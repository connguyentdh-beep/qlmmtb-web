import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

function formatPmFrequency(value) {
  const v = String(value || "").toLowerCase().trim();
  if (v === "daily") return "Hàng ngày";
  if (v === "weekly") return "Hàng tuần";
  if (v === "monthly") return "Hàng tháng";
  if (v === "quarterly") return "Hàng quý";
  if (v === "yearly") return "Hàng năm";
  return value || "";
}

function formatPmStatus(value) {
  const v = String(value || "").toLowerCase().trim();
  if (v === "planned") return "Kế hoạch";
  if (v === "in_progress") return "Đang thực hiện";
  if (v === "done") return "Hoàn thành";
  if (v === "overdue") return "Quá hạn";
  if (v === "cancelled") return "Đã hủy";
  return value || "Không rõ";
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

function StatCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#9ca3af" }}>{subtitle}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const raw = String(status || "").toLowerCase().trim();

  let bg = "#e5e7eb";
  let color = "#374151";
  let label = status || "Không rõ";

  if (raw === "active") {
    bg = "#dcfce7";
    color = "#166534";
    label = "Đang hoạt động";
  } else if (raw === "inactive") {
    bg = "#fee2e2";
    color = "#991b1b";
    label = "Dừng hoạt động";
  } else if (raw === "broken") {
    bg = "#fee2e2";
    color = "#991b1b";
    label = "Hỏng";
  } else if (raw === "dismantled") {
    bg = "#fef3c7";
    color = "#92400e";
    label = "Tháo dỡ";
  } else if (raw === "converted") {
    bg = "#dbeafe";
    color = "#1d4ed8";
    label = "Chuyển đổi mục đích";
  } else if (raw === "planned") {
    bg = "#dbeafe";
    color = "#1d4ed8";
    label = "Kế hoạch";
  } else if (raw === "in_progress") {
    bg = "#fef3c7";
    color = "#92400e";
    label = "Đang thực hiện";
  } else if (raw === "done") {
    bg = "#dcfce7";
    color = "#166534";
    label = "Hoàn thành";
  } else if (raw === "overdue") {
    bg = "#fee2e2";
    color = "#991b1b";
    label = "Quá hạn";
  } else if (raw === "cancelled") {
    bg = "#f3f4f6";
    color = "#6b7280";
    label = "Đã hủy";
  } else {
    label = formatPmStatus(raw);
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

function DetailModal({ item, onClose }) {
  if (!item) return null;

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px solid #f3f4f6",
    alignItems: "start",
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
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(900px, 100%)",
          maxHeight: "85vh",
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
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Chi tiết thiết bị</div>
            <div style={{ color: "#6b7280" }}>
              Xem nhanh thông tin thiết bị từ danh mục hiện tại
            </div>
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

        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>Mã máy</div>
          <div>{item.equipment_code || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>Tên máy móc, thiết bị</div>
          <div>{item.equipment_name_vi || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>Thông số kỹ thuật</div>
          <div>{item.csv_power_spec || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>Đơn vị sử dụng</div>
          <div>{item.csv_department || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>Khu vực</div>
          <div>{item.csv_area || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>Đơn vị tính</div>
          <div>{item.csv_unit || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>Số lượng</div>
          <div>{item.csv_quantity ?? ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>Trạng thái</div>
          <div>
            <StatusBadge status={item.status} />
          </div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>Người phụ trách</div>
          <div>{item.csv_owner_name || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>Ghi chú</div>
          <div>{item.notes || ""}</div>
        </div>
      </div>
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
}) {
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
              {isEdit ? "Sửa kế hoạch PM" : "Tạo kế hoạch PM"}
            </div>
            <div style={{ color: "#6b7280" }}>
              Nhập đầy đủ thông tin theo schema backend
            </div>
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
            "Equipment ID",
            <input
              type="number"
              value={form.equipment_id}
              onChange={(e) => setForm((prev) => ({ ...prev, equipment_id: e.target.value }))}
              style={inputStyle}
              placeholder="Ví dụ: 2"
            />
          )}

          {renderField(
            "Mã máy",
            <input
              value={form.equipment_code}
              onChange={(e) => setForm((prev) => ({ ...prev, equipment_code: e.target.value }))}
              style={inputStyle}
              placeholder="Ví dụ: EQP-002"
            />
          )}

          <div style={{ gridColumn: "1 / -1" }}>
            {renderField(
              "Tên thiết bị",
              <input
                value={form.equipment_name_vi}
                onChange={(e) => setForm((prev) => ({ ...prev, equipment_name_vi: e.target.value }))}
                style={inputStyle}
                placeholder="Ví dụ: Motor bơm cấp nước nuôi trồng"
              />
            )}
          </div>

          {renderField(
            "Chu kỳ",
            <select
              value={form.frequency_type}
              onChange={(e) => setForm((prev) => ({ ...prev, frequency_type: e.target.value }))}
              style={inputStyle}
            >
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
              <option value="monthly">Hàng tháng</option>
              <option value="quarterly">Hàng quý</option>
              <option value="yearly">Hàng năm</option>
            </select>
          )}

          {renderField(
            "Giá trị chu kỳ",
            <input
              type="number"
              min="1"
              value={form.frequency_value}
              onChange={(e) => setForm((prev) => ({ ...prev, frequency_value: e.target.value }))}
              style={inputStyle}
              placeholder="Ví dụ: 1"
            />
          )}

          {renderField(
            "Ngày kế hoạch",
            <input
              type="date"
              value={form.planned_date}
              onChange={(e) => setForm((prev) => ({ ...prev, planned_date: e.target.value }))}
              style={inputStyle}
            />
          )}

          {renderField(
            "Người phụ trách",
            <input
              value={form.assignee}
              onChange={(e) => setForm((prev) => ({ ...prev, assignee: e.target.value }))}
              style={inputStyle}
              placeholder="Ví dụ: Lê Minh Khang"
            />
          )}

          {renderField(
            "Trạng thái",
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              style={inputStyle}
            >
              <option value="planned">Kế hoạch</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="done">Hoàn thành</option>
              <option value="overdue">Quá hạn</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          )}

          <div style={{ gridColumn: "1 / -1" }}>
            {renderField(
              "Ghi chú",
              <textarea
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
                placeholder="Nhập ghi chú PM"
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
            Đóng
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
            {savingPm ? "Đang lưu..." : isEdit ? "Lưu cập nhật" : "Tạo kế hoạch PM"}
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

export default function App() {
  const [activeMenu, setActiveMenu] = useState("devices");
  const [search, setSearch] = useState("");
  const [pmSearch, setPmSearch] = useState("");

  const [devices, setDevices] = useState([]);
  const [pmPlans, setPmPlans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingPm, setLoadingPm] = useState(true);

  const [error, setError] = useState("");
  const [pmError, setPmError] = useState("");

  const [importing, setImporting] = useState(false);
  const [savingPm, setSavingPm] = useState(false);

  const [notice, setNotice] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [pmModalOpen, setPmModalOpen] = useState(false);
  const [pmModalMode, setPmModalMode] = useState("create");
  const [editingPmId, setEditingPmId] = useState(null);
  const [pmForm, setPmForm] = useState(getInitialPmForm());

  const loadDevices = () => {
    setLoading(true);
    setError("");

    axios
      .get(`${API_BASE}/equipments/`)
      .then((res) => {
        setDevices(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Không tải được dữ liệu thiết bị từ backend");
        setLoading(false);
      });
  };

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
      })
      .catch((err) => {
        console.error(err);
        setPmError("Không tải được dữ liệu kế hoạch PM từ backend");
        setLoadingPm(false);
      });
  };

  useEffect(() => {
    loadDevices();
    loadPmPlans();
  }, []);

  const handleImportCsv = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setImporting(true);
      setError("");
      setNotice(null);

      const res = await axios.post(`${API_BASE}/equipments/import-csv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNotice({
        type: "success",
        message: `Import thành công
File: ${res.data.filename}
Số dòng xử lý: ${res.data.rows_processed}`,
      });

      loadDevices();
    } catch (err) {
      console.error(err);
      setNotice({
        type: "error",
        message: "Import CSV thất bại. Vui lòng kiểm tra lại file dữ liệu.",
      });
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  const handleEditDevice = (item) => {
    setNotice({
      type: "success",
      message: `Chức năng Sửa cho thiết bị ${item.equipment_code} sẽ làm ở bước tiếp theo.`,
    });
  };

  const handleDeleteDevice = (item) => {
    const confirmed = window.confirm(
      `Anh có chắc muốn xóa thiết bị ${item.equipment_code} - ${item.equipment_name_vi} không?`
    );

    if (!confirmed) return;

    setNotice({
      type: "error",
      message: `Chức năng Xóa cho thiết bị ${item.equipment_code} sẽ làm ở bước tiếp theo.`,
    });
  };

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
    if (!String(pmForm.equipment_id).trim()) {
      return "Thiếu Equipment ID";
    }
    if (!String(pmForm.equipment_code).trim()) {
      return "Thiếu Mã máy";
    }
    if (!String(pmForm.equipment_name_vi).trim()) {
      return "Thiếu Tên thiết bị";
    }
    if (!String(pmForm.frequency_type).trim()) {
      return "Thiếu Chu kỳ";
    }
    if (!String(pmForm.frequency_value).trim()) {
      return "Thiếu Giá trị chu kỳ";
    }
    if (!String(pmForm.planned_date).trim()) {
      return "Thiếu Ngày kế hoạch";
    }
    if (!String(pmForm.status).trim()) {
      return "Thiếu Trạng thái";
    }
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
          message: "Tạo kế hoạch PM thành công",
        });
      } else {
        await axios.put(`${API_BASE}/pm-plans/${editingPmId}`, payload);
        setNotice({
          type: "success",
          message: `Cập nhật kế hoạch PM #${editingPmId} thành công`,
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
          : "Backend trả lỗi khi lưu kế hoạch PM.";

      setNotice({
        type: "error",
        message: `Lưu kế hoạch PM thất bại\n${detail}`,
      });
    } finally {
      setSavingPm(false);
    }
  };

  const handleDeletePm = async (item) => {
    const confirmed = window.confirm(`Anh có chắc muốn xóa kế hoạch PM #${item.pm_id} không?`);
    if (!confirmed) return;

    try {
      setSavingPm(true);
      await axios.delete(`${API_BASE}/pm-plans/${item.pm_id}`);
      setNotice({
        type: "success",
        message: `Đã xóa kế hoạch PM #${item.pm_id}`,
      });
      loadPmPlans();
    } catch (err) {
      console.error(err);
      const detail =
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : "Backend trả lỗi khi xóa kế hoạch PM.";

      setNotice({
        type: "error",
        message: `Xóa kế hoạch PM thất bại\n${detail}`,
      });
    } finally {
      setSavingPm(false);
    }
  };

  const filteredDevices = useMemo(() => {
    return devices.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        (item.equipment_code || "").toLowerCase().includes(keyword) ||
        (item.equipment_name_vi || "").toLowerCase().includes(keyword) ||
        (item.csv_power_spec || "").toLowerCase().includes(keyword) ||
        (item.csv_department || "").toLowerCase().includes(keyword) ||
        (item.csv_area || "").toLowerCase().includes(keyword) ||
        (item.csv_unit || "").toLowerCase().includes(keyword) ||
        String(item.csv_quantity || "").toLowerCase().includes(keyword) ||
        (item.csv_owner_name || "").toLowerCase().includes(keyword)
      );
    });
  }, [devices, search]);

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

  const totalDevices = devices.length;
  const activeDevices = devices.filter((d) => d.status === "active").length;
  const stoppedDevices = devices.filter((d) => d.status === "inactive").length;
  const pmTotal = pmPlans.length;

  const renderDevicesContent = () => {
    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: 18,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
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
              Danh mục thiết bị
            </div>
            <div style={{ color: "#6b7280" }}>
              Hiển thị đầy đủ cột theo file CSV
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <label
              style={{
                background: importing ? "#9ca3af" : "#2563eb",
                color: "#ffffff",
                borderRadius: 12,
                padding: "12px 16px",
                cursor: importing ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {importing ? "Đang import..." : "Import danh mục thiết bị (.CSV)"}
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCsv}
                disabled={importing}
                style={{ display: "none" }}
              />
            </label>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã máy, tên máy, thông số, khu vực..."
              style={{
                minWidth: 360,
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #d1d5db",
                outline: "none",
              }}
            />
          </div>
        </div>

        {loading && <p>Đang tải dữ liệu thiết bị...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
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
                minWidth: 1820,
                tableLayout: "fixed",
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
                  <th style={{ width: "110px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Mã máy
                  </th>
                  <th style={{ width: "290px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Tên máy móc, thiết bị
                  </th>
                  <th style={{ width: "260px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Thông số kỹ thuật
                  </th>
                  <th style={{ width: "180px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Đơn vị sử dụng
                  </th>
                  <th style={{ width: "170px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Khu vực
                  </th>
                  <th style={{ width: "120px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Đơn vị tính
                  </th>
                  <th style={{ width: "100px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Số lượng
                  </th>
                  <th style={{ width: "150px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Trạng thái
                  </th>
                  <th style={{ width: "180px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Người phụ trách
                  </th>
                  <th style={{ width: "220px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((item) => (
                  <tr key={item.equipment_id} style={{ height: 74 }}>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #f3f4f6",
                        fontWeight: 700,
                        verticalAlign: "top",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.equipment_code}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #f3f4f6",
                        verticalAlign: "top",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.equipment_name_vi}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #f3f4f6",
                        verticalAlign: "top",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.csv_power_spec || ""}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #f3f4f6",
                        verticalAlign: "top",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.csv_department || ""}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #f3f4f6",
                        verticalAlign: "top",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.csv_area || ""}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #f3f4f6",
                        verticalAlign: "top",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.csv_unit || ""}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #f3f4f6",
                        verticalAlign: "top",
                        textAlign: "center",
                      }}
                    >
                      {item.csv_quantity ?? ""}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #f3f4f6",
                        verticalAlign: "top",
                      }}
                    >
                      <StatusBadge status={item.status} />
                    </td>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #f3f4f6",
                        verticalAlign: "top",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.csv_owner_name || ""}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        borderBottom: "1px solid #f3f4f6",
                        verticalAlign: "top",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <ActionButton
                          label="Chi tiết"
                          bg="#2563eb"
                          onClick={() => setSelectedDevice(item)}
                        />
                        <ActionButton
                          label="Sửa"
                          bg="#f59e0b"
                          onClick={() => handleEditDevice(item)}
                        />
                        <ActionButton
                          label="Xóa"
                          bg="#dc2626"
                          onClick={() => handleDeleteDevice(item)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredDevices.length === 0 && (
                  <tr>
                    <td
                      colSpan="10"
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: "#6b7280",
                      }}
                    >
                      Không có dữ liệu thiết bị
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderPmContent = () => {
    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: 18,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
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
              Kế hoạch PM
            </div>
            <div style={{ color: "#6b7280" }}>
              Quản lý kế hoạch bảo trì định kỳ theo thiết bị
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <input
              value={pmSearch}
              onChange={(e) => setPmSearch(e.target.value)}
              placeholder="Tìm theo mã máy, tên thiết bị, chu kỳ, người phụ trách..."
              style={{
                minWidth: 360,
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #d1d5db",
                outline: "none",
              }}
            />

            <ActionButton
              label="+ Tạo kế hoạch PM"
              bg="#2563eb"
              onClick={openCreatePmModal}
              disabled={savingPm}
            />
          </div>
        </div>

        {loadingPm && <p>Đang tải dữ liệu kế hoạch PM...</p>}
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
                minWidth: 1450,
              }}
            >
              <thead style={{ background: "#f9fafb" }}>
                <tr style={{ textAlign: "left" }}>
                  <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 80 }}>ID</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 130 }}>Mã máy</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 280 }}>Tên thiết bị</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 160 }}>Chu kỳ</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 100 }}>Giá trị</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 160 }}>Ngày kế hoạch</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 180 }}>Người phụ trách</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 170 }}>Trạng thái</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #e5e7eb", width: 220 }}>Thao tác</th>
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
                      {formatPmFrequency(item.frequency_type)}
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
                      <StatusBadge status={item.status} />
                    </td>

                    <td style={{ padding: 12, borderBottom: "1px solid #f3f4f6" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <ActionButton
                          label="Sửa"
                          bg="#f59e0b"
                          onClick={() => openEditPmModal(item)}
                          disabled={savingPm}
                        />
                        <ActionButton
                          label="Xóa"
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
                      Không tìm thấy kế hoạch PM phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderPlaceholder = (title) => {
    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: 18,
          padding: 24,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>{title}</div>
        <div style={{ color: "#6b7280", lineHeight: 1.6 }}>
          Khu vực này sẽ làm ở bước tiếp theo.
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    if (activeMenu === "devices") return renderDevicesContent();
    if (activeMenu === "pm") return renderPmContent();
    if (activeMenu === "dashboard") return renderPlaceholder("Dashboard");
    if (activeMenu === "workorders") return renderPlaceholder("Phiếu công việc");
    if (activeMenu === "downtime") return renderPlaceholder("Downtime");
    if (activeMenu === "reports") return renderPlaceholder("Báo cáo");
    return renderPlaceholder("Module");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      <DetailModal item={selectedDevice} onClose={() => setSelectedDevice(null)} />

      <PmPlanModal
        open={pmModalOpen}
        mode={pmModalMode}
        form={pmForm}
        setForm={setPmForm}
        onClose={closePmModal}
        onSubmit={handleSubmitPm}
        savingPm={savingPm}
      />

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside
          style={{
            width: 250,
            background: "#111827",
            color: "#ffffff",
            padding: 20,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 30 }}>QLMMTB</div>

          <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>MENU CHÍNH</div>

          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "devices", label: "Danh mục thiết bị" },
            { key: "pm", label: "Kế hoạch PM" },
            { key: "workorders", label: "Phiếu công việc" },
            { key: "downtime", label: "Downtime" },
            { key: "reports", label: "Báo cáo" },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                marginBottom: 8,
                cursor: "pointer",
                background: activeMenu === item.key ? "#2563eb" : "transparent",
                color: "#ffffff",
                fontWeight: activeMenu === item.key ? 700 : 500,
              }}
            >
              {item.label}
            </div>
          ))}
        </aside>

        <main style={{ flex: 1, padding: 24 }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: 20,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
                Hệ thống quản lý máy móc thiết bị
              </div>
              <div style={{ color: "#6b7280" }}>
                {activeMenu === "devices" && "Tab Danh mục thiết bị đang hiển thị theo dữ liệu CSV"}
                {activeMenu === "pm" && "Tab Kế hoạch PM đã nối CRUD thật với backend"}
                {activeMenu === "dashboard" && "Tổng quan hệ thống"}
                {activeMenu === "workorders" && "Quản lý phiếu công việc"}
                {activeMenu === "downtime" && "Theo dõi downtime"}
                {activeMenu === "reports" && "Báo cáo hệ thống"}
              </div>
            </div>

            <div
              style={{
                background: "#eff6ff",
                color: "#1d4ed8",
                border: "1px solid #bfdbfe",
                borderRadius: 12,
                padding: "10px 14px",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Backend + Database đã kết nối
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <StatCard title="Tổng số thiết bị" value={totalDevices} subtitle="Đọc từ database" />
            <StatCard title="Đang hoạt động" value={activeDevices} subtitle="Thiết bị vận hành" />
            <StatCard title="Dừng hoạt động" value={stoppedDevices} subtitle="Cần xem xét" />
            <StatCard title="Kế hoạch PM v1" value={pmTotal} subtitle="Đọc từ database" />
          </div>

          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}