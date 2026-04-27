from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


DowntimeType = Literal["mechanical", "electrical", "instrument", "operation", "other"]
ImpactLevel = Literal["low", "medium", "high"]
DowntimeStatus = Literal["new", "processing", "resolved", "closed"]


class DowntimeBase(BaseModel):
    ticket_code: str = Field(..., min_length=1, max_length=50)

    equipment_id: Optional[int] = None
    equipment_code: Optional[str] = Field(default=None, max_length=50)
    equipment_name: str = Field(..., min_length=1, max_length=255)

    area: str = Field(..., min_length=1, max_length=255)
    downtime_type: DowntimeType
    impact_level: ImpactLevel = "medium"
    owner_name: str = Field(..., min_length=1, max_length=100)

    start_time: datetime
    end_time: datetime

    cause: str = Field(..., min_length=1)
    action_taken: Optional[str] = None
    notes: Optional[str] = None

    status: DowntimeStatus = "new"


class DowntimeCreate(DowntimeBase):
    pass


class DowntimeUpdate(DowntimeBase):
    pass


class DowntimeResponse(DowntimeBase):
    downtime_id: int

    model_config = ConfigDict(from_attributes=True)