package com.linkguard.analytics.listener;

import com.linkguard.analytics.entity.AnalyticsSummary;
import com.linkguard.analytics.entity.ClickEventEntity;
import com.linkguard.analytics.repository.AnalyticsSummaryRepository;
import com.linkguard.analytics.repository.ClickEventRepository;
import com.linkguard.common.util.IpAnonymizer;
import com.linkguard.common.util.UserAgentParser;
import com.linkguard.redirect.event.ClickEvent;
import com.linkguard.url.entity.Url;
import com.linkguard.url.repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import org.springframework.data.redis.core.RedisTemplate;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClickEventListener {

    private final ClickEventRepository clickEventRepository;
    private final AnalyticsSummaryRepository analyticsSummaryRepository;
    private final UrlRepository urlRepository;
    private final IpAnonymizer ipAnonymizer;
    private final RedisTemplate<String, Object> redisTemplate;

    @Async
    @EventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleClickEvent(ClickEvent event) {
        try {
            String ipHash = ipAnonymizer.hashIp(event.getIpAddress());
            UserAgentParser.UserAgentInfo uaInfo = UserAgentParser.parse(event.getRawUserAgent());

            ClickEventEntity entity = ClickEventEntity.builder()
                    .urlId(event.getUrlId())
                    .shortCode(event.getShortCode())
                    .timestamp(event.getTimestamp())
                    .ipHash(ipHash)
                    .country("IN") // Geolocation placeholder
                    .city("Mumbai")
                    .region("MH")
                    .browser(uaInfo.getBrowser())
                    .operatingSystem(uaInfo.getOs())
                    .os(uaInfo.getOs())
                    .deviceType(uaInfo.getDeviceType())
                    .device(uaInfo.getDeviceType())
                    .referrer(event.getReferrer())
                    .userAgent(event.getRawUserAgent())
                    .language("en-US")
                    .build();

            clickEventRepository.save(entity);

            // Increment URL click count & last accessed timestamp
            urlRepository.findById(event.getUrlId()).ifPresent(url -> {
                url.setClickCount(url.getClickCount() + 1);
                url.setLastAccessedAt(event.getTimestamp());
                urlRepository.save(url);
            });

            // Update or Create AnalyticsSummary record
            long totalClicks = clickEventRepository.countByUrlId(event.getUrlId());
            long uniqueClicks = clickEventRepository.countUniqueVisitorsByUrlId(event.getUrlId());

            AnalyticsSummary summary = analyticsSummaryRepository.findByUrlId(event.getUrlId())
                    .orElseGet(() -> AnalyticsSummary.builder().urlId(event.getUrlId()).build());

            summary.setTotalClicks(totalClicks);
            summary.setUniqueClicks(uniqueClicks);
            summary.setLastAccessedAt(event.getTimestamp());
            analyticsSummaryRepository.save(summary);

            // Evict analytics Redis cache so next dashboard query gets fresh counts
            try {
                redisTemplate.delete("linkguard:cache:analytics:" + event.getUrlId());
            } catch (Exception ex) {
                log.warn("Failed to evict Redis analytics cache for urlId {}: {}", event.getUrlId(), ex.getMessage());
            }

            log.debug("Recorded click event for URL id {} shortCode {}", event.getUrlId(), event.getShortCode());
        } catch (Exception ex) {
            log.error("Failed to process click event for URL id {}: ", event.getUrlId(), ex);
        }
    }
}
