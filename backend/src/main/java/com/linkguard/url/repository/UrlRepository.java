package com.linkguard.url.repository;

import com.linkguard.url.entity.Url;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
    Optional<Url> findByShortCodeAndDeletedAtIsNull(String shortCode);
    Optional<Url> findByShortCode(String shortCode);
    Optional<Url> findByCustomAliasAndDeletedAtIsNull(String customAlias);
    boolean existsByShortCode(String shortCode);
    boolean existsByCustomAlias(String customAlias);

    Page<Url> findByUserIdAndDeletedAtIsNull(Long userId, Pageable pageable);
    Optional<Url> findByIdAndUserIdAndDeletedAtIsNull(Long id, Long userId);
    Optional<Url> findByIdAndUserId(Long id, Long userId);
}
