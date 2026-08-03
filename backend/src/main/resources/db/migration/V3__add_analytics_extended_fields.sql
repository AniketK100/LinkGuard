-- Migration V3: Add extended fields to click_events table and create analytics_summaries table

ALTER TABLE click_events ADD COLUMN IF NOT EXISTS short_code VARCHAR(30);
ALTER TABLE click_events ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE click_events ADD COLUMN IF NOT EXISTS region VARCHAR(100);
ALTER TABLE click_events ADD COLUMN IF NOT EXISTS operating_system VARCHAR(50);
ALTER TABLE click_events ADD COLUMN IF NOT EXISTS device_type VARCHAR(20);
ALTER TABLE click_events ADD COLUMN IF NOT EXISTS user_agent VARCHAR(1000);
ALTER TABLE click_events ADD COLUMN IF NOT EXISTS language VARCHAR(10);

CREATE INDEX IF NOT EXISTS idx_click_events_country ON click_events(country);
CREATE INDEX IF NOT EXISTS idx_click_events_browser ON click_events(browser);
CREATE INDEX IF NOT EXISTS idx_click_events_device ON click_events(device);

CREATE TABLE IF NOT EXISTS analytics_summaries (
    id BIGSERIAL PRIMARY KEY,
    url_id BIGINT NOT NULL UNIQUE REFERENCES urls(id) ON DELETE CASCADE,
    total_clicks BIGINT NOT NULL DEFAULT 0,
    unique_clicks BIGINT NOT NULL DEFAULT 0,
    last_accessed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analytics_summaries_url_id ON analytics_summaries(url_id);
