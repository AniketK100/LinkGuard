package com.linkguard.common.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

public class UserAgentParser {

    @Getter
    @AllArgsConstructor
    public static class UserAgentInfo {
        private String browser;
        private String os;
        private String deviceType;
    }

    public static UserAgentInfo parse(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return new UserAgentInfo("Unknown", "Unknown", "desktop");
        }

        String ua = userAgent.toLowerCase();

        // Browser Detection
        String browser = "Other";
        if (ua.contains("edg/") || ua.contains("edge/")) {
            browser = "Edge";
        } else if (ua.contains("chrome") && !ua.contains("chromium")) {
            browser = "Chrome";
        } else if (ua.contains("firefox")) {
            browser = "Firefox";
        } else if (ua.contains("safari") && !ua.contains("chrome")) {
            browser = "Safari";
        } else if (ua.contains("opera") || ua.contains("opr/")) {
            browser = "Opera";
        }

        // OS Detection
        String os = "Other";
        if (ua.contains("windows")) {
            os = "Windows";
        } else if (ua.contains("mac os x") || ua.contains("macintosh")) {
            os = "macOS";
        } else if (ua.contains("iphone") || ua.contains("ipad") || ua.contains("ipod")) {
            os = "iOS";
        } else if (ua.contains("android")) {
            os = "Android";
        } else if (ua.contains("linux")) {
            os = "Linux";
        }

        // Device Type Detection
        String deviceType = "desktop";
        if (ua.contains("mobile") || ua.contains("iphone") || ua.contains("android") && !ua.contains("tablet")) {
            deviceType = "mobile";
        } else if (ua.contains("ipad") || ua.contains("tablet")) {
            deviceType = "tablet";
        }

        return new UserAgentInfo(browser, os, deviceType);
    }
}
