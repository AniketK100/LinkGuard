package com.linkguard.qr.repository;

import com.linkguard.qr.entity.QrCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QrCodeRepository extends JpaRepository<QrCode, Long> {
    Optional<QrCode> findByUrlId(Long urlId);
    List<QrCode> findByUrlIdIn(List<Long> urlIds);
    Optional<QrCode> findByShortCode(String shortCode);
}
