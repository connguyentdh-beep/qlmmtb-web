from sqlalchemy import Column, BigInteger, String, Date, Numeric, Boolean, Text, TIMESTAMP
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Equipment(Base):
    __tablename__ = "equipments"

    equipment_id = Column(BigInteger, primary_key=True, index=True)
    equipment_code = Column(String(50), unique=True, nullable=False)
    equipment_name_vi = Column(String(255), nullable=False)
    equipment_name_en = Column(String(255))
    category_id = Column(BigInteger)
    model = Column(String(255))
    serial_number = Column(String(255))
    manufacturer = Column(String(255))
    area_id = Column(BigInteger)
    line_name = Column(String(100))
    department_id = Column(BigInteger)
    criticality_level = Column(String(30))
    commission_date = Column(Date)
    status = Column(String(30), default="active")
    owner_team = Column(String(255))
    maintenance_team = Column(String(255))
    standard_run_hours_per_day = Column(Numeric(10, 2))
    power_rated_kw = Column(Numeric(12, 3))
    water_required_flag = Column(Boolean, default=False)
    estimated_water_use_per_hour = Column(Numeric(12, 3))
    qr_code = Column(String(255))
    image_url = Column(Text)
    notes = Column(Text)

    csv_power_spec = Column(Text)
    csv_department = Column(String(255))
    csv_area = Column(String(255))
    csv_unit = Column(String(100))
    csv_quantity = Column(Numeric(12, 2))
    csv_owner_name = Column(String(255))

    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    updated_at = Column(TIMESTAMP, server_default=func.current_timestamp())