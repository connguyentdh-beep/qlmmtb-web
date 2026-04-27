from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.pm_plan import PMPlan
from app.schemas.pm_plan import PMPlanOut, PMPlanCreate, PMPlanUpdate

router = APIRouter(prefix="/pm-plans", tags=["pm-plans"])


@router.get("/", response_model=list[PMPlanOut])
async def get_pm_plans(db: Session = Depends(get_db)):
    items = db.query(PMPlan).order_by(PMPlan.pm_id.desc()).all()
    return items


@router.post("/", response_model=PMPlanOut)
async def create_pm_plan(payload: PMPlanCreate, db: Session = Depends(get_db)):
    item = PMPlan(
        equipment_id=payload.equipment_id,
        equipment_code=payload.equipment_code,
        equipment_name_vi=payload.equipment_name_vi,
        frequency_type=payload.frequency_type,
        frequency_value=payload.frequency_value,
        planned_date=payload.planned_date,
        assignee=payload.assignee,
        notes=payload.notes,
        status=payload.status,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{pm_id}", response_model=PMPlanOut)
async def update_pm_plan(pm_id: int, payload: PMPlanUpdate, db: Session = Depends(get_db)):
    item = db.query(PMPlan).filter(PMPlan.pm_id == pm_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy kế hoạch PM")

    item.equipment_id = payload.equipment_id
    item.equipment_code = payload.equipment_code
    item.equipment_name_vi = payload.equipment_name_vi
    item.frequency_type = payload.frequency_type
    item.frequency_value = payload.frequency_value
    item.planned_date = payload.planned_date
    item.assignee = payload.assignee
    item.notes = payload.notes
    item.status = payload.status

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{pm_id}")
async def delete_pm_plan(pm_id: int, db: Session = Depends(get_db)):
    item = db.query(PMPlan).filter(PMPlan.pm_id == pm_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy kế hoạch PM")

    db.delete(item)
    db.commit()

    return {
        "status": "ok",
        "message": f"Đã xóa kế hoạch PM #{pm_id}"
    }