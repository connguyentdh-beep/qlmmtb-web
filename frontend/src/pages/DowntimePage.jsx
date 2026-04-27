import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

function getTexts(language = "vi") {
  const texts = {
    vi: {
      unknown: "Không rõ",

      statuses: {
        new: "Mới tạo",
        processing: "Đang xử lý",
        resolved: "Đã khắc phục",
        closed: "Đã đóng",
      },

      downtimeTypes: {
        mechanical: "Cơ khí",
        electrical: "Điện",
        instrument: "Điều khiển",
        operation: "Vận hành",
        other: "Khác",
      },

      impactLevels: {
        low: "Thấp",
        medium: "Trung bình",
        high: "Cao",
      },

      page: {
        title: "Downtime",
        subtitle: "Dữ liệu downtime đang đọc/ghi thật từ backend",
        loading: "Đang tải dữ liệu downtime...",
        noData: "Không tìm thấy phiếu downtime phù hợp",
        totalDowntimeLabel: "Tổng toàn bộ thời gian downtime",
        totalDowntimeUnit: "phút",
      },

      stats: {
        total: "Tổng phiếu",
        totalSub: "Sự cố đã ghi nhận",
        open: "Đang mở",
        openSub: "Cần xử lý",
        closed: "Đã đóng",
        closedSub: "Đã hoàn tất",
        totalMinutes: "Tổng phút dừng",
        totalMinutesSub: "Phút downtime",
      },

      form: {
        title: "Tạo phiếu downtime",
        ticketCode: "Mã phiếu",
        selectEquipment: "Chọn thiết bị từ Danh mục thiết bị",
        selectEquipmentPlaceholder: "-- Chọn thiết bị --",
        equipmentId: "EQ ID",
        equipmentCode: "Mã máy",
        equipmentName: "Tên thiết bị",
        area: "Khu vực",
        areaPlaceholder: "Ví dụ: Xưởng sấy",
        downtimeType: "Loại downtime",
        startTime: "Bắt đầu dừng",
        endTime: "Kết thúc",
        impactLevel: "Mức độ ảnh hưởng",
        ownerName: "Người phụ trách",
        ownerNamePlaceholder: "Tên người phụ trách",
        status: "Trạng thái",
        cause: "Nguyên nhân",
        causePlaceholder: "Mô tả nguyên nhân gây dừng máy",
        actionTaken: "Biện pháp xử lý",
        actionTakenPlaceholder: "Ghi biện pháp xử lý",
        notes: "Ghi chú",
        notesPlaceholder: "Thông tin bổ sung",
      },

      filters: {
        searchPlaceholder: "Tìm theo mã phiếu, thiết bị, khu vực...",
        typeAll: "Tất cả loại",
        statusAll: "Tất cả trạng thái",
      },

      table: {
        ticketCode: "Mã phiếu",
        equipmentId: "EQ ID",
        equipmentCode: "Mã máy",
        equipmentName: "Thiết bị",
        area: "Khu vực",
        startTime: "Bắt đầu",
        endTime: "Kết thúc",
        downtimeMinutes: "Phút dừng",
        type: "Loại",
        impact: "Ảnh hưởng",
        cause: "Nguyên nhân",
        owner: "Phụ trách",
        status: "Trạng thái",
        actions: "Thao tác",
      },

      buttons: {
        save: "Lưu phiếu",
        reset: "Làm mới",
        process: "Xử lý",
        close: "Đóng",
        delete: "Xóa",
      },

      messages: {
        loadDowntimeError: "Không tải được dữ liệu downtime từ backend",
        loadEquipmentsError: "Không tải được danh mục thiết bị",

        missingTicketCode: "Thiếu mã phiếu downtime",
        missingEquipment: "Thiếu thiết bị",
        missingEquipmentName: "Thiếu tên thiết bị",
        missingArea: "Thiếu khu vực",
        missingStartTime: "Thiếu thời gian bắt đầu dừng",
        missingEndTime: "Thiếu thời gian kết thúc",
        missingOwner: "Thiếu người phụ trách",
        missingCause: "Thiếu nguyên nhân",
        invalidTimeRange: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",

        createSuccess: "Đã tạo phiếu downtime {code}",
        saveFailed: "Lưu phiếu downtime thất bại",
        saveBackendError: "Backend trả lỗi khi lưu phiếu downtime.",

        updateProcessSuccess: "Phiếu {code} chuyển sang Đang xử lý",
        updateCloseSuccess: "Phiếu {code} đã đóng",
        updateFailed: "Cập nhật downtime thất bại",
        updateBackendError: "Backend trả lỗi khi cập nhật downtime.",

        deleteConfirm: "Anh có chắc muốn xóa phiếu {code} không?",
        deleteSuccess: "Đã xóa phiếu {code}",
        deleteFailed: "Xóa phiếu downtime thất bại",
        deleteBackendError: "Backend trả lỗi khi xóa phiếu downtime.",
      },
    },

    en: {
      unknown: "Unknown",

      statuses: {
        new: "New",
        processing: "Processing",
        resolved: "Resolved",
        closed: "Closed",
      },

      downtimeTypes: {
        mechanical: "Mechanical",
        electrical: "Electrical",
        instrument: "Instrument",
        operation: "Operation",
        other: "Other",
      },

      impactLevels: {
        low: "Low",
        medium: "Medium",
        high: "High",
      },

      page: {
        title: "Downtime",
        subtitle: "Downtime data is being read from and written to the backend",
        loading: "Loading downtime data...",
        noData: "No matching downtime tickets found",
        totalDowntimeLabel: "Total downtime duration",
        totalDowntimeUnit: "min",
      },

      stats: {
        total: "Total Tickets",
        totalSub: "Recorded incidents",
        open: "Open",
        openSub: "Need processing",
        closed: "Closed",
        closedSub: "Completed",
        totalMinutes: "Total Downtime Minutes",
        totalMinutesSub: "Downtime minutes",
      },

      form: {
        title: "Create Downtime Ticket",
        ticketCode: "Ticket Code",
        selectEquipment: "Select equipment from Equipment List",
        selectEquipmentPlaceholder: "-- Select equipment --",
        equipmentId: "EQ ID",
        equipmentCode: "Equipment Code",
        equipmentName: "Equipment Name",
        area: "Area",
        areaPlaceholder: "Example: Drying workshop",
        downtimeType: "Downtime Type",
        startTime: "Downtime Start",
        endTime: "End Time",
        impactLevel: "Impact Level",
        ownerName: "Owner",
        ownerNamePlaceholder: "Owner name",
        status: "Status",
        cause: "Cause",
        causePlaceholder: "Describe the cause of the downtime",
        actionTaken: "Action Taken",
        actionTakenPlaceholder: "Describe the corrective action",
        notes: "Notes",
        notesPlaceholder: "Additional information",
      },

      filters: {
        searchPlaceholder: "Search by ticket code, equipment, area...",
        typeAll: "All types",
        statusAll: "All statuses",
      },

      table: {
        ticketCode: "Ticket Code",
        equipmentId: "EQ ID",
        equipmentCode: "Equipment Code",
        equipmentName: "Equipment",
        area: "Area",
        startTime: "Start Time",
        endTime: "End Time",
        downtimeMinutes: "Downtime Minutes",
        type: "Type",
        impact: "Impact",
        cause: "Cause",
        owner: "Owner",
        status: "Status",
        actions: "Actions",
      },

      buttons: {
        save: "Save Ticket",
        reset: "Reset",
        process: "Process",
        close: "Close",
        delete: "Delete",
      },

      messages: {
        loadDowntimeError: "Cannot load downtime data from backend",
        loadEquipmentsError: "Cannot load equipment list",

        missingTicketCode: "Missing downtime ticket code",
        missingEquipment: "Missing equipment",
        missingEquipmentName: "Missing equipment name",
        missingArea: "Missing area",
        missingStartTime: "Missing downtime start time",
        missingEndTime: "Missing end time",
        missingOwner: "Missing owner",
        missingCause: "Missing cause",
        invalidTimeRange: "End time must be later than start time",

        createSuccess: "Created downtime ticket {code}",
        saveFailed: "Failed to save downtime ticket",
        saveBackendError: "Backend returned an error while saving the downtime ticket.",

        updateProcessSuccess: "Ticket {code} changed to Processing",
        updateCloseSuccess: "Ticket {code} has been closed",
        updateFailed: "Failed to update downtime",
        updateBackendError: "Backend returned an error while updating downtime.",

        deleteConfirm: "Are you sure you want to delete ticket {code}?",
        deleteSuccess: "Deleted ticket {code}",
        deleteFailed: "Failed to delete downtime ticket",
        deleteBackendError: "Backend returned an error while deleting the downtime ticket.",
      },
    },
  };

  return texts[language] || texts.vi;
}

