import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

function getTexts(language = "vi") {
  const texts = {
    vi: {
      unknown: "Không rõ",

      frequency: {
        daily: "Hàng ngày",
        weekly: "Hàng tuần",
        monthly: "Hàng tháng",
        quarterly: "Hàng quý",
        yearly: "Hàng năm",
      },

      status: {
        planned: "Kế hoạch",
        in_progress: "Đang thực hiện",
        done: "Hoàn thành",
        overdue: "Quá hạn",
        cancelled: "Đã hủy",
      },

      modal: {
        createTitle: "Tạo kế hoạch PM",
        editTitle: "Sửa kế hoạch PM",
        subtitle: "Chọn thiết bị từ danh mục rồi nhập các thông tin còn lại",
        selectEquipment: "Chọn thiết bị",
        selectEquipmentPlaceholder: "-- Chọn thiết bị --",
        equipmentId: "Equipment ID",
        equipmentCode: "Mã máy",
        equipmentName: "Tên thiết bị",
        frequencyType: "Chu kỳ",
        frequencyValue: "Giá trị chu kỳ",
        plannedDate: "Ngày kế hoạch",
        assignee: "Người phụ trách",
        status: "Trạng thái",
        notes: "Ghi chú",
        close: "Đóng",
        saving: "Đang lưu...",
        saveUpdate: "Lưu cập nhật",
        create: "Tạo kế hoạch PM",
      },

      page: {
        title: "Kế hoạch PM",
        subtitle: "Quản lý kế hoạch bảo trì định kỳ theo thiết bị",
        searchPlaceholder: "Tìm theo mã máy, tên thiết bị, chu kỳ, người phụ trách...",
        createButton: "+ Tạo kế hoạch PM",
        loading: "Đang tải dữ liệu kế hoạch PM...",
        noData: "Không tìm thấy kế hoạch PM phù hợp",
      },

      table: {
        id: "ID",
        equipmentCode: "Mã máy",
        equipmentName: "Tên thiết bị",
        frequencyType: "Chu kỳ",
        frequencyValue: "Giá trị",
        plannedDate: "Ngày kế hoạch",
        assignee: "Người phụ trách",
        status: "Trạng thái",
        actions: "Thao tác",
      },

      buttons: {
        edit: "Sửa",
        close: "Đóng",
        delete: "Xóa",
      },

      messages: {
        loadPmError: "Không tải được dữ liệu kế hoạch PM từ backend",
        loadEquipmentError: "Không tải được danh mục thiết bị từ API /equipments/",
        missingEquipmentId: "Thiếu Equipment ID",
        missingEquipmentCode: "Thiếu Mã máy",
        missingEquipmentName: "Thiếu Tên thiết bị",
        missingFrequencyType: "Thiếu Chu kỳ",
        missingFrequencyValue: "Thiếu Giá trị chu kỳ",
        missingPlannedDate: "Thiếu Ngày kế hoạch",
        missingStatus: "Thiếu Trạng thái",
        createSuccess: "Tạo kế hoạch PM thành công",
        updateSuccess: "Cập nhật kế hoạch PM #{id} thành công",
        saveFailed: "Lưu kế hoạch PM thất bại",
        saveBackendError: "Backend trả lỗi khi lưu kế hoạch PM.",
        deleteConfirm: "Anh có chắc muốn xóa kế hoạch PM #{id} không?",
        deleteSuccess: "Đã xóa kế hoạch PM #{id}",
        deleteFailed: "Xóa kế hoạch PM thất bại",
        deleteBackendError: "Backend trả lỗi khi xóa kế hoạch PM.",
        closeConfirm: "Anh có chắc muốn đóng kế hoạch PM #{id} không?",
        closeSuccess: "Đã đóng kế hoạch PM #{id}",
        closeFailed: "Đóng kế hoạch PM thất bại",
        closeBackendError: "Backend trả lỗi khi đóng kế hoạch PM.",
      },
    },

    en: {
      unknown: "Unknown",

      frequency: {
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        quarterly: "Quarterly",
        yearly: "Yearly",
      },

      status: {
        planned: "Planned",
        in_progress: "In Progress",
        done: "Completed",
        overdue: "Overdue",
        cancelled: "Cancelled",
      },

      modal: {
        createTitle: "Create PM Plan",
        editTitle: "Edit PM Plan",
        subtitle: "Select equipment from the list, then enter the remaining information",
        selectEquipment: "Select Equipment",
        selectEquipmentPlaceholder: "-- Select equipment --",
        equipmentId: "Equipment ID",
        equipmentCode: "Equipment Code",
        equipmentName: "Equipment Name",
        frequencyType: "Frequency",
        frequencyValue: "Frequency Value",
        plannedDate: "Planned Date",
        assignee: "Assignee",
        status: "Status",
        notes: "Notes",
        close: "Close",
        saving: "Saving...",
        saveUpdate: "Save Update",
        create: "Create PM Plan",
      },

      page: {
        title: "PM Plans",
        subtitle: "Manage preventive maintenance plans by equipment",
        searchPlaceholder: "Search by equipment code, equipment name, frequency, assignee...",
        createButton: "+ Create PM Plan",
        loading: "Loading PM plan data...",
        noData: "No matching PM plans found",
      },

      table: {
        id: "ID",
        equipmentCode: "Equipment Code",
        equipmentName: "Equipment Name",
        frequencyType: "Frequency",
        frequencyValue: "Value",
        plannedDate: "Planned Date",
        assignee: "Assignee",
        status: "Status",
        actions: "Actions",
      },

      buttons: {
        edit: "Edit",
        close: "Close",
        delete: "Delete",
      },

      messages: {
        loadPmError: "Cannot load PM plan data from backend",
        loadEquipmentError: "Cannot load equipment list from API /equipments/",
        missingEquipmentId: "Missing Equipment ID",
        missingEquipmentCode: "Missing Equipment Code",
        missingEquipmentName: "Missing Equipment Name",
        missingFrequencyType: "Missing Frequency",
        missingFrequencyValue: "Missing Frequency Value",
        missingPlannedDate: "Missing Planned Date",
        missingStatus: "Missing Status",
        createSuccess: "PM plan created successfully",
        updateSuccess: "PM plan #{id} updated successfully",
        saveFailed: "Failed to save PM plan",
        saveBackendError: "Backend returned an error while saving the PM plan.",
        deleteConfirm: "Are you sure you want to delete PM plan #{id}?",
        deleteSuccess: "Deleted PM plan #{id}",
        deleteFailed: "Failed to delete PM plan",
        deleteBackendError: "Backend returned an error while deleting the PM plan.",
        closeConfirm: "Are you sure you want to close PM plan #{id}?",
        closeSuccess: "Closed PM plan #{id}",
        closeFailed: "Failed to close PM plan",
        closeBackendError: "Backend returned an error while closing the PM plan.",
      },
    },
  };

  return texts[language] || texts.vi;
}

