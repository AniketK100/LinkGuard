package com.linkguard.analytics.service;

import com.linkguard.analytics.dto.*;
import com.linkguard.analytics.entity.ClickEventEntity;
import com.linkguard.analytics.repository.ClickEventRepository;
import com.linkguard.common.exception.ForbiddenException;
import com.linkguard.common.exception.ResourceNotFoundException;
import com.linkguard.url.entity.Url;
import com.linkguard.url.repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ClickEventRepository clickEventRepository;
    private final UrlRepository urlRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String CACHE_PREFIX = "linkguard:cache:analytics:";

    @Override
    @Transactional(readOnly = true)
    public UrlAnalyticsResponse getFullAnalytics(Long urlId, Long userId) {
        validateUrlOwnership(urlId, userId);

        String cacheKey = CACHE_PREFIX + urlId;
        try {
            Object cachedObj = redisTemplate.opsForValue().get(cacheKey);
            if (cachedObj instanceof UrlAnalyticsResponse cachedResponse) {
                log.debug("Redis cache HIT for analytics of urlId: {}", urlId);
                return cachedResponse;
            }
        } catch (Exception ex) {
            log.warn("Redis analytics cache lookup failed for urlId {}. Falling back to DB: {}", urlId, ex.getMessage());
        }

        Url url = urlRepository.findById(urlId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found with id: " + urlId));

        long totalClicks = clickEventRepository.countByUrlId(urlId);
        long uniqueVisitors = clickEventRepository.countUniqueVisitorsByUrlId(urlId);

        List<BreakdownItemDto> byCountry = getCountryBreakdown(urlId, userId);
        List<BreakdownItemDto> byDevice = getDeviceBreakdown(urlId, userId);
        List<BreakdownItemDto> byBrowser = getBrowserBreakdown(urlId, userId);
        List<BreakdownItemDto> byOs = getOsBreakdown(urlId, userId);
        List<BreakdownItemDto> byReferrer = getReferrerBreakdown(urlId, userId);
        List<TimelineItemDto> timeSeries = getTimeline(urlId, userId);

        UrlAnalyticsResponse response = UrlAnalyticsResponse.builder()
                .urlId(urlId)
                .totalClicks(totalClicks)
                .uniqueVisitors(uniqueVisitors)
                .lastAccessedAt(url.getLastAccessedAt())
                .byCountry(byCountry)
                .byDevice(byDevice)
                .byBrowser(byBrowser)
                .byOperatingSystem(byOs)
                .byReferrer(byReferrer)
                .timeSeries(timeSeries)
                .build();

        try {
            redisTemplate.opsForValue().set(cacheKey, response, Duration.ofMinutes(15));
        } catch (Exception ex) {
            log.warn("Failed to set Redis analytics cache for urlId {}: {}", urlId, ex.getMessage());
        }

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsOverviewDto getOverview(Long urlId, Long userId) {
        Url url = validateUrlOwnership(urlId, userId);
        long totalClicks = clickEventRepository.countByUrlId(urlId);
        long uniqueVisitors = clickEventRepository.countUniqueVisitorsByUrlId(urlId);

        return AnalyticsOverviewDto.builder()
                .urlId(urlId)
                .totalClicks(totalClicks)
                .uniqueVisitors(uniqueVisitors)
                .lastAccessedAt(url.getLastAccessedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BreakdownItemDto> getCountryBreakdown(Long urlId, Long userId) {
        validateUrlOwnership(urlId, userId);
        return mapBreakdown(clickEventRepository.findCountryBreakdownByUrlId(urlId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BreakdownItemDto> getDeviceBreakdown(Long urlId, Long userId) {
        validateUrlOwnership(urlId, userId);
        return mapBreakdown(clickEventRepository.findDeviceBreakdownByUrlId(urlId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BreakdownItemDto> getBrowserBreakdown(Long urlId, Long userId) {
        validateUrlOwnership(urlId, userId);
        return mapBreakdown(clickEventRepository.findBrowserBreakdownByUrlId(urlId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BreakdownItemDto> getOsBreakdown(Long urlId, Long userId) {
        validateUrlOwnership(urlId, userId);
        return mapBreakdown(clickEventRepository.findOsBreakdownByUrlId(urlId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BreakdownItemDto> getReferrerBreakdown(Long urlId, Long userId) {
        validateUrlOwnership(urlId, userId);
        return mapBreakdown(clickEventRepository.findReferrerBreakdownByUrlId(urlId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimelineItemDto> getTimeline(Long urlId, Long userId) {
        validateUrlOwnership(urlId, userId);
        List<ClickEventEntity> events = clickEventRepository.findByUrlIdOrderByTimestampDesc(urlId);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(ZoneId.of("UTC"));
        Map<String, List<ClickEventEntity>> grouped = events.stream()
                .collect(Collectors.groupingBy(e -> formatter.format(e.getTimestamp())));

        List<TimelineItemDto> timeline = new ArrayList<>();
        grouped.forEach((date, eventList) -> {
            long total = eventList.size();
            long unique = eventList.stream().map(ClickEventEntity::getIpHash).distinct().count();
            timeline.add(new TimelineItemDto(date, total, unique));
        });

        timeline.sort(Comparator.comparing(TimelineItemDto::getDate));
        return timeline;
    }

    @Override
    @Transactional(readOnly = true)
    public String exportAnalyticsToCsv(Long urlId, Long userId) {
        validateUrlOwnership(urlId, userId);
        List<ClickEventEntity> events = clickEventRepository.findByUrlIdOrderByTimestampDesc(urlId);

        StringBuilder csv = new StringBuilder();
        csv.append("EventId,Timestamp,ShortCode,IpHash,Country,Browser,OS,DeviceType,Referrer\n");

        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
        for (ClickEventEntity e : events) {
            csv.append(e.getId()).append(",")
               .append(formatter.format(e.getTimestamp())).append(",")
               .append(e.getShortCode() != null ? e.getShortCode() : "").append(",")
               .append(e.getIpHash()).append(",")
               .append(e.getCountry() != null ? e.getCountry() : "").append(",")
               .append(e.getBrowser() != null ? e.getBrowser() : "").append(",")
               .append(e.getOperatingSystem() != null ? e.getOperatingSystem() : "").append(",")
               .append(e.getDeviceType() != null ? e.getDeviceType() : "").append(",")
               .append("\"").append(e.getReferrer() != null ? e.getReferrer().replace("\"", "\"\"") : "").append("\"\n");
        }

        return csv.toString();
    }

    private Url validateUrlOwnership(Long urlId, Long userId) {
        Url url = urlRepository.findById(urlId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found with id: " + urlId));

        if (userId != null && url.getUserId() != null && !url.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to access analytics for this URL");
        }
        return url;
    }

    private List<BreakdownItemDto> mapBreakdown(List<Object[]> queryResults) {
        long grandTotal = queryResults.stream().mapToLong(row -> (Long) row[1]).sum();
        List<BreakdownItemDto> items = new ArrayList<>();

        for (Object[] row : queryResults) {
            String name = (String) row[0];
            long count = (Long) row[1];
            double percentage = grandTotal > 0 ? (count * 100.0 / grandTotal) : 0.0;
            items.add(new BreakdownItemDto(name != null ? name : "Unknown", count, Math.round(percentage * 10.0) / 10.0));
        }

        return items;
    }
}
