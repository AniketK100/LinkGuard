package com.linkguard.security.repository;

import com.linkguard.security.entity.BlockedIp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlockedIpRepository extends JpaRepository<BlockedIp, Long> {
    Optional<BlockedIp> findByIpAddress(String ipAddress);
    boolean existsByIpAddress(String ipAddress);
}
