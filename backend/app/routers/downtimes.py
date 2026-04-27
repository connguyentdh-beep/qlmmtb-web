from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.downtime_ticket import DowntimeTicket
from app.schemas.downtime import (
    DowntimeCreate,
    DowntimeUpdate,
    DowntimeResponse,
)

router = APIRouter(prefix="/downtimes", tags=["downtimes"])


@router.get("/", response_model=List[DowntimeResponse])
def get_downtimes(db: Session = Depends(get_db)):
    items = (
        db.query(DowntimeTicket)
        .order_by(DowntimeTicket.downtime_id.desc())
        .all()
    )
    return items


@router.post("/", response_model=DowntimeResponse, status_code=status.HTTP_201_CREATED)
def create_downtime(payload: DowntimeCreate, db: Session = Depends(get_db)):
    existing = (
        db.query(DowntimeTicket)
        .filter(DowntimeTicket.ticket_code == payload.ticket_code)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Mã phiếu downtime đã tồn tại: {payload.ticket_code}",
        )

    if payload.end_time <= payload.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
        )

    item = DowntimeTicket(
        ticket_code=payload.ticket_code,
        equipment_id=payload.equipment_id,
        equipment_code=payload.equipment_code,
        equipment_name=payload.equipment_name,
        area=payload.area,
        downtime_type=payload.downtime_type,
        impact_level=payload.impact_level,
        owner_name=payload.owner_name,
        start_time=payload.start_time,
        end_time=payload.end_time,
        cause=payload.cause,
        action_taken=payload.action_taken,
        notes=payload.notes,
        status=payload.status,
    )

    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{downtime_id}", response_model=DowntimeResponse)
def update_downtime(
    downtime_id: int,
    payload: DowntimeUpdate,
    db: Session = Depends(get_db),
):
    item = (
        db.query(DowntimeTicket)
        .filter(DowntimeTicket.downtime_id == downtime_id)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiếu downtime ID={downtime_id}",
        )

    duplicate = (
        db.query(DowntimeTicket)
        .filter(
            DowntimeTicket.ticket_code == payload.ticket_code,
            DowntimeTicket.downtime_id != downtime_id,
        )
        .first()
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Mã phiếu downtime đã tồn tại: {payload.ticket_code}",
        )

    if payload.end_time <= payload.start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
        )

    item.ticket_code = payload.ticket_code
    item.equipment_id = payload.equipment_id
    item.equipment_code = payload.equipment_code
    item.equipment_name = payload.equipment_name
    item.area = payload.area
    item.downtime_type = payload.downtime_type
    item.impact_level = payload.impact_level
    item.owner_name = payload.owner_name
    item.start_time = payload.start_time
    item.end_time = payload.end_time
    item.cause = payload.cause
    item.action_taken = payload.action_taken
    item.notes = payload.notes
    item.status = payload.status

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{downtime_id}")
def delete_downtime(downtime_id: int, db: Session = Depends(get_db)):
    item = (
        db.query(DowntimeTicket)
        .filter(DowntimeTicket.downtime_id == downtime_id)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiếu downtime ID={downtime_id}",
        )

    db.delete(item)
    db.commit()

    return {
        "status": "ok",
        "message": f"Đã xóa phiếu downtime ID={downtime_id}",
    }