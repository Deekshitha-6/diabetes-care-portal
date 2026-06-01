import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Camera,
  BarChart3,
  Pill,
  LogOut,
  HeartPulse,
  Menu,
  X,
  Scale
} from "lucide-react";
import HealthRecordsModule from "./HealthRecordsModule";
import FoodScannerModule from "./FoodScannerModule";
import ProgressAnalysisModule from "./ProgressAnalysisModule";
import MedicationModule from "./MedicationModule";
import ObesityManagementModule from "./ObesityManagementModule";
function Dashboard({ userEmail, onLogout }) {
  const [activeTab, setActiveTab] = useState("records");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const getProfile = () => {
    const list = localStorage.getItem("dia_users");
    if (list) {
      try {
        const users = JSON.parse(list);
        const match = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
        if (match) return match;
      } catch (e) {
        console.warn("Error reading stored users:", e);
      }
    }
    return {
      name: "Deekshitha",
      age: 28,
      gender: "Female",
      email: userEmail,
      mobile: "9845012345",
      height: 165,
      weight: 68,
      diabetesType: "type2"
    };
  };
  const user = getProfile();
  const navigationItems = [
    { id: "records", label: "Health Records", icon: <FileText className="w-4 h-4" /> },
    { id: "scanner", label: "Food Scanner & GI Advisory", icon: <Camera className="w-4 h-4" /> },
    { id: "progress", label: "Progress Trends", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "meds", label: "Medication Checking", icon: <Pill className="w-4 h-4" /> },
    { id: "obesity", label: "Obesity & Diet Plan", icon: <Scale className="w-4 h-4" /> }
  ];
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };
  return <div className="min-h-screen bg-[#f8f9f4] flex flex-col md:flex-row font-sans text-[#2d362e]" id="dashboard-container">
      
      {
    /* Mobile Header */
  }
      <header className="md:hidden bg-[#2d362e] text-white px-4 py-3 flex justify-between items-center z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[#8fb394] text-[#2d362e] flex items-center justify-center font-bold">
            <HeartPulse className="w-5 h-5" />
          </span>
          <span className="font-semibold text-white text-sm tracking-tight">Dia-Assisst</span>
        </div>
        <button
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    className="p-2 text-[#8fb394] hover:text-white border border-[#3e4a3f] rounded-lg"
  >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {
    /* Navigation Drawer Menu */
  }
      <aside
    className={`fixed inset-y-0 left-0 w-64 md:sticky flex flex-col justify-between bg-[#2d362e] text-white p-6 z-10 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} border-r border-[#2d362e]`}
    id="dashboard-sidebar"
  >
            <div className="space-y-8">
              {
    /* Portal Brand Sign */
  }
              <div className="hidden md:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8fb394] text-[#2d362e] flex items-center justify-center font-bold">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-md tracking-tight leading-tight font-display">Dia-Assisst</span>
                  <span className="text-[10px] text-[#8fb394]/80 font-semibold uppercase tracking-wider">Clinical Care Module</span>
                </div>
              </div>

              {
    /* User Identity widget */
  }
              <div className="bg-[#3e4a3f]/75 rounded-2xl p-4 flex items-center gap-3 border border-[#3e4a3f]">
                <div className="w-9 h-9 rounded-full bg-[#8fb394] text-[#2d362e] flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-white text-xs truncate">{user.name}</span>
                  <span className="text-[9px] uppercase font-bold text-[#8fb394] tracking-wider truncate mb-0.5">
                    {user.diabetesType === "type2" ? "Type 2 Diabetes" : user.diabetesType === "type1" ? "Type 1 Diabetes" : "Gestational"}
                  </span>
                </div>
              </div>

              {
    /* Navigation lists */
  }
              <nav className="space-y-1.5" id="dashboard-nav">
                {navigationItems.map((item) => {
    const isActive = activeTab === item.id;
    return <button
      key={item.id}
      onClick={() => handleTabChange(item.id)}
      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all ${isActive ? "bg-[#3e4a3f] text-white shadow-xs border border-[#3e4a3f]" : "text-gray-300 hover:bg-[#3e4a3f]/50 hover:text-white"}`}
    >
                      <span className={isActive ? "text-[#8fb394]" : "text-gray-400"}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>;
  })}
              </nav>
            </div>

            {
    /* Logout control trigger */
  }
            <div className="pt-6 border-t border-[#3e4a3f]">
              <button
    onClick={onLogout}
    id="btn-logout"
    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-[#e67e22] hover:bg-[#3e4a3f]/40 transition-all cursor-pointer"
  >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

      {
    /* Main Panel Viewport */
  }
      <main className="flex-1 min-w-0 overflow-y-auto px-4 md:px-8 py-8 md:py-10 bg-[#f8f9f4]" id="dashboard-viewport">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <AnimatePresence mode="wait">
            <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
    transition={{ duration: 0.15 }}
  >
              {activeTab === "records" && <HealthRecordsModule user={user} />}
              {activeTab === "scanner" && <FoodScannerModule user={user} />}
              {activeTab === "progress" && <ProgressAnalysisModule user={user} />}
              {activeTab === "meds" && <MedicationModule user={user} />}
              {activeTab === "obesity" && <ObesityManagementModule user={user} />}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

    </div>;
}
export {
  Dashboard as default
};