function formatMessage(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function formatPmFrequency(value, language = "vi") {
  const t = getTexts(language);
  const v = String(value || "").toLowerCase().trim();
  if (v === "daily") return t.frequency.daily;
  if (v === "weekly") return t.frequency.weekly;
  if (v === "monthly") return t.frequency.monthly;
  if (v === "quarterly") return t.frequency.quarterly;
  if (v === "yearly") return t.frequency.yearly;
  return value || "";
}

function formatPmStatus(value, language = "vi") {
  const t = getTexts(language);
  const v = String(value || "").toLowerCase().trim();
  if (v === "planned") return t.status.planned;
  if (v === "in_progress") return t.status.in_progress;
  if (v === "done") return t.status.done;
  if (v === "overdue") return t.status.overdue;
  if (v === "cancelled") return t.status.cancelled;
  return value || t.unknown;
}

function formatDateVN(value) {
  if (!value) return "";
  const text = String(value).trim();
  const onlyDate = text.includes("T") ? text.split("T")[0] : text;
  const parts = onlyDate.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return text;
}

function StatusBadge({ status, language = "vi" }) {
  const t = getTexts(language);
  const raw = String(status || "").toLowerCase().trim();

  let bg = "#e5e7eb";
  let color = "#374151";
  let label = status || t.unknown;

  if (raw === "planned") {
    bg = "#dbeafe";
    color = "#1d4ed8";
    label = t.status.planned;
  } else if (raw === "in_progress") {
    bg = "#fef3c7";
    color = "#92400e";
    label = t.status.in_progress;
  } else if (raw === "done") {
    bg = "#dcfce7";
    color = "#166534";
    label = t.status.done;
  } else if (raw === "overdue") {
    bg = "#fee2e2";
    color = "#991b1b";
    label = t.status.overdue;
  } else if (raw === "cancelled") {
    bg = "#f3f4f6";
    color = "#6b7280";
    label = t.status.cancelled;
  } else {
    label = formatPmStatus(raw, language);
  }

  return (
    <span
      style={{
        background: bg,
        color,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
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
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
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
        marginBottom: 16,
        background: isSuccess ? "#ecfdf5" : "#fef2f2",
        color: isSuccess ? "#065f46" : "#991b1b",
        border: `1px solid ${isSuccess ? "#a7f3d0" : "#fecaca"}`,
        borderRadius: 14,
        padding: "12px 14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}>{notice.message}</div>
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

function PmPlanModal({
  open,
  mode,
  form,
  setForm,
  onClose,
  onSubmit,
  savingPm,
  equipmentOptions,
  language = "vi",
}) {
  const t = getTexts(language);

  if (!open) return null;

  const isEdit = mode === "edit";

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #d1d5db",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
    color: "#111827",
  };

  const renderField = (label, children) => (
    <div>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );

  const handleEquipmentChange = (e) => {
    const selectedId = e.target.value;

    if (!selectedId) {
      setForm((prev) => ({
        ...prev,
        equipment_id: "",
        equipment_code: "",
        equipment_name_vi: "",
      }));
      return;
    }

    const selectedEquipment = equipmentOptions.find(
      (item) => String(item.equipment_id) === String(selectedId)
    );

    if (!selectedEquipment) return;

    setForm((prev) => ({
      ...prev,
      equipment_id: String(selectedEquipment.equipment_id ?? ""),
      equipment_code: selectedEquipment.equipment_code || "",
      equipment_name_vi: selectedEquipment.equipment_name_vi || "",
    }));
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 1100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(900px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 10px 35px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
              {isEdit ? t.modal.editTitle : t.modal.createTitle}
            </div>
            <div style={{ color: "#6b7280" }}>{t.modal.subtitle}</div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: 10,
              width: 40,
              height: 40,
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {renderField(
            t.modal.selectEquipment,
            <select
              value={form.equipment_id}
              onChange={handleEquipmentChange}
              style={inputStyle}
            >
              <option value="">{t.modal.selectEquipmentPlaceholder}</option>
              {equipmentOptions.map((item) => (
                <option key={item.equipment_id} value={item.equipment_id}>
                  {item.equipment_name_vi} ({item.equipment_code})
                </option>
              ))}
            </select>
          )}

          {renderField(
            t.modal.equipmentId,
            <input
              type="number"
              value={form.equipment_id}
              readOnly
              style={{ ...inputStyle, background: "#f9fafb" }}
            />
          )}

          {renderField(
            t.modal.equipmentCode,
            <input
              value={form.equipment_code}
              readOnly
              style={{ ...inputStyle, background: "#f9fafb" }}
            />
          )}

          {renderField(
            t.modal.equipmentName,
            <input
              value={form.equipment_name_vi}
              readOnly
              style={{ ...inputStyle, background: "#f9fafb" }}
            />
          )}

          {renderField(
            t.modal.frequencyType,
            <select
              value={form.frequency_type}
              onChange={(e) => setForm((prev) => ({ ...prev, frequency_type: e.target.value }))}
              style={inputStyle}
            >
              <option value="daily">{t.frequency.daily}</option>
              <option value="weekly">{t.frequency.weekly}</option>
              <option value="monthly">{t.frequency.monthly}</option>
              <option value="quarterly">{t.frequency.quarterly}</option>
              <option value="yearly">{t.frequency.yearly}</option>
            </select>
          )}

          {renderField(
            t.modal.frequencyValue,
            <input
              type="number"
              min="1"
              value={form.frequency_value}
              onChange={(e) => setForm((prev) => ({ ...prev, frequency_value: e.target.value }))}
              style={inputStyle}
            />
          )}

          {renderField(
            t.modal.plannedDate,
            <input
              type="date"
              value={form.planned_date}
              onChange={(e) => setForm((prev) => ({ ...prev, planned_date: e.target.value }))}
              style={inputStyle}
            />
          )}

          {renderField(
            t.modal.assignee,
            <input
              value={form.assignee}
              onChange={(e) => setForm((prev) => ({ ...prev, assignee: e.target.value }))}
              style={inputStyle}
            />
          )}

          {renderField(
            t.modal.status,
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              style={inputStyle}
            >
              <option value="planned">{t.status.planned}</option>
              <option value="in_progress">{t.status.in_progress}</option>
              <option value="done">{t.status.done}</option>
              <option value="overdue">{t.status.overdue}</option>
              <option value="cancelled">{t.status.cancelled}</option>
            </select>
          )}

          <div style={{ gridColumn: "1 / -1" }}>
            {renderField(
              t.modal.notes,
              <textarea
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
              />
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 24,
          }}
        >
          <button
            onClick={onClose}
            disabled={savingPm}
            style={{
              background: "#f3f4f6",
              color: "#111827",
              border: "none",
              borderRadius: 12,
              padding: "12px 16px",
              cursor: savingPm ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {t.modal.close}
          </button>

          <button
            onClick={onSubmit}
            disabled={savingPm}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: 12,
              padding: "12px 16px",
              cursor: savingPm ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {savingPm
              ? t.modal.saving
              : isEdit
              ? t.modal.saveUpdate
              : t.modal.create}
          </button>
        </div>
      </div>
    </div>
  );
}

function getInitialPmForm() {
  const today = new Date().toISOString().slice(0, 10);

  return {
    equipment_id: "",
    equipment_code: "",
    equipment_name_vi: "",
    frequency_type: "weekly",
    frequency_value: "1",
    planned_date: today,
    assignee: "",
    notes: "",
    status: "planned",
  };
}

export default function PmPage({ onStatsChange, language = "vi" }) {
  const t = getTexts(language);

  const [pmSearch, setPmSearch] = useState("");
  const [pmPlans, setPmPlans] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [loadingPm, setLoadingPm] = useState(true);
  const [pmError, setPmError] = useState("");
  const [savingPm, setSavingPm] = useState(false);
  const [notice, setNotice] = useState(null);

  const [pmModalOpen, setPmModalOpen] = useState(false);
  const [pmModalMode, setPmModalMode] = useState("create");
  const [editingPmId, setEditingPmId] = useState(null);
  const [pmForm, setPmForm] = useState(getInitialPmForm());

  const loadPmPlans = () => {
    setLoadingPm(true);
    setPmError("");

    axios
      .get(`${API_BASE}/pm-plans/`)
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.items)
          ? res.data.items
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setPmPlans(data);
        setLoadingPm(false);

        if (onStatsChange) {
          onStatsChange({
            total: data.length,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setPmError(t.messages.loadPmError);
        setLoadingPm(false);
      });
  };

  const loadEquipmentOptions = () => {
    axios
      .get(`${API_BASE}/equipments/`)
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.items)
          ? res.data.items
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setEquipmentOptions(data);
      })
      .catch((err) => {
        console.error(err);
        setNotice({
          type: "error",
          message: t.messages.loadEquipmentError,
        });
      });
  };

  useEffect(() => {
    loadPmPlans();
    loadEquipmentOptions();
  }, [language]);

  const openCreatePmModal = () => {
    setPmModalMode("create");
    setEditingPmId(null);
    setPmForm(getInitialPmForm());
    setPmModalOpen(true);
  };

  const openEditPmModal = (item) => {
    setPmModalMode("edit");
    setEditingPmId(item.pm_id);
    setPmForm({
      equipment_id: String(item.equipment_id ?? ""),
      equipment_code: item.equipment_code ?? "",
      equipment_name_vi: item.equipment_name_vi ?? "",
      frequency_type: item.frequency_type ?? "weekly",
      frequency_value: String(item.frequency_value ?? "1"),
      planned_date: String(item.planned_date ?? "").slice(0, 10),
      assignee: item.assignee ?? "",
      notes: item.notes ?? "",
      status: item.status ?? "planned",
    });
    setPmModalOpen(true);
  };

  const closePmModal = () => {
    if (savingPm) return;
    setPmModalOpen(false);
    setEditingPmId(null);
    setPmForm(getInitialPmForm());
  };

  const validatePmForm = () => {
    if (!String(pmForm.equipment_id).trim()) return t.messages.missingEquipmentId;
    if (!String(pmForm.equipment_code).trim()) return t.messages.missingEquipmentCode;
    if (!String(pmForm.equipment_name_vi).trim()) return t.messages.missingEquipmentName;
    if (!String(pmForm.frequency_type).trim()) return t.messages.missingFrequencyType;
    if (!String(pmForm.frequency_value).trim()) return t.messages.missingFrequencyValue;
    if (!String(pmForm.planned_date).trim()) return t.messages.missingPlannedDate;
    if (!String(pmForm.status).trim()) return t.messages.missingStatus;
    return "";
  };

  const buildPmPayload = () => {
    return {
      equipment_id: Number(pmForm.equipment_id),
      equipment_code: String(pmForm.equipment_code).trim(),
      equipment_name_vi: String(pmForm.equipment_name_vi).trim(),
      frequency_type: String(pmForm.frequency_type).trim(),
      frequency_value: Number(pmForm.frequency_value),
      planned_date: String(pmForm.planned_date).trim(),
      assignee: String(pmForm.assignee || "").trim(),
      notes: String(pmForm.notes || "").trim(),
      status: String(pmForm.status).trim(),
    };
  };

  const handleSubmitPm = async () => {
    const validationMessage = validatePmForm();
    if (validationMessage) {
      setNotice({
        type: "error",
        message: validationMessage,
      });
      return;
    }

    const payload = buildPmPayload();

    try {
      setSavingPm(true);
      setNotice(null);

      if (pmModalMode === "create") {
        await axios.post(`${API_BASE}/pm-plans/`, payload);
        setNotice({
          type: "success",
          message: t.messages.createSuccess,
        });
      } else {
        await axios.put(`${API_BASE}/pm-plans/${editingPmId}`, payload);
        setNotice({
          type: "success",
          message: formatMessage(t.messages.updateSuccess, { id: editingPmId }),
        });
      }

      closePmModal();
      loadPmPlans();
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
      setSavingPm(false);
    }
  };

  const handleDeletePm = async (item) => {
    const confirmed = window.confirm(
      formatMessage(t.messages.deleteConfirm, { id: item.pm_id })
    );
    if (!confirmed) return;

    try {
      setSavingPm(true);
      await axios.delete(`${API_BASE}/pm-plans/${item.pm_id}`);
      setNotice({
        type: "success",
        message: formatMessage(t.messages.deleteSuccess, { id: item.pm_id }),
      });
      loadPmPlans();
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
      setSavingPm(false);
    }
  };

  const handleClosePm = async (item) => {
    const confirmed = window.confirm(
      formatMessage(t.messages.closeConfirm, { id: item.pm_id })
    );
    if (!confirmed) return;

    const payload = {
      equipment_id: Number(item.equipment_id),
      equipment_code: String(item.equipment_code || "").trim(),
      equipment_name_vi: String(item.equipment_name_vi || "").trim(),
      frequency_type: String(item.frequency_type || "").trim(),
      frequency_value: Number(item.frequency_value || 1),
      planned_date: String(item.planned_date || "").slice(0, 10),
      assignee: String(item.assignee || "").trim(),
      notes: String(item.notes || "").trim(),
      status: "done",
    };

    try {
      setSavingPm(true);
      await axios.put(`${API_BASE}/pm-plans/${item.pm_id}`, payload);
      setNotice({
        type: "success",
        message: formatMessage(t.messages.closeSuccess, { id: item.pm_id }),
      });
      loadPmPlans();
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : t.messages.closeBackendError;

      setNotice({
        type: "error",
        message: `${t.messages.closeFailed}\n${detail}`,
      });
    } finally {
      setSavingPm(false);
    }
  };

  const filteredPmPlans = useMemo(() => {
    const keyword = pmSearch.toLowerCase().trim();

    if (!keyword) return pmPlans;

    return pmPlans.filter((item) => {
      return (
        String(item.equipment_code || "").toLowerCase().includes(keyword) ||
        String(item.equipment_name_vi || "").toLowerCase().includes(keyword) ||
        String(item.frequency_type || "").toLowerCase().includes(keyword) ||
        String(item.assignee || "").toLowerCase().includes(keyword) ||
        String(item.status || "").toLowerCase().includes(keyword)
      );
    });
  }, [pmPlans, pmSearch]);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <PmPlanModal
        open={pmModalOpen}
        mode={pmModalMode}
        form={pmForm}
        setForm={setPmForm}
        onClose={closePmModal}
        onSubmit={handleSubmitPm}
        savingPm={savingPm}
        equipmentOptions={equipmentOptions}
        language={language}
      />

      <NotificationBox notice={notice} onClose={() => setNotice(null)} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            {t.page.title}
          </div>
          <div style={{ color: "#6b7280" }}>{t.page.subtitle}</div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={pmSearch}
            onChange={(e) => setPmSearch(e.target.value)}
            placeholder={t.page.searchPlaceholder}
            style={{
              minWidth: 360,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #d1d5db",
              outline: "none",
            }}
          />

          <ActionButton
            label={t.page.createButton}
            bg="#2563eb"
            onClick={openCreatePmModal}
            disabled={savingPm}
          />
        </div>
      </div>

      {loadingPm && <p>{t.page.loading}</p>}
      {pmError && <p style={{ color: "red" }}>{pmError}</p>}

      {!loadingPm && !pmError && (
        <div
          style={{
            overflowX: "auto",
            maxHeight: "560px",
            border: "1px solid #eef2f7",
            borderRadius: 16,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1550,
            }}
          >
            <thead style={{ background: "#f9fafb" }}>
              <tr style={{ textAlign: "left" }}>
                <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 80 }}>
                  {t.table.id}
                </th>
                <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 130 }}>
                  {t.table.equipmentCode}
                </th>
                <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 280 }}>
                  {t.table.equipmentName}
                </th>
                <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 160 }}>
                  {t.table.frequencyType}
                </th>
                <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 100 }}>
                  {t.table.frequencyValue}
                </th>
                <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 160 }}>
                  {t.table.plannedDate}
                </th>
                <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 180 }}>
                  {t.table.assignee}
                </th>
                <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 170 }}>
                  {t.table.status}
                </th>
                <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 300 }}>
                  {t.table.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPmPlans.map((item) => (
                <tr key={item.pm_id}>
                  <td style={{ padding: 12, borderBottom: "1px solid #f3f4f6" }}>
                    {item.pm_id}
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                    {item.equipment_code}
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #f3f4f6", lineHeight: 1.5 }}>
                    {item.equipment_name_vi}
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #f3f4f6" }}>
                    {formatPmFrequency(item.frequency_type, language)}
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #f3f4f6" }}>
                    {item.frequency_value}
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #f3f4f6" }}>
                    {formatDateVN(item.planned_date)}
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #f3f4f6" }}>
                    {item.assignee || ""}
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #f3f4f6" }}>
                    <StatusBadge status={item.status} language={language} />
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <ActionButton
                        label={t.buttons.edit}
                        bg="#f59e0b"
                        onClick={() => openEditPmModal(item)}
                        disabled={savingPm}
                      />
                      <ActionButton
                        label={t.buttons.close}
                        bg="#2563eb"
                        onClick={() => handleClosePm(item)}
                        disabled={savingPm || String(item.status).toLowerCase() === "done"}
                      />
                      <ActionButton
                        label={t.buttons.delete}
                        bg="#dc2626"
                        onClick={() => handleDeletePm(item)}
                        disabled={savingPm}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPmPlans.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      padding: 20,
                      textAlign: "center",
                      color: "#6b7280",
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
    </div>
  );
}