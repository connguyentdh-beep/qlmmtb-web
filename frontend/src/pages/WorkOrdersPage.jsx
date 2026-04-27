import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

function getTexts(language = "vi") {
  const texts = {
    vi: {
      unknown: "Không rõ",
      notAvailable: "N/A",

      workTypes: {
        PM: "PM",
        BC: "BC",
        CM: "CM",
        INSPECTION: "Inspection",
      },

      priorities: {
        low: "Thấp",
        medium: "Trung bình",
        high: "Cao",
        critical: "Khẩn cấp",
      },

      statuses: {
        open: "Mở",
        in_progress: "Đang thực hiện",
        done: "Hoàn thành",
        cancelled: "Đã hủy",
      },

      modal: {
        editTitle: "Sửa phiếu công việc",
        createTitle: "Tạo phiếu công việc",
        subtitle: "Chọn thiết bị từ Danh mục thiết bị để tự điền EQ ID, Mã máy, Tên thiết bị",
        workType: "Loại phiếu",
        workCode: "Mã phiếu",
        workCodePlaceholder: "Ví dụ: WO-0001",
        selectEquipment: "Chọn thiết bị từ Danh mục thiết bị",
        selectEquipmentPlaceholder: "-- Chọn thiết bị --",
        equipmentId: "EQ ID",
        equipmentCode: "Mã máy",
        equipmentName: "Tên thiết bị",
        jobDescription: "Nội dung công việc",
        jobDescriptionPlaceholder: "Mô tả công việc cần thực hiện",
        assignee: "Người thực hiện",
        assigneePlaceholder: "Ví dụ: Lê Minh Khang",
        priority: "Mức ưu tiên",
        status: "Trạng thái",
        createdDate: "Ngày tạo",
        dueDate: "Hạn hoàn thành",
        notes: "Ghi chú",
        notesPlaceholder: "Nhập ghi chú",
        close: "Đóng",
        saving: "Đang lưu...",
        saveUpdate: "Lưu cập nhật",
        create: "Tạo phiếu",
      },

      page: {
        title: "Phiếu công việc",
        subtitle: "Thiết bị đang lấy trực tiếp từ Danh mục thiết bị",
        createButton: "+ Tạo phiếu công việc",
        searchPlaceholder: "Tìm theo mã phiếu, mã máy, tên thiết bị, người thực hiện...",
        typeFilterAll: "Tất cả loại phiếu",
        loading: "Đang tải dữ liệu Phiếu công việc...",
        noData: "Không tìm thấy phiếu công việc phù hợp",
      },

      stats: {
        total: "Tổng phiếu",
        totalSub: "Đọc từ database",
        open: "Đang mở",
        openSub: "Chờ xử lý",
        inProgress: "Đang thực hiện",
        inProgressSub: "Đang xử lý",
        done: "Hoàn thành",
        doneSub: "Đã đóng",
      },

      table: {
        workCode: "Mã phiếu",
        workType: "Loại phiếu",
        equipmentCode: "Mã máy",
        equipmentId: "EQ ID",
        equipmentName: "Tên thiết bị",
        jobDescription: "Nội dung công việc",
        assignee: "Người thực hiện",
        priority: "Ưu tiên",
        status: "Trạng thái",
        createdDate: "Ngày tạo",
        dueDate: "Hạn xong",
        actions: "Thao tác",
      },

      buttons: {
        edit: "Sửa",
        close: "Đóng",
        delete: "Xóa",
      },

      messages: {
        loadWorkOrdersError: "Không tải được dữ liệu Phiếu công việc từ backend",
        loadEquipmentsError: "Không tải được danh mục thiết bị",

        missingWorkCode: "Thiếu mã phiếu",
        missingWorkType: "Thiếu loại phiếu",
        missingEquipment: "Thiếu thiết bị",
        missingEquipmentCode: "Thiếu mã máy",
        missingEquipmentName: "Thiếu tên thiết bị",
        missingJobDescription: "Thiếu nội dung công việc",
        missingAssignee: "Thiếu người thực hiện",
        missingPriority: "Thiếu mức ưu tiên",
        missingStatus: "Thiếu trạng thái",
        missingCreatedDate: "Thiếu ngày tạo",
        missingDueDate: "Thiếu hạn hoàn thành",

        createSuccess: "Tạo phiếu công việc {code} thành công",
        updateSuccess: "Cập nhật phiếu công việc {code} thành công",
        saveFailed: "Lưu phiếu công việc thất bại",
        saveBackendError: "Backend trả lỗi khi lưu phiếu công việc.",

        deleteConfirm: "Anh có chắc muốn xóa phiếu {code} không?",
        deleteSuccess: "Đã xóa phiếu {code}",
        deleteFailed: "Xóa phiếu công việc thất bại",
        deleteBackendError: "Backend trả lỗi khi xóa phiếu công việc.",

        closeConfirm: "Anh có chắc muốn đóng phiếu {code} không?",
        closeSuccess: "Đã đóng phiếu {code}",
        closeFailed: "Đóng phiếu công việc thất bại",
        closeBackendError: "Backend trả lỗi khi đóng phiếu công việc.",
      },
    },

    en: {
      unknown: "Unknown",
      notAvailable: "N/A",

      workTypes: {
        PM: "PM",
        BC: "BC",
        CM: "CM",
        INSPECTION: "Inspection",
      },

      priorities: {
        low: "Low",
        medium: "Medium",
        high: "High",
        critical: "Critical",
      },

      statuses: {
        open: "Open",
        in_progress: "In Progress",
        done: "Completed",
        cancelled: "Cancelled",
      },

      modal: {
        editTitle: "Edit Work Order",
        createTitle: "Create Work Order",
        subtitle: "Select equipment from the Equipment List to auto-fill EQ ID, Equipment Code, and Equipment Name",
        workType: "Work Type",
        workCode: "Work Order Code",
        workCodePlaceholder: "Example: WO-0001",
        selectEquipment: "Select equipment from Equipment List",
        selectEquipmentPlaceholder: "-- Select equipment --",
        equipmentId: "EQ ID",
        equipmentCode: "Equipment Code",
        equipmentName: "Equipment Name",
        jobDescription: "Job Description",
        jobDescriptionPlaceholder: "Describe the work to be performed",
        assignee: "Assignee",
        assigneePlaceholder: "Example: Le Minh Khang",
        priority: "Priority",
        status: "Status",
        createdDate: "Created Date",
        dueDate: "Due Date",
        notes: "Notes",
        notesPlaceholder: "Enter notes",
        close: "Close",
        saving: "Saving...",
        saveUpdate: "Save Update",
        create: "Create Work Order",
      },

      page: {
        title: "Work Orders",
        subtitle: "Equipment is loaded directly from the Equipment List",
        createButton: "+ Create Work Order",
        searchPlaceholder: "Search by work order code, equipment code, equipment name, assignee...",
        typeFilterAll: "All work order types",
        loading: "Loading work order data...",
        noData: "No matching work orders found",
      },

      stats: {
        total: "Total Orders",
        totalSub: "Read from database",
        open: "Open",
        openSub: "Waiting for processing",
        inProgress: "In Progress",
        inProgressSub: "Being processed",
        done: "Completed",
        doneSub: "Closed",
      },

      table: {
        workCode: "Work Order Code",
        workType: "Work Type",
        equipmentCode: "Equipment Code",
        equipmentId: "EQ ID",
        equipmentName: "Equipment Name",
        jobDescription: "Job Description",
        assignee: "Assignee",
        priority: "Priority",
        status: "Status",
        createdDate: "Created Date",
        dueDate: "Due Date",
        actions: "Actions",
      },

      buttons: {
        edit: "Edit",
        close: "Close",
        delete: "Delete",
      },

      messages: {
        loadWorkOrdersError: "Cannot load work order data from backend",
        loadEquipmentsError: "Cannot load equipment list",

        missingWorkCode: "Missing work order code",
        missingWorkType: "Missing work type",
        missingEquipment: "Missing equipment",
        missingEquipmentCode: "Missing equipment code",
        missingEquipmentName: "Missing equipment name",
        missingJobDescription: "Missing job description",
        missingAssignee: "Missing assignee",
        missingPriority: "Missing priority",
        missingStatus: "Missing status",
        missingCreatedDate: "Missing created date",
        missingDueDate: "Missing due date",

        createSuccess: "Work order {code} created successfully",
        updateSuccess: "Work order {code} updated successfully",
        saveFailed: "Failed to save work order",
        saveBackendError: "Backend returned an error while saving the work order.",

        deleteConfirm: "Are you sure you want to delete work order {code}?",
        deleteSuccess: "Deleted work order {code}",
        deleteFailed: "Failed to delete work order",
        deleteBackendError: "Backend returned an error while deleting the work order.",

        closeConfirm: "Are you sure you want to close work order {code}?",
        closeSuccess: "Closed work order {code}",
        closeFailed: "Failed to close work order",
        closeBackendError: "Backend returned an error while closing the work order.",
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

function WorkTypeBadge({ type, language = "vi" }) {
  const t = getTexts(language);
  const raw = String(type || "").toUpperCase();

  let bg = "#e5e7eb";
  let color = "#374151";
  let label = raw || t.notAvailable;

  if (raw === "PM") {
    bg = "#dbeafe";
    color = "#1d4ed8";
    label = t.workTypes.PM;
  } else if (raw === "BC") {
    bg = "#fee2e2";
    color = "#b91c1c";
    label = t.workTypes.BC;
  } else if (raw === "CM") {
    bg = "#fef3c7";
    color = "#92400e";
    label = t.workTypes.CM;
  } else if (raw === "INSPECTION") {
    bg = "#dcfce7";
    color = "#166534";
    label = t.workTypes.INSPECTION;
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

function PriorityBadge({ priority, language = "vi" }) {
  const t = getTexts(language);
  const raw = String(priority || "").toLowerCase();

  let bg = "#e5e7eb";
  let color = "#374151";
  let label = priority || t.unknown;

  if (raw === "low") {
    bg = "#e0f2fe";
    color = "#075985";
    label = t.priorities.low;
  } else if (raw === "medium") {
    bg = "#fef3c7";
    color = "#92400e";
    label = t.priorities.medium;
  } else if (raw === "high") {
    bg = "#fee2e2";
    color = "#b91c1c";
    label = t.priorities.high;
  } else if (raw === "critical") {
    bg = "#7f1d1d";
    color = "#ffffff";
    label = t.priorities.critical;
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

function StatusBadge({ status, language = "vi" }) {
  const t = getTexts(language);
  const raw = String(status || "").toLowerCase();

  let bg = "#e5e7eb";
  let color = "#374151";
  let label = status || t.unknown;

  if (raw === "open") {
    bg = "#dbeafe";
    color = "#1d4ed8";
    label = t.statuses.open;
  } else if (raw === "in_progress") {
    bg = "#fef3c7";
    color = "#92400e";
    label = t.statuses.in_progress;
  } else if (raw === "done") {
    bg = "#dcfce7";
    color = "#166534";
    label = t.statuses.done;
  } else if (raw === "cancelled") {
    bg = "#f3f4f6";
    color = "#6b7280";
    label = t.statuses.cancelled;
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

function getInitialForm() {
  const today = new Date().toISOString().slice(0, 10);

  return {
    work_code: "",
    work_type: "PM",
    equipment_id: "",
    equipment_code: "",
    equipment_name_vi: "",
    job_description: "",
    assignee: "",
    priority: "medium",
    status: "open",
    created_date: today,
    due_date: today,
    notes: "",
  };
}

function WorkOrderModal({
  open,
  mode,
  form,
  setForm,
  onClose,
  onSubmit,
  saving,
  equipments,
  language = "vi",
}) {
  const t = getTexts(language);

  if (!open) return null;

  const isEdit = mode === "edit";

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
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

  const renderField = (label, children) => (
    <div>
      <div style={labelStyle}>{label}</div>
      {children}
    </div>
  );

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
        equipment_name_vi: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      equipment_id: String(selected.equipment_id ?? ""),
      equipment_code: selected.equipment_code ?? "",
      equipment_name_vi: selected.equipment_name_vi ?? "",
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
        padding: 16,
        zIndex: 1200,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(980px, 100%)",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: 18,
          padding: 20,
          boxShadow: "0 10px 35px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: 16,
            marginBottom: 18,
          }}
        >
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
              {isEdit ? t.modal.editTitle : t.modal.createTitle}
            </div>
            <div style={{ color: "#6b7280", fontSize: 13 }}>
              {t.modal.subtitle}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: 10,
              width: 38,
              height: 38,
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {renderField(
            t.modal.workType,
            <select
              value={form.work_type}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, work_type: e.target.value }))
              }
              style={inputStyle}
            >
              <option value="PM">{t.workTypes.PM}</option>
              <option value="BC">{t.workTypes.BC}</option>
              <option value="CM">{t.workTypes.CM}</option>
              <option value="INSPECTION">{t.workTypes.INSPECTION}</option>
            </select>
          )}

          {renderField(
            t.modal.workCode,
            <input
              value={form.work_code}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, work_code: e.target.value }))
              }
              style={inputStyle}
              placeholder={t.modal.workCodePlaceholder}
            />
          )}

          <div style={{ gridColumn: "1 / -1" }}>
            {renderField(
              t.modal.selectEquipment,
              <select
                value={form.equipment_id}
                onChange={(e) => handleSelectEquipment(e.target.value)}
                style={inputStyle}
              >
                <option value="">{t.modal.selectEquipmentPlaceholder}</option>
                {equipments.map((item) => (
                  <option key={item.equipment_id} value={item.equipment_id}>
                    {item.equipment_code} - {item.equipment_name_vi}
                  </option>
                ))}
              </select>
            )}
          </div>

          {renderField(
            t.modal.equipmentId,
            <input
              value={form.equipment_id}
              style={{ ...inputStyle, background: "#f9fafb" }}
              readOnly
            />
          )}

          {renderField(
            t.modal.equipmentCode,
            <input
              value={form.equipment_code}
              style={{ ...inputStyle, background: "#f9fafb" }}
              readOnly
            />
          )}

          <div style={{ gridColumn: "1 / -1" }}>
            {renderField(
              t.modal.equipmentName,
              <input
                value={form.equipment_name_vi}
                style={{ ...inputStyle, background: "#f9fafb" }}
                readOnly
              />
            )}
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            {renderField(
              t.modal.jobDescription,
              <textarea
                value={form.job_description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    job_description: e.target.value,
                  }))
                }
                style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
                placeholder={t.modal.jobDescriptionPlaceholder}
              />
            )}
          </div>

          {renderField(
            t.modal.assignee,
            <input
              value={form.assignee}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, assignee: e.target.value }))
              }
              style={inputStyle}
              placeholder={t.modal.assigneePlaceholder}
            />
          )}

          {renderField(
            t.modal.priority,
            <select
              value={form.priority}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, priority: e.target.value }))
              }
              style={inputStyle}
            >
              <option value="low">{t.priorities.low}</option>
              <option value="medium">{t.priorities.medium}</option>
              <option value="high">{t.priorities.high}</option>
              <option value="critical">{t.priorities.critical}</option>
            </select>
          )}

          {renderField(
            t.modal.status,
            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, status: e.target.value }))
              }
              style={inputStyle}
            >
              <option value="open">{t.statuses.open}</option>
              <option value="in_progress">{t.statuses.in_progress}</option>
              <option value="done">{t.statuses.done}</option>
              <option value="cancelled">{t.statuses.cancelled}</option>
            </select>
          )}

          {renderField(
            t.modal.createdDate,
            <input
              type="date"
              value={form.created_date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, created_date: e.target.value }))
              }
              style={inputStyle}
            />
          )}

          {renderField(
            t.modal.dueDate,
            <input
              type="date"
              value={form.due_date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, due_date: e.target.value }))
              }
              style={inputStyle}
            />
          )}

          <div style={{ gridColumn: "1 / -1" }}>
            {renderField(
              t.modal.notes,
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                placeholder={t.modal.notesPlaceholder}
              />
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              background: "#f3f4f6",
              color: "#111827",
              border: "none",
              borderRadius: 10,
              padding: "10px 14px",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {t.modal.close}
          </button>

          <button
            onClick={onSubmit}
            disabled={saving}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              padding: "10px 14px",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {saving ? t.modal.saving : isEdit ? t.modal.saveUpdate : t.modal.create}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkOrdersPage({ language = "vi" }) {
  const t = getTexts(language);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [notice, setNotice] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [equipments, setEquipments] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(getInitialForm());

  const loadWorkOrders = () => {
    setLoading(true);

    axios
      .get(`${API_BASE}/work-orders/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setWorkOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotice({
          type: "error",
          message: t.messages.loadWorkOrdersError,
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
    loadWorkOrders();
    loadEquipments();
  }, [language]);

  const stats = useMemo(() => {
    return {
      total: workOrders.length,
      open: workOrders.filter((x) => x.status === "open").length,
      inProgress: workOrders.filter((x) => x.status === "in_progress").length,
      done: workOrders.filter((x) => x.status === "done").length,
    };
  }, [workOrders]);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return workOrders.filter((item) => {
      const matchType = typeFilter === "ALL" ? true : item.work_type === typeFilter;

      const matchKeyword =
        !keyword ||
        String(item.work_code || "").toLowerCase().includes(keyword) ||
        String(item.work_type || "").toLowerCase().includes(keyword) ||
        String(item.equipment_code || "").toLowerCase().includes(keyword) ||
        String(item.equipment_name_vi || "").toLowerCase().includes(keyword) ||
        String(item.job_description || "").toLowerCase().includes(keyword) ||
        String(item.assignee || "").toLowerCase().includes(keyword) ||
        String(item.status || "").toLowerCase().includes(keyword);

      return matchType && matchKeyword;
    });
  }, [workOrders, search, typeFilter]);

  const openCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setForm(getInitialForm());
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setEditingId(item.work_order_id);
    setForm({
      work_code: item.work_code ?? "",
      work_type: item.work_type ?? "PM",
      equipment_id: String(item.equipment_id ?? ""),
      equipment_code: item.equipment_code ?? "",
      equipment_name_vi: item.equipment_name_vi ?? "",
      job_description: item.job_description ?? "",
      assignee: item.assignee ?? "",
      priority: item.priority ?? "medium",
      status: item.status ?? "open",
      created_date: String(item.created_date ?? "").slice(0, 10),
      due_date: String(item.due_date ?? "").slice(0, 10),
      notes: item.notes ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(getInitialForm());
  };

  const validateForm = () => {
    if (!String(form.work_code).trim()) return t.messages.missingWorkCode;
    if (!String(form.work_type).trim()) return t.messages.missingWorkType;
    if (String(form.equipment_id).trim() === "") return t.messages.missingEquipment;
    if (!String(form.equipment_code).trim()) return t.messages.missingEquipmentCode;
    if (!String(form.equipment_name_vi).trim()) return t.messages.missingEquipmentName;
    if (!String(form.job_description).trim()) return t.messages.missingJobDescription;
    if (!String(form.assignee).trim()) return t.messages.missingAssignee;
    if (!String(form.priority).trim()) return t.messages.missingPriority;
    if (!String(form.status).trim()) return t.messages.missingStatus;
    if (!String(form.created_date).trim()) return t.messages.missingCreatedDate;
    if (!String(form.due_date).trim()) return t.messages.missingDueDate;
    return "";
  };

  const buildPayload = (sourceForm = form) => {
    return {
      work_code: String(sourceForm.work_code).trim(),
      work_type: String(sourceForm.work_type).trim(),
      equipment_id: Number(sourceForm.equipment_id),
      equipment_code: String(sourceForm.equipment_code).trim(),
      equipment_name_vi: String(sourceForm.equipment_name_vi).trim(),
      job_description: String(sourceForm.job_description).trim(),
      assignee: String(sourceForm.assignee).trim(),
      priority: String(sourceForm.priority).trim(),
      status: String(sourceForm.status).trim(),
      created_date: String(sourceForm.created_date).trim(),
      due_date: String(sourceForm.due_date).trim(),
      notes: String(sourceForm.notes || "").trim(),
    };
  };

  const handleSubmit = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setNotice({
        type: "error",
        message: validationMessage,
      });
      return;
    }

    const payload = buildPayload();

    try {
      setSaving(true);
      setNotice(null);

      if (modalMode === "create") {
        await axios.post(`${API_BASE}/work-orders/`, payload);
        setNotice({
          type: "success",
          message: formatMessage(t.messages.createSuccess, {
            code: payload.work_code,
          }),
        });
      } else {
        await axios.put(`${API_BASE}/work-orders/${editingId}`, payload);
        setNotice({
          type: "success",
          message: formatMessage(t.messages.updateSuccess, {
            code: payload.work_code,
          }),
        });
      }

      closeModal();
      loadWorkOrders();
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

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      formatMessage(t.messages.deleteConfirm, { code: item.work_code })
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      await axios.delete(`${API_BASE}/work-orders/${item.work_order_id}`);
      setNotice({
        type: "success",
        message: formatMessage(t.messages.deleteSuccess, { code: item.work_code }),
      });
      loadWorkOrders();
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

  const handleCloseWorkOrder = async (item) => {
    const confirmed = window.confirm(
      formatMessage(t.messages.closeConfirm, { code: item.work_code })
    );
    if (!confirmed) return;

    try {
      setSaving(true);

      const payload = buildPayload({
        ...item,
        created_date: String(item.created_date ?? "").slice(0, 10),
        due_date: String(item.due_date ?? "").slice(0, 10),
        status: "done",
      });

      await axios.put(`${API_BASE}/work-orders/${item.work_order_id}`, payload);

      setNotice({
        type: "success",
        message: formatMessage(t.messages.closeSuccess, { code: item.work_code }),
      });

      loadWorkOrders();
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
      <WorkOrderModal
        open={modalOpen}
        mode={modalMode}
        form={form}
        setForm={setForm}
        onClose={closeModal}
        onSubmit={handleSubmit}
        saving={saving}
        equipments={equipments}
        language={language}
      />

      <NotificationBox notice={notice} onClose={() => setNotice(null)} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
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
          label={t.page.createButton}
          bg="#2563eb"
          onClick={openCreateModal}
          disabled={saving}
        />
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
          { title: t.stats.open, value: stats.open, subtitle: t.stats.openSub },
          { title: t.stats.inProgress, value: stats.inProgress, subtitle: t.stats.inProgressSub },
          { title: t.stats.done, value: stats.done, subtitle: t.stats.doneSub },
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
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
              {card.title}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>
              {card.value}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>{card.subtitle}</div>
          </div>
        ))}
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
          placeholder={t.page.searchPlaceholder}
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
          <option value="ALL">{t.page.typeFilterAll}</option>
          <option value="PM">{t.workTypes.PM}</option>
          <option value="BC">{t.workTypes.BC}</option>
          <option value="CM">{t.workTypes.CM}</option>
          <option value="INSPECTION">{t.workTypes.INSPECTION}</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 20, color: "#6b7280" }}>
          {t.page.loading}
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            border: "1px solid #eef2f7",
            borderRadius: 12,
            maxHeight: "60vh",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1650,
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
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 110 }}>
                  {t.table.workCode}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 110 }}>
                  {t.table.workType}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 110 }}>
                  {t.table.equipmentCode}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 90 }}>
                  {t.table.equipmentId}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 260 }}>
                  {t.table.equipmentName}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 280 }}>
                  {t.table.jobDescription}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 150 }}>
                  {t.table.assignee}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 110 }}>
                  {t.table.priority}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 140 }}>
                  {t.table.status}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 110 }}>
                  {t.table.createdDate}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 120 }}>
                  {t.table.dueDate}
                </th>
                <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", width: 240 }}>
                  {t.table.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.work_order_id}>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                    {item.work_code}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    <WorkTypeBadge type={item.work_type} language={language} />
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>
                    {item.equipment_code}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    {item.equipment_id ?? ""}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", lineHeight: 1.4 }}>
                    {item.equipment_name_vi}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", lineHeight: 1.4 }}>
                    {item.job_description}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    {item.assignee}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    <PriorityBadge priority={item.priority} language={language} />
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    <StatusBadge status={item.status} language={language} />
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    {formatDateVN(item.created_date)}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    {formatDateVN(item.due_date)}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <ActionButton
                        label={t.buttons.edit}
                        bg="#f59e0b"
                        onClick={() => openEditModal(item)}
                        disabled={saving}
                      />
                      <ActionButton
                        label={t.buttons.close}
                        bg="#2563eb"
                        onClick={() => handleCloseWorkOrder(item)}
                        disabled={saving || item.status === "done"}
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

              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan="12"
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
    </div>
  );
}