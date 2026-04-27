import pandas as pd
from sqlalchemy import text
from app.db.session import engine

CSV_PATH = r"C:\Users\Admin\Desktop\qlmmtb-web\database\MMTB.csv"


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


def main():
    df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")
    df = clean_columns(df)

    print("COLUMNS FOUND:", list(df.columns))
    print("FIRST ROW RAW:")
    print(df.iloc[0].to_dict())

    records = []
    for _, row in df.iterrows():
        equipment_code = safe_str(get_value(row, "Mã máy"))
        equipment_name_vi = safe_str(get_value(row, "Tên máy móc, thiết bị"))

        if not equipment_code or not equipment_name_vi:
            continue

        power_spec = safe_str(get_value(row, "Thông số kỹ thuật", "Công suất", "Công suất "))
        department = safe_str(get_value(row, "Đơn vị sử dụng", "Đơn vị sử dụng "))
        area = safe_str(get_value(row, "Khu vực", "Khu vực "))
        unit = safe_str(get_value(row, "Đơn vị tính", "Đơn vị tính "))
        quantity = safe_qty(get_value(row, "Số lượng", "Số lượng "))
        status = normalize_status(get_value(row, "Trạng thái", "Trạng thái "))
        owner_name = safe_str(get_value(row, "Người phụ trách", "Người phụ trách "))

        if equipment_code == "EQP-001":
            print("DEBUG EQP-001 POWER:", power_spec)

        notes = (
            f"Đơn vị sử dụng: {department or ''}; "
            f"Khu vực: {area or ''}; "
            f"Công suất: {power_spec or ''}; "
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

    with engine.begin() as conn:
        for item in records:
            conn.execute(insert_sql, item)

    print({
        "status": "ok",
        "rows_input": len(df),
        "rows_processed": len(records)
    })


if __name__ == "__main__":
    main()
