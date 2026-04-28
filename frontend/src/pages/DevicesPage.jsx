import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "https://qlmmtb-api.onrender.com";

function getTexts(language = "vi") {
  const texts = {
    vi: {
      unknown: "Không rõ",

      statuses: {
        active: "Đang hoạt động",
        inactive: "Dừng hoạt động",
        broken: "Hỏng",
        dismantled: "Tháo dỡ",
        converted: "Chuyển đổi mục đích",
      },

      detailModal: {
        title: "Chi tiết thiết bị",
        subtitle: "Xem nhanh thông tin thiết bị từ danh mục hiện tại",
        equipmentCode: "Mã máy",
        equipmentName: "Tên máy móc, thiết bị",
        spec: "Thông số kỹ thuật",
        department: "Đơn vị sử dụng",
        area: "Khu vực",
        unit: "Đơn vị tính",
        quantity: "Số lượng",
        status: "Trạng thái",
        owner: "Người phụ trách",
      },

      editModal: {
        title: "Sửa thiết bị",
        subtitle: "Cập nhật thông tin thiết bị theo schema backend",
        equipmentCode: "Mã máy",
        equipmentName: "Tên thiết bị",
        status: "Trạng thái",
        spec: "Thông số kỹ thuật",
        department: "Đơn vị sử dụng",
        area: "Khu vực",
        unit: "Đơn vị tính",
        quantity: "Số lượng",
        owner: "Người phụ trách",
        close: "Đóng",
        saving: "Đang lưu...",
        save: "Lưu thiết bị",
      },

      page: {
        title: "Danh mục thiết bị",
        subtitle: "Hiển thị đầy đủ cột theo file CSV",
        importing: "Đang import...",
        importButton: "Import danh mục thiết bị (.CSV)",
        searchPlaceholder: "Tìm theo mã máy, tên máy, thông số, khu vực...",
        loading: "Đang tải dữ liệu thiết bị...",
        noData: "Không có dữ liệu thiết bị",
      },

      table: {
        equipmentCode: "Mã máy",
        equipmentName: "Tên máy móc, thiết bị",
        spec: "Thông số kỹ thuật",
        department: "Đơn vị sử dụng",
        area: "Khu vực",
        unit: "Đơn vị tính",
        quantity: "Số lượng",
        status: "Trạng thái",
        owner: "Người phụ trách",
        actions: "Thao tác",
      },

      buttons: {
        detail: "Chi tiết",
        edit: "Sửa",
        delete: "Xóa",
      },

      messages: {
        loadError: "Không tải được dữ liệu thiết bị từ backend",
        importSuccess: "Import thành công",
        importFile: "File",
        importRows: "Số dòng xử lý",
        importFailed: "Import CSV thất bại. Vui lòng kiểm tra lại file dữ liệu.",
        missingEquipmentId: "Thiếu equipment_id",
        missingEquipmentName: "Thiếu tên thiết bị",
        missingStatus: "Thiếu trạng thái",
        missingSpec: "Thiếu thông số kỹ thuật",
        missingDepartment: "Thiếu đơn vị sử dụng",
        missingArea: "Thiếu khu vực",
        missingUnit: "Thiếu đơn vị tính",
        missingQuantity: "Thiếu số lượng",
        missingOwner: "Thiếu người phụ trách",
        updateSuccess: "Cập nhật thiết bị {code} thành công",
        updateFailed: "Cập nhật thiết bị thất bại",
        updateBackendError: "Backend trả lỗi khi cập nhật thiết bị.",
        deleteConfirm: "Anh có chắc muốn xóa thiết bị {code} - {name} không?",
        deleteSuccess: "Đã xóa thiết bị {code}",
        deleteFailed: "Xóa thiết bị thất bại",
        deleteBackendError: "Backend trả lỗi khi xóa thiết bị.",
      },
    },

    en: {
      unknown: "Unknown",

      statuses: {
        active: "Active",
        inactive: "Inactive",
        broken: "Broken",
        dismantled: "Dismantled",
        converted: "Converted",
      },

      detailModal: {
        title: "Device Details",
        subtitle: "Quick view of device information from the current equipment list",
        equipmentCode: "Equipment Code",
        equipmentName: "Equipment Name",
        spec: "Technical Specification",
        department: "Department",
        area: "Area",
        unit: "Unit",
        quantity: "Quantity",
        status: "Status",
        owner: "Owner",
      },

      editModal: {
        title: "Edit Device",
        subtitle: "Update device information based on backend schema",
        equipmentCode: "Equipment Code",
        equipmentName: "Device Name",
        status: "Status",
        spec: "Technical Specification",
        department: "Department",
        area: "Area",
        unit: "Unit",
        quantity: "Quantity",
        owner: "Owner",
        close: "Close",
        saving: "Saving...",
        save: "Save Device",
      },

      page: {
        title: "Equipment List",
        subtitle: "Display all columns from the CSV file",
        importing: "Importing...",
        importButton: "Import equipment list (.CSV)",
        searchPlaceholder: "Search by code, name, specification, area...",
        loading: "Loading device data...",
        noData: "No device data",
      },

      table: {
        equipmentCode: "Equipment Code",
        equipmentName: "Equipment Name",
        spec: "Technical Specification",
        department: "Department",
        area: "Area",
        unit: "Unit",
        quantity: "Quantity",
        status: "Status",
        owner: "Owner",
        actions: "Actions",
      },

      buttons: {
        detail: "Details",
        edit: "Edit",
        delete: "Delete",
      },

      messages: {
        loadError: "Cannot load device data from backend",
        importSuccess: "Import successful",
        importFile: "File",
        importRows: "Processed rows",
        importFailed: "CSV import failed. Please check the data file again.",
        missingEquipmentId: "Missing equipment_id",
        missingEquipmentName: "Missing device name",
        missingStatus: "Missing status",
        missingSpec: "Missing technical specification",
        missingDepartment: "Missing department",
        missingArea: "Missing area",
        missingUnit: "Missing unit",
        missingQuantity: "Missing quantity",
        missingOwner: "Missing owner",
        updateSuccess: "Device {code} updated successfully",
        updateFailed: "Failed to update device",
        updateBackendError: "Backend returned an error while updating the device.",
        deleteConfirm: "Are you sure you want to delete device {code} - {name}?",
        deleteSuccess: "Deleted device {code}",
        deleteFailed: "Failed to delete device",
        deleteBackendError: "Backend returned an error while deleting the device.",
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

  let bg = "#e5e7eb";
  let color = "#374151";
  let label = status || t.unknown;

  if (status === "active") {
    bg = "#dcfce7";
    color = "#166534";
    label = t.statuses.active;
  } else if (status === "inactive") {
    bg = "#fee2e2";
    color = "#991b1b";
    label = t.statuses.inactive;
  } else if (status === "broken") {
    bg = "#fee2e2";
    color = "#991b1b";
    label = t.statuses.broken;
  } else if (status === "dismantled") {
    bg = "#fef3c7";
    color = "#92400e";
    label = t.statuses.dismantled;
  } else if (status === "converted") {
    bg = "#dbeafe";
    color = "#1d4ed8";
    label = t.statuses.converted;
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

function DetailModal({ item, onClose, language = "vi" }) {
  const t = getTexts(language);

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
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
              {t.detailModal.title}
            </div>
            <div style={{ color: "#6b7280" }}>{t.detailModal.subtitle}</div>
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
          <div style={{ fontWeight: 700 }}>{t.detailModal.equipmentCode}</div>
          <div>{item.equipment_code || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>{t.detailModal.equipmentName}</div>
          <div>{item.equipment_name_vi || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>{t.detailModal.spec}</div>
          <div>{item.csv_power_spec || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>{t.detailModal.department}</div>
          <div>{item.csv_department || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>{t.detailModal.area}</div>
          <div>{item.csv_area || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>{t.detailModal.unit}</div>
          <div>{item.csv_unit || ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>{t.detailModal.quantity}</div>
          <div>{item.csv_quantity ?? ""}</div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>{t.detailModal.status}</div>
          <div>
            <StatusBadge status={item.status} language={language} />
          </div>
        </div>
        <div style={rowStyle}>
          <div style={{ fontWeight: 700 }}>{t.detailModal.owner}</div>
          <div>{item.csv_owner_name || ""}</div>
        </div>
      </div>
    </div>
  );
}

function DeviceEditModal({
  open,
  form,
  setForm,
  onClose,
  onSubmit,
  savingDevice,
  language = "vi",
}) {
  const t = getTexts(language);

  if (!open) return null;

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
        zIndex: 1200,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1000px, 100%)",
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
              {t.editModal.title}
            </div>
            <div style={{ color: "#6b7280" }}>{t.editModal.subtitle}</div>
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
            t.editModal.equipmentCode,
            <input value={form.equipment_code} style={inputStyle} disabled />
          )}

          {renderField(
            t.editModal.equipmentName,
            <input
              value={form.equipment_name_vi}
              onChange={(e) => setForm((prev) => ({ ...prev, equipment_name_vi: e.target.value }))}
              style={inputStyle}
            />
          )}

          {renderField(
            t.editModal.status,
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              style={inputStyle}
            >
              <option value="active">{t.statuses.active}</option>
              <option value="inactive">{t.statuses.inactive}</option>
              <option value="broken">{t.statuses.broken}</option>
              <option value="dismantled">{t.statuses.dismantled}</option>
              <option value="converted">{t.statuses.converted}</option>
            </select>
          )}

          {renderField(
            t.editModal.spec,
            <input
              value={form.csv_power_spec}
              onChange={(e) => setForm((prev) => ({ ...prev, csv_power_spec: e.target.value }))}
              style={inputStyle}
            />
          )}

          {renderField(
            t.editModal.department,
            <input
              value={form.csv_department}
              onChange={(e) => setForm((prev) => ({ ...prev, csv_department: e.target.value }))}
              style={inputStyle}
            />
          )}

          {renderField(
            t.editModal.area,
            <input
              value={form.csv_area}
              onChange={(e) => setForm((prev) => ({ ...prev, csv_area: e.target.value }))}
              style={inputStyle}
            />
          )}

          {renderField(
            t.editModal.unit,
            <input
              value={form.csv_unit}
              onChange={(e) => setForm((prev) => ({ ...prev, csv_unit: e.target.value }))}
              style={inputStyle}
            />
          )}

          {renderField(
            t.editModal.quantity,
            <input
              type="number"
              min="0"
              step="1"
              value={form.csv_quantity}
              onChange={(e) => setForm((prev) => ({ ...prev, csv_quantity: e.target.value }))}
              style={inputStyle}
            />
          )}

          <div style={{ gridColumn: "1 / -1" }}>
            {renderField(
              t.editModal.owner,
              <input
                value={form.csv_owner_name}
                onChange={(e) => setForm((prev) => ({ ...prev, csv_owner_name: e.target.value }))}
                style={inputStyle}
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
            disabled={savingDevice}
            style={{
              background: "#f3f4f6",
              color: "#111827",
              border: "none",
              borderRadius: 12,
              padding: "12px 16px",
              cursor: savingDevice ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {t.editModal.close}
          </button>

          <button
            onClick={onSubmit}
            disabled={savingDevice}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: 12,
              padding: "12px 16px",
              cursor: savingDevice ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {savingDevice ? t.editModal.saving : t.editModal.save}
          </button>
        </div>
      </div>
    </div>
  );
}

function getInitialDeviceForm() {
  return {
    equipment_id: "",
    equipment_code: "",
    equipment_name_vi: "",
    status: "active",
    csv_power_spec: "",
    csv_department: "",
    csv_area: "",
    csv_unit: "",
    csv_quantity: "",
    csv_owner_name: "",
  };
}

export default function DevicesPage({ onStatsChange, language = "vi" }) {
  const t = getTexts(language);

  const [search, setSearch] = useState("");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [savingDevice, setSavingDevice] = useState(false);
  const [notice, setNotice] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [deviceForm, setDeviceForm] = useState(getInitialDeviceForm());

  const loadDevices = () => {
    setLoading(true);
    setError("");

    axios
      .get(`${API_BASE}/equipments/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setDevices(data);
        setLoading(false);

        if (onStatsChange) {
          onStatsChange({
            total: data.length,
            active: data.filter((d) => d.status === "active").length,
            inactive: data.filter((d) => d.status === "inactive").length,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setError(t.messages.loadError);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDevices();
  }, [language]);

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
        message: `${t.messages.importSuccess}
${t.messages.importFile}: ${res.data.filename}
${t.messages.importRows}: ${res.data.rows_processed}`,
      });

      loadDevices();
    } catch (err) {
      console.error(err);
      setNotice({
        type: "error",
        message: t.messages.importFailed,
      });
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  const openEditDeviceModal = (item) => {
    setDeviceForm({
      equipment_id: String(item.equipment_id ?? ""),
      equipment_code: item.equipment_code ?? "",
      equipment_name_vi: item.equipment_name_vi ?? "",
      status: item.status ?? "active",
      csv_power_spec: item.csv_power_spec ?? "",
      csv_department: item.csv_department ?? "",
      csv_area: item.csv_area ?? "",
      csv_unit: item.csv_unit ?? "",
      csv_quantity: String(item.csv_quantity ?? ""),
      csv_owner_name: item.csv_owner_name ?? "",
    });
    setDeviceModalOpen(true);
  };

  const closeDeviceModal = () => {
    if (savingDevice) return;
    setDeviceModalOpen(false);
    setDeviceForm(getInitialDeviceForm());
  };

  const validateDeviceForm = () => {
    if (!String(deviceForm.equipment_id).trim()) return t.messages.missingEquipmentId;
    if (!String(deviceForm.equipment_name_vi).trim()) return t.messages.missingEquipmentName;
    if (!String(deviceForm.status).trim()) return t.messages.missingStatus;
    if (!String(deviceForm.csv_power_spec).trim()) return t.messages.missingSpec;
    if (!String(deviceForm.csv_department).trim()) return t.messages.missingDepartment;
    if (!String(deviceForm.csv_area).trim()) return t.messages.missingArea;
    if (!String(deviceForm.csv_unit).trim()) return t.messages.missingUnit;
    if (String(deviceForm.csv_quantity).trim() === "") return t.messages.missingQuantity;
    if (!String(deviceForm.csv_owner_name).trim()) return t.messages.missingOwner;
    return "";
  };

  const buildDevicePayload = () => {
    return {
      equipment_name_vi: String(deviceForm.equipment_name_vi).trim(),
      status: String(deviceForm.status).trim(),
      csv_power_spec: String(deviceForm.csv_power_spec).trim(),
      csv_department: String(deviceForm.csv_department).trim(),
      csv_area: String(deviceForm.csv_area).trim(),
      csv_unit: String(deviceForm.csv_unit).trim(),
      csv_quantity: Number(deviceForm.csv_quantity),
      csv_owner_name: String(deviceForm.csv_owner_name).trim(),
    };
  };

  const handleSubmitDevice = async () => {
    const validationMessage = validateDeviceForm();
    if (validationMessage) {
      setNotice({
        type: "error",
        message: validationMessage,
      });
      return;
    }

    try {
      setSavingDevice(true);
      setNotice(null);

      const payload = buildDevicePayload();
      const equipmentId = Number(deviceForm.equipment_id);

      await axios.put(`${API_BASE}/equipments/${equipmentId}`, payload);

      setNotice({
        type: "success",
        message: formatMessage(t.messages.updateSuccess, {
          code: deviceForm.equipment_code,
        }),
      });

      closeDeviceModal();
      loadDevices();
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
      setSavingDevice(false);
    }
  };

  const handleDeleteDevice = async (item) => {
    const confirmed = window.confirm(
      formatMessage(t.messages.deleteConfirm, {
        code: item.equipment_code,
        name: item.equipment_name_vi,
      })
    );

    if (!confirmed) return;

    try {
      setSavingDevice(true);
      await axios.delete(`${API_BASE}/equipments/${item.equipment_id}`);
      setNotice({
        type: "success",
        message: formatMessage(t.messages.deleteSuccess, {
          code: item.equipment_code,
        }),
      });
      loadDevices();
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
      setSavingDevice(false);
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

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <DetailModal
        item={selectedDevice}
        onClose={() => setSelectedDevice(null)}
        language={language}
      />

      <DeviceEditModal
        open={deviceModalOpen}
        form={deviceForm}
        setForm={setDeviceForm}
        onClose={closeDeviceModal}
        onSubmit={handleSubmitDevice}
        savingDevice={savingDevice}
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
            {importing ? t.page.importing : t.page.importButton}
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
            placeholder={t.page.searchPlaceholder}
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

      {loading && <p>{t.page.loading}</p>}
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
                  {t.table.equipmentCode}
                </th>
                <th style={{ width: "290px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                  {t.table.equipmentName}
                </th>
                <th style={{ width: "260px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                  {t.table.spec}
                </th>
                <th style={{ width: "180px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                  {t.table.department}
                </th>
                <th style={{ width: "170px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                  {t.table.area}
                </th>
                <th style={{ width: "120px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                  {t.table.unit}
                </th>
                <th style={{ width: "100px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                  {t.table.quantity}
                </th>
                <th style={{ width: "150px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                  {t.table.status}
                </th>
                <th style={{ width: "180px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                  {t.table.owner}
                </th>
                <th style={{ width: "220px", padding: 12, borderBottom: "1px solid #e5e7eb" }}>
                  {t.table.actions}
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
                    <StatusBadge status={item.status} language={language} />
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
                        label={t.buttons.detail}
                        bg="#2563eb"
                        onClick={() => setSelectedDevice(item)}
                      />
                      <ActionButton
                        label={t.buttons.edit}
                        bg="#f59e0b"
                        onClick={() => openEditDeviceModal(item)}
                        disabled={savingDevice}
                      />
                      <ActionButton
                        label={t.buttons.delete}
                        bg="#dc2626"
                        onClick={() => handleDeleteDevice(item)}
                        disabled={savingDevice}
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