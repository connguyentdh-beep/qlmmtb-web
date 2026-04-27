import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const API_BASE = "http://127.0.0.1:8000";

function getTexts(language = "vi") {
  const texts = {
    vi: {
      pageTitle: "Dashboard",
      heroTitle: "Tổng quan vận hành hệ thống",
      heroDescription:
        "Màn hình này tổng hợp nhanh dữ liệu thiết bị, PM, phiếu công việc, downtime và điện/nước để hỗ trợ theo dõi vận hành hằng ngày.",

      loading: "Đang tải dữ liệu dashboard...",
      loadError: "Không tải được dữ liệu dashboard từ backend",

      kpi: {
        totalDevices: "Tổng thiết bị",
        activeDevices: "Thiết bị hoạt động",
        totalPm: "Kế hoạch PM",
        openWorkOrders: "WO đang mở",
        totalDowntimes: "Phiếu downtime",
        totalUtilityCost: "Tổng chi phí điện/nước",
        devicesSub: "Từ danh mục thiết bị",
        activeSub: "Status = active",
        pmSub: "Từ kế hoạch PM",
        woSub: "open + in_progress",
        dtSub: "Từ downtime",
        utilitySub: "Điện + nước",
      },

      quickHealth: {
        title: "Tình trạng vận hành",
        subtitle: "Các chỉ số nhanh để nhìn hệ thống trong vài giây",
        activeRate: "Tỷ lệ thiết bị hoạt động",
        inactiveRate: "Tỷ lệ thiết bị dừng",
        pmCoverage: "Mật độ PM trên thiết bị",
        overduePm: "PM quá hạn",
      },

      alerts: {
        title: "Cảnh báo nhanh",
        subtitle: "Các điểm cần ưu tiên kiểm tra",
        inactiveDevices: "Thiết bị dừng",
        overduePm: "PM quá hạn",
        openWorkOrders: "Work orders chưa đóng",
        unresolvedDowntime: "Downtime chưa đóng",
      },

      charts: {
        workOrderStatus: "Biểu đồ Work Orders theo trạng thái",
        workOrderStatusSub: "Mở / Đang thực hiện / Hoàn thành / Đã hủy",
        downtimeType: "Biểu đồ Downtime theo loại",
        downtimeTypeSub: "Cơ khí / Điện / Điều khiển / Vận hành / Khác",
        utility7Days: "Điện / Nước 7 ngày gần nhất",
        utility7DaysSub: "Theo dữ liệu thực tế đã nhập",
        electric: "Điện",
        water: "Nước",
        noData: "Chưa có dữ liệu",
      },

      quickActions: {
        title: "Điều hướng nhanh",
        subtitle: "Bấm để chuyển sang đúng tab làm việc",
        devices: "Danh mục thiết bị",
        pm: "Kế hoạch PM",
        workorders: "Phiếu công việc",
        downtime: "Downtime",
        utilities: "Điện / Nước",
        reports: "Báo cáo",
      },

      tables: {
        topDowntimeMachines: "Top máy downtime nhiều",
        topDowntimeMachinesSub: "Xếp theo tổng phút dừng",
        machine: "Thiết bị",
        count: "Số phiếu",
        minutes: "Phút dừng",
        noData: "Chưa có dữ liệu",
      },

      summary: {
        title: "Tóm tắt điều hành",
        subtitle: "Gợi ý để sử dụng hệ thống hiệu quả hơn",
        item1:
          "Danh mục thiết bị là nền tảng, nên luôn giữ đúng trạng thái hoạt động thực tế.",
        item2:
          "PM nên được cập nhật đầy đủ để tránh dồn việc và bỏ sót bảo trì định kỳ.",
        item3:
          "Work Orders và Downtime nên được dùng song song để theo dõi cả công việc lẫn sự cố.",
        item4:
          "Điện/Nước đã có thể dùng để theo dõi chi phí và mức tiêu thụ theo từng máy.",
      },
    },

    en: {
      pageTitle: "Dashboard",
      heroTitle: "System Operations Overview",
      heroDescription:
        "This screen provides a quick operational summary of equipment, PM plans, work orders, downtime, and utilities to support daily monitoring.",

      loading: "Loading dashboard data...",
      loadError: "Cannot load dashboard data from backend",

      kpi: {
        totalDevices: "Total Devices",
        activeDevices: "Active Devices",
        totalPm: "PM Plans",
        openWorkOrders: "Open Work Orders",
        totalDowntimes: "Downtime Tickets",
        totalUtilityCost: "Total Utility Cost",
        devicesSub: "From equipment list",
        activeSub: "Status = active",
        pmSub: "From PM plans",
        woSub: "open + in_progress",
        dtSub: "From downtime",
        utilitySub: "Electricity + water",
      },

      quickHealth: {
        title: "Operational Health",
        subtitle: "Quick indicators to understand the system in seconds",
        activeRate: "Active device rate",
        inactiveRate: "Inactive device rate",
        pmCoverage: "PM coverage per device",
        overduePm: "Overdue PM",
      },

      alerts: {
        title: "Quick Alerts",
        subtitle: "Items that should be reviewed first",
        inactiveDevices: "Inactive devices",
        overduePm: "Overdue PM",
        openWorkOrders: "Unclosed work orders",
        unresolvedDowntime: "Unclosed downtime",
      },

      charts: {
        workOrderStatus: "Work Orders by Status",
        workOrderStatusSub: "Open / In Progress / Done / Cancelled",
        downtimeType: "Downtime by Type",
        downtimeTypeSub: "Mechanical / Electrical / Instrument / Operation / Other",
        utility7Days: "Electricity / Water in Last 7 Days",
        utility7DaysSub: "Based on actual entered records",
        electric: "Electricity",
        water: "Water",
        noData: "No data yet",
      },

      quickActions: {
        title: "Quick Navigation",
        subtitle: "Click to jump to the working tab",
        devices: "Equipment List",
        pm: "PM Plans",
        workorders: "Work Orders",
        downtime: "Downtime",
        utilities: "Electricity / Water",
        reports: "Reports",
      },

      tables: {
        topDowntimeMachines: "Top Downtime Machines",
        topDowntimeMachinesSub: "Ranked by total downtime minutes",
        machine: "Machine",
        count: "Tickets",
        minutes: "Downtime Minutes",
        noData: "No data yet",
      },

      summary: {
        title: "Management Notes",
        subtitle: "Suggestions for using the system more effectively",
        item1:
          "The equipment list is the foundation, so keep the real operating status updated.",
        item2:
          "PM plans should be maintained consistently to avoid overdue preventive tasks.",
        item3:
          "Work Orders and Downtime should be used together to track both tasks and incidents.",
        item4:
          "Utilities can now be used to monitor cost and consumption by machine.",
      },
    },
  };

  return texts[language] || texts.vi;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(Number(value || 0));
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(String(value).trim().replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function minutesBetween(start, end) {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s || !e) return 0;
  const diff = e.getTime() - s.getTime();
  if (diff <= 0) return 0;
  return Math.round(diff / 60000);
}

function getConsumption(item) {
  return Math.max(0, Number(item?.end_reading || 0) - Number(item?.start_reading || 0));
}

function formatDateKey(dateText) {
  if (!dateText) return "";
  const parts = String(dateText).split("-");
  if (parts.length !== 3) return dateText;
  return `${parts[2]}/${parts[1]}`;
}

function KpiCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 16,
        minHeight: 98,
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>{subtitle}</div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: 16,
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
        {title}
      </div>
      {subtitle ? (
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12, lineHeight: 1.6 }}>
          {subtitle}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function ProgressRow({ label, valueText, percent, color }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          fontSize: 13,
          marginBottom: 6,
        }}
      >
        <div style={{ color: "#374151", fontWeight: 600 }}>{label}</div>
        <div style={{ color: "#111827", fontWeight: 700 }}>{valueText}</div>
      </div>
      <div
        style={{
          width: "100%",
          height: 10,
          background: "#eef2f7",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, percent))}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}

