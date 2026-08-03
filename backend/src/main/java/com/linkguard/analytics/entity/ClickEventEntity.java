package com.linkguard.analytics.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "click_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "url_id", nullable = false)
    private Long urlId;

    @Column(name = "short_code", length = 30)
    private String shortCode;

    @Column(name = "timestamp", nullable = false)
    @Builder.Default
    private Instant timestamp = Instant.now();

    @Column(name = "ip_hash", nullable = false, length = 64)
    private String ipHash;

    @Column(length = 2)
    private String country;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String region;

    @Column(length = 50)
    private String browser;

    @Column(name = "operating_system", length = 50)
    private String operatingSystem;

    @Column(name = "os", length = 50)
    private String os;

    @Column(name = "device_type", length = 20)
    private String deviceType;

    @Column(length = 20)
    private String device;

    @Column(columnDefinition = "TEXT")
    private String referrer;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(length = 10)
    private String language;
}
