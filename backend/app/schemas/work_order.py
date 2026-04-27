from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


WorkType = Literal["PM", "BC", "CM", "INSPECTION"]
PriorityType = Literal["low", "medium", "high", "critical"]
StatusType = Literal["open", "in_progress", "done", "cancelled"]


class WorkOrderBase(BaseModel):
    work_code: str = Field(..., min_length=1, max_length=50)
    work_type: WorkType

    equipment_id: Optional[int] = None
    equipment_code: str = Field(..., min_length=1, max_length=50)
    equipment_name_vi: str = Field(..., min_length=1, max_length=255)

    job_description: str = Field(..., min_length=1)
    assignee: str = Field(..., min_length=1, max_length=100)

    priority: PriorityType = "medium"
    status: StatusType = "open"

    created_date: date
    due_date: date

    notes: Optional[str] = None


class WorkOrderCreate(WorkOrderBase):
    pass


class WorkOrderUpdate(WorkOrderBase):
    pass


class WorkOrderResponse(WorkOrderBase):
    work_order_id: int

    model_config = ConfigDict(from_attributes=True)