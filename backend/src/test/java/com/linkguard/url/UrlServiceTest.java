package com.linkguard.url;

import com.linkguard.common.exception.BadRequestException;
import com.linkguard.url.dto.CreateUrlRequest;
import com.linkguard.url.dto.UrlResponse;
import com.linkguard.url.entity.Url;
import com.linkguard.url.entity.UrlStatus;
import com.linkguard.url.repository.UrlRepository;
import com.linkguard.url.service.UrlServiceImpl;
import com.linkguard.url.validator.UrlValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UrlServiceTest {

    @Mock
    private UrlRepository urlRepository;

    @Mock
    private UrlValidator urlValidator;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UrlServiceImpl urlService;

    private Url sampleUrl;

    @BeforeEach
    void setUp() {
        sampleUrl = Url.builder()
                .id(10L)
                .userId(1L)
                .originalUrl("https://example.com/target")
                .shortCode("abcd123")
                .status(UrlStatus.ACTIVE)
                .clickCount(0L)
                .build();
    }

    @Test
    void testCreateUrlSuccess() {
        CreateUrlRequest request = CreateUrlRequest.builder()
                .originalUrl("https://example.com/target")
                .build();

        doNothing().when(urlValidator).validateOriginalUrl("https://example.com/target");
        when(urlRepository.existsByShortCode(anyString())).thenReturn(false);
        when(urlRepository.save(any(Url.class))).thenReturn(sampleUrl);

        UrlResponse response = urlService.createUrl(request, 1L);

        assertNotNull(response);
        assertEquals("https://example.com/target", response.getOriginalUrl());
        assertEquals("abcd123", response.getShortCode());
        verify(urlRepository, times(1)).save(any(Url.class));
    }

    @Test
    void testCreateUrlCustomAliasConflictThrowsBadRequest() {
        CreateUrlRequest request = CreateUrlRequest.builder()
                .originalUrl("https://example.com/target")
                .customAlias("myalias")
                .build();

        doNothing().when(urlValidator).validateOriginalUrl(anyString());
        doNothing().when(urlValidator).validateCustomAlias("myalias");
        when(urlRepository.existsByShortCode("myalias")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> urlService.createUrl(request, 1L));
    }

    @Test
    void testSoftDeleteUrlSuccess() {
        when(urlRepository.findByIdAndUserIdAndDeletedAtIsNull(10L, 1L)).thenReturn(Optional.of(sampleUrl));
        when(urlRepository.save(any(Url.class))).thenReturn(sampleUrl);

        urlService.softDeleteUrl(10L, 1L);

        assertNotNull(sampleUrl.getDeletedAt());
        verify(urlRepository, times(1)).save(sampleUrl);
    }
}
