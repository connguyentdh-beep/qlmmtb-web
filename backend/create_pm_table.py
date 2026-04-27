from sqlalchemy import text
from app.db.session import engine

sql = """
CREATE TABLE IF NOT EXISTS pm_plans_v1 (
    pm_id BIGSERIAL PRIMARY KEY,
    equipment_id BIGINT,
    equipment_code VARCHAR(50) NOT NULL,
    equipment_name_vi VARCHAR(255) NOT NULL,
    frequency_type VARCHAR(20) NOT NULL DEFAULT 'monthly',
    frequency_value INTEGER NOT NULL DEFAULT 1,
    planned_date DATE NOT NULL,
    assignee VARCHAR(255),
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

with engine.begin() as conn:
    conn.execute(text(sql))

print({"status": "ok", "message": "pm_plans_v1 table created"})