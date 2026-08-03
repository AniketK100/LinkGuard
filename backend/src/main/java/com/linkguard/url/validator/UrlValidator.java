package com.linkguard.url.validator;

import com.linkguard.common.exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Set;

@Component
public class UrlValidator {

    private static final Set<String> RESERVED_WORDS = Set.of(
            "admin", "api", "login", "register", "static", "actuator",
            "swagger-ui", "dashboard", "urls", "auth", "health", "metrics",
            "info", "redirect", "analytics", "qr", "security", "users"
    );

    public void validateOriginalUrl(String originalUrl) {
        if (originalUrl == null || originalUrl.isBlank()) {
            throw new BadRequestException("Original URL cannot be empty");
        }
        if (originalUrl.length() > 2048) {
            throw new BadRequestException("Original URL exceeds maximum permitted length of 2048 characters");
        }

        try {
            URI uri = new URI(originalUrl);
            String scheme = uri.getScheme();
            if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                throw new BadRequestException("URL scheme must be http or https");
            }

            String host = uri.getHost();
            if (host == null || isInternalHost(host)) {
                throw new BadRequestException("URL host is invalid or points to a private/internal network target (SSRF Protection)");
            }
        } catch (URISyntaxException e) {
            throw new BadRequestException("Malformed URL format: " + e.getMessage());
        }
    }

    public void validateCustomAlias(String customAlias) {
        if (customAlias == null || customAlias.isBlank()) {
            return;
        }
        String alias = customAlias.trim().toLowerCase();
        if (alias.length() < 3 || alias.length() > 30) {
            throw new BadRequestException("Custom alias must be between 3 and 30 characters in length");
        }
        if (!alias.matches("^[a-zA-Z0-9_-]+$")) {
            throw new BadRequestException("Custom alias may only contain alphanumeric characters, hyphens, and underscores");
        }
        if (RESERVED_WORDS.contains(alias)) {
            throw new BadRequestException("Custom alias '" + alias + "' is a reserved keyword");
        }
    }

    private boolean isInternalHost(String host) {
        String lowerHost = host.toLowerCase();
        if (lowerHost.equals("localhost") || lowerHost.equals("127.0.0.1") || lowerHost.equals("::1") || lowerHost.equals("169.254.169.254")) {
            return true;
        }
        return lowerHost.startsWith("10.") || lowerHost.startsWith("192.168.") || (lowerHost.startsWith("172.") && isPrivate172(lowerHost));
    }

    private boolean isPrivate172(String host) {
        String[] parts = host.split("\\.");
        if (parts.length >= 2) {
            try {
                int secondOctet = Integer.parseInt(parts[1]);
                return secondOctet >= 16 && secondOctet <= 31;
            } catch (NumberFormatException ignored) {}
        }
        return false;
    }
}
