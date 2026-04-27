import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

function getTexts(language = "vi") {
  const texts = {
    vi: {
      emptyData: "Không có dữ liệu",
      unknown: "Không rõ",

      page: {
        title: "Báo cáo",
        subtitle:
          "Tổng hợp dữ liệu thật từ backend, có thêm bộ lọc theo tháng và xuất dữ liệu",
        loading: "Đang tải dữ liệu báo cáo...",
        loadError: "Không tải được dữ liệu báo cáo từ backend",
      },

      filters: {
        title: "Bộ lọc báo cáo",
        subtitle: "Lọc dữ liệu phiếu công việc, PM và downtime trước khi xem tổng hợp",
        monthAll: "Tháng: tất cả",
        workTypeAll: "Loại phiếu công việc: tất cả",
        workStatusAll: "Trạng thái work order: tất cả",
        downtimeTypeAll: "Loại downtime: tất cả",
        areaAll: "Khu vực downtime: tất cả",
        all: "Tất cả",
      },

      buttons: {
        exportSummaryCsv: "Export tổng hợp CSV",
        exportDowntimeCsv: "Export downtime CSV",
        printPdf: "In / Lưu PDF",
      },

      statCards: {
        totalDevices: "Tổng thiết bị",
        totalDevicesSub: "Thiết bị toàn hệ thống",
        totalPmPlans: "Kế hoạch PM",
        totalPmPlansSub: "Sau khi lọc tháng",
        totalWorkOrders: "Phiếu công việc",
        totalWorkOrdersSub: "Sau khi lọc",
        totalDowntimes: "Phiếu downtime",
        totalDowntimesSub: "Sau khi lọc",
        activeDevices: "Thiết bị hoạt động",
        activeDevicesSub: "Status = active",
        inactiveDevices: "Thiết bị dừng",
        inactiveDevicesSub: "Status = inactive",
        workOpen: "WO mở",
        workOpenSub: "Sau khi lọc",
        totalDowntimeMinutes: "Tổng phút downtime",
        totalDowntimeMinutesSub: "Sau khi lọc",
      },

      workTypes: {
        PM: "PM",
        BC: "BC",
        CM: "CM",
        INSPECTION: "Inspection",
      },

      workStatuses: {
        open: "Mở",
        in_progress: "Đang thực hiện",
        done: "Hoàn thành",
        cancelled: "Đã hủy",
      },

      pmStatuses: {
        planned: "Kế hoạch",
        in_progress: "Đang thực hiện",
        done: "Hoàn thành",
        overdue: "Quá hạn",
        cancelled: "Đã hủy",
      },

      deviceStatuses: {
        active: "Đang hoạt động",
        inactive: "Dừng hoạt động",
        broken: "Hỏng",
        dismantled: "Tháo dỡ",
        converted: "Chuyển đổi",
      },

      downtimeTypes: {
        mechanical: "Cơ khí",
        electrical: "Điện",
        instrument: "Điều khiển",
        operation: "Vận hành",
        other: "Khác",
      },

      charts: {
        workTypeTitle: "Biểu đồ phiếu công việc theo loại",
        workTypeSubtitle: "PM / BC / CM / Inspection",
        workStatusTitle: "Biểu đồ phiếu công việc theo trạng thái",
        workStatusSubtitle: "Open / In Progress / Done / Cancelled",
        downtimeTypeTitle: "Biểu đồ downtime theo loại",
        downtimeTypeSubtitle: "Cơ khí / Điện / Điều khiển / Vận hành / Khác",
        topDowntimeAreasTitle: "Biểu đồ top khu vực downtime",
        topDowntimeAreasSubtitle: "Tính theo tổng phút dừng",
        minuteUnit: "phút",
      },

      tables: {
        pmReportTitle: "Báo cáo riêng PM",
        pmReportSubtitle: "Thống kê kế hoạch PM theo trạng thái",
        pmHeaders: ["Trạng thái PM", "Số lượng"],

        deviceReportTitle: "Báo cáo thiết bị",
        deviceReportSubtitle: "Thiết bị theo trạng thái",
        deviceHeaders: ["Trạng thái", "Số lượng"],

        workTypeReportTitle: "Báo cáo riêng Work Orders",
        workTypeReportSubtitle: "Theo loại phiếu",
        workTypeHeaders: ["Loại phiếu", "Số lượng"],

        workStatusReportTitle: "Báo cáo Work Orders theo trạng thái",
        workStatusReportSubtitle: "Sau khi lọc",
        workStatusHeaders: ["Trạng thái", "Số lượng"],

        downtimeReportTitle: "Báo cáo riêng Downtime",
        downtimeReportSubtitle: "Theo loại downtime",
        downtimeHeaders: ["Loại downtime", "Số lượng"],

        summaryTitle: "Tổng quan sau lọc",
        summarySubtitle: "Số liệu cuối cùng đang hiển thị",

        topEquipmentTitle: "Top thiết bị downtime nhiều",
        topEquipmentSubtitle: "Xếp theo tổng phút downtime",
        topEquipmentHeaders: ["Thiết bị", "Số phiếu", "Tổng phút dừng"],

        topAreaTitle: "Top khu vực downtime nhiều",
        topAreaSubtitle: "Xếp theo tổng phút downtime",
        topAreaHeaders: ["Khu vực", "Số phiếu", "Tổng phút dừng"],
      },

      summary: {
        reportMonth: "Tháng báo cáo",
        workType: "Loại phiếu công việc",
        workStatus: "Trạng thái work order",
        downtimeType: "Loại downtime",
        downtimeArea: "Khu vực downtime",
        totalDowntimeMinutes: "Tổng phút downtime",
      },

      csv: {
        summaryFile: "bao-cao-tong-hop.csv",
        downtimeFile: "bao-cao-downtime.csv",
        summaryHeaders: ["Chỉ số", "Giá trị"],
        totalDevices: "Tổng thiết bị",
        activeDevices: "Thiết bị hoạt động",
        inactiveDevices: "Thiết bị dừng",
        totalPmPlans: "Kế hoạch PM",
        totalWorkOrders: "Phiếu công việc",
        totalDowntimes: "Phiếu downtime",
        totalDowntimeMinutes: "Tổng phút downtime",
        workOpen: "WO mở",
        workInProgress: "WO đang thực hiện",
        workDone: "WO hoàn thành",
        workCancelled: "WO đã hủy",

        downtimeHeaders: [
          "Mã phiếu",
          "EQ ID",
          "Mã máy",
          "Thiết bị",
          "Khu vực",
          "Loại downtime",
          "Bắt đầu",
          "Kết thúc",
          "Phút dừng",
          "Nguyên nhân",
          "Phụ trách",
          "Trạng thái",
        ],
      },
    },

    en: {
      emptyData: "No data",
      unknown: "Unknown",

      page: {
        title: "Reports",
        subtitle:
          "Aggregate real backend data with monthly filters and data export options",
        loading: "Loading report data...",
        loadError: "Cannot load report data from backend",
      },

      filters: {
        title: "Report Filters",
        subtitle: "Filter work orders, PM plans, and downtimes before viewing the summary",
        monthAll: "Month: all",
        workTypeAll: "Work order type: all",
        workStatusAll: "Work order status: all",
        downtimeTypeAll: "Downtime type: all",
        areaAll: "Downtime area: all",
        all: "All",
      },

      buttons: {
        exportSummaryCsv: "Export summary CSV",
        exportDowntimeCsv: "Export downtime CSV",
        printPdf: "Print / Save PDF",
      },

      statCards: {
        totalDevices: "Total Devices",
        totalDevicesSub: "All system devices",
        totalPmPlans: "PM Plans",
        totalPmPlansSub: "After month filter",
        totalWorkOrders: "Work Orders",
        totalWorkOrdersSub: "After filtering",
        totalDowntimes: "Downtime Tickets",
        totalDowntimesSub: "After filtering",
        activeDevices: "Active Devices",
        activeDevicesSub: "Status = active",
        inactiveDevices: "Inactive Devices",
        inactiveDevicesSub: "Status = inactive",
        workOpen: "Open WOs",
        workOpenSub: "After filtering",
        totalDowntimeMinutes: "Total Downtime Minutes",
        totalDowntimeMinutesSub: "After filtering",
      },

      workTypes: {
        PM: "PM",
        BC: "BC",
        CM: "CM",
        INSPECTION: "Inspection",
      },

      workStatuses: {
        open: "Open",
        in_progress: "In Progress",
        done: "Completed",
        cancelled: "Cancelled",
      },

      pmStatuses: {
        planned: "Planned",
        in_progress: "In Progress",
        done: "Completed",
        overdue: "Overdue",
        cancelled: "Cancelled",
      },

      deviceStatuses: {
        active: "Active",
        inactive: "Inactive",
        broken: "Broken",
        dismantled: "Dismantled",
        converted: "Converted",
      },

      downtimeTypes: {
        mechanical: "Mechanical",
        electrical: "Electrical",
        instrument: "Instrument",
        operation: "Operation",
        other: "Other",
      },

      charts: {
        workTypeTitle: "Work Orders by Type",
        workTypeSubtitle: "PM / BC / CM / Inspection",
        workStatusTitle: "Work Orders by Status",
        workStatusSubtitle: "Open / In Progress / Done / Cancelled",
        downtimeTypeTitle: "Downtime by Type",
        downtimeTypeSubtitle: "Mechanical / Electrical / Instrument / Operation / Other",
        topDowntimeAreasTitle: "Top Downtime Areas",
        topDowntimeAreasSubtitle: "Based on total downtime minutes",
        minuteUnit: "min",
      },

      tables: {
        pmReportTitle: "PM Report",
        pmReportSubtitle: "PM plans by status",
        pmHeaders: ["PM Status", "Quantity"],

        deviceReportTitle: "Device Report",
        deviceReportSubtitle: "Devices by status",
        deviceHeaders: ["Status", "Quantity"],

        workTypeReportTitle: "Work Orders by Type",
        workTypeReportSubtitle: "Grouped by work order type",
        workTypeHeaders: ["Work Order Type", "Quantity"],

        workStatusReportTitle: "Work Orders by Status",
        workStatusReportSubtitle: "After filtering",
        workStatusHeaders: ["Status", "Quantity"],

        downtimeReportTitle: "Downtime Report",
        downtimeReportSubtitle: "Grouped by downtime type",
        downtimeHeaders: ["Downtime Type", "Quantity"],

        summaryTitle: "Filtered Summary",
        summarySubtitle: "Final displayed values",

        topEquipmentTitle: "Top Downtime Equipment",
        topEquipmentSubtitle: "Ranked by total downtime minutes",
        topEquipmentHeaders: ["Equipment", "Tickets", "Total Downtime Minutes"],

        topAreaTitle: "Top Downtime Areas",
        topAreaSubtitle: "Ranked by total downtime minutes",
        topAreaHeaders: ["Area", "Tickets", "Total Downtime Minutes"],
      },

      summary: {
        reportMonth: "Report Month",
        workType: "Work Order Type",
        workStatus: "Work Order Status",
        downtimeType: "Downtime Type",
        downtimeArea: "Downtime Area",
        totalDowntimeMinutes: "Total Downtime Minutes",
      },

      csv: {
        summaryFile: "summary-report.csv",
        downtimeFile: "downtime-report.csv",
        summaryHeaders: ["Metric", "Value"],
        totalDevices: "Total Devices",
        activeDevices: "Active Devices",
        inactiveDevices: "Inactive Devices",
        totalPmPlans: "PM Plans",
        totalWorkOrders: "Work Orders",
        totalDowntimes: "Downtime Tickets",
        totalDowntimeMinutes: "Total Downtime Minutes",
        workOpen: "Open WOs",
        workInProgress: "WOs In Progress",
        workDone: "Completed WOs",
        workCancelled: "Cancelled WOs",

        downtimeHeaders: [
          "Ticket Code",
          "EQ ID",
          "Equipment Code",
          "Equipment",
          "Area",
          "Downtime Type",
          "Start Time",
          "End Time",
          "Downtime Minutes",
          "Cause",
          "Owner",
          "Status",
        ],
      },
    },
  };

  return texts[language] || texts.vi;
}

function StatCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        background: "#f9fafb",
        minHeight: 84,
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#9ca3af" }}>{subtitle}</div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        background: "#ffffff",
        padding: 14,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{title}</div>
      {subtitle ? (
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>{subtitle}</div>
      ) : null}
      {children}
    </div>
  );
}

function TableCard({ title, subtitle, headers, rows, emptyText }) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
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
            minWidth: 560,
          }}
        >
          <thead style={{ background: "#f9fafb" }}>
            <tr style={{ textAlign: "left" }}>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{
                    padding: 10,
                    borderBottom: "1px solid #e5e7eb",
                    fontSize: 13,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, idx) => (
                <tr key={idx}>
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      style={{
                        padding: 10,
                        borderBottom: "1px solid #f3f4f6",
                        fontSize: 13,
                        verticalAlign: "top",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  style={{
                    padding: 16,
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: 13,
                  }}
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function ColorBarChart({ title, subtitle, data, unit = "", color = "#2563eb", emptyText }) {
  const maxValue = Math.max(...data.map((x) => x.value), 0);

  return (
    <SectionCard title={title} subtitle={subtitle}>
      {data.length === 0 ? (
        <div style={{ color: "#6b7280", fontSize: 13 }}>{emptyText}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map((item) => {
            const percent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

            return (
              <div key={item.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 4,
                    fontSize: 13,
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#374151" }}>{item.label}</div>
                  <div style={{ fontWeight: 700, color: "#111827" }}>
                    {item.value} {unit}
                  </div>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: 14,
                    background: "#eef2f7",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background: color,
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

function parseDate(value) {
  if (!value) return null;
  const text = String(value).trim().replace(" ", "T");
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function minutesBetween(start, end) {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s || !e) return 0;
  const diff = e.getTime() - s.getTime();
  if (diff <= 0) return 0;
  return Math.round(diff / 60000);
}

function formatMinutes(value, language = "vi") {
  return language === "en" ? `${value} min` : `${value} phút`;
}

function getMonthValueFromDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function withinMonth(dateValue, monthFilter) {
  if (!monthFilter || monthFilter === "ALL") return true;
  const date = parseDate(dateValue);
  if (!date) return false;
  return getMonthValueFromDate(date) === monthFilter;
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function downloadCsv(filename, headers, rows) {
  const content = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ReportsPage({ language = "vi" }) {
  const t = getTexts(language);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [equipments, setEquipments] = useState([]);
  const [pmPlans, setPmPlans] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [downtimes, setDowntimes] = useState([]);

  const [reportMonth, setReportMonth] = useState("ALL");
  const [workTypeFilter, setWorkTypeFilter] = useState("ALL");
  const [workStatusFilter, setWorkStatusFilter] = useState("ALL");
  const [downtimeTypeFilter, setDowntimeTypeFilter] = useState("ALL");
  const [areaFilter, setAreaFilter] = useState("ALL");

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        setNotice("");

        const [eqRes, pmRes, woRes, dtRes] = await Promise.all([
          axios.get(`${API_BASE}/equipments/`),
          axios.get(`${API_BASE}/pm-plans/`),
          axios.get(`${API_BASE}/work-orders/`),
          axios.get(`${API_BASE}/downtimes/`),
        ]);

        setEquipments(Array.isArray(eqRes.data) ? eqRes.data : []);
        setPmPlans(Array.isArray(pmRes.data) ? pmRes.data : []);
        setWorkOrders(Array.isArray(woRes.data) ? woRes.data : []);
        setDowntimes(Array.isArray(dtRes.data) ? dtRes.data : []);
      } catch (err) {
        console.error(err);
        setNotice(t.page.loadError);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [language]);

  const monthOptions = useMemo(() => {
    const monthSet = new Set();

    pmPlans.forEach((item) => {
      const date = parseDate(item.planned_date);
      if (date) monthSet.add(getMonthValueFromDate(date));
    });

    workOrders.forEach((item) => {
      const date = parseDate(item.created_date);
      if (date) monthSet.add(getMonthValueFromDate(date));
    });

    downtimes.forEach((item) => {
      const date = parseDate(item.start_time);
      if (date) monthSet.add(getMonthValueFromDate(date));
    });

    return Array.from(monthSet).sort().reverse();
  }, [pmPlans, workOrders, downtimes]);

  const areaOptions = useMemo(() => {
    const unique = Array.from(
      new Set(downtimes.map((x) => String(x.area || "").trim()).filter(Boolean))
    );
    return unique.sort((a, b) => a.localeCompare(b));
  }, [downtimes]);

  const filteredPmPlans = useMemo(() => {
    return pmPlans.filter((item) => withinMonth(item.planned_date, reportMonth));
  }, [pmPlans, reportMonth]);

  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter((item) => {
      const matchMonth = withinMonth(item.created_date, reportMonth);
      const matchType = workTypeFilter === "ALL" ? true : item.work_type === workTypeFilter;
      const matchStatus = workStatusFilter === "ALL" ? true : item.status === workStatusFilter;
      return matchMonth && matchType && matchStatus;
    });
  }, [workOrders, reportMonth, workTypeFilter, workStatusFilter]);

  const filteredDowntimes = useMemo(() => {
    return downtimes.filter((item) => {
      const matchMonth = withinMonth(item.start_time, reportMonth);
      const matchType =
        downtimeTypeFilter === "ALL" ? true : item.downtime_type === downtimeTypeFilter;
      const matchArea = areaFilter === "ALL" ? true : item.area === areaFilter;
      return matchMonth && matchType && matchArea;
    });
  }, [downtimes, reportMonth, downtimeTypeFilter, areaFilter]);

  const overviewStats = useMemo(() => {
    const activeDevices = equipments.filter((x) => x.status === "active").length;
    const inactiveDevices = equipments.filter((x) => x.status === "inactive").length;
    const totalDowntimeMinutes = filteredDowntimes.reduce(
      (sum, item) => sum + minutesBetween(item.start_time, item.end_time),
      0
    );

    return {
      totalDevices: equipments.length,
      activeDevices,
      inactiveDevices,
      totalPmPlans: filteredPmPlans.length,
      totalWorkOrders: filteredWorkOrders.length,
      totalDowntimes: filteredDowntimes.length,
      totalDowntimeMinutes,
      workOpen: filteredWorkOrders.filter((x) => x.status === "open").length,
      workInProgress: filteredWorkOrders.filter((x) => x.status === "in_progress").length,
      workDone: filteredWorkOrders.filter((x) => x.status === "done").length,
      workCancelled: filteredWorkOrders.filter((x) => x.status === "cancelled").length,
    };
  }, [equipments, filteredPmPlans, filteredWorkOrders, filteredDowntimes]);

  const pmStatusRows = useMemo(() => {
    const counts = {
      planned: 0,
      in_progress: 0,
      done: 0,
      overdue: 0,
      cancelled: 0,
    };

    filteredPmPlans.forEach((item) => {
      const key = String(item.status || "").toLowerCase();
      if (counts[key] !== undefined) counts[key] += 1;
    });

    return [
      [t.pmStatuses.planned, counts.planned],
      [t.pmStatuses.in_progress, counts.in_progress],
      [t.pmStatuses.done, counts.done],
      [t.pmStatuses.overdue, counts.overdue],
      [t.pmStatuses.cancelled, counts.cancelled],
    ];
  }, [filteredPmPlans, language]);

  const workTypeStats = useMemo(() => {
    const counts = { PM: 0, BC: 0, CM: 0, INSPECTION: 0 };
    filteredWorkOrders.forEach((item) => {
      const key = String(item.work_type || "").toUpperCase();
      if (counts[key] !== undefined) counts[key] += 1;
    });
    return counts;
  }, [filteredWorkOrders]);

  const workStatusStats = useMemo(() => {
    return {
      open: filteredWorkOrders.filter((x) => x.status === "open").length,
      in_progress: filteredWorkOrders.filter((x) => x.status === "in_progress").length,
      done: filteredWorkOrders.filter((x) => x.status === "done").length,
      cancelled: filteredWorkOrders.filter((x) => x.status === "cancelled").length,
    };
  }, [filteredWorkOrders]);

  const downtimeTypeStats = useMemo(() => {
    return {
      mechanical: filteredDowntimes.filter((x) => x.downtime_type === "mechanical").length,
      electrical: filteredDowntimes.filter((x) => x.downtime_type === "electrical").length,
      instrument: filteredDowntimes.filter((x) => x.downtime_type === "instrument").length,
      operation: filteredDowntimes.filter((x) => x.downtime_type === "operation").length,
      other: filteredDowntimes.filter((x) => x.downtime_type === "other").length,
    };
  }, [filteredDowntimes]);

  const topDowntimeEquipments = useMemo(() => {
    const map = new Map();

    filteredDowntimes.forEach((item) => {
      const key = item.equipment_name || item.equipment_code || t.unknown;
      const current = map.get(key) || { count: 0, minutes: 0 };
      current.count += 1;
      current.minutes += minutesBetween(item.start_time, item.end_time);
      map.set(key, current);
    });

    return Array.from(map.entries())
      .map(([name, info]) => ({
        name,
        count: info.count,
        minutes: info.minutes,
      }))
      .sort((a, b) => {
        if (b.minutes !== a.minutes) return b.minutes - a.minutes;
        return b.count - a.count;
      })
      .slice(0, 10);
  }, [filteredDowntimes, language]);

  const topDowntimeAreas = useMemo(() => {
    const map = new Map();

    filteredDowntimes.forEach((item) => {
      const key = item.area || t.unknown;
      const current = map.get(key) || { count: 0, minutes: 0 };
      current.count += 1;
      current.minutes += minutesBetween(item.start_time, item.end_time);
      map.set(key, current);
    });

    return Array.from(map.entries())
      .map(([area, info]) => ({
        area,
        count: info.count,
        minutes: info.minutes,
      }))
      .sort((a, b) => {
        if (b.minutes !== a.minutes) return b.minutes - a.minutes;
        return b.count - a.count;
      })
      .slice(0, 10);
  }, [filteredDowntimes, language]);

  const deviceStatusRows = useMemo(() => {
    const map = new Map();

    equipments.forEach((item) => {
      const raw = String(item.status || "").toLowerCase();
      let label = t.unknown;
      if (raw === "active") label = t.deviceStatuses.active;
      else if (raw === "inactive") label = t.deviceStatuses.inactive;
      else if (raw === "broken") label = t.deviceStatuses.broken;
      else if (raw === "dismantled") label = t.deviceStatuses.dismantled;
      else if (raw === "converted") label = t.deviceStatuses.converted;

      map.set(label, (map.get(label) || 0) + 1);
    });

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => [label, count]);
  }, [equipments, language]);

  const handleExportSummaryCsv = () => {
    const headers = t.csv.summaryHeaders;
    const rows = [
      [t.csv.totalDevices, overviewStats.totalDevices],
      [t.csv.activeDevices, overviewStats.activeDevices],
      [t.csv.inactiveDevices, overviewStats.inactiveDevices],
      [t.csv.totalPmPlans, overviewStats.totalPmPlans],
      [t.csv.totalWorkOrders, overviewStats.totalWorkOrders],
      [t.csv.totalDowntimes, overviewStats.totalDowntimes],
      [t.csv.totalDowntimeMinutes, overviewStats.totalDowntimeMinutes],
      [t.csv.workOpen, overviewStats.workOpen],
      [t.csv.workInProgress, overviewStats.workInProgress],
      [t.csv.workDone, overviewStats.workDone],
      [t.csv.workCancelled, overviewStats.workCancelled],
    ];
    downloadCsv(t.csv.summaryFile, headers, rows);
  };

  const handleExportDowntimeCsv = () => {
    const headers = t.csv.downtimeHeaders;

    const rows = filteredDowntimes.map((item) => [
      item.ticket_code,
      item.equipment_id ?? "",
      item.equipment_code ?? "",
      item.equipment_name ?? "",
      item.area ?? "",
      item.downtime_type ?? "",
      item.start_time ?? "",
      item.end_time ?? "",
      minutesBetween(item.start_time, item.end_time),
      item.cause ?? "",
      item.owner_name ?? "",
      item.status ?? "",
    ]);

    downloadCsv(t.csv.downtimeFile, headers, rows);
  };

  const handlePrintPdf = () => {
    window.print();
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
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t.page.title}</div>
        <div style={{ color: "#6b7280", fontSize: 13 }}>{t.page.subtitle}</div>
      </div>

      {notice ? (
        <div
          style={{
            marginBottom: 12,
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 13,
          }}
        >
          {notice}
        </div>
      ) : null}

      {loading ? (
        <div style={{ padding: 20, color: "#6b7280" }}>{t.page.loading}</div>
      ) : (
        <>
          <SectionCard title={t.filters.title} subtitle={t.filters.subtitle}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              <select
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  fontSize: 13,
                }}
              >
                <option value="ALL">{t.filters.monthAll}</option>
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={workTypeFilter}
                onChange={(e) => setWorkTypeFilter(e.target.value)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  fontSize: 13,
                }}
              >
                <option value="ALL">{t.filters.workTypeAll}</option>
                <option value="PM">{t.workTypes.PM}</option>
                <option value="BC">{t.workTypes.BC}</option>
                <option value="CM">{t.workTypes.CM}</option>
                <option value="INSPECTION">{t.workTypes.INSPECTION}</option>
              </select>

              <select
                value={workStatusFilter}
                onChange={(e) => setWorkStatusFilter(e.target.value)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  fontSize: 13,
                }}
              >
                <option value="ALL">{t.filters.workStatusAll}</option>
                <option value="open">{t.workStatuses.open}</option>
                <option value="in_progress">{t.workStatuses.in_progress}</option>
                <option value="done">{t.workStatuses.done}</option>
                <option value="cancelled">{t.workStatuses.cancelled}</option>
              </select>

              <select
                value={downtimeTypeFilter}
                onChange={(e) => setDowntimeTypeFilter(e.target.value)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  fontSize: 13,
                }}
              >
                <option value="ALL">{t.filters.downtimeTypeAll}</option>
                <option value="mechanical">{t.downtimeTypes.mechanical}</option>
                <option value="electrical">{t.downtimeTypes.electrical}</option>
                <option value="instrument">{t.downtimeTypes.instrument}</option>
                <option value="operation">{t.downtimeTypes.operation}</option>
                <option value="other">{t.downtimeTypes.other}</option>
              </select>

              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  fontSize: 13,
                }}
              >
                <option value="ALL">{t.filters.areaAll}</option>
                {areaOptions.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 12,
              }}
            >
              <button
                onClick={handleExportSummaryCsv}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 10,
                  padding: "9px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t.buttons.exportSummaryCsv}
              </button>

              <button
                onClick={handleExportDowntimeCsv}
                style={{
                  background: "#0f766e",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 10,
                  padding: "9px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t.buttons.exportDowntimeCsv}
              </button>

              <button
                onClick={handlePrintPdf}
                style={{
                  background: "#6b7280",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 10,
                  padding: "9px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t.buttons.printPdf}
              </button>
            </div>
          </SectionCard>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 10,
              marginTop: 12,
              marginBottom: 12,
            }}
          >
            <StatCard
              title={t.statCards.totalDevices}
              value={overviewStats.totalDevices}
              subtitle={t.statCards.totalDevicesSub}
            />
            <StatCard
              title={t.statCards.totalPmPlans}
              value={overviewStats.totalPmPlans}
              subtitle={t.statCards.totalPmPlansSub}
            />
            <StatCard
              title={t.statCards.totalWorkOrders}
              value={overviewStats.totalWorkOrders}
              subtitle={t.statCards.totalWorkOrdersSub}
            />
            <StatCard
              title={t.statCards.totalDowntimes}
              value={overviewStats.totalDowntimes}
              subtitle={t.statCards.totalDowntimesSub}
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
            <StatCard
              title={t.statCards.activeDevices}
              value={overviewStats.activeDevices}
              subtitle={t.statCards.activeDevicesSub}
            />
            <StatCard
              title={t.statCards.inactiveDevices}
              value={overviewStats.inactiveDevices}
              subtitle={t.statCards.inactiveDevicesSub}
            />
            <StatCard
              title={t.statCards.workOpen}
              value={overviewStats.workOpen}
              subtitle={t.statCards.workOpenSub}
            />
            <StatCard
              title={t.statCards.totalDowntimeMinutes}
              value={overviewStats.totalDowntimeMinutes}
              subtitle={t.statCards.totalDowntimeMinutesSub}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <ColorBarChart
              title={t.charts.workTypeTitle}
              subtitle={t.charts.workTypeSubtitle}
              data={[
                { label: t.workTypes.PM, value: workTypeStats.PM },
                { label: t.workTypes.BC, value: workTypeStats.BC },
                { label: t.workTypes.CM, value: workTypeStats.CM },
                { label: t.workTypes.INSPECTION, value: workTypeStats.INSPECTION },
              ]}
              color="#2563eb"
              emptyText={t.emptyData}
            />

            <ColorBarChart
              title={t.charts.workStatusTitle}
              subtitle={t.charts.workStatusSubtitle}
              data={[
                { label: t.workStatuses.open, value: workStatusStats.open },
                { label: t.workStatuses.in_progress, value: workStatusStats.in_progress },
                { label: t.workStatuses.done, value: workStatusStats.done },
                { label: t.workStatuses.cancelled, value: workStatusStats.cancelled },
              ]}
              color="#f59e0b"
              emptyText={t.emptyData}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <ColorBarChart
              title={t.charts.downtimeTypeTitle}
              subtitle={t.charts.downtimeTypeSubtitle}
              data={[
                { label: t.downtimeTypes.mechanical, value: downtimeTypeStats.mechanical },
                { label: t.downtimeTypes.electrical, value: downtimeTypeStats.electrical },
                { label: t.downtimeTypes.instrument, value: downtimeTypeStats.instrument },
                { label: t.downtimeTypes.operation, value: downtimeTypeStats.operation },
                { label: t.downtimeTypes.other, value: downtimeTypeStats.other },
              ]}
              color="#dc2626"
              emptyText={t.emptyData}
            />

            <ColorBarChart
              title={t.charts.topDowntimeAreasTitle}
              subtitle={t.charts.topDowntimeAreasSubtitle}
              data={topDowntimeAreas.map((item) => ({
                label: item.area,
                value: item.minutes,
              }))}
              unit={t.charts.minuteUnit}
              color="#7c3aed"
              emptyText={t.emptyData}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <TableCard
              title={t.tables.pmReportTitle}
              subtitle={t.tables.pmReportSubtitle}
              headers={t.tables.pmHeaders}
              rows={pmStatusRows}
              emptyText={t.emptyData}
            />

            <TableCard
              title={t.tables.deviceReportTitle}
              subtitle={t.tables.deviceReportSubtitle}
              headers={t.tables.deviceHeaders}
              rows={deviceStatusRows}
              emptyText={t.emptyData}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <TableCard
              title={t.tables.workTypeReportTitle}
              subtitle={t.tables.workTypeReportSubtitle}
              headers={t.tables.workTypeHeaders}
              rows={[
                [t.workTypes.PM, workTypeStats.PM],
                [t.workTypes.BC, workTypeStats.BC],
                [t.workTypes.CM, workTypeStats.CM],
                [t.workTypes.INSPECTION, workTypeStats.INSPECTION],
              ]}
              emptyText={t.emptyData}
            />

            <TableCard
              title={t.tables.workStatusReportTitle}
              subtitle={t.tables.workStatusReportSubtitle}
              headers={t.tables.workStatusHeaders}
              rows={[
                [t.workStatuses.open, workStatusStats.open],
                [t.workStatuses.in_progress, workStatusStats.in_progress],
                [t.workStatuses.done, workStatusStats.done],
                [t.workStatuses.cancelled, workStatusStats.cancelled],
              ]}
              emptyText={t.emptyData}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <TableCard
              title={t.tables.downtimeReportTitle}
              subtitle={t.tables.downtimeReportSubtitle}
              headers={t.tables.downtimeHeaders}
              rows={[
                [t.downtimeTypes.mechanical, downtimeTypeStats.mechanical],
                [t.downtimeTypes.electrical, downtimeTypeStats.electrical],
                [t.downtimeTypes.instrument, downtimeTypeStats.instrument],
                [t.downtimeTypes.operation, downtimeTypeStats.operation],
                [t.downtimeTypes.other, downtimeTypeStats.other],
              ]}
              emptyText={t.emptyData}
            />

            <SectionCard title={t.tables.summaryTitle} subtitle={t.tables.summarySubtitle}>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.9 }}>
                <div>
                  <b>{t.summary.reportMonth}:</b>{" "}
                  {reportMonth === "ALL" ? t.filters.all : reportMonth}
                </div>
                <div>
                  <b>{t.summary.workType}:</b>{" "}
                  {workTypeFilter === "ALL"
                    ? t.filters.all
                    : workTypeFilter === "PM"
                    ? t.workTypes.PM
                    : workTypeFilter === "BC"
                    ? t.workTypes.BC
                    : workTypeFilter === "CM"
                    ? t.workTypes.CM
                    : t.workTypes.INSPECTION}
                </div>
                <div>
                  <b>{t.summary.workStatus}:</b>{" "}
                  {workStatusFilter === "ALL"
                    ? t.filters.all
                    : workStatusFilter === "open"
                    ? t.workStatuses.open
                    : workStatusFilter === "in_progress"
                    ? t.workStatuses.in_progress
                    : workStatusFilter === "done"
                    ? t.workStatuses.done
                    : t.workStatuses.cancelled}
                </div>
                <div>
                  <b>{t.summary.downtimeType}:</b>{" "}
                  {downtimeTypeFilter === "ALL"
                    ? t.filters.all
                    : downtimeTypeFilter === "mechanical"
                    ? t.downtimeTypes.mechanical
                    : downtimeTypeFilter === "electrical"
                    ? t.downtimeTypes.electrical
                    : downtimeTypeFilter === "instrument"
                    ? t.downtimeTypes.instrument
                    : downtimeTypeFilter === "operation"
                    ? t.downtimeTypes.operation
                    : t.downtimeTypes.other}
                </div>
                <div>
                  <b>{t.summary.downtimeArea}:</b>{" "}
                  {areaFilter === "ALL" ? t.filters.all : areaFilter}
                </div>
                <div>
                  <b>{t.summary.totalDowntimeMinutes}:</b>{" "}
                  {formatMinutes(overviewStats.totalDowntimeMinutes, language)}
                </div>
              </div>
            </SectionCard>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <TableCard
              title={t.tables.topEquipmentTitle}
              subtitle={t.tables.topEquipmentSubtitle}
              headers={t.tables.topEquipmentHeaders}
              rows={topDowntimeEquipments.map((item) => [
                item.name,
                item.count,
                item.minutes,
              ])}
              emptyText={t.emptyData}
            />

            <TableCard
              title={t.tables.topAreaTitle}
              subtitle={t.tables.topAreaSubtitle}
              headers={t.tables.topAreaHeaders}
              rows={topDowntimeAreas.map((item) => [
                item.area,
                item.count,
                item.minutes,
              ])}
              emptyText={t.emptyData}
            />
          </div>
        </>
      )}
    </div>
  );
}