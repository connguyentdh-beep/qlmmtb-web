import { useMemo, useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import DevicesPage from "./pages/DevicesPage";
import PmPage from "./pages/PmPage";
import WorkOrdersPage from "./pages/WorkOrdersPage";
import DowntimePage from "./pages/DowntimePage";
import ReportsPage from "./pages/ReportsPage";
import UtilitiesPage from "./pages/UtilitiesPage";
import LanguageSwitcher from "./components/LanguageSwitcher";

function StatCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        background: "#bcccae",
        borderRadius:20,
        padding:8,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        border: "1px solid #e5e7eb",
        minHeight: 60,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 15, color: "rgb(11, 177, 66)", marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#032672", marginBottom: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "rgb(129, 26, 13)" }}>{subtitle}</div>
    </div>
  );
}

export default function App() {
  const [activeMenu, setActiveMenu] = useState("devices");
  const [language, setLanguage] = useState("vi");

  const [deviceStats, setDeviceStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const [pmStats, setPmStats] = useState({
    total: 0,
  });

  const texts = {
    vi: {
      appTitle: "CÔNG TY CỔ PHẦN SOLAGRON: QUẢN LÝ HỆ THÔNG MÁY MÓC THIẾT BỊ NHÀ XƯỞNG",
      mainMenu: "MENU CHÍNH",
      backendConnected: "kết nối",

      menu: {
        dashboard: "Dashboard",
        devices: "Danh mục thiết bị",
        pm: "Kế hoạch PM",
        workorders: "Phiếu công việc",
        downtime: "Downtime",
        reports: "Báo cáo",
        utilities: "Điện nước",
      },

      subtitle: {
        dashboard: "Tổng quan hệ thống",
        devices: "Quản lý danh mục máy móc, thiết bị",
        pm: "Quản lý kế hoạch bảo trì định kỳ",
        workorders: "Quản lý phiếu công việc",
        downtime: "Theo dõi thời gian dừng máy",
        reports: "Tổng hợp và phân tích báo cáo",
        utilities: "Theo dõi điện và nước",
        default: "Hệ thống quản lý máy móc thiết bị",
      },

      stats: {
        totalDevices: "Tổng số thiết bị",
        activeDevices: "Đang hoạt động",
        inactiveDevices: "Dừng hoạt động",
        pmPlans: "Kế hoạch PM v1",
        fromDb: "Đọc từ database",
        running: "Thiết bị vận hành",
        needReview: "Cần xem xét",
      },
    },

    en: {
      appTitle: "SOLAGRON JOINT STOCK COMPANY: MANAGEMENT OF FACTORY EQUIPMENT AND MACHINERY SYSTEMS",
      mainMenu: "MAIN MENU",
      backendConnected: "connected",

      menu: {
        dashboard: "Dashboard",
        devices: "Equipment List",
        pm: "PM Plan",
        workorders: "Work Orders",
        downtime: "Downtime",
        reports: "Reports",
        utilities: "Utilities",
      },

      subtitle: {
        dashboard: "System overview",
        devices: "Manage equipment and machine list",
        pm: "Manage preventive maintenance plans",
        workorders: "Manage work orders",
        downtime: "Track machine downtime",
        reports: "Report summary and analysis",
        utilities: "Track electricity and water",
        default: "Equipment Management System",
      },

      stats: {
        totalDevices: "Total Devices",
        activeDevices: "Active",
        inactiveDevices: "Inactive",
        pmPlans: "PM Plans v1",
        fromDb: "Read from database",
        running: "Operating devices",
        needReview: "Needs review",
      },
    },
  };

  const t = texts[language];

  const menuItems = [
    { key: "dashboard", label: t.menu.dashboard },
    { key: "devices", label: t.menu.devices },
    { key: "pm", label: t.menu.pm },
    { key: "workorders", label: t.menu.workorders },
    { key: "downtime", label: t.menu.downtime },
    { key: "reports", label: t.menu.reports },
    { key: "utilities", label: t.menu.utilities },
  ];

  const headerSubtitle = useMemo(() => {
    if (activeMenu === "dashboard") return t.subtitle.dashboard;
    if (activeMenu === "devices") return t.subtitle.devices;
    if (activeMenu === "pm") return t.subtitle.pm;
    if (activeMenu === "workorders") return t.subtitle.workorders;
    if (activeMenu === "downtime") return t.subtitle.downtime;
    if (activeMenu === "reports") return t.subtitle.reports;
    if (activeMenu === "utilities") return t.subtitle.utilities;
    return t.subtitle.default;
  }, [activeMenu, language]);

  const renderMainContent = () => {
  if (activeMenu === "dashboard") {
    return <DashboardPage language={language} onNavigate={setActiveMenu} />;
  }

  if (activeMenu === "devices") {
    return <DevicesPage onStatsChange={setDeviceStats} language={language} />;
  }

  if (activeMenu === "pm") {
    return <PmPage onStatsChange={setPmStats} language={language} />;
  }

  if (activeMenu === "workorders") {
    return <WorkOrdersPage language={language} />;
  }

  if (activeMenu === "downtime") {
    return <DowntimePage language={language} />;
  }

  if (activeMenu === "reports") {
    return <ReportsPage language={language} />;
  }

  if (activeMenu === "utilities") {
    return <UtilitiesPage language={language} />;
  }

  return <DashboardPage language={language} onNavigate={setActiveMenu} />;
};
  return (
    <div
      style={{
        height: "100vh",
        background: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <aside
          style={{
            width: 220,
            minWidth: 220,
            background: "#111827",
            color: "#ffffff",
            padding: 12,
            boxSizing: "border-box",
            flexShrink: 0,
            overflowY: "auto",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>QLMMTB</div>

          <div style={{ fontSize: 11, color: "#9c9caf", marginBottom: 8 }}>
            {t.mainMenu}
          </div>

          {menuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              style={{
                padding: "9px 10px",
                borderRadius: 8,
                marginBottom: 5,
                cursor: "pointer",
                background: activeMenu === item.key ? "#2563eb" : "transparent",
                color: "#ffffff",
                fontWeight: activeMenu === item.key ? 700 : 500,
                transition: "all 0.15s ease",
                userSelect: "none",
                fontSize: 13,
                lineHeight: 1.2,
              }}
            >
              {item.label}
            </div>
          ))}
        </aside>

        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: 10,
            boxSizing: "border-box",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              height: "100%",
              minHeight: 0,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: 12,
                padding: 12,
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                minHeight: 64,
                boxSizing: "border-box",
              }}
            >
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>
                  {t.appTitle}
                </div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>{headerSubtitle}</div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <LanguageSwitcher language={language} onChange={setLanguage} />

                <div
                  style={{
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    border: "1px solid #bfdbfe",
                    borderRadius: 8,
                    padding: "7px 10px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    fontSize: 12,
                    lineHeight: 1.2,
                  }}
                >
                  {t.backendConnected}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <StatCard
                title={t.stats.totalDevices}
                value={deviceStats.total}
                subtitle={t.stats.fromDb}
              />
              <StatCard
                title={t.stats.activeDevices}
                value={deviceStats.active}
                subtitle={t.stats.running}
              />
              <StatCard
                title={t.stats.inactiveDevices}
                value={deviceStats.inactive}
                subtitle={t.stats.needReview}
              />
              <StatCard
                title={t.stats.pmPlans}
                value={pmStats.total}
                subtitle={t.stats.fromDb}
              />
            </div>

            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflow: "auto",
              }}
            >
              {renderMainContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}