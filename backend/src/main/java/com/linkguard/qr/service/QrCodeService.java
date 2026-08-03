package com.linkguard.qr.service;

import com.linkguard.qr.dto.GenerateQrRequest;
import com.linkguard.qr.dto.QrCodeResponse;
import com.linkguard.qr.dto.UpdateQrRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QrCodeService {
    QrCodeResponse generateQrCode(GenerateQrRequest request, Long userId);
    Page<QrCodeResponse> getUserQrCodes(Long userId, Pageable pageable);
    QrCodeResponse getQrCodeById(Long id, Long userId);
    QrCodeResponse updateQrCode(Long id, UpdateQrRequest request, Long userId);
    void deleteQrCode(Long id, Long userId);
    byte[] downloadQrCodeImage(Long id);
    QrCodeResponse regenerateQrCode(Long id, Long userId);
    QrCodeResponse getOrCreateQrCodeForUrl(Long urlId, Long userId);
}
