from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.electric_record import ElectricRecord
from app.schemas.electric_record import (
    ElectricRecordOut,
    ElectricRecordCreate,
    ElectricRecordUpdate,
)

router = APIRouter(prefix="/electric-records", tags=["electric-records"])


def validate_readings(start_reading: float, end_reading: float):
    if end_reading < start_reading:
        raise HTTPException(
            status_code=400,
            detail="end_reading must be greater than or equal to start_reading",
        )


@router.get("/", response_model=list[ElectricRecordOut])
async def get_electric_records(db: Session = Depends(get_db)):
    items = (
        db.query(ElectricRecord)
        .order_by(ElectricRecord.record_date.desc(), ElectricRecord.id.desc())
        .all()
    )
    return items


@router.post("/", response_model=ElectricRecordOut)
async def create_electric_record(
    payload: ElectricRecordCreate,
    db: Session = Depends(get_db),
):
    validate_readings(payload.start_reading, payload.end_reading)

    duplicated = (
        db.query(ElectricRecord)
        .filter(
            ElectricRecord.record_date == payload.record_date,
            ElectricRecord.equipment_id == payload.equipment_id,
        )
        .first()
    )
    if duplicated:
        raise HTTPException(
            status_code=400,
            detail="Electric record already exists for this equipment and date",
        )

    item = ElectricRecord(
        record_date=payload.record_date,
        equipment_id=payload.equipment_id,
        equipment_code=payload.equipment_code,
        equipment_name_vi=payload.equipment_name_vi,
        start_reading=payload.start_reading,
        end_reading=payload.end_reading,
        unit_price=payload.unit_price,
        notes=payload.notes,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{record_id}", response_model=ElectricRecordOut)
async def update_electric_record(
    record_id: int,
    payload: ElectricRecordUpdate,
    db: Session = Depends(get_db),
):
    validate_readings(payload.start_reading, payload.end_reading)

    item = db.query(ElectricRecord).filter(ElectricRecord.id == record_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Electric record not found")

    duplicated = (
        db.query(ElectricRecord)
        .filter(
            ElectricRecord.record_date == payload.record_date,
            ElectricRecord.equipment_id == payload.equipment_id,
            ElectricRecord.id != record_id,
        )
        .first()
    )
    if duplicated:
        raise HTTPException(
            status_code=400,
            detail="Electric record already exists for this equipment and date",
        )

    item.record_date = payload.record_date
    item.equipment_id = payload.equipment_id
    item.equipment_code = payload.equipment_code
    item.equipment_name_vi = payload.equipment_name_vi
    item.start_reading = payload.start_reading
    item.end_reading = payload.end_reading
    item.unit_price = payload.unit_price
    item.notes = payload.notes

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{record_id}")
async def delete_electric_record(record_id: int, db: Session = Depends(get_db)):
    item = db.query(ElectricRecord).filter(ElectricRecord.id == record_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Electric record not found")

    db.delete(item)
    db.commit()
    return {"status": "ok", "message": "Electric record deleted"}