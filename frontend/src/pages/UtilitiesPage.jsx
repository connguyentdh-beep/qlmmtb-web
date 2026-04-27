import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";

const API_BASE = "http://127.0.0.1:8000";

function getTexts(language = "vi") {
  const texts = {
    vi: {
      page: {
        title: "Điện / Nước",
        subtitle:
          "Ghi nhận điện nước theo từng máy, theo ngày, theo tuần và xem biểu đồ tổng hợp",
      },

      messages: {
        loadEquipmentError: "Không tải được danh mục thiết bị cho tab Điện/Nước",
        loadElectricError: "Không tải được dữ liệu điện từ backend",
        loadWaterError: "Không tải được dữ liệu nước từ backend",

        missingElectricDate: "Thiếu ngày ghi điện",
        missingElectricEquipment: "Thiếu thiết bị điện",
        missingElectricStart: "Thiếu chỉ số điện đầu ngày",
        missingElectricEnd: "Thiếu chỉ số điện cuối ngày",
        missingElectricPrice: "Thiếu đơn giá điện",
        invalidElectricReading:
          "Chỉ số điện cuối ngày phải lớn hơn hoặc bằng đầu ngày",
        duplicateElectric: "Máy này đã có dữ liệu điện ngày {date}",
        electricSaved: "Đã lưu điện theo máy {code} ngày {date}",
        electricSaveFailed: "Lưu điện thất bại",
        electricSaveBackendError: "Backend trả lỗi khi lưu điện.",
        confirmDeleteElectric:
          "Anh có chắc muốn xóa điện máy {code} ngày {date} không?",
        deleteElectricSuccess: "Đã xóa bản ghi điện {code} ngày {date}",
        deleteElectricFailed: "Xóa bản ghi điện thất bại",
        deleteElectricBackendError: "Backend trả lỗi khi xóa bản ghi điện.",

        missingWaterDate: "Thiếu ngày ghi nước",
        missingWaterEquipment: "Thiếu thiết bị nước",
        missingWaterStart: "Thiếu chỉ số nước đầu ngày",
        missingWaterEnd: "Thiếu chỉ số nước cuối ngày",
        missingWaterPrice: "Thiếu đơn giá nước",
        invalidWaterReading:
          "Chỉ số nước cuối ngày phải lớn hơn hoặc bằng đầu ngày",
        duplicateWater: "Máy này đã có dữ liệu nước ngày {date}",
        waterSaved: "Đã lưu nước theo máy {code} ngày {date}",
        waterSaveFailed: "Lưu nước thất bại",
        waterSaveBackendError: "Backend trả lỗi khi lưu nước.",
        confirmDeleteWater:
          "Anh có chắc muốn xóa nước máy {code} ngày {date} không?",
        deleteWaterSuccess: "Đã xóa bản ghi nước {code} ngày {date}",
        deleteWaterFailed: "Xóa bản ghi nước thất bại",
        deleteWaterBackendError: "Backend trả lỗi khi xóa bản ghi nước.",
      },

      stats: {
        electricRecords: "Bản ghi điện",
        electricRecordsSub: "Theo bộ lọc máy",
        electricConsumption: "Điện tiêu thụ",
        electricConsumptionSub: "kWh",
        electricCost: "Chi phí điện",
        electricCostSub: "VND",
        waterConsumption: "Nước tiêu thụ",
        waterConsumptionSub: "m³",
        totalCost: "Tổng chi phí",
        totalCostSub: "Điện + nước",
      },

      filter: {
        title: "Bộ lọc theo máy",
        allMachines: "Tất cả máy",
      },

      electricForm: {
        title: "Nhập điện theo máy / theo ngày",
        recordDate: "Ngày ghi điện",
        selectMachine: "Chọn máy",
        selectMachinePlaceholder: "-- Chọn máy --",
        equipmentId: "EQ ID",
        equipmentCode: "Mã máy",
        equipmentName: "Tên thiết bị",
        startReading: "Chỉ số đầu ngày",
        endReading: "Chỉ số cuối ngày",
        unitPrice: "Đơn giá điện (VND/kWh)",
        notes: "Ghi chú",
        save: "Lưu điện",
        reset: "Làm mới",
      },

      waterForm: {
        title: "Nhập nước theo máy / theo ngày",
        recordDate: "Ngày ghi nước",
        selectMachine: "Chọn máy",
        selectMachinePlaceholder: "-- Chọn máy --",
        equipmentId: "EQ ID",
        equipmentCode: "Mã máy",
        equipmentName: "Tên thiết bị",
        startReading: "Chỉ số đầu ngày",
        endReading: "Chỉ số cuối ngày",
        unitPrice: "Đơn giá nước (VND/m³)",
        notes: "Ghi chú",
        save: "Lưu nước",
        reset: "Làm mới",
      },

      charts: {
        noData: "Chưa có dữ liệu",
        dailyTitle: "Biểu đồ điện / nước theo ngày",
        dailySubtitle:
          "Line xanh là nước, line đỏ là điện, cột xám là tổng theo ngày",
        weeklyTitle: "Biểu đồ điện / nước theo tuần",
        weeklySubtitle:
          "Line xanh là nước, line đỏ là điện, cột xám là tổng theo tuần",
        total: "Tổng",
        water: "Nước",
        electric: "Điện",
      },

      electricHistory: {
        title: "Lịch sử điện theo máy",
        date: "Ngày",
        equipmentCode: "Mã máy",
        equipmentName: "Tên thiết bị",
        startReading: "Đầu ngày",
        endReading: "Cuối ngày",
        consumption: "Tiêu thụ",
        cost: "Chi phí",
        actions: "Thao tác",
        noData: "Chưa có dữ liệu điện theo máy",
      },

      waterHistory: {
        title: "Lịch sử nước theo máy",
        date: "Ngày",
        equipmentCode: "Mã máy",
        equipmentName: "Tên thiết bị",
        startReading: "Đầu ngày",
        endReading: "Cuối ngày",
        consumption: "Tiêu thụ",
        cost: "Chi phí",
        actions: "Thao tác",
        noData: "Chưa có dữ liệu nước theo máy",
      },

      buttons: {
        delete: "Xóa",
        exportIso: "Export Excel ISO",
      },

      exportIso: {
        company: "CÔNG TY / COMPANY",
        companyValue: "STAR ALGAE VIETNAM",
        form: "BIỂU MẪU / FORM",
        formValue: "Theo dõi chỉ số điện nước thiết bị",
        standard: "TIÊU CHUẨN / STANDARD",
        standardValue: "ISO 9001:2008 (Internal controlled form)",
        formCode: "MÃ BIỂU MẪU / FORM CODE",
        formCodeValue: "BM-UT-01",
        revision: "PHIÊN BẢN / REVISION",
        revisionValue: "01",
        printDate: "NGÀY IN / PRINT DATE",
        machineFilter: "BỘ LỌC MÁY / MACHINE FILTER",
        totalElectricRecords: "TỔNG BẢN GHI ĐIỆN",
        totalElectricConsumption: "TỔNG TIÊU THỤ ĐIỆN (kWh)",
        totalElectricCost: "TỔNG CHI PHÍ ĐIỆN (VND)",
        totalWaterRecords: "TỔNG BẢN GHI NƯỚC",
        totalWaterConsumption: "TỔNG TIÊU THỤ NƯỚC (m³)",
        totalWaterCost: "TỔNG CHI PHÍ NƯỚC (VND)",
        totalCost: "TỔNG CHI PHÍ (VND)",
        preparedBy: "Người lập",
        checkedBy: "Người kiểm tra",
        approvedBy: "Người phê duyệt",
        allMachines: "Tất cả máy",
        summarySheet: "ISO_Form",
        electricSheet: "Electric",
        waterSheet: "Water",
        fileNamePrefix: "iso-electric-water",
      },
    },

    en: {
      page: {
        title: "Electricity / Water",
        subtitle:
          "Record electricity and water by machine, by day, by week, and view summary charts",
      },

      messages: {
        loadEquipmentError: "Cannot load equipment list for the Utilities tab",
        loadElectricError: "Cannot load electricity data from backend",
        loadWaterError: "Cannot load water data from backend",

        missingElectricDate: "Missing electricity record date",
        missingElectricEquipment: "Missing electricity equipment",
        missingElectricStart: "Missing electricity start reading",
        missingElectricEnd: "Missing electricity end reading",
        missingElectricPrice: "Missing electricity unit price",
        invalidElectricReading:
          "Electricity end reading must be greater than or equal to the start reading",
        duplicateElectric:
          "This machine already has electricity data for {date}",
        electricSaved: "Saved electricity for machine {code} on {date}",
        electricSaveFailed: "Failed to save electricity",
        electricSaveBackendError:
          "Backend returned an error while saving electricity.",
        confirmDeleteElectric:
          "Are you sure you want to delete electricity data for machine {code} on {date}?",
        deleteElectricSuccess:
          "Deleted electricity record for {code} on {date}",
        deleteElectricFailed: "Failed to delete electricity record",
        deleteElectricBackendError:
          "Backend returned an error while deleting the electricity record.",

        missingWaterDate: "Missing water record date",
        missingWaterEquipment: "Missing water equipment",
        missingWaterStart: "Missing water start reading",
        missingWaterEnd: "Missing water end reading",
        missingWaterPrice: "Missing water unit price",
        invalidWaterReading:
          "Water end reading must be greater than or equal to the start reading",
        duplicateWater: "This machine already has water data for {date}",
        waterSaved: "Saved water for machine {code} on {date}",
        waterSaveFailed: "Failed to save water",
        waterSaveBackendError: "Backend returned an error while saving water.",
        confirmDeleteWater:
          "Are you sure you want to delete water data for machine {code} on {date}?",
        deleteWaterSuccess: "Deleted water record for {code} on {date}",
        deleteWaterFailed: "Failed to delete water record",
        deleteWaterBackendError:
          "Backend returned an error while deleting the water record.",
      },

      stats: {
        electricRecords: "Electric Records",
        electricRecordsSub: "By machine filter",
        electricConsumption: "Electricity Consumption",
        electricConsumptionSub: "kWh",
        electricCost: "Electricity Cost",
        electricCostSub: "VND",
        waterConsumption: "Water Consumption",
        waterConsumptionSub: "m³",
        totalCost: "Total Cost",
        totalCostSub: "Electricity + Water",
      },

      filter: {
        title: "Machine Filter",
        allMachines: "All Machines",
      },

      electricForm: {
        title: "Enter electricity by machine / by day",
        recordDate: "Electricity Record Date",
        selectMachine: "Select Machine",
        selectMachinePlaceholder: "-- Select machine --",
        equipmentId: "EQ ID",
        equipmentCode: "Equipment Code",
        equipmentName: "Equipment Name",
        startReading: "Start Reading",
        endReading: "End Reading",
        unitPrice: "Electricity Price (VND/kWh)",
        notes: "Notes",
        save: "Save Electricity",
        reset: "Reset",
      },

      waterForm: {
        title: "Enter water by machine / by day",
        recordDate: "Water Record Date",
        selectMachine: "Select Machine",
        selectMachinePlaceholder: "-- Select machine --",
        equipmentId: "EQ ID",
        equipmentCode: "Equipment Code",
        equipmentName: "Equipment Name",
        startReading: "Start Reading",
        endReading: "End Reading",
        unitPrice: "Water Price (VND/m³)",
        notes: "Notes",
        save: "Save Water",
        reset: "Reset",
      },

      charts: {
        noData: "No data yet",
        dailyTitle: "Electricity / Water Chart by Day",
        dailySubtitle:
          "Blue line is water, red line is electricity, gray bars are daily totals",
        weeklyTitle: "Electricity / Water Chart by Week",
        weeklySubtitle:
          "Blue line is water, red line is electricity, gray bars are weekly totals",
        total: "Total",
        water: "Water",
        electric: "Electricity",
      },

      electricHistory: {
        title: "Electricity History by Machine",
        date: "Date",
        equipmentCode: "Equipment Code",
        equipmentName: "Equipment Name",
        startReading: "Start Reading",
        endReading: "End Reading",
        consumption: "Consumption",
        cost: "Cost",
        actions: "Actions",
        noData: "No electricity data by machine",
      },

      waterHistory: {
        title: "Water History by Machine",
        date: "Date",
        equipmentCode: "Equipment Code",
        equipmentName: "Equipment Name",
        startReading: "Start Reading",
        endReading: "End Reading",
        consumption: "Consumption",
        cost: "Cost",
        actions: "Actions",
        noData: "No water data by machine",
      },

      buttons: {
        delete: "Delete",
        exportIso: "Export ISO Excel",
      },

      exportIso: {
        company: "COMPANY",
        companyValue: "STAR ALGAE VIETNAM",
        form: "FORM",
        formValue: "Equipment Electricity & Water Monitoring Record",
        standard: "STANDARD",
        standardValue: "ISO 9001:2008 (Internal controlled form)",
        formCode: "FORM CODE",
        formCodeValue: "BM-UT-01",
        revision: "REVISION",
        revisionValue: "01",
        printDate: "PRINT DATE",
        machineFilter: "MACHINE FILTER",
        totalElectricRecords: "TOTAL ELECTRIC RECORDS",
        totalElectricConsumption: "TOTAL ELECTRIC CONSUMPTION (kWh)",
        totalElectricCost: "TOTAL ELECTRIC COST (VND)",
        totalWaterRecords: "TOTAL WATER RECORDS",
        totalWaterConsumption: "TOTAL WATER CONSUMPTION (m³)",
        totalWaterCost: "TOTAL WATER COST (VND)",
        totalCost: "TOTAL COST (VND)",
        preparedBy: "Prepared by",
        checkedBy: "Checked by",
        approvedBy: "Approved by",
        allMachines: "All Machines",
        summarySheet: "ISO_Form",
        electricSheet: "Electric",
        waterSheet: "Water",
        fileNamePrefix: "iso-electric-water",
      },
    },
  };

  return texts[language] || texts.vi;
}