function formatMessage(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function StatusBadge({ status, language = "vi" }) {
  const t = getTexts(language);
  const raw = String(status || "").toLowerCase();

  let bg = "#e5e7eb";
  let color = "#374151";
  let label = status || t.unknown;

  if (raw === "new") {
    bg = "#dbeafe";
    color = "#1d4ed8";
    label = t.statuses.new;
  } else if (raw === "processing") {
    bg = "#fef3c7";
    color = "#92400e";
    label = t.statuses.processing;
  } else if (raw === "resolved") {
    bg = "#dcfce7";
    color = "#166534";
    label = t.statuses.resolved;
  } else if (raw === "closed") {
    bg = "#f3f4f6";
    color = "#6b7280";
    label = t.statuses.closed;
  }

  return (
    <span
      style={{
        background: bg,
        color,
        padding: "5px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

function TypeBadge({ type, language = "vi" }) {
  const t = getTexts(language);
  const raw = String(type || "").toLowerCase();

  let bg = "#e5e7eb";
  let color = "#374151";
  let label = type || t.unknown;

  if (raw === "mechanical") {
    bg = "#fee2e2";
    color = "#b91c1c";
    label = t.downtimeTypes.mechanical;
  } else if (raw === "electrical") {
    bg = "#dbeafe";
    color = "#1d4ed8";
    label = t.downtimeTypes.electrical;
  } else if (raw === "instrument") {
    bg = "#f3e8ff";
    color = "#7e22ce";
    label = t.downtimeTypes.instrument;
  } else if (raw === "operation") {
    bg = "#dcfce7";
    color = "#166534";
    label = t.downtimeTypes.operation;
  } else if (raw === "other") {
    bg = "#f3f4f6";
    color = "#6b7280";
    label = t.downtimeTypes.other;
  }

  return (
    <span
      style={{
        background: bg,
        color,
        padding: "5px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

function ImpactBadge({ impact, language = "vi" }) {
  const t = getTexts(language);
  const raw = String(impact || "").toLowerCase();

  let bg = "#e5e7eb";
  let color = "#374151";
  let label = impact || t.unknown;

  if (raw === "low") {
    bg = "#e0f2fe";
    color = "#075985";
    label = t.impactLevels.low;
  } else if (raw === "medium") {
    bg = "#fef3c7";
    color = "#92400e";
    label = t.impactLevels.medium;
  } else if (raw === "high") {
    bg = "#fee2e2";
    color = "#b91c1c";
    label = t.impactLevels.high;
  }

  return (
    <span
      style={{
        background: bg,
        color,
        padding: "5px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

function ActionButton({ label, onClick, bg, color = "#ffffff", disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#9ca3af" : bg,
        color,
        border: "none",
        borderRadius: 8,
        padding: "6px 10px",
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

function formatDateTimeVN(value) {
  if (!value) return "";
  const text = String(value).trim().replace(" ", "T");
  const [datePart, timePart] = text.split("T");
  if (!datePart) return text;

  const parts = datePart.split("-");
  if (parts.length !== 3) return text;

  const vnDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
  const shortTime = timePart ? timePart.slice(0, 5) : "";
  return shortTime ? `${vnDate} ${shortTime}` : vnDate;
}

function minutesBetween(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return 0;
  return Math.round((e - s) / 60000);
}

function buildDefaultTicketCode() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `DT-${y}${m}${d}-${hh}${mm}`;
}

function getInitialForm() {
  return {
    ticket_code: buildDefaultTicketCode(),
    equipment_id: "",
    equipment_code: "",
    equipment_name: "",
    area: "",
    downtime_type: "mechanical",
    start_time: "",
    end_time: "",
    impact_level: "medium",
    owner_name: "",
    cause: "",
    action_taken: "",
    notes: "",
    status: "new",
  };
}

export default function DowntimePage({ language = "vi" }) {
  const t = getTexts(language);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notice, setNotice] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [equipments, setEquipments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(getInitialForm());

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

  const loadDowntimes = () => {
    setLoading(true);

    axios
      .get(`${API_BASE}/downtimes/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotice({
          type: "error",
          message: t.messages.loadDowntimeError,
        });
        setLoading(false);
      });
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
          message: t.messages.loadEquipmentsError,
        });
      });
  };

  useEffect(() => {
    loadDowntimes();
    loadEquipments();
  }, [language]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const openCount = tickets.filter((x) => x.status === "new" || x.status === "processing").length;
    const closedCount = tickets.filter((x) => x.status === "resolved" || x.status === "closed").length;
    const totalMinutes = tickets.reduce(
      (sum, item) => sum + minutesBetween(item.start_time, item.end_time),
      0
    );

    return {
      total,
      openCount,
      closedCount,
      totalMinutes,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return tickets.filter((item) => {
      const matchKeyword =
        !keyword ||
        String(item.ticket_code || "").toLowerCase().includes(keyword) ||
        String(item.equipment_name || "").toLowerCase().includes(keyword) ||
        String(item.equipment_code || "").toLowerCase().includes(keyword) ||
        String(item.area || "").toLowerCase().includes(keyword) ||
        String(item.owner_name || "").toLowerCase().includes(keyword) ||
        String(item.cause || "").toLowerCase().includes(keyword);

      const matchType = typeFilter === "all" ? true : item.downtime_type === typeFilter;
      const matchStatus = statusFilter === "all" ? true : item.status === statusFilter;

      return matchKeyword && matchType && matchStatus;
    });
  }, [tickets, search, typeFilter, statusFilter]);

  const handleSelectEquipment = (equipmentIdText) => {
    const selectedId = Number(equipmentIdText);

    const selected = equipments.find(
      (item) => Number(item.equipment_id) === selectedId
    );

    if (!selected) {
      setForm((prev) => ({
        ...prev,
        equipment_id: "",
        equipment_code: "",
        equipment_name: "",
        area: "",
        owner_name: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      equipment_id: String(selected.equipment_id ?? ""),
      equipment_code: selected.equipment_code ?? "",
      equipment_name: selected.equipment_name_vi ?? "",
      area: selected.csv_area ?? "",
      owner_name: selected.csv_owner_name ?? "",
    }));
  };

  const validateForm = () => {
    if (!String(form.ticket_code).trim()) return t.messages.missingTicketCode;
    if (String(form.equipment_id).trim() === "") return t.messages.missingEquipment;
    if (!String(form.equipment_name).trim()) return t.messages.missingEquipmentName;
    if (!String(form.area).trim()) return t.messages.missingArea;
    if (!String(form.start_time).trim()) return t.messages.missingStartTime;
    if (!String(form.end_time).trim()) return t.messages.missingEndTime;
    if (!String(form.owner_name).trim()) return t.messages.missingOwner;
    if (!String(form.cause).trim()) return t.messages.missingCause;

    const start = new Date(form.start_time).getTime();
    const end = new Date(form.end_time).getTime();
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
      return t.messages.invalidTimeRange;
    }

    return "";
  };

  const buildPayload = () => {
    return {
      ticket_code: String(form.ticket_code).trim(),
      equipment_id: form.equipment_id === "" ? null : Number(form.equipment_id),
      equipment_code: String(form.equipment_code || "").trim(),
      equipment_name: String(form.equipment_name).trim(),
      area: String(form.area).trim(),
      downtime_type: String(form.downtime_type).trim(),
      impact_level: String(form.impact_level).trim(),
      owner_name: String(form.owner_name).trim(),
      start_time: new Date(form.start_time).toISOString(),
      end_time: new Date(form.end_time).toISOString(),
      cause: String(form.cause).trim(),
      action_taken: String(form.action_taken || "").trim(),
      notes: String(form.notes || "").trim(),
      status: String(form.status).trim(),
    };
  };

  const handleSave = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setNotice({ type: "error", message: validationMessage });
      return;
    }

    const payload = buildPayload();

    try {
      setSaving(true);
      setNotice(null);

      await axios.post(`${API_BASE}/downtimes/`, payload);

      setNotice({
        type: "success",
        message: formatMessage(t.messages.createSuccess, { code: payload.ticket_code }),
      });

      setForm(getInitialForm());
      loadDowntimes();
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : t.messages.saveBackendError;

      setNotice({
        type: "error",
        message: `${t.messages.saveFailed}\n${detail}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(getInitialForm());
  };

  const updateStatus = async (item, newStatus, successMessage) => {
    const payload = {
      ticket_code: item.ticket_code,
      equipment_id: item.equipment_id,
      equipment_code: item.equipment_code,
      equipment_name: item.equipment_name,
      area: item.area,
      downtime_type: item.downtime_type,
      impact_level: item.impact_level,
      owner_name: item.owner_name,
      start_time: new Date(item.start_time).toISOString(),
      end_time: new Date(item.end_time).toISOString(),
      cause: item.cause,
      action_taken: item.action_taken || "",
      notes: item.notes || "",
      status: newStatus,
    };

    try {
      setSaving(true);
      await axios.put(`${API_BASE}/downtimes/${item.downtime_id}`, payload);
      setNotice({
        type: "success",
        message: successMessage,
      });
      loadDowntimes();
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : t.messages.updateBackendError;

      setNotice({
        type: "error",
        message: `${t.messages.updateFailed}\n${detail}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickProcess = (item) => {
    updateStatus(
      item,
      "processing",
      formatMessage(t.messages.updateProcessSuccess, { code: item.ticket_code })
    );
  };

  const handleQuickClose = (item) => {
    updateStatus(
      item,
      "closed",
      formatMessage(t.messages.updateCloseSuccess, { code: item.ticket_code })
    );
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      formatMessage(t.messages.deleteConfirm, { code: item.ticket_code })
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      await axios.delete(`${API_BASE}/downtimes/${item.downtime_id}`);
      setNotice({
        type: "success",
        message: formatMessage(t.messages.deleteSuccess, { code: item.ticket_code }),
      });
      loadDowntimes();
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : t.messages.deleteBackendError;

      setNotice({
        type: "error",
        message: `${t.messages.deleteFailed}\n${detail}`,
      });
    } finally {
      setSaving(false);
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

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          {t.page.title}
        </div>
        <div style={{ color: "#6b7280", fontSize: 13 }}>
          {t.page.subtitle}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 10,
          marginBottom: 12,
        }}
      >
        {[
          { title: t.stats.total, value: stats.total, subtitle: t.stats.totalSub },
          { title: t.stats.open, value: stats.openCount, subtitle: t.stats.openSub },
          { title: t.stats.closed, value: stats.closedCount, subtitle: t.stats.closedSub },
          { title: t.stats.totalMinutes, value: stats.totalMinutes, subtitle: t.stats.totalMinutesSub },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 12,
              background: "#f9fafb",
              minHeight: 78,
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{card.title}</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>{card.value}</div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{card.subtitle}</div>
          </div>
        ))}
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
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
          {t.form.title}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <div>
            <div style={labelStyle}>{t.form.ticketCode}</div>
            <input
              value={form.ticket_code}
              onChange={(e) => setForm((prev) => ({ ...prev, ticket_code: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.form.selectEquipment}</div>
            <select
              value={form.equipment_id}
              onChange={(e) => handleSelectEquipment(e.target.value)}
              style={inputStyle}
            >
              <option value="">{t.form.selectEquipmentPlaceholder}</option>
              {equipments.map((item) => (
                <option key={item.equipment_id} value={item.equipment_id}>
                  {item.equipment_code} - {item.equipment_name_vi}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div style={labelStyle}>{t.form.equipmentId}</div>
            <input
              value={form.equipment_id}
              style={{ ...inputStyle, background: "#f9fafb" }}
              readOnly
            />
          </div>

          <div>
            <div style={labelStyle}>{t.form.equipmentCode}</div>
            <input
              value={form.equipment_code}
              style={{ ...inputStyle, background: "#f9fafb" }}
              readOnly
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={labelStyle}>{t.form.equipmentName}</div>
            <input
              value={form.equipment_name}
              style={{ ...inputStyle, background: "#f9fafb" }}
              readOnly
            />
          </div>

          <div>
            <div style={labelStyle}>{t.form.area}</div>
            <input
              value={form.area}
              onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))}
              style={inputStyle}
              placeholder={t.form.areaPlaceholder}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.form.downtimeType}</div>
            <select
              value={form.downtime_type}
              onChange={(e) => setForm((prev) => ({ ...prev, downtime_type: e.target.value }))}
              style={inputStyle}
            >
              <option value="mechanical">{t.downtimeTypes.mechanical}</option>
              <option value="electrical">{t.downtimeTypes.electrical}</option>
              <option value="instrument">{t.downtimeTypes.instrument}</option>
              <option value="operation">{t.downtimeTypes.operation}</option>
              <option value="other">{t.downtimeTypes.other}</option>
            </select>
          </div>

          <div>
            <div style={labelStyle}>{t.form.startTime}</div>
            <input
              type="datetime-local"
              value={form.start_time}
              onChange={(e) => setForm((prev) => ({ ...prev, start_time: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.form.endTime}</div>
            <input
              type="datetime-local"
              value={form.end_time}
              onChange={(e) => setForm((prev) => ({ ...prev, end_time: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.form.impactLevel}</div>
            <select
              value={form.impact_level}
              onChange={(e) => setForm((prev) => ({ ...prev, impact_level: e.target.value }))}
              style={inputStyle}
            >
              <option value="low">{t.impactLevels.low}</option>
              <option value="medium">{t.impactLevels.medium}</option>
              <option value="high">{t.impactLevels.high}</option>
            </select>
          </div>

          <div>
            <div style={labelStyle}>{t.form.ownerName}</div>
            <input
              value={form.owner_name}
              onChange={(e) => setForm((prev) => ({ ...prev, owner_name: e.target.value }))}
              style={inputStyle}
              placeholder={t.form.ownerNamePlaceholder}
            />
          </div>

          <div>
            <div style={labelStyle}>{t.form.status}</div>
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              style={inputStyle}
            >
              <option value="new">{t.statuses.new}</option>
              <option value="processing">{t.statuses.processing}</option>
              <option value="resolved">{t.statuses.resolved}</option>
              <option value="closed">{t.statuses.closed}</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={labelStyle}>{t.form.cause}</div>
            <textarea
              value={form.cause}
              onChange={(e) => setForm((prev) => ({ ...prev, cause: e.target.value }))}
              style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
              placeholder={t.form.causePlaceholder}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={labelStyle}>{t.form.actionTaken}</div>
            <textarea
              value={form.action_taken}
              onChange={(e) => setForm((prev) => ({ ...prev, action_taken: e.target.value }))}
              style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
              placeholder={t.form.actionTakenPlaceholder}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={labelStyle}>{t.form.notes}</div>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
              placeholder={t.form.notesPlaceholder}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginTop: 12,
          }}
        >
          <ActionButton
            label={t.buttons.save}
            bg="#2563eb"
            onClick={handleSave}
            disabled={saving}
          />
          <ActionButton
            label={t.buttons.reset}
            bg="#6b7280"
            onClick={handleReset}
            disabled={saving}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.filters.searchPlaceholder}
          style={{
            minWidth: 320,
            padding: "9px 12px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 13,
          }}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "9px 12px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 13,
          }}
        >
          <option value="all">{t.filters.typeAll}</option>
          <option value="mechanical">{t.downtimeTypes.mechanical}</option>
          <option value="electrical">{t.downtimeTypes.electrical}</option>
          <option value="instrument">{t.downtimeTypes.instrument}</option>
          <option value="operation">{t.downtimeTypes.operation}</option>
          <option value="other">{t.downtimeTypes.other}</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "9px 12px",
            borderRadius: 10,
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: 13,
          }}
        >
          <option value="all">{t.filters.statusAll}</option>
          <option value="new">{t.statuses.new}</option>
          <option value="processing">{t.statuses.processing}</option>
          <option value="resolved">{t.statuses.resolved}</option>
          <option value="closed">{t.statuses.closed}</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 20, color: "#6b7280" }}>{t.page.loading}</div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            border: "1px solid #eef2f7",
            borderRadius: 12,
            maxHeight: "58vh",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1600,
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                background: "#f9fafb",
              }}
            >
              <tr style={{ textAlign: "left" }}>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 130 }}>
                  {t.table.ticketCode}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 90 }}>
                  {t.table.equipmentId}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 110 }}>
                  {t.table.equipmentCode}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 220 }}>
                  {t.table.equipmentName}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 150 }}>
                  {t.table.area}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 160 }}>
                  {t.table.startTime}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 160 }}>
                  {t.table.endTime}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 100 }}>
                  {t.table.downtimeMinutes}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 110 }}>
                  {t.table.type}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 120 }}>
                  {t.table.impact}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 240 }}>
                  {t.table.cause}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 150 }}>
                  {t.table.owner}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 130 }}>
                  {t.table.status}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 180 }}>
                  {t.table.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((item) => (
                <tr key={item.downtime_id}>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                    {item.ticket_code}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    {item.equipment_id ?? ""}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                    {item.equipment_code || ""}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", lineHeight: 1.4 }}>
                    {item.equipment_name}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    {item.area}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    {formatDateTimeVN(item.start_time)}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    {formatDateTimeVN(item.end_time)}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                    {minutesBetween(item.start_time, item.end_time)}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    <TypeBadge type={item.downtime_type} language={language} />
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    <ImpactBadge impact={item.impact_level} language={language} />
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", lineHeight: 1.4 }}>
                    {item.cause}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    {item.owner_name}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    <StatusBadge status={item.status} language={language} />
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <ActionButton
                        label={t.buttons.process}
                        bg="#f59e0b"
                        onClick={() => handleQuickProcess(item)}
                        disabled={saving}
                      />
                      <ActionButton
                        label={t.buttons.close}
                        bg="#2563eb"
                        onClick={() => handleQuickClose(item)}
                        disabled={saving}
                      />
                      <ActionButton
                        label={t.buttons.delete}
                        bg="#dc2626"
                        onClick={() => handleDelete(item)}
                        disabled={saving}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTickets.length === 0 && (
                <tr>
                  <td
                    colSpan="14"
                    style={{
                      padding: 20,
                      textAlign: "center",
                      color: "#6b7280",
                      fontSize: 13,
                    }}
                  >
                    {t.page.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div
        style={{
          marginTop: 10,
          fontSize: 13,
          color: "#374151",
        }}
      >
        {t.page.totalDowntimeLabel}: <b>{stats.totalMinutes} {t.page.totalDowntimeUnit}</b>
      </div>
    </div>
  );
}