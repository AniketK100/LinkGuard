package com.linkguard.redirect.service;

import com.linkguard.common.exception.BadRequestException;
import com.linkguard.common.exception.GoneException;
import com.linkguard.common.exception.ResourceNotFoundException;
import com.linkguard.common.exception.UnauthorizedException;
import com.linkguard.redirect.dto.RedirectResultDto;
import com.linkguard.redirect.event.ClickEvent;
import com.linkguard.url.entity.Url;
import com.linkguard.url.entity.UrlStatus;
import com.linkguard.url.repository.UrlRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedirectServiceImpl implements RedirectService {

    private final UrlRepository urlRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ApplicationEventPublisher eventPublisher;
    private final PasswordEncoder passwordEncoder;

    private static final String CACHE_PREFIX = "linkguard:cache:url:";

    @Override
    @Transactional
    public RedirectResultDto resolveRedirect(String shortCode, HttpServletRequest request) {
        RedirectResultDto redirectDto = fetchRedirectDto(shortCode);

        // Security & Expiration Checks
        validateRedirect(redirectDto);

        // If password protected, do not redirect immediately until password is submitted
        if (redirectDto.isPasswordProtected()) {
            return redirectDto;
        }

        // Dispatch async click analytics event
        emitAnalyticsClickEvent(redirectDto, request);

        return redirectDto;
    }

    @Override
    @Transactional
    public RedirectResultDto verifyPasswordAndResolve(String shortCode, String password, HttpServletRequest request) {
        Url url = urlRepository.findByShortCodeAndDeletedAtIsNull(shortCode)
                .or(() -> urlRepository.findByCustomAliasAndDeletedAtIsNull(shortCode))
                .orElseThrow(() -> new ResourceNotFoundException("Short code does not exist or has been disabled"));

        if (url.getDeletedAt() != null || url.getStatus() != UrlStatus.ACTIVE) {
            throw new ResourceNotFoundException("Short code does not exist or has been disabled");
        }

        if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(Instant.now())) {
            throw new GoneException("This link has expired");
        }

        if (url.getPasswordHash() == null || !passwordEncoder.matches(password, url.getPasswordHash())) {
            throw new UnauthorizedException("Incorrect password for this protected link");
        }

        RedirectResultDto result = mapToDto(url);
        emitAnalyticsClickEvent(result, request);
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public RedirectResultDto getRedirectMetadata(String shortCode) {
        return fetchRedirectDto(shortCode);
    }

    @Override
    public boolean checkEngineHealth() {
        try {
            Long count = urlRepository.count();
            return count != null;
        } catch (Exception ex) {
            log.error("Redirect engine health check failed", ex);
            return false;
        }
    }

    private RedirectResultDto fetchRedirectDto(String shortCode) {
        String cacheKey = CACHE_PREFIX + shortCode;

        // 1. Try Redis Cache-Aside Lookup (Fail-Open)
        try {
            Object cachedObj = redisTemplate.opsForValue().get(cacheKey);
            if (cachedObj instanceof RedirectResultDto cachedDto) {
                log.debug("Redis cache HIT for short code: {}", shortCode);
                return cachedDto;
            }
        } catch (Exception ex) {
            log.warn("Redis lookup failed for short code {}. Falling back to PostgreSQL DB (Fail-Open): {}", shortCode, ex.getMessage());
        }

        // 2. Cache Miss -> Query PostgreSQL System of Record
        Url url = urlRepository.findByShortCodeAndDeletedAtIsNull(shortCode)
                .or(() -> urlRepository.findByCustomAliasAndDeletedAtIsNull(shortCode))
                .orElseThrow(() -> new ResourceNotFoundException("Short code does not exist or has been disabled"));

        RedirectResultDto dto = mapToDto(url);

        // 3. Populate Redis Cache (Fail-Open)
        try {
            redisTemplate.opsForValue().set(cacheKey, dto, Duration.ofHours(1));
        } catch (Exception ex) {
            log.warn("Failed to populate Redis cache for short code {}: {}", shortCode, ex.getMessage());
        }

        return dto;
    }

    private void validateRedirect(RedirectResultDto dto) {
        if (dto.getStatus() == UrlStatus.DISABLED || dto.getStatus() == UrlStatus.UNDER_REVIEW) {
            throw new ResourceNotFoundException("Short code does not exist or has been disabled");
        }

        if (dto.getExpiresAt() != null && dto.getExpiresAt().isBefore(Instant.now())) {
            throw new GoneException("This short link has expired");
        }

        if (isRedirectLoop(dto.getOriginalUrl(), dto.getShortCode())) {
            throw new BadRequestException("Redirect loop detected: destination points back to this short link");
        }
    }

    private boolean isRedirectLoop(String destinationUrl, String shortCode) {
        if (destinationUrl == null) return false;
        String lowerDest = destinationUrl.toLowerCase();
        return lowerDest.endsWith("/" + shortCode.toLowerCase()) || lowerDest.contains("/r/" + shortCode.toLowerCase());
    }

    private void emitAnalyticsClickEvent(RedirectResultDto dto, HttpServletRequest request) {
        try {
            String clientIp = extractClientIp(request);
            String userAgent = request.getHeader("User-Agent");
            String secChUa = request.getHeader("Sec-CH-UA");
            if (secChUa == null || secChUa.isBlank()) {
                secChUa = request.getHeader("Sec-CH-UA-Full-Version-List");
            }
            String referrer = request.getHeader("Referer");
            String country = extractCountryHeader(request);

            ClickEvent clickEvent = ClickEvent.builder()
                    .urlId(dto.getUrlId())
                    .shortCode(dto.getShortCode())
                    .rawUserAgent(userAgent != null ? userAgent : "Unknown")
                    .secChUa(secChUa)
                    .referrer(referrer)
                    .ipAddress(clientIp != null ? clientIp : "127.0.0.1")
                    .country(country)
                    .timestamp(Instant.now())
                    .build();

            eventPublisher.publishEvent(clickEvent);
        } catch (Exception ex) {
            log.error("Failed to publish analytics click event for urlId {}: ", dto.getUrlId(), ex);
        }
    }

    private String extractCountryHeader(HttpServletRequest request) {
        if (request == null) return null;
        String[] headers = {
            "CF-IPCountry", "X-Country-Code", "X-Geo-Country",
            "CloudFront-Viewer-Country", "X-AppEngine-Country"
        };
        for (String h : headers) {
            String val = request.getHeader(h);
            if (val != null && !val.isBlank() && !val.equalsIgnoreCase("XX") && !val.equalsIgnoreCase("T1")) {
                return val.trim().toUpperCase();
            }
        }
        return null;
    }

    private String extractClientIp(HttpServletRequest request) {
        if (request == null) return "127.0.0.1";
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private RedirectResultDto mapToDto(Url url) {
        return RedirectResultDto.builder()
                .urlId(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortCode(url.getShortCode())
                .status(url.getStatus())
                .passwordProtected(url.getPasswordHash() != null && !url.getPasswordHash().isBlank())
                .expiresAt(url.getExpiresAt())
                .build();
    }
}
