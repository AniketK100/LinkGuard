package com.linkguard.common.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Component
public class IpAnonymizer {

    private final String salt;

    public IpAnonymizer(@Value("${security.ip-hash-salt:linkguard_ip_anonymization_salt}") String salt) {
        this.salt = salt;
    }

    public String hashIp(String ipAddress) {
        if (ipAddress == null || ipAddress.isBlank()) {
            ipAddress = "127.0.0.1";
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String input = ipAddress.trim() + ":" + salt;
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
