package com.linkguard.security.ratelimit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String RATE_LIMIT_PREFIX = "linkguard:ratelimit:";

    public boolean isAllowed(String key, int maxRequests, long windowInSeconds) {
        String redisKey = RATE_LIMIT_PREFIX + key;
        try {
            Long currentRequests = redisTemplate.opsForValue().increment(redisKey);
            if (currentRequests != null && currentRequests == 1) {
                redisTemplate.expire(redisKey, Duration.ofSeconds(windowInSeconds));
            }
            return currentRequests != null && currentRequests <= maxRequests;
        } catch (Exception ex) {
            log.warn("Redis rate limiter failed for key {}. Failing open (allowed): {}", key, ex.getMessage());
            return true; // Fail-Open
        }
    }

    public long getCurrentCount(String key) {
        String redisKey = RATE_LIMIT_PREFIX + key;
        try {
            Object val = redisTemplate.opsForValue().get(redisKey);
            return val instanceof Number num ? num.longValue() : 0L;
        } catch (Exception ex) {
            return 0L;
        }
    }
}
