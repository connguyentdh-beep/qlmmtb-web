from sqlalchemy import Column, Integer, String, Date, Text

from app.db.session import Base


class WorkOrder(Base):
    __tablename__ = "work_orders_v1"

    work_order_id = Column(Integer, primary_key=True, index=True)
    work_code = Column(String(50), unique=True, nullable=False, index=True)
    work_type = Column(String(20), nullable=False, index=True)

    equipment_id = Column(Integer, nullable=True, index=True)
    equipment_code = Column(String(50), nullable=False, index=True)
    equipment_name_vi = Column(String(255), nullable=False)

    job_description = Column(Text, nullable=False)
    assignee = Column(String(100), nullable=False)

    priority = Column(String(20), nullable=False, default="medium")
    status = Column(String(20), nullable=False, default="open")

    created_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)

    notes = Column(Text, nullable=True)