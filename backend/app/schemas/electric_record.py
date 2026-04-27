from datetime import date
from pydantic import BaseModel, Field, ConfigDict


class ElectricRecordBase(BaseModel):
    record_date: date
    equipment_id: int
    equipment_code: str = Field(..., max_length=100)
    equipment_name_vi: str = Field(..., max_length=255)

    start_reading: float
    end_reading: float
    unit_price: float = 2500
    notes: str | None = None


class ElectricRecordCreate(ElectricRecordBase):
    pass


class ElectricRecordUpdate(ElectricRecordBase):
    pass


class ElectricRecordOut(ElectricRecordBase):
    id: int

    model_config = ConfigDict(from_attributes=True)