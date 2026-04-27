from sqlalchemy import text
from app.db.session import engine

sql = """
ALTER TABLE equipments
ADD COLUMN IF NOT EXISTS csv_power_spec TEXT,
ADD COLUMN IF NOT EXISTS csv_department VARCHAR(255),
ADD COLUMN IF NOT EXISTS csv_area VARCHAR(255),
ADD COLUMN IF NOT EXISTS csv_unit VARCHAR(100),
ADD COLUMN IF NOT EXISTS csv_quantity NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS csv_owner_name VARCHAR(255);
"""

with engine.begin() as conn:
    conn.execute(text(sql))

print({"status": "ok", "message": "ALTER TABLE executed successfully"})