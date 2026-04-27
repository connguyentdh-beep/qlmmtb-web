from sqlalchemy import Column, BigInteger, String, Integer, Date, Text, TIMESTAMP
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class PMPlan(Base):
    __tablename__ = "pm_plans_v1"

    pm_id = Column(BigInteger, primary_key=True, index=True)
    equipment_id = Column(BigInteger, nullable=True)
    equipment_code = Column(String(50), nullable=False)
    equipment_name_vi = Column(String(255), nullable=False)
    frequency_type = Column(String(20), nullable=False, default="monthly")
    frequency_value = Column(Integer, nullable=False, default=1)
    planned_date = Column(Date, nullable=False)
    assignee = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="planned")
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    updated_at = Column(TIMESTAMP, server_default=func.current_timestamp())