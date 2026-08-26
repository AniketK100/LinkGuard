package com.linkguard.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.linkguard.analytics.dto.UrlAnalyticsResponse;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;

import java.time.Instant;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class RedisConfigTest {

    @Test
    void testRedisSerializerWithJavaTimeModuleAndPolymorphicTyping() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        GenericJackson2JsonRedisSerializer serializer = GenericJackson2JsonRedisSerializer.builder()
                .defaultTyping(true)
                .objectMapper(objectMapper)
                .build();

        UrlAnalyticsResponse response = UrlAnalyticsResponse.builder()
                .urlId(20L)
                .totalClicks(100L)
                .uniqueVisitors(50L)
                .lastAccessedAt(Instant.now())
                .byCountry(Collections.emptyList())
                .byDevice(Collections.emptyList())
                .byBrowser(Collections.emptyList())
                .byOperatingSystem(Collections.emptyList())
                .byReferrer(Collections.emptyList())
                .timeSeries(Collections.emptyList())
                .build();

        // 1. Serialization Test (Instant field must serialize cleanly without exception)
        byte[] bytes = serializer.serialize(response);
        assertNotNull(bytes, "Serialized byte array must not be null");

        String json = new String(bytes);
        assertTrue(json.contains("@class"), "JSON payload must contain @class hint");
        assertTrue(json.contains("lastAccessedAt"), "JSON payload must contain lastAccessedAt field");

        // 2. Deserialization Test (@class hint must restore exact UrlAnalyticsResponse object)
        Object deserialized = serializer.deserialize(bytes);
        assertNotNull(deserialized, "Deserialized object must not be null");
        assertTrue(deserialized instanceof UrlAnalyticsResponse, "Deserialized object must be an instance of UrlAnalyticsResponse");

        UrlAnalyticsResponse result = (UrlAnalyticsResponse) deserialized;
        assertEquals(20L, result.getUrlId());
        assertEquals(100L, result.getTotalClicks());
        assertNotNull(result.getLastAccessedAt(), "lastAccessedAt Instant must be preserved");
    }
}
