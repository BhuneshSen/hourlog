import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Settings } from "../hooks/useSettings";

function hourToTimeString(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

function timeStringToHour(time: string): number {
  return Number.parseInt(time.split(":")[0], 10);
}

interface SettingsTabProps {
  settings: Settings;
  onUpdate: (partial: Partial<Settings>) => void;
}

export function SettingsTab({ settings, onUpdate }: SettingsTabProps) {
  const [notifStatus, setNotifStatus] = useState<
    "idle" | "requesting" | "granted" | "denied"
  >(
    typeof Notification !== "undefined" && Notification.permission === "granted"
      ? "granted"
      : "idle",
  );

  const requestNotification = async () => {
    if (typeof Notification === "undefined") {
      toast.error("Notifications not supported in this browser");
      return;
    }
    setNotifStatus("requesting");
    const result = await Notification.requestPermission();
    setNotifStatus(result === "granted" ? "granted" : "denied");
    if (result === "granted") {
      toast.success("Notifications enabled!");
      onUpdate({ notificationEnabled: true });
    } else {
      toast.error("Notification permission denied");
    }
  };

  return (
    <div className="flex flex-col gap-5" data-ocid="settings.page">
      <div className="bg-card rounded-2xl shadow-card border border-border p-5">
        <h2 className="font-bold text-foreground mb-1">Schedule</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Set the hours when HourLog should prompt you.
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="schedule-start"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5"
            >
              Start Time
            </label>
            <input
              id="schedule-start"
              type="time"
              value={hourToTimeString(settings.scheduleStart)}
              onChange={(e) =>
                onUpdate({ scheduleStart: timeStringToHour(e.target.value) })
              }
              step="3600"
              className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              data-ocid="settings.input"
            />
          </div>
          <div>
            <label
              htmlFor="schedule-end"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5"
            >
              End Time
            </label>
            <input
              id="schedule-end"
              type="time"
              value={hourToTimeString(settings.scheduleEnd)}
              onChange={(e) =>
                onUpdate({ scheduleEnd: timeStringToHour(e.target.value) })
              }
              step="3600"
              className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              data-ocid="settings.select"
            />
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-accent/50 text-xs text-accent-foreground">
          📅 HourLog will beep at the top of each hour between{" "}
          <strong>
            {new Date(2000, 0, 1, settings.scheduleStart).toLocaleTimeString(
              [],
              { hour: "numeric", minute: "2-digit" },
            )}
          </strong>{" "}
          and{" "}
          <strong>
            {new Date(2000, 0, 1, settings.scheduleEnd).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </strong>
          .
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border p-5">
        <h2 className="font-bold text-foreground mb-1">Notifications</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Allow browser notifications to be reminded even when the app is in the
          background.
        </p>
        {notifStatus === "granted" ? (
          <div className="flex items-center gap-3 text-sm text-primary font-semibold">
            <CheckCircle className="h-5 w-5" />
            Notifications are enabled
          </div>
        ) : (
          <Button
            onClick={requestNotification}
            disabled={notifStatus === "requesting" || notifStatus === "denied"}
            variant="outline"
            className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            data-ocid="settings.primary_button"
          >
            {notifStatus === "denied" ? (
              <>
                <BellOff className="h-4 w-4" /> Permission denied
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" /> Enable Notifications
              </>
            )}
          </Button>
        )}
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <Label
              htmlFor="beep-toggle"
              className="font-bold text-foreground block"
            >
              Hourly Beep
            </Label>
            <p className="text-sm text-muted-foreground mt-0.5">
              Play a sound at each hourly prompt
            </p>
          </div>
          <Switch
            id="beep-toggle"
            checked={settings.notificationEnabled}
            onCheckedChange={(v) => onUpdate({ notificationEnabled: v })}
            data-ocid="settings.switch"
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border p-5">
        <h2 className="font-bold text-foreground mb-1">About HourLog</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          HourLog helps you stay accountable by logging what you accomplish each
          hour. At the top of every scheduled hour, you&apos;ll hear a beep and
          get a prompt to reflect. At the end of the day, review your full
          timeline.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-secondary rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary">⏰</p>
            <p className="text-xs text-muted-foreground mt-1">Hourly Beeps</p>
          </div>
          <div className="bg-secondary rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary">📊</p>
            <p className="text-xs text-muted-foreground mt-1">
              Daily Summaries
            </p>
          </div>
        </div>
      </div>

      <footer className="pb-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
