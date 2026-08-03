package com.linkguard.qr.service;

import com.linkguard.common.exception.ForbiddenException;
import com.linkguard.common.exception.InternalServerException;
import com.linkguard.common.exception.ResourceNotFoundException;
import com.linkguard.common.util.QrCodeGeneratorUtil;
import com.linkguard.qr.dto.GenerateQrRequest;
import com.linkguard.qr.dto.QrCodeResponse;
import com.linkguard.qr.dto.UpdateQrRequest;
import com.linkguard.qr.entity.QrCode;
import com.linkguard.qr.entity.QrType;
import com.linkguard.qr.repository.QrCodeRepository;
import com.linkguard.url.entity.Url;
import com.linkguard.url.repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class QrCodeServiceImpl implements QrCodeService {

    private final QrCodeRepository qrCodeRepository;
    private final UrlRepository urlRepository;

    @Value("${app.baseUrl:http://localhost:8080}")
    private String baseUrl;

    @Value("${storage.local.qrcode-dir:uploads/qrcodes}")
    private String qrStorageDir;

    // TODO: Cloudinary External Storage Integration
    // CLOUDINARY_CLOUD_NAME=
    // CLOUDINARY_API_KEY=
    // CLOUDINARY_API_SECRET=

    @Override
    @Transactional
    public QrCodeResponse generateQrCode(GenerateQrRequest request, Long userId) {
        Url url = validateUrlOwnership(request.getUrlId(), userId);

        int width = request.getWidth() != null ? request.getWidth() : 300;
        int height = request.getHeight() != null ? request.getHeight() : 300;
        String fgColor = request.getForegroundColor() != null ? request.getForegroundColor() : "#000000";
        String bgColor = request.getBackgroundColor() != null ? request.getBackgroundColor() : "#FFFFFF";
        QrType qrType = request.getQrType() != null ? request.getQrType() : QrType.DYNAMIC;
        String format = request.getFormat() != null && request.getFormat().equalsIgnoreCase("svg") ? "svg" : "png";

        String targetUrl = baseUrl + "/r/" + url.getShortCode();
        String fileName = "qr_" + url.getShortCode() + "." + format;
        String contentType = format.equals("svg") ? "image/svg+xml" : "image/png";

        String savedFilePath = storeQrCodeLocally(targetUrl, fileName, width, height, fgColor, bgColor, format);

        QrCode qrCode = qrCodeRepository.findByUrlId(url.getId())
                .orElseGet(() -> QrCode.builder().urlId(url.getId()).shortCode(url.getShortCode()).build());

        qrCode.setQrType(qrType);
        qrCode.setFileName(fileName);
        qrCode.setFilePath(savedFilePath);
        qrCode.setContentType(contentType);
        qrCode.setWidth(width);
        qrCode.setHeight(height);
        qrCode.setForegroundColor(fgColor);
        qrCode.setBackgroundColor(bgColor);
        qrCode.setActive(true);
        qrCode.setUpdatedAt(Instant.now());

        QrCode saved = qrCodeRepository.save(qrCode);
        log.info("Generated QR code for urlId: {} shortCode: {}", url.getId(), url.getShortCode());

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QrCodeResponse> getUserQrCodes(Long userId, Pageable pageable) {
        Page<Url> urls = urlRepository.findByUserIdAndDeletedAtIsNull(userId, pageable);
        List<Long> urlIds = urls.getContent().stream().map(Url::getId).collect(Collectors.toList());

        List<QrCode> qrCodes = qrCodeRepository.findByUrlIdIn(urlIds);
        List<QrCodeResponse> responses = qrCodes.stream().map(this::mapToResponse).collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, urls.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public QrCodeResponse getQrCodeById(Long id, Long userId) {
        QrCode qrCode = qrCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("QR Code not found with id: " + id));
        validateUrlOwnership(qrCode.getUrlId(), userId);
        return mapToResponse(qrCode);
    }

    @Override
    @Transactional
    public QrCodeResponse updateQrCode(Long id, UpdateQrRequest request, Long userId) {
        QrCode qrCode = qrCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("QR Code not found with id: " + id));
        Url url = validateUrlOwnership(qrCode.getUrlId(), userId);

        if (request.getQrType() != null) qrCode.setQrType(request.getQrType());
        if (request.getWidth() != null) qrCode.setWidth(request.getWidth());
        if (request.getHeight() != null) qrCode.setHeight(request.getHeight());
        if (request.getForegroundColor() != null) qrCode.setForegroundColor(request.getForegroundColor());
        if (request.getBackgroundColor() != null) qrCode.setBackgroundColor(request.getBackgroundColor());

        String targetUrl = baseUrl + "/r/" + url.getShortCode();
        String format = qrCode.getContentType().contains("svg") ? "svg" : "png";
        String savedFilePath = storeQrCodeLocally(targetUrl, qrCode.getFileName(), qrCode.getWidth(), qrCode.getHeight(), qrCode.getForegroundColor(), qrCode.getBackgroundColor(), format);

        qrCode.setFilePath(savedFilePath);
        QrCode updated = qrCodeRepository.save(qrCode);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteQrCode(Long id, Long userId) {
        QrCode qrCode = qrCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("QR Code not found with id: " + id));
        validateUrlOwnership(qrCode.getUrlId(), userId);
        qrCodeRepository.delete(qrCode);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadQrCodeImage(Long id) {
        QrCode qrCode = qrCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("QR Code not found with id: " + id));

        Url url = urlRepository.findById(qrCode.getUrlId())
                .orElseThrow(() -> new ResourceNotFoundException("Associated URL not found"));

        String targetUrl = baseUrl + "/r/" + url.getShortCode();

        try {
            if (qrCode.getContentType().contains("svg")) {
                return QrCodeGeneratorUtil.generateQrSvg(targetUrl, qrCode.getWidth(), qrCode.getHeight(), qrCode.getForegroundColor(), qrCode.getBackgroundColor()).getBytes();
            } else {
                return QrCodeGeneratorUtil.generateQrPng(targetUrl, qrCode.getWidth(), qrCode.getHeight(), qrCode.getForegroundColor(), qrCode.getBackgroundColor());
            }
        } catch (IOException e) {
            throw new InternalServerException("Failed to render QR Code image bytes");
        }
    }

    @Override
    @Transactional
    public QrCodeResponse regenerateQrCode(Long id, Long userId) {
        QrCode qrCode = qrCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("QR Code not found with id: " + id));
        Url url = validateUrlOwnership(qrCode.getUrlId(), userId);

        String targetUrl = baseUrl + "/r/" + url.getShortCode();
        String format = qrCode.getContentType().contains("svg") ? "svg" : "png";
        String savedFilePath = storeQrCodeLocally(targetUrl, qrCode.getFileName(), qrCode.getWidth(), qrCode.getHeight(), qrCode.getForegroundColor(), qrCode.getBackgroundColor(), format);

        qrCode.setFilePath(savedFilePath);
        qrCode.setUpdatedAt(Instant.now());
        QrCode updated = qrCodeRepository.save(qrCode);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public QrCodeResponse getOrCreateQrCodeForUrl(Long urlId, Long userId) {
        return qrCodeRepository.findByUrlId(urlId)
                .map(this::mapToResponse)
                .orElseGet(() -> generateQrCode(GenerateQrRequest.builder().urlId(urlId).build(), userId));
    }

    private String storeQrCodeLocally(String text, String fileName, int width, int height, String fgHex, String bgHex, String format) {
        try {
            Path dirPath = Paths.get(qrStorageDir);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            File targetFile = dirPath.resolve(fileName).toFile();
            if (format.equalsIgnoreCase("svg")) {
                String svgContent = QrCodeGeneratorUtil.generateQrSvg(text, width, height, fgHex, bgHex);
                Files.writeString(targetFile.toPath(), svgContent);
            } else {
                byte[] pngBytes = QrCodeGeneratorUtil.generateQrPng(text, width, height, fgHex, bgHex);
                try (FileOutputStream fos = new FileOutputStream(targetFile)) {
                    fos.write(pngBytes);
                }
            }
            return targetFile.getAbsolutePath();
        } catch (Exception ex) {
            log.warn("Local filesystem storage failed for QR code {}. Falling back to virtual path: {}", fileName, ex.getMessage());
            return qrStorageDir + "/" + fileName;
        }
    }

    private Url validateUrlOwnership(Long urlId, Long userId) {
        Url url = urlRepository.findById(urlId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found with id: " + urlId));

        if (userId != null && url.getUserId() != null && !url.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to manage QR codes for this URL");
        }
        return url;
    }

    private QrCodeResponse mapToResponse(QrCode qrCode) {
        return QrCodeResponse.builder()
                .id(qrCode.getId())
                .urlId(qrCode.getUrlId())
                .shortCode(qrCode.getShortCode())
                .qrType(qrCode.getQrType())
                .fileName(qrCode.getFileName())
                .downloadUrl("/api/v1/qr-codes/" + qrCode.getId() + "/download")
                .contentType(qrCode.getContentType())
                .width(qrCode.getWidth())
                .height(qrCode.getHeight())
                .foregroundColor(qrCode.getForegroundColor())
                .backgroundColor(qrCode.getBackgroundColor())
                .active(qrCode.isActive())
                .createdAt(qrCode.getCreatedAt())
                .updatedAt(qrCode.getUpdatedAt())
                .build();
    }
}
