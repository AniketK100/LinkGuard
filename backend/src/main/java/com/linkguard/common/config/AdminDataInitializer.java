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
            User admin = userRepository.findByEmail(adminEmail).orElse(null);

            if (admin == null) {
                admin = User.builder()
                        .name("LinkGuard Admin")
                        .email(adminEmail)
                        .passwordHash(passwordEncoder.encode("AdminPassword123!"))
                        .role(Role.ADMIN)
                        .emailVerified(true)
                        .status(UserStatus.ACTIVE)
                        .build();

                userRepository.save(admin);
                log.info("Successfully initialized default Admin user: {}", adminEmail);
            } else {
                // Ensure valid BCrypt hash for AdminPassword123!
                admin.setPasswordHash(passwordEncoder.encode("AdminPassword123!"));
                admin.setRole(Role.ADMIN);
                admin.setStatus(UserStatus.ACTIVE);
                userRepository.save(admin);
                log.info("Successfully updated default Admin user credentials: {}", adminEmail);
            }
        } catch (Exception ex) {
            log.error("Failed to seed or update default admin user: ", ex);
        }
    }
}
