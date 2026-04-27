from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import Base, engine

from app.models.work_order import WorkOrder
from app.models.downtime_ticket import DowntimeTicket
from app.models.electric_record import ElectricRecord
from app.models.water_record import WaterRecord

from app.api.equipments import router as equipments_router
from app.api.pm_plans import router as pm_plans_router
from app.routers.work_orders import router as work_orders_router
from app.routers.downtimes import router as downtimes_router
from app.routers.electric_records import router as electric_records_router
from app.routers.water_records import router as water_records_router

app = FastAPI(
    title="QLMMTB API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(equipments_router)
app.include_router(pm_plans_router)
app.include_router(work_orders_router)
app.include_router(downtimes_router)
app.include_router(electric_records_router)
app.include_router(water_records_router)


@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "QLMMTB backend is running",
    }