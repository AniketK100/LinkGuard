-- Migration V8: Seed default admin user
INSERT INTO users (name, email, password_hash, role, email_verified, status)
SELECT 'LinkGuard Admin', 'admin@linkguard.app', '$2a$10$e0MYzXyjpJS7Pd0RVvHwHe1V.V7LhH7.g.W5x5w9u3XwXwXwXwXwX', 'ADMIN', true, 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@linkguard.app');
