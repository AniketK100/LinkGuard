-- Migration V5: Create qr_codes table for LinkGuard QR Code Module

CREATE TABLE IF NOT EXISTS qr_codes (
    id BIGSERIAL PRIMARY KEY,
    url_id BIGINT NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
    short_code VARCHAR(30) NOT NULL,
    qr_type VARCHAR(20) NOT NULL DEFAULT 'DYNAMIC',
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    content_type VARCHAR(50) DEFAULT 'image/png',
    width INT DEFAULT 300,
    height INT DEFAULT 300,
    foreground_color VARCHAR(20) DEFAULT '#000000',
    background_color VARCHAR(20) DEFAULT '#FFFFFF',
    logo_path VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_url_id ON qr_codes(url_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_short_code ON qr_codes(short_code);