function formatMessage(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function NotificationBox({ notice, onClose }) {
  if (!notice) return null;

  const isSuccess = notice.type === "success";

  return (
    <div
      style={{
        marginBottom: 12,
        background: isSuccess ? "#ecfdf5" : "#fef2f2",
        color: isSuccess ? "#065f46" : "#991b1b",
        border: `1px solid ${isSuccess ? "#a7f3d0" : "#fecaca"}`,
        borderRadius: 10,
        padding: "10px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ whiteSpace: "pre-line", lineHeight: 1.5, fontSize: 13 }}>
        {notice.message}
      </div>
      <button
        onClick={onClose}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: 18,
          color: "inherit",
        }}
      >
        ×
      </button>
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        background: "#f9fafb",
        minHeight: 78,
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "#9ca3af" }}>{subtitle}</div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  bg,
  color = "#ffffff",
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#9ca3af" : bg,
        color,
        border: "none",
        borderRadius: 8,
        padding: "7px 11px",
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        lineHeight: 1.2,
      }}
    >
      {label}
    </button>
  );
}

function formatCurrency(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("vi-VN").format(number);
}

function formatDateVN(dateText) {
  if (!dateText) return "";
  const parts = String(dateText).split("-");
  if (parts.length !== 3) return dateText;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getTodayText() {
  return new Date().toISOString().slice(0, 10);
}

function getInitialElectricForm() {
  return {
    record_date: getTodayText(),
    equipment_id: "",
    equipment_code: "",
    equipment_name_vi: "",
    start_reading: "",
    end_reading: "",
    unit_price: "2500",
    notes: "",
  };
}

function getInitialWaterForm() {
  return {
    record_date: getTodayText(),
    equipment_id: "",
    equipment_code: "",
    equipment_name_vi: "",
    start_reading: "",
    end_reading: "",
    unit_price: "12000",
    notes: "",
  };
}

function getConsumption(item) {
  return Math.max(0, Number(item.end_reading) - Number(item.start_reading));
}

function getWeekKey(dateText) {
  const date = new Date(dateText);
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function UtilityComboChart({ title, subtitle, data, language = "vi" }) {
  const t = getTexts(language);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 14,
        background: "#ffffff",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
        {subtitle}
      </div>

      {data.length === 0 ? (
        <div style={{ color: "#6b7280", fontSize: 13 }}>{t.charts.noData}</div>
      ) : (
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <ComposedChart data={data}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="tong"
                name={t.charts.total}
                fill="#d1d5db"
                radius={[6, 6, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="nuoc"
                name={t.charts.water}
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="dien"
                name={t.charts.electric}
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function buildDailyUtilityChartData(electricRecords, waterRecords) {
  const map = new Map();

  electricRecords.forEach((item) => {
    const key = item.record_date;
    const old = map.get(key) || {
      key,
      label: formatDateVN(key),
      dien: 0,
      nuoc: 0,
      tong: 0,
    };

    old.dien += getConsumption(item);
    old.tong = old.dien + old.nuoc;
    map.set(key, old);
  });

  waterRecords.forEach((item) => {
    const key = item.record_date;
    const old = map.get(key) || {
      key,
      label: formatDateVN(key),
      dien: 0,
      nuoc: 0,
      tong: 0,
    };

    old.nuoc += getConsumption(item);
    old.tong = old.dien + old.nuoc;
    map.set(key, old);
  });

  return Array.from(map.values())
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-14);
}

function buildWeeklyUtilityChartData(electricRecords, waterRecords) {
  const map = new Map();

  electricRecords.forEach((item) => {
    const key = getWeekKey(item.record_date);
    const old = map.get(key) || {
      key,
      label: key,
      dien: 0,
      nuoc: 0,
      tong: 0,
    };

    old.dien += getConsumption(item);
    old.tong = old.dien + old.nuoc;
    map.set(key, old);
  });

  waterRecords.forEach((item) => {
    const key = getWeekKey(item.record_date);
    const old = map.get(key) || {
      key,
      label: key,
      dien: 0,
      nuoc: 0,
      tong: 0,
    };

    old.nuoc += getConsumption(item);
    old.tong = old.dien + old.nuoc;
    map.set(key, old);
  });

  return Array.from(map.values())
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-10);
}

export default function UtilitiesPage({ language = "vi" }) {
  const t = getTexts(language);

  const [notice, setNotice] = useState(null);

  const [equipments, setEquipments] = useState([]);
  const [electricRecords, setElectricRecords] = useState([]);
  const [waterRecords, setWaterRecords] = useState([]);

  const [electricForm, setElectricForm] = useState(getInitialElectricForm());
  const [waterForm, setWaterForm] = useState(getInitialWaterForm());

  const [selectedMachineFilter, setSelectedMachineFilter] = useState("ALL");

  const inputStyle = {
    width: "100%",
    padding: "9px 11px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    outline: "none",
    boxSizing: "border-box",
    fontSize: 13,
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    color: "#111827",
  };

  const loadEquipments = () => {
    axios
      .get(`${API_BASE}/equipments/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setEquipments(data);
      })
      .catch((err) => {
        console.error(err);
        setNotice({
          type: "error",
          message: t.messages.loadEquipmentError,
        });
      });
  };

  const loadElectricRecords = () => {
    axios
      .get(`${API_BASE}/electric-records/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setElectricRecords(data);
      })
      .catch((err) => {
        console.error(err);
        setNotice({
          type: "error",
          message: t.messages.loadElectricError,
        });
      });
  };

  const loadWaterRecords = () => {
    axios
      .get(`${API_BASE}/water-records/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setWaterRecords(data);
      })
      .catch((err) => {
        console.error(err);
        setNotice({
          type: "error",
          message: t.messages.loadWaterError,
        });
      });
  };

  useEffect(() => {
    loadEquipments();
    loadElectricRecords();
    loadWaterRecords();
  }, [language]);

  const handleSelectElectricEquipment = (equipmentIdText) => {
    const selectedId = Number(equipmentIdText);

    const selected = equipments.find(
      (item) => Number(item.equipment_id) === selectedId
    );

    if (!selected) {
      setElectricForm((prev) => ({
        ...prev,
        equipment_id: "",
        equipment_code: "",
        equipment_name_vi: "",
      }));
      return;
    }

    setElectricForm((prev) => ({
      ...prev,
      equipment_id: String(selected.equipment_id ?? ""),
      equipment_code: selected.equipment_code ?? "",
      equipment_name_vi: selected.equipment_name_vi ?? "",
    }));
  };

  const handleSelectWaterEquipment = (equipmentIdText) => {
    const selectedId = Number(equipmentIdText);

    const selected = equipments.find(
      (item) => Number(item.equipment_id) === selectedId
    );

    if (!selected) {
      setWaterForm((prev) => ({
        ...prev,
        equipment_id: "",
        equipment_code: "",
        equipment_name_vi: "",
      }));
      return;
    }

    setWaterForm((prev) => ({
      ...prev,
      equipment_id: String(selected.equipment_id ?? ""),
      equipment_code: selected.equipment_code ?? "",
      equipment_name_vi: selected.equipment_name_vi ?? "",
    }));
  };

  const filteredElectricRecords = useMemo(() => {
    if (selectedMachineFilter === "ALL") return electricRecords;
    return electricRecords.filter(
      (item) => String(item.equipment_id) === String(selectedMachineFilter)
    );
  }, [electricRecords, selectedMachineFilter]);

  const filteredWaterRecords = useMemo(() => {
    if (selectedMachineFilter === "ALL") return waterRecords;
    return waterRecords.filter(
      (item) => String(item.equipment_id) === String(selectedMachineFilter)
    );
  }, [waterRecords, selectedMachineFilter]);

  const electricStats = useMemo(() => {
    const totalConsumption = filteredElectricRecords.reduce(
      (sum, item) => sum + getConsumption(item),
      0
    );

    const totalCost = filteredElectricRecords.reduce((sum, item) => {
      const consumption = getConsumption(item);
      return sum + consumption * Number(item.unit_price || 0);
    }, 0);

    return {
      totalRecords: filteredElectricRecords.length,
      totalConsumption,
      totalCost,
    };
  }, [filteredElectricRecords]);

  const waterStats = useMemo(() => {
    const totalConsumption = filteredWaterRecords.reduce(
      (sum, item) => sum + getConsumption(item),
      0
    );

    const totalCost = filteredWaterRecords.reduce((sum, item) => {
      const consumption = getConsumption(item);
      return sum + consumption * Number(item.unit_price || 0);
    }, 0);

    return {
      totalRecords: filteredWaterRecords.length,
      totalConsumption,
      totalCost,
    };
  }, [filteredWaterRecords]);

  const totalUtilityCost = electricStats.totalCost + waterStats.totalCost;

  const dailyUtilityChartData = useMemo(() => {
    return buildDailyUtilityChartData(filteredElectricRecords, filteredWaterRecords);
  }, [filteredElectricRecords, filteredWaterRecords]);

  const weeklyUtilityChartData = useMemo(() => {
    return buildWeeklyUtilityChartData(filteredElectricRecords, filteredWaterRecords);
  }, [filteredElectricRecords, filteredWaterRecords]);

  const handleExportIsoExcel = () => {
    const e = t.exportIso;

    const machineLabel =
      selectedMachineFilter === "ALL"
        ? e.allMachines
        : (() => {
            const found = equipments.find(
              (x) => String(x.equipment_id) === String(selectedMachineFilter)
            );
            return found
              ? `${found.equipment_code} - ${found.equipment_name_vi}`
              : selectedMachineFilter;
          })();

    const summaryRows = [
      [e.company, e.companyValue],
      [e.form, e.formValue],
      [e.standard, e.standardValue],
      [e.formCode, e.formCodeValue],
      [e.revision, e.revisionValue],
      [e.printDate, new Date().toLocaleString()],
      [e.machineFilter, machineLabel],
      [e.totalElectricRecords, filteredElectricRecords.length],
      [e.totalElectricConsumption, electricStats.totalConsumption],
      [e.totalElectricCost, electricStats.totalCost],
      [e.totalWaterRecords, filteredWaterRecords.length],
      [e.totalWaterConsumption, waterStats.totalConsumption],
      [e.totalWaterCost, waterStats.totalCost],
      [e.totalCost, totalUtilityCost],
      ["", ""],
      [e.preparedBy, ""],
      [e.checkedBy, ""],
      [e.approvedBy, ""],
    ];

    const electricRows = filteredElectricRecords.map((item, index) => {
      const consumption = getConsumption(item);
      const cost = consumption * Number(item.unit_price || 0);

      return {
        STT: index + 1,
        "Ngày / Date": item.record_date,
        "EQ ID": item.equipment_id,
        "Mã máy / Equipment Code": item.equipment_code,
        "Tên thiết bị / Equipment Name": item.equipment_name_vi,
        "Chỉ số đầu / Start Reading": Number(item.start_reading || 0),
        "Chỉ số cuối / End Reading": Number(item.end_reading || 0),
        "Tiêu thụ / Consumption (kWh)": consumption,
        "Đơn giá / Unit Price (VND)": Number(item.unit_price || 0),
        "Chi phí / Cost (VND)": cost,
        "Ghi chú / Notes": item.notes || "",
      };
    });

    const waterRows = filteredWaterRecords.map((item, index) => {
      const consumption = getConsumption(item);
      const cost = consumption * Number(item.unit_price || 0);

      return {
        STT: index + 1,
        "Ngày / Date": item.record_date,
        "EQ ID": item.equipment_id,
        "Mã máy / Equipment Code": item.equipment_code,
        "Tên thiết bị / Equipment Name": item.equipment_name_vi,
        "Chỉ số đầu / Start Reading": Number(item.start_reading || 0),
        "Chỉ số cuối / End Reading": Number(item.end_reading || 0),
        "Tiêu thụ / Consumption (m³)": consumption,
        "Đơn giá / Unit Price (VND)": Number(item.unit_price || 0),
        "Chi phí / Cost (VND)": cost,
        "Ghi chú / Notes": item.notes || "",
      };
    });

    const wb = XLSX.utils.book_new();

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    const wsElectric = XLSX.utils.json_to_sheet(electricRows);
    const wsWater = XLSX.utils.json_to_sheet(waterRows);

    wsSummary["!cols"] = [{ wch: 35 }, { wch: 45 }];
    wsElectric["!cols"] = [
      { wch: 6 },
      { wch: 14 },
      { wch: 10 },
      { wch: 18 },
      { wch: 35 },
      { wch: 18 },
      { wch: 18 },
      { wch: 22 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
    ];
    wsWater["!cols"] = [
      { wch: 6 },
      { wch: 14 },
      { wch: 10 },
      { wch: 18 },
      { wch: 35 },
      { wch: 18 },
      { wch: 18 },
      { wch: 22 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
    ];

    XLSX.utils.book_append_sheet(wb, wsSummary, e.summarySheet);
    XLSX.utils.book_append_sheet(wb, wsElectric, e.electricSheet);
    XLSX.utils.book_append_sheet(wb, wsWater, e.waterSheet);

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `${e.fileNamePrefix}-${today}.xlsx`);
  };

  const handleSaveElectric = async () => {
    const start = Number(electricForm.start_reading);
    const end = Number(electricForm.end_reading);
    const unitPrice = Number(electricForm.unit_price);

    if (!electricForm.record_date) {
      setNotice({ type: "error", message: t.messages.missingElectricDate });
      return;
    }
    if (String(electricForm.equipment_id).trim() === "") {
      setNotice({ type: "error", message: t.messages.missingElectricEquipment });
      return;
    }
    if (Number.isNaN(start)) {
      setNotice({ type: "error", message: t.messages.missingElectricStart });
      return;
    }
    if (Number.isNaN(end)) {
      setNotice({ type: "error", message: t.messages.missingElectricEnd });
      return;
    }
    if (Number.isNaN(unitPrice)) {
      setNotice({ type: "error", message: t.messages.missingElectricPrice });
      return;
    }
    if (end < start) {
      setNotice({
        type: "error",
        message: t.messages.invalidElectricReading,
      });
      return;
    }

    const duplicated = electricRecords.find(
      (x) =>
        x.record_date === electricForm.record_date &&
        String(x.equipment_id) === String(electricForm.equipment_id)
    );

    if (duplicated) {
      setNotice({
        type: "error",
        message: formatMessage(t.messages.duplicateElectric, {
          date: electricForm.record_date,
        }),
      });
      return;
    }

    const payload = {
      record_date: electricForm.record_date,
      equipment_id: Number(electricForm.equipment_id),
      equipment_code: electricForm.equipment_code,
      equipment_name_vi: electricForm.equipment_name_vi,
      start_reading: start,
      end_reading: end,
      unit_price: unitPrice,
      notes: electricForm.notes.trim(),
    };

    try {
      await axios.post(`${API_BASE}/electric-records/`, payload);

      setElectricForm(getInitialElectricForm());
      setNotice({
        type: "success",
        message: formatMessage(t.messages.electricSaved, {
          code: payload.equipment_code,
          date: payload.record_date,
        }),
      });
      loadElectricRecords();
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : t.messages.electricSaveBackendError;

      setNotice({
        type: "error",
        message: `${t.messages.electricSaveFailed}\n${detail}`,
      });
    }
  };

  const handleSaveWater = async () => {
    const start = Number(waterForm.start_reading);
    const end = Number(waterForm.end_reading);
    const unitPrice = Number(waterForm.unit_price);

    if (!waterForm.record_date) {
      setNotice({ type: "error", message: t.messages.missingWaterDate });
      return;
    }
    if (String(waterForm.equipment_id).trim() === "") {
      setNotice({ type: "error", message: t.messages.missingWaterEquipment });
      return;
    }
    if (Number.isNaN(start)) {
      setNotice({ type: "error", message: t.messages.missingWaterStart });
      return;
    }
    if (Number.isNaN(end)) {
      setNotice({ type: "error", message: t.messages.missingWaterEnd });
      return;
    }
    if (Number.isNaN(unitPrice)) {
      setNotice({ type: "error", message: t.messages.missingWaterPrice });
      return;
    }
    if (end < start) {
      setNotice({
        type: "error",
        message: t.messages.invalidWaterReading,
      });
      return;
    }

    const duplicated = waterRecords.find(
      (x) =>
        x.record_date === waterForm.record_date &&
        String(x.equipment_id) === String(waterForm.equipment_id)
    );

    if (duplicated) {
      setNotice({
        type: "error",
        message: formatMessage(t.messages.duplicateWater, {
          date: waterForm.record_date,
        }),
      });
      return;
    }

    const payload = {
      record_date: waterForm.record_date,
      equipment_id: Number(waterForm.equipment_id),
      equipment_code: waterForm.equipment_code,
      equipment_name_vi: waterForm.equipment_name_vi,
      start_reading: start,
      end_reading: end,
      unit_price: unitPrice,
      notes: waterForm.notes.trim(),
    };

    try {
      await axios.post(`${API_BASE}/water-records/`, payload);

      setWaterForm(getInitialWaterForm());
      setNotice({
        type: "success",
        message: formatMessage(t.messages.waterSaved, {
          code: payload.equipment_code,
          date: payload.record_date,
        }),
      });
      loadWaterRecords();
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : t.messages.waterSaveBackendError;

      setNotice({
        type: "error",
        message: `${t.messages.waterSaveFailed}\n${detail}`,
      });
    }
  };

  const handleDeleteElectric = async (item) => {
    const confirmed = window.confirm(
      formatMessage(t.messages.confirmDeleteElectric, {
        code: item.equipment_code,
        date: item.record_date,
      })
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/electric-records/${item.id}`);
      setNotice({
        type: "success",
        message: formatMessage(t.messages.deleteElectricSuccess, {
          code: item.equipment_code,
          date: item.record_date,
        }),
      });
      loadElectricRecords();
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : t.messages.deleteElectricBackendError;

      setNotice({
        type: "error",
        message: `${t.messages.deleteElectricFailed}\n${detail}`,
      });
    }
  };

  const handleDeleteWater = async (item) => {
    const confirmed = window.confirm(
      formatMessage(t.messages.confirmDeleteWater, {
        code: item.equipment_code,
        date: item.record_date,
      })
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/water-records/${item.id}`);
      setNotice({
        type: "success",
        message: formatMessage(t.messages.deleteWaterSuccess, {
          code: item.equipment_code,
          date: item.record_date,
        }),
      });
      loadWaterRecords();
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : t.messages.deleteWaterBackendError;

      setNotice({
        type: "error",
        message: `${t.messages.deleteWaterFailed}\n${detail}`,
      });
    }
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 14,
        padding: 14,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      }}
    >
      <NotificationBox notice={notice} onClose={() => setNotice(null)} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            {t.page.title}
          </div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            {t.page.subtitle}
          </div>
        </div>

        <ActionButton
          label={t.buttons.exportIso}
          bg="#2563eb"
          onClick={handleExportIsoExcel}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <StatCard
          title={t.stats.electricRecords}
          value={electricStats.totalRecords}
          subtitle={t.stats.electricRecordsSub}
        />
        <StatCard
          title={t.stats.electricConsumption}
          value={electricStats.totalConsumption}
          subtitle={t.stats.electricConsumptionSub}
        />
        <StatCard
          title={t.stats.electricCost}
          value={formatCurrency(electricStats.totalCost)}
          subtitle={t.stats.electricCostSub}
        />
        <StatCard
          title={t.stats.waterConsumption}
          value={waterStats.totalConsumption}
          subtitle={t.stats.waterConsumptionSub}
        />
        <StatCard
          title={t.stats.totalCost}
          value={formatCurrency(totalUtilityCost)}
          subtitle={t.stats.totalCostSub}
        />
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 14,
          background: "#ffffff",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
          {t.filter.title}
        </div>

        <select
          value={selectedMachineFilter}
          onChange={(e) => setSelectedMachineFilter(e.target.value)}
          style={{
            width: 360,
            maxWidth: "100%",
            padding: "9px 12px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            fontSize: 13,
          }}
        >
          <option value="ALL">{t.filter.allMachines}</option>
          {equipments.map((item) => (
            <option key={item.equipment_id} value={item.equipment_id}>
              {item.equipment_code} - {item.equipment_name_vi}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 14,
            background: "#ffffff",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            {t.electricForm.title}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <div style={labelStyle}>{t.electricForm.recordDate}</div>
              <input
                type="date"
                value={electricForm.record_date}
                onChange={(e) =>
                  setElectricForm((prev) => ({
                    ...prev,
                    record_date: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.electricForm.selectMachine}</div>
              <select
                value={electricForm.equipment_id}
                onChange={(e) => handleSelectElectricEquipment(e.target.value)}
                style={inputStyle}
              >
                <option value="">{t.electricForm.selectMachinePlaceholder}</option>
                {equipments.map((item) => (
                  <option key={item.equipment_id} value={item.equipment_id}>
                    {item.equipment_code} - {item.equipment_name_vi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={labelStyle}>{t.electricForm.equipmentId}</div>
              <input
                value={electricForm.equipment_id}
                readOnly
                style={{ ...inputStyle, background: "#f9fafb" }}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.electricForm.equipmentCode}</div>
              <input
                value={electricForm.equipment_code}
                readOnly
                style={{ ...inputStyle, background: "#f9fafb" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <div style={labelStyle}>{t.electricForm.equipmentName}</div>
              <input
                value={electricForm.equipment_name_vi}
                readOnly
                style={{ ...inputStyle, background: "#f9fafb" }}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.electricForm.startReading}</div>
              <input
                type="number"
                value={electricForm.start_reading}
                onChange={(e) =>
                  setElectricForm((prev) => ({
                    ...prev,
                    start_reading: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.electricForm.endReading}</div>
              <input
                type="number"
                value={electricForm.end_reading}
                onChange={(e) =>
                  setElectricForm((prev) => ({
                    ...prev,
                    end_reading: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.electricForm.unitPrice}</div>
              <input
                type="number"
                value={electricForm.unit_price}
                onChange={(e) =>
                  setElectricForm((prev) => ({
                    ...prev,
                    unit_price: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <div style={labelStyle}>{t.electricForm.notes}</div>
              <textarea
                value={electricForm.notes}
                onChange={(e) =>
                  setElectricForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <ActionButton
              label={t.electricForm.save}
              bg="#2563eb"
              onClick={handleSaveElectric}
            />
            <ActionButton
              label={t.electricForm.reset}
              bg="#6b7280"
              onClick={() => setElectricForm(getInitialElectricForm())}
            />
          </div>
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 14,
            background: "#ffffff",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            {t.waterForm.title}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <div>
              <div style={labelStyle}>{t.waterForm.recordDate}</div>
              <input
                type="date"
                value={waterForm.record_date}
                onChange={(e) =>
                  setWaterForm((prev) => ({
                    ...prev,
                    record_date: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.waterForm.selectMachine}</div>
              <select
                value={waterForm.equipment_id}
                onChange={(e) => handleSelectWaterEquipment(e.target.value)}
                style={inputStyle}
              >
                <option value="">{t.waterForm.selectMachinePlaceholder}</option>
                {equipments.map((item) => (
                  <option key={item.equipment_id} value={item.equipment_id}>
                    {item.equipment_code} - {item.equipment_name_vi}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={labelStyle}>{t.waterForm.equipmentId}</div>
              <input
                value={waterForm.equipment_id}
                readOnly
                style={{ ...inputStyle, background: "#f9fafb" }}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.waterForm.equipmentCode}</div>
              <input
                value={waterForm.equipment_code}
                readOnly
                style={{ ...inputStyle, background: "#f9fafb" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <div style={labelStyle}>{t.waterForm.equipmentName}</div>
              <input
                value={waterForm.equipment_name_vi}
                readOnly
                style={{ ...inputStyle, background: "#f9fafb" }}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.waterForm.startReading}</div>
              <input
                type="number"
                value={waterForm.start_reading}
                onChange={(e) =>
                  setWaterForm((prev) => ({
                    ...prev,
                    start_reading: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.waterForm.endReading}</div>
              <input
                type="number"
                value={waterForm.end_reading}
                onChange={(e) =>
                  setWaterForm((prev) => ({
                    ...prev,
                    end_reading: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>{t.waterForm.unitPrice}</div>
              <input
                type="number"
                value={waterForm.unit_price}
                onChange={(e) =>
                  setWaterForm((prev) => ({
                    ...prev,
                    unit_price: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <div style={labelStyle}>{t.waterForm.notes}</div>
              <textarea
                value={waterForm.notes}
                onChange={(e) =>
                  setWaterForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <ActionButton
              label={t.waterForm.save}
              bg="#0f766e"
              onClick={handleSaveWater}
            />
            <ActionButton
              label={t.waterForm.reset}
              bg="#6b7280"
              onClick={() => setWaterForm(getInitialWaterForm())}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <UtilityComboChart
          title={t.charts.dailyTitle}
          subtitle={t.charts.dailySubtitle}
          data={dailyUtilityChartData}
          language={language}
        />

        <UtilityComboChart
          title={t.charts.weeklyTitle}
          subtitle={t.charts.weeklySubtitle}
          data={weeklyUtilityChartData}
          language={language}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 14,
            background: "#ffffff",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            {t.electricHistory.title}
          </div>

          <div
            style={{
              overflowX: "auto",
              border: "1px solid #eef2f7",
              borderRadius: 12,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 900,
              }}
            >
              <thead style={{ background: "#f9fafb" }}>
                <tr style={{ textAlign: "left" }}>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.electricHistory.date}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.electricHistory.equipmentCode}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.electricHistory.equipmentName}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.electricHistory.startReading}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.electricHistory.endReading}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.electricHistory.consumption}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.electricHistory.cost}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.electricHistory.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredElectricRecords.map((item) => {
                  const consumption = getConsumption(item);
                  const cost = consumption * Number(item.unit_price || 0);

                  return (
                    <tr key={item.id}>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                        {formatDateVN(item.record_date)}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                        {item.equipment_code}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                        {item.equipment_name_vi}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                        {item.start_reading}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                        {item.end_reading}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                        {consumption}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                        {formatCurrency(cost)}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                        <ActionButton
                          label={t.buttons.delete}
                          bg="#dc2626"
                          onClick={() => handleDeleteElectric(item)}
                        />
                      </td>
                    </tr>
                  );
                })}

                {filteredElectricRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ padding: 16, textAlign: "center", color: "#6b7280", fontSize: 13 }}
                    >
                      {t.electricHistory.noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 14,
            background: "#ffffff",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            {t.waterHistory.title}
          </div>

          <div
            style={{
              overflowX: "auto",
              border: "1px solid #eef2f7",
              borderRadius: 12,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 900,
              }}
            >
              <thead style={{ background: "#f9fafb" }}>
                <tr style={{ textAlign: "left" }}>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.waterHistory.date}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.waterHistory.equipmentCode}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.waterHistory.equipmentName}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.waterHistory.startReading}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.waterHistory.endReading}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.waterHistory.consumption}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.waterHistory.cost}
                  </th>
                  <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                    {t.waterHistory.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredWaterRecords.map((item) => {
                  const consumption = getConsumption(item);
                  const cost = consumption * Number(item.unit_price || 0);

                  return (
                    <tr key={item.id}>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                        {formatDateVN(item.record_date)}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                        {item.equipment_code}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                        {item.equipment_name_vi}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                        {item.start_reading}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                        {item.end_reading}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                        {consumption}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                        {formatCurrency(cost)}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                        <ActionButton
                          label={t.buttons.delete}
                          bg="#dc2626"
                          onClick={() => handleDeleteWater(item)}
                        />
                      </td>
                    </tr>
                  );
                })}

                {filteredWaterRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ padding: 16, textAlign: "center", color: "#6b7280", fontSize: 13 }}
                    >
                      {t.waterHistory.noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}