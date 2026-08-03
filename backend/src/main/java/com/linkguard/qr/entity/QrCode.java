package com.linkguard.qr.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "qr_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QrCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "url_id", nullable = false)
    private Long urlId;

    @Column(name = "short_code", nullable = false, length = 30)
    private String shortCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "qr_type", nullable = false, length = 20)
    @Builder.Default
    private QrType qrType = QrType.DYNAMIC;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "content_type", length = 50)
    @Builder.Default
    private String contentType = "image/png";

    @Column(nullable = false)
    @Builder.Default
    private Integer width = 300;

    @Column(nullable = false)
    @Builder.Default
    private Integer height = 300;

    @Column(name = "foreground_color", length = 20)
    @Builder.Default
    private String foregroundColor = "#000000";

    @Column(name = "background_color", length = 20)
    @Builder.Default
    private String backgroundColor = "#FFFFFF";

    @Column(name = "logo_path", length = 500)
    private String logoPath;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
