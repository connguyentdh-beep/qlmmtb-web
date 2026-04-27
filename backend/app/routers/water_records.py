from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.water_record import WaterRecord
from app.schemas.water_record import (
    WaterRecordOut,
    WaterRecordCreate,
    WaterRecordUpdate,
)

router = APIRouter(prefix="/water-records", tags=["water-records"])


def validate_readings(start_reading: float, end_reading: float):
    if end_reading < start_reading:
        raise HTTPException(
            status_code=400,
            detail="end_reading must be greater than or equal to start_reading",
        )


@router.get("/", response_model=list[WaterRecordOut])
async def get_water_records(db: Session = Depends(get_db)):
    items = (
        db.query(WaterRecord)
        .order_by(WaterRecord.record_date.desc(), WaterRecord.id.desc())
        .all()
    )
    return items


@router.post("/", response_model=WaterRecordOut)
async def create_water_record(
    payload: WaterRecordCreate,
    db: Session = Depends(get_db),
):
    validate_readings(payload.start_reading, payload.end_reading)

    duplicated = (
        db.query(WaterRecord)
        .filter(
            WaterRecord.record_date == payload.record_date,
            WaterRecord.equipment_id == payload.equipment_id,
        )
        .first()
    )
    if duplicated:
        raise HTTPException(
            status_code=400,
            detail="Water record already exists for this equipment and date",
        )

    item = WaterRecord(
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


@router.put("/{record_id}", response_model=WaterRecordOut)
async def update_water_record(
    record_id: int,
    payload: WaterRecordUpdate,
    db: Session = Depends(get_db),
):
    validate_readings(payload.start_reading, payload.end_reading)

    item = db.query(WaterRecord).filter(WaterRecord.id == record_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Water record not found")

    duplicated = (
        db.query(WaterRecord)
        .filter(
            WaterRecord.record_date == payload.record_date,
            WaterRecord.equipment_id == payload.equipment_id,
            WaterRecord.id != record_id,
        )
        .first()
    )
    if duplicated:
        raise HTTPException(
            status_code=400,
            detail="Water record already exists for this equipment and date",
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
async def delete_water_record(record_id: int, db: Session = Depends(get_db)):
    item = db.query(WaterRecord).filter(WaterRecord.id == record_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Water record not found")

    db.delete(item)
    db.commit()
    return {"status": "ok", "message": "Water record deleted"}