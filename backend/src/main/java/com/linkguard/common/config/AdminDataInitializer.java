package com.linkguard.common.config;

import com.linkguard.auth.entity.Role;
import com.linkguard.auth.entity.User;
import com.linkguard.auth.entity.UserStatus;
import com.linkguard.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            String adminEmail = "admin@linkguard.app";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = User.builder()
                        .name("LinkGuard Admin")
                        .email(adminEmail)
                        .passwordHash(passwordEncoder.encode("AdminPassword123!"))
                        .role(Role.ADMIN)
                        .emailVerified(true)
                        .status(UserStatus.ACTIVE)
                        .build();

                userRepository.save(admin);
                log.info("Successfully initialized default Admin user: {}", adminEmail);
            }
        } catch (Exception ex) {
            log.error("Failed to seed default admin user: ", ex);
        }
    }
}
