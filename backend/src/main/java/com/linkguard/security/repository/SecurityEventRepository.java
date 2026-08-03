package com.linkguard.security.repository;

import com.linkguard.security.entity.SecurityEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityEventRepository extends JpaRepository<SecurityEvent, Long> {
    Page<SecurityEvent> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