function AlertItem({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 12,
        background: "#f9fafb",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{value}</div>
    </div>
  );
}

function QuickNavButton({ label, onClick, bg }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        color: "#ffffff",
        border: "none",
        borderRadius: 14,
        padding: "12px 14px",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        textAlign: "left",
        minHeight: 52,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      {label}
    </button>
  );
}

export default function DashboardPage({ language = "vi", onNavigate }) {
  const t = getTexts(language);

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [equipments, setEquipments] = useState([]);
  const [pmPlans, setPmPlans] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [downtimes, setDowntimes] = useState([]);
  const [electricRecords, setElectricRecords] = useState([]);
  const [waterRecords, setWaterRecords] = useState([]);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        setNotice("");

        const [eqRes, pmRes, woRes, dtRes, erRes, wrRes] = await Promise.all([
          axios.get(`${API_BASE}/equipments/`),
          axios.get(`${API_BASE}/pm-plans/`),
          axios.get(`${API_BASE}/work-orders/`),
          axios.get(`${API_BASE}/downtimes/`),
          axios.get(`${API_BASE}/electric-records/`),
          axios.get(`${API_BASE}/water-records/`),
        ]);

        setEquipments(Array.isArray(eqRes.data) ? eqRes.data : []);
        setPmPlans(Array.isArray(pmRes.data) ? pmRes.data : []);
        setWorkOrders(Array.isArray(woRes.data) ? woRes.data : []);
        setDowntimes(Array.isArray(dtRes.data) ? dtRes.data : []);
        setElectricRecords(Array.isArray(erRes.data) ? erRes.data : []);
        setWaterRecords(Array.isArray(wrRes.data) ? wrRes.data : []);
      } catch (err) {
        console.error(err);
        setNotice(t.loadError);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [language, t.loadError]);

  const dashboardData = useMemo(() => {
    const totalDevices = equipments.length;
    const activeDevices = equipments.filter((x) => x.status === "active").length;
    const inactiveDevices = equipments.filter((x) => x.status === "inactive").length;

    const totalPm = pmPlans.length;
    const overduePm = pmPlans.filter((x) => String(x.status).toLowerCase() === "overdue").length;

    const openWorkOrders = workOrders.filter(
      (x) => x.status === "open" || x.status === "in_progress"
    ).length;

    const totalDowntimes = downtimes.length;
    const unresolvedDowntime = downtimes.filter(
      (x) => x.status === "new" || x.status === "processing" || x.status === "resolved"
    ).length;

    const workOrderStatusData = [
      {
        name: language === "vi" ? "Mở" : "Open",
        value: workOrders.filter((x) => x.status === "open").length,
      },
      {
        name: language === "vi" ? "Đang thực hiện" : "In Progress",
        value: workOrders.filter((x) => x.status === "in_progress").length,
      },
      {
        name: language === "vi" ? "Hoàn thành" : "Done",
        value: workOrders.filter((x) => x.status === "done").length,
      },
      {
        name: language === "vi" ? "Đã hủy" : "Cancelled",
        value: workOrders.filter((x) => x.status === "cancelled").length,
      },
    ];

    const downtimeTypeData = [
      {
        name: language === "vi" ? "Cơ khí" : "Mechanical",
        value: downtimes.filter((x) => x.downtime_type === "mechanical").length,
      },
      {
        name: language === "vi" ? "Điện" : "Electrical",
        value: downtimes.filter((x) => x.downtime_type === "electrical").length,
      },
      {
        name: language === "vi" ? "Điều khiển" : "Instrument",
        value: downtimes.filter((x) => x.downtime_type === "instrument").length,
      },
      {
        name: language === "vi" ? "Vận hành" : "Operation",
        value: downtimes.filter((x) => x.downtime_type === "operation").length,
      },
      {
        name: language === "vi" ? "Khác" : "Other",
        value: downtimes.filter((x) => x.downtime_type === "other").length,
      },
    ];

    const electricCost = electricRecords.reduce((sum, item) => {
      return sum + getConsumption(item) * Number(item.unit_price || 0);
    }, 0);

    const waterCost = waterRecords.reduce((sum, item) => {
      return sum + getConsumption(item) * Number(item.unit_price || 0);
    }, 0);

    const totalUtilityCost = electricCost + waterCost;

    const electricByDate = new Map();
    electricRecords.forEach((item) => {
      const key = item.record_date;
      electricByDate.set(key, (electricByDate.get(key) || 0) + getConsumption(item));
    });

    const waterByDate = new Map();
    waterRecords.forEach((item) => {
      const key = item.record_date;
      waterByDate.set(key, (waterByDate.get(key) || 0) + getConsumption(item));
    });

    const allDateKeys = Array.from(new Set([...electricByDate.keys(), ...waterByDate.keys()]))
      .sort()
      .slice(-7);

    const utility7DaysData = allDateKeys.map((key) => ({
      label: formatDateKey(key),
      electric: electricByDate.get(key) || 0,
      water: waterByDate.get(key) || 0,
    }));

    const downtimeMachineMap = new Map();
    downtimes.forEach((item) => {
      const key =
        item.equipment_name ||
        item.equipment_code ||
        (language === "vi" ? "Không rõ" : "Unknown");

      const old = downtimeMachineMap.get(key) || { count: 0, minutes: 0 };
      old.count += 1;
      old.minutes += minutesBetween(item.start_time, item.end_time);
      downtimeMachineMap.set(key, old);
    });

    const topDowntimeMachines = Array.from(downtimeMachineMap.entries())
      .map(([name, info]) => ({
        name,
        count: info.count,
        minutes: info.minutes,
      }))
      .sort((a, b) => {
        if (b.minutes !== a.minutes) return b.minutes - a.minutes;
        return b.count - a.count;
      })
      .slice(0, 5);

    const activeRate = totalDevices > 0 ? Math.round((activeDevices / totalDevices) * 100) : 0;
    const inactiveRate = totalDevices > 0 ? Math.round((inactiveDevices / totalDevices) * 100) : 0;
    const pmCoverage = totalDevices > 0 ? Math.round((totalPm / totalDevices) * 100) : 0;

    return {
      totalDevices,
      activeDevices,
      inactiveDevices,
      totalPm,
      overduePm,
      openWorkOrders,
      totalDowntimes,
      unresolvedDowntime,
      totalUtilityCost,
      activeRate,
      inactiveRate,
      pmCoverage,
      workOrderStatusData,
      downtimeTypeData,
      utility7DaysData,
      topDowntimeMachines,
    };
  }, [equipments, pmPlans, workOrders, downtimes, electricRecords, waterRecords, language]);

  const pieColors1 = ["#2563eb", "#f59e0b", "#16a34a", "#9ca3af"];
  const pieColors2 = ["#dc2626", "#2563eb", "#7c3aed", "#16a34a", "#6b7280"];

  if (loading) {
    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: 18,
          padding: 24,
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
          color: "#6b7280",
        }}
      >
        {t.loading}
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 18,
        padding: 16,
      }}
    >
      {notice ? (
        <div
          style={{
            marginBottom: 12,
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            borderRadius: 12,
            padding: "10px 12px",
            fontSize: 13,
          }}
        >
          {notice}
        </div>
      ) : null}

      <div
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
          border: "1px solid #dbeafe",
          borderRadius: 20,
          padding: 22,
          marginBottom: 14,
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#2563eb", marginBottom: 8 }}>
          {t.pageTitle}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#111827",
            marginBottom: 8,
            lineHeight: 1.25,
          }}
        >
          {t.heroTitle}
        </div>
        <div
          style={{
            fontSize: 14,
            color: "#4b5563",
            lineHeight: 1.7,
            maxWidth: 980,
          }}
        >
          {t.heroDescription}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <KpiCard title={t.kpi.totalDevices} value={dashboardData.totalDevices} subtitle={t.kpi.devicesSub} />
        <KpiCard title={t.kpi.activeDevices} value={dashboardData.activeDevices} subtitle={t.kpi.activeSub} />
        <KpiCard title={t.kpi.totalPm} value={dashboardData.totalPm} subtitle={t.kpi.pmSub} />
        <KpiCard title={t.kpi.openWorkOrders} value={dashboardData.openWorkOrders} subtitle={t.kpi.woSub} />
        <KpiCard title={t.kpi.totalDowntimes} value={dashboardData.totalDowntimes} subtitle={t.kpi.dtSub} />
        <KpiCard title={t.kpi.totalUtilityCost} value={formatCurrency(dashboardData.totalUtilityCost)} subtitle={t.kpi.utilitySub} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <SectionCard title={t.quickHealth.title} subtitle={t.quickHealth.subtitle}>
          <ProgressRow label={t.quickHealth.activeRate} valueText={`${dashboardData.activeRate}%`} percent={dashboardData.activeRate} color="#16a34a" />
          <ProgressRow label={t.quickHealth.inactiveRate} valueText={`${dashboardData.inactiveRate}%`} percent={dashboardData.inactiveRate} color="#dc2626" />
          <ProgressRow label={t.quickHealth.pmCoverage} valueText={`${dashboardData.pmCoverage}%`} percent={dashboardData.pmCoverage} color="#2563eb" />
          <ProgressRow
            label={t.quickHealth.overduePm}
            valueText={dashboardData.overduePm}
            percent={dashboardData.totalPm > 0 ? (dashboardData.overduePm / dashboardData.totalPm) * 100 : 0}
            color="#f59e0b"
          />
        </SectionCard>

        <SectionCard title={t.alerts.title} subtitle={t.alerts.subtitle}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            <AlertItem label={t.alerts.inactiveDevices} value={dashboardData.inactiveDevices} />
            <AlertItem label={t.alerts.overduePm} value={dashboardData.overduePm} />
            <AlertItem label={t.alerts.openWorkOrders} value={dashboardData.openWorkOrders} />
            <AlertItem label={t.alerts.unresolvedDowntime} value={dashboardData.unresolvedDowntime} />
          </div>
        </SectionCard>
      </div>

      <div style={{ marginBottom: 14 }}>
        <SectionCard title={t.quickActions.title} subtitle={t.quickActions.subtitle}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            <QuickNavButton label={t.quickActions.devices} bg="#2563eb" onClick={() => onNavigate?.("devices")} />
            <QuickNavButton label={t.quickActions.pm} bg="#0f766e" onClick={() => onNavigate?.("pm")} />
            <QuickNavButton label={t.quickActions.workorders} bg="#f59e0b" onClick={() => onNavigate?.("workorders")} />
            <QuickNavButton label={t.quickActions.downtime} bg="#dc2626" onClick={() => onNavigate?.("downtime")} />
            <QuickNavButton label={t.quickActions.utilities} bg="#7c3aed" onClick={() => onNavigate?.("utilities")} />
            <QuickNavButton label={t.quickActions.reports} bg="#6b7280" onClick={() => onNavigate?.("reports")} />
          </div>
        </SectionCard>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <SectionCard title={t.charts.workOrderStatus} subtitle={t.charts.workOrderStatusSub}>
          {dashboardData.workOrderStatusData.every((x) => x.value === 0) ? (
            <div style={{ color: "#6b7280", fontSize: 13 }}>{t.charts.noData}</div>
          ) : (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={dashboardData.workOrderStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label
                  >
                    {dashboardData.workOrderStatusData.map((entry, index) => (
                      <Cell key={`wo-${index}`} fill={pieColors1[index % pieColors1.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard title={t.charts.downtimeType} subtitle={t.charts.downtimeTypeSub}>
          {dashboardData.downtimeTypeData.every((x) => x.value === 0) ? (
            <div style={{ color: "#6b7280", fontSize: 13 }}>{t.charts.noData}</div>
          ) : (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={dashboardData.downtimeTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label
                  >
                    {dashboardData.downtimeTypeData.map((entry, index) => (
                      <Cell key={`dt-${index}`} fill={pieColors2[index % pieColors2.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <SectionCard title={t.charts.utility7Days} subtitle={t.charts.utility7DaysSub}>
          {dashboardData.utility7DaysData.length === 0 ? (
            <div style={{ color: "#6b7280", fontSize: 13 }}>{t.tables.noData}</div>
          ) : (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <LineChart data={dashboardData.utility7DaysData}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="electric" name={t.charts.electric} stroke="#dc2626" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="water" name={t.charts.water} stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard title={t.tables.topDowntimeMachines} subtitle={t.tables.topDowntimeMachinesSub}>
          {dashboardData.topDowntimeMachines.length === 0 ? (
            <div style={{ color: "#6b7280", fontSize: 13 }}>{t.tables.noData}</div>
          ) : (
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
                  minWidth: 420,
                }}
              >
                <thead style={{ background: "#f9fafb" }}>
                  <tr style={{ textAlign: "left" }}>
                    <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                      {t.tables.machine}
                    </th>
                    <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                      {t.tables.count}
                    </th>
                    <th style={{ padding: 10, borderBottom: "1px solid #e5e7eb", fontSize: 13 }}>
                      {t.tables.minutes}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.topDowntimeMachines.map((item) => (
                    <tr key={item.name}>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontSize: 13 }}>
                        {item.name}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontSize: 13, fontWeight: 700 }}>
                        {item.count}
                      </td>
                      <td style={{ padding: 10, borderBottom: "1px solid #f3f4f6", fontSize: 13, fontWeight: 700 }}>
                        {item.minutes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title={t.summary.title} subtitle={t.summary.subtitle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {[t.summary.item1, t.summary.item2, t.summary.item3, t.summary.item4].map((item, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 14,
                background: "#f9fafb",
                fontSize: 13,
                color: "#374151",
                lineHeight: 1.7,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}