from pydantic import BaseModel
from typing import Optional


class EquipmentOut(BaseModel):
    equipment_id: int
    equipment_code: str
    equipment_name_vi: str
    status: Optional[str] = None

    csv_power_spec: Optional[str] = None
    csv_department: Optional[str] = None
    csv_area: Optional[str] = None
    csv_unit: Optional[str] = None
    csv_quantity: Optional[float] = None
    csv_owner_name: Optional[str] = None

    model: Optional[str] = None
    manufacturer: Optional[str] = None
    owner_team: Optional[str] = None
    maintenance_team: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class EquipmentUpdate(BaseModel):
    equipment_name_vi: str
    status: Optional[str] = None
    csv_power_spec: Optional[str] = None
    csv_department: Optional[str] = None
    csv_area: Optional[str] = None
    csv_unit: Optional[str] = None
    csv_quantity: Optional[float] = None
    csv_owner_name: Optional[str] = None