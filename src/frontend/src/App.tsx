import { Toaster } from "@/components/ui/sonner";
import { Calendar, Clock, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { useSettings } from "./hooks/useSettings";
import { HistoryTab } from "./pages/HistoryTab";
import { SettingsTab } from "./pages/SettingsTab";
import { TodayTab } from "./pages/TodayTab";

type Tab = "today" | "history" | "settings";

const TABS = [
  { id: "today" as Tab, label: "Today", icon: Clock },
  { id: "history" as Tab, label: "History", icon: Calendar },
  { id: "settings" as Tab, label: "Settings", icon: SettingsIcon },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const { settings, update } = useSettings();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[430px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground font-display">
              HourLog
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[430px] mx-auto w-full px-4 pt-5 pb-28">
        {activeTab === "today" && (
          <TodayTab
            scheduleStart={settings.scheduleStart}
            scheduleEnd={settings.scheduleEnd}
          />
        )}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "settings" && (
          <SettingsTab settings={settings} onUpdate={update} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-t border-border">
        <div className="max-w-[430px] mx-auto px-2">
          <div className="flex items-center justify-around">
            {TABS.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`relative flex flex-col items-center gap-1 py-3 px-5 flex-1 transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`nav.${id}.tab`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`}
                  />
                  <span
                    className={`text-xs font-medium ${isActive ? "text-primary" : ""}`}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <Toaster position="top-center" richColors />
    </div>
  );
}
