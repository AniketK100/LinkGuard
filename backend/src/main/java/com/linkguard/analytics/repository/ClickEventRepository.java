package com.linkguard.analytics.repository;

import com.linkguard.analytics.entity.ClickEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClickEventRepository extends JpaRepository<ClickEventEntity, Long> {

    long countByUrlId(Long urlId);

    @Query("SELECT COUNT(DISTINCT c.ipHash) FROM ClickEventEntity c WHERE c.urlId = :urlId")
    long countUniqueVisitorsByUrlId(@Param("urlId") Long urlId);

    @Query("SELECT COALESCE(c.country, 'Unknown') as keyName, COUNT(c) as countVal FROM ClickEventEntity c WHERE c.urlId = :urlId GROUP BY c.country ORDER BY COUNT(c) DESC")
    List<Object[]> findCountryBreakdownByUrlId(@Param("urlId") Long urlId);

    @Query("SELECT COALESCE(c.deviceType, c.device, 'desktop') as keyName, COUNT(c) as countVal FROM ClickEventEntity c WHERE c.urlId = :urlId GROUP BY c.deviceType, c.device ORDER BY COUNT(c) DESC")
    List<Object[]> findDeviceBreakdownByUrlId(@Param("urlId") Long urlId);

    @Query("SELECT COALESCE(c.browser, 'Other') as keyName, COUNT(c) as countVal FROM ClickEventEntity c WHERE c.urlId = :urlId GROUP BY c.browser ORDER BY COUNT(c) DESC")
    List<Object[]> findBrowserBreakdownByUrlId(@Param("urlId") Long urlId);

    @Query("SELECT COALESCE(c.operatingSystem, c.os, 'Other') as keyName, COUNT(c) as countVal FROM ClickEventEntity c WHERE c.urlId = :urlId GROUP BY c.operatingSystem, c.os ORDER BY COUNT(c) DESC")
    List<Object[]> findOsBreakdownByUrlId(@Param("urlId") Long urlId);

    @Query("SELECT COALESCE(c.referrer, 'Direct / None') as keyName, COUNT(c) as countVal FROM ClickEventEntity c WHERE c.urlId = :urlId GROUP BY c.referrer ORDER BY COUNT(c) DESC")
    List<Object[]> findReferrerBreakdownByUrlId(@Param("urlId") Long urlId);

    List<ClickEventEntity> findByUrlIdOrderByTimestampDesc(Long urlId);
}
