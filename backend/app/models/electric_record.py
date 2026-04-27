from sqlalchemy import Column, Integer, String, Date, Text, Numeric
from app.db.session import Base


class ElectricRecord(Base):
    __tablename__ = "electric_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    record_date = Column(Date, nullable=False, index=True)

    equipment_id = Column(Integer, nullable=False, index=True)
    equipment_code = Column(String(100), nullable=False, index=True)
    equipment_name_vi = Column(String(255), nullable=False)

    start_reading = Column(Numeric(18, 3), nullable=False)
    end_reading = Column(Numeric(18, 3), nullable=False)
    unit_price = Column(Numeric(18, 2), nullable=False, default=2500)

    notes = Column(Text, nullable=True)