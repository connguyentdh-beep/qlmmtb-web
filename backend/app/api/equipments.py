import io

import pandas as pd
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.equipment import Equipment
from app.schemas.equipment import EquipmentOut, EquipmentUpdate

router = APIRouter(prefix="/equipments", tags=["equipments"])


def normalize_status(value: str) -> str:
    if value is None:
        return "active"

    v = str(value).strip().lower()

    if "đang hoạt động" in v:
        return "active"
    if "dừng hoạt động" in v:
        return "inactive"
    if "hỏng" in v:
        return "broken"
    if "tháo dở" in v:
        return "dismantled"
    if "chuyển đổi" in v:
        return "converted"

    return "active"


def safe_str(value):
    if pd.isna(value):
        return None
    return str(value).strip()


def safe_qty(value):
    if pd.isna(value):
        return None
    try:
        return float(value)
    except Exception:
        return None


def clean_columns(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = [str(col).replace("\ufeff", "").strip() for col in df.columns]
    return df


def get_value(row, *possible_names):
    for name in possible_names:
        if name in row.index:
            return row.get(name)
    return None


@router.get("/", response_model=list[EquipmentOut])
async def get_equipments(db: Session = Depends(get_db)):
    items = db.query(Equipment).order_by(Equipment.equipment_id.asc()).all()
    return items


@router.put("/{equipment_id}", response_model=EquipmentOut)
async def update_equipment(
    equipment_id: int,
    payload: EquipmentUpdate,
    db: Session = Depends(get_db),
):
    item = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy thiết bị")

    item.equipment_name_vi = payload.equipment_name_vi
    item.status = payload.status
    item.csv_power_spec = payload.csv_power_spec
    item.csv_department = payload.csv_department
    item.csv_area = payload.csv_area
    item.csv_unit = payload.csv_unit
    item.csv_quantity = payload.csv_quantity
    item.csv_owner_name = payload.csv_owner_name
    item.owner_team = payload.csv_owner_name
    item.maintenance_team = payload.csv_owner_name

    item.notes = (
        f"Đơn vị sử dụng: {payload.csv_department or ''}; "
        f"Khu vực: {payload.csv_area or ''}; "
        f"Thông số kỹ thuật: {payload.csv_power_spec or ''}; "
        f"Đơn vị tính: {payload.csv_unit or ''}; "
        f"Số lượng: {payload.csv_quantity if payload.csv_quantity is not None else ''}"
    )

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{equipment_id}")
async def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
):
    item = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Không tìm thấy thiết bị")

    db.delete(item)
    db.commit()

    return {
        "status": "ok",
        "message": f"Đã xóa thiết bị {item.equipment_code}"
    }


@router.post("/import-csv")
async def import_equipments_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận file .csv")

    content = await file.read()

    try:
        df = pd.read_csv(io.BytesIO(content), encoding="utf-8-sig")
        df = clean_columns(df)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Không đọc được file CSV: {str(e)}")

    records = []
    for _, row in df.iterrows():
        equipment_code = safe_str(get_value(row, "Mã máy"))
        equipment_name_vi = safe_str(get_value(row, "Tên máy móc, thiết bị"))
        power_spec = safe_str(get_value(row, "Thông số kỹ thuật", "Công suất"))
        department = safe_str(get_value(row, "Đơn vị sử dụng"))
        area = safe_str(get_value(row, "Khu vực"))
        unit = safe_str(get_value(row, "Đơn vị tính"))
        quantity = safe_qty(get_value(row, "Số lượng"))
        status = normalize_status(get_value(row, "Trạng thái"))
        owner_name = safe_str(get_value(row, "Người phụ trách"))

        if not equipment_code or not equipment_name_vi:
            continue

        notes = (
            f"Đơn vị sử dụng: {department or ''}; "
            f"Khu vực: {area or ''}; "
            f"Thông số kỹ thuật: {power_spec or ''}; "
            f"Đơn vị tính: {unit or ''}; "
            f"Số lượng: {quantity if quantity is not None else ''}"
        )

        records.append(
            {
                "equipment_code": equipment_code,
                "equipment_name_vi": equipment_name_vi,
                "status": status,
                "owner_team": owner_name,
                "maintenance_team": owner_name,
                "notes": notes,
                "csv_power_spec": power_spec,
                "csv_department": department,
                "csv_area": area,
                "csv_unit": unit,
                "csv_quantity": quantity,
                "csv_owner_name": owner_name,
            }
        )

    insert_sql = text("""
        INSERT INTO equipments (
            equipment_code,
            equipment_name_vi,
            status,
            owner_team,
            maintenance_team,
            notes,
            csv_power_spec,
            csv_department,
            csv_area,
            csv_unit,
            csv_quantity,
            csv_owner_name
        )
        VALUES (
            :equipment_code,
            :equipment_name_vi,
            :status,
            :owner_team,
            :maintenance_team,
            :notes,
            :csv_power_spec,
            :csv_department,
            :csv_area,
            :csv_unit,
            :csv_quantity,
            :csv_owner_name
        )
        ON CONFLICT (equipment_code) DO UPDATE SET
            equipment_name_vi = EXCLUDED.equipment_name_vi,
            status = EXCLUDED.status,
            owner_team = EXCLUDED.owner_team,
            maintenance_team = EXCLUDED.maintenance_team,
            notes = EXCLUDED.notes,
            csv_power_spec = EXCLUDED.csv_power_spec,
            csv_department = EXCLUDED.csv_department,
            csv_area = EXCLUDED.csv_area,
            csv_unit = EXCLUDED.csv_unit,
            csv_quantity = EXCLUDED.csv_quantity,
            csv_owner_name = EXCLUDED.csv_owner_name
    """)

    for item in records:
        db.execute(insert_sql, item)

    db.commit()

    return {
        "status": "ok",
        "filename": file.filename,
        "rows_input": len(df),
        "rows_processed": len(records),
    }