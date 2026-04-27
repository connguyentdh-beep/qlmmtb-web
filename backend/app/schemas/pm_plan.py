from datetime import date
from pydantic import BaseModel
from typing import Optional


class PMPlanOut(BaseModel):
    pm_id: int
    equipment_id: Optional[int] = None
    equipment_code: str
    equipment_name_vi: str
    frequency_type: str
    frequency_value: int
    planned_date: date
    assignee: Optional[str] = None
    notes: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


class PMPlanCreate(BaseModel):
    equipment_id: Optional[int] = None
    equipment_code: str
    equipment_name_vi: str
    frequency_type: str
    frequency_value: int
    planned_date: date
    assignee: Optional[str] = None
    notes: Optional[str] = None
    status: str = "planned"


class PMPlanUpdate(BaseModel):
    equipment_id: Optional[int] = None
    equipment_code: str
    equipment_name_vi: str
    frequency_type: str
    frequency_value: int
    planned_date: date
    assignee: Optional[str] = None
    notes: Optional[str] = None
    status: str