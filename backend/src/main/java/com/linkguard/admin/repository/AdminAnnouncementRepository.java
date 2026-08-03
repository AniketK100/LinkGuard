package com.linkguard.admin.repository;

import com.linkguard.admin.entity.AdminAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminAnnouncementRepository extends JpaRepository<AdminAnnouncement, Long> {
    List<AdminAnnouncement> findAllByOrderByCreatedAtDesc();
}
