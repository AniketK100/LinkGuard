package com.linkguard.url.service;

import com.linkguard.url.dto.CreateUrlRequest;
import com.linkguard.url.dto.UpdateUrlRequest;
import com.linkguard.url.dto.UrlResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UrlService {
    UrlResponse createUrl(CreateUrlRequest request, Long userId);
    Page<UrlResponse> getUserUrls(Long userId, Pageable pageable);
    UrlResponse getUrlById(Long id, Long userId);
    UrlResponse updateUrl(Long id, UpdateUrlRequest request, Long userId);
    void softDeleteUrl(Long id, Long userId);
    UrlResponse enableUrl(Long id, Long userId);
    UrlResponse disableUrl(Long id, Long userId);
    UrlResponse restoreUrl(Long id, Long userId);
}
