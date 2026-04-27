from sqlalchemy import Column, Integer, String, DateTime, Text

from app.db.session import Base


class DowntimeTicket(Base):
    __tablename__ = "downtime_tickets_v1"

    downtime_id = Column(Integer, primary_key=True, index=True)
    ticket_code = Column(String(50), unique=True, nullable=False, index=True)

    equipment_id = Column(Integer, nullable=True, index=True)
    equipment_code = Column(String(50), nullable=True, index=True)
    equipment_name = Column(String(255), nullable=False)

    area = Column(String(255), nullable=False)
    downtime_type = Column(String(50), nullable=False, index=True)   # mechanical / electrical / instrument / operation / other
    impact_level = Column(String(20), nullable=False, default="medium")  # low / medium / high
    owner_name = Column(String(100), nullable=False)

    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)

    cause = Column(Text, nullable=False)
    action_taken = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    status = Column(String(20), nullable=False, default="new")  # new / processing / resolved / closed