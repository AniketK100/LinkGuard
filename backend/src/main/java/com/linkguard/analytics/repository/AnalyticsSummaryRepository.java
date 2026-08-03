package com.linkguard.analytics.repository;

import com.linkguard.analytics.entity.AnalyticsSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnalyticsSummaryRepository extends JpaRepository<AnalyticsSummary, Long> {
    Optional<AnalyticsSummary> findByUrlId(Long urlId);
}
