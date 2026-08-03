package com.linkguard.url.service;

import com.linkguard.common.exception.BadRequestException;
import com.linkguard.common.exception.ForbiddenException;
import com.linkguard.common.exception.ResourceNotFoundException;
import com.linkguard.common.util.Base62;
import com.linkguard.url.dto.CreateUrlRequest;
import com.linkguard.url.dto.UpdateUrlRequest;
import com.linkguard.url.dto.UrlResponse;
import com.linkguard.url.entity.Url;
import com.linkguard.url.entity.UrlStatus;
import com.linkguard.url.repository.UrlRepository;
import com.linkguard.url.validator.UrlValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class UrlServiceImpl implements UrlService {

    private final UrlRepository urlRepository;
    private final UrlValidator urlValidator;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UrlResponse createUrl(CreateUrlRequest request, Long userId) {
        urlValidator.validateOriginalUrl(request.getOriginalUrl());

        String shortCode;
        boolean isCustom = false;

        if (request.getCustomAlias() != null && !request.getCustomAlias().isBlank()) {
            String alias = request.getCustomAlias().trim();
            urlValidator.validateCustomAlias(alias);
            if (urlRepository.existsByShortCode(alias) || urlRepository.existsByCustomAlias(alias)) {
                throw new BadRequestException("Custom alias '" + alias + "' is already taken");
            }
            shortCode = alias;
            isCustom = true;
        } else {
            shortCode = generateUniqueShortCode();
        }

        String passwordHash = null;
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            passwordHash = passwordEncoder.encode(request.getPassword());
        }

        Url url = Url.builder()
                .userId(userId)
                .originalUrl(request.getOriginalUrl().trim())
                .shortCode(shortCode)
                .customAlias(isCustom ? shortCode : null)
                .title(request.getTitle() != null ? request.getTitle().trim() : null)
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .isCustomAlias(isCustom)
                .status(UrlStatus.ACTIVE)
                .clickCount(0L)
                .passwordHash(passwordHash)
                .expiresAt(request.getExpiresAt())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Url savedUrl;
        try {
            savedUrl = urlRepository.save(url);
        } catch (DataIntegrityViolationException ex) {
            log.warn("Collision encountered for short code {}, retrying Base62 generation", shortCode);
            if (!isCustom) {
                url.setShortCode(generateUniqueShortCode());
                savedUrl = urlRepository.save(url);
            } else {
                throw new BadRequestException("Custom alias is already taken");
            }
        }

        log.info("Created short URL {} for original URL {}", savedUrl.getShortCode(), savedUrl.getOriginalUrl());
        return mapToResponse(savedUrl);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UrlResponse> getUserUrls(Long userId, Pageable pageable) {
        return urlRepository.findByUserIdAndDeletedAtIsNull(userId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UrlResponse getUrlById(Long id, Long userId) {
        Url url = urlRepository.findByIdAndUserIdAndDeletedAtIsNull(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found with id: " + id));
        return mapToResponse(url);
    }

    @Override
    @Transactional
    public UrlResponse updateUrl(Long id, UpdateUrlRequest request, Long userId) {
        Url url = urlRepository.findByIdAndUserIdAndDeletedAtIsNull(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found with id: " + id));

        if (request.getOriginalUrl() != null && !request.getOriginalUrl().isBlank()) {
            urlValidator.validateOriginalUrl(request.getOriginalUrl());
            url.setOriginalUrl(request.getOriginalUrl().trim());
        }

        if (request.getTitle() != null) {
            url.setTitle(request.getTitle().trim());
        }

        if (request.getDescription() != null) {
            url.setDescription(request.getDescription().trim());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            url.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getExpiresAt() != null) {
            url.setExpiresAt(request.getExpiresAt());
        }

        Url updatedUrl = urlRepository.save(url);
        log.info("Updated URL id: {} shortCode: {}", id, updatedUrl.getShortCode());
        return mapToResponse(updatedUrl);
    }

    @Override
    @Transactional
    public void softDeleteUrl(Long id, Long userId) {
        Url url = urlRepository.findByIdAndUserIdAndDeletedAtIsNull(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found with id: " + id));
        url.setDeletedAt(Instant.now());
        urlRepository.save(url);
        log.info("Soft deleted URL id: {}", id);
    }

    @Override
    @Transactional
    public UrlResponse enableUrl(Long id, Long userId) {
        Url url = urlRepository.findByIdAndUserIdAndDeletedAtIsNull(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found with id: " + id));
        url.setStatus(UrlStatus.ACTIVE);
        Url updated = urlRepository.save(url);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public UrlResponse disableUrl(Long id, Long userId) {
        Url url = urlRepository.findByIdAndUserIdAndDeletedAtIsNull(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found with id: " + id));
        url.setStatus(UrlStatus.DISABLED);
        Url updated = urlRepository.save(url);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public UrlResponse restoreUrl(Long id, Long userId) {
        Url url = urlRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found with id: " + id));
        url.setDeletedAt(null);
        url.setStatus(UrlStatus.ACTIVE);
        Url updated = urlRepository.save(url);
        return mapToResponse(updated);
    }

    private String generateUniqueShortCode() {
        for (int i = 0; i < 5; i++) {
            String code = Base62.generateRandomCode(7);
            if (!urlRepository.existsByShortCode(code)) {
                return code;
            }
        }
        return Base62.generateRandomCode(8);
    }

    private UrlResponse mapToResponse(Url url) {
        return UrlResponse.builder()
                .id(url.getId())
                .userId(url.getUserId())
                .originalUrl(url.getOriginalUrl())
                .shortCode(url.getShortCode())
                .shortUrl("/" + url.getShortCode())
                .customAlias(url.getCustomAlias())
                .title(url.getTitle())
                .description(url.getDescription())
                .isCustomAlias(url.isCustomAlias())
                .status(url.getStatus())
                .clickCount(url.getClickCount())
                .isPasswordProtected(url.getPasswordHash() != null && !url.getPasswordHash().isBlank())
                .expiresAt(url.getExpiresAt())
                .lastAccessedAt(url.getLastAccessedAt())
                .deletedAt(url.getDeletedAt())
                .createdAt(url.getCreatedAt())
                .updatedAt(url.getUpdatedAt())
                .build();
    }
}
