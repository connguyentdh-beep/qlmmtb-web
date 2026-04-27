from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.work_order import WorkOrder
from app.schemas.work_order import (
    WorkOrderCreate,
    WorkOrderUpdate,
    WorkOrderResponse,
)

router = APIRouter(prefix="/work-orders", tags=["work-orders"])


@router.get("/", response_model=List[WorkOrderResponse])
async def get_work_orders(db: Session = Depends(get_db)):
    items = (
        db.query(WorkOrder)
        .order_by(WorkOrder.work_order_id.desc())
        .all()
    )
    return items


@router.post("/", response_model=WorkOrderResponse, status_code=status.HTTP_201_CREATED)
async def create_work_order(payload: WorkOrderCreate, db: Session = Depends(get_db)):
    existing = (
        db.query(WorkOrder)
        .filter(WorkOrder.work_code == payload.work_code)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Mã phiếu đã tồn tại: {payload.work_code}",
        )

    item = WorkOrder(
        work_code=payload.work_code,
        work_type=payload.work_type,
        equipment_id=payload.equipment_id,
        equipment_code=payload.equipment_code,
        equipment_name_vi=payload.equipment_name_vi,
        job_description=payload.job_description,
        assignee=payload.assignee,
        priority=payload.priority,
        status=payload.status,
        created_date=payload.created_date,
        due_date=payload.due_date,
        notes=payload.notes,
    )

    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{work_order_id}", response_model=WorkOrderResponse)
async def update_work_order(
    work_order_id: int,
    payload: WorkOrderUpdate,
    db: Session = Depends(get_db),
):
    item = (
        db.query(WorkOrder)
        .filter(WorkOrder.work_order_id == work_order_id)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiếu công việc ID={work_order_id}",
        )

    duplicate = (
        db.query(WorkOrder)
        .filter(
            WorkOrder.work_code == payload.work_code,
            WorkOrder.work_order_id != work_order_id,
        )
        .first()
    )
    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Mã phiếu đã tồn tại: {payload.work_code}",
        )

    item.work_code = payload.work_code
    item.work_type = payload.work_type
    item.equipment_id = payload.equipment_id
    item.equipment_code = payload.equipment_code
    item.equipment_name_vi = payload.equipment_name_vi
    item.job_description = payload.job_description
    item.assignee = payload.assignee
    item.priority = payload.priority
    item.status = payload.status
    item.created_date = payload.created_date
    item.due_date = payload.due_date
    item.notes = payload.notes

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{work_order_id}")
async def delete_work_order(work_order_id: int, db: Session = Depends(get_db)):
    item = (
        db.query(WorkOrder)
        .filter(WorkOrder.work_order_id == work_order_id)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy phiếu công việc ID={work_order_id}",
        )

    db.delete(item)
    db.commit()

    return {
        "status": "ok",
        "message": f"Đã xóa phiếu công việc ID={work_order_id}",
    }