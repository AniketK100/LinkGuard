package com.linkguard.redirect;

import com.linkguard.common.exception.GoneException;
import com.linkguard.common.exception.ResourceNotFoundException;
import com.linkguard.redirect.dto.RedirectResultDto;
import com.linkguard.redirect.service.RedirectServiceImpl;
import com.linkguard.url.entity.Url;
import com.linkguard.url.entity.UrlStatus;
import com.linkguard.url.repository.UrlRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RedirectServiceTest {

    @Mock
    private UrlRepository urlRepository;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private RedirectServiceImpl redirectService;

    private Url sampleUrl;

    @BeforeEach
    void setUp() {
        sampleUrl = Url.builder()
                .id(1L)
                .shortCode("test123")
                .originalUrl("https://destination.com/page")
                .status(UrlStatus.ACTIVE)
                .build();
    }

    @Test
    void testResolveRedirectSuccess() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null); // Cache Miss
        when(urlRepository.findByShortCodeAndDeletedAtIsNull("test123")).thenReturn(Optional.of(sampleUrl));
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");

        RedirectResultDto result = redirectService.resolveRedirect("test123", request);

        assertNotNull(result);
        assertEquals("https://destination.com/page", result.getOriginalUrl());
        verify(eventPublisher, times(1)).publishEvent(any());
    }

    @Test
    void testResolveRedirectExpiredThrowsGone() {
        sampleUrl.setExpiresAt(Instant.now().minusSeconds(3600)); // Expired 1h ago

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);
        when(urlRepository.findByShortCodeAndDeletedAtIsNull("expired123")).thenReturn(Optional.of(sampleUrl));

        assertThrows(GoneException.class, () -> redirectService.resolveRedirect("expired123", request));
    }

    @Test
    void testResolveRedirectNotFoundThrowsResourceNotFound() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);
        when(urlRepository.findByShortCodeAndDeletedAtIsNull("nonexistent")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> redirectService.resolveRedirect("nonexistent", request));
    }
}
