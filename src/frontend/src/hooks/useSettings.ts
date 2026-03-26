import { useEffect, useState } from "react";

export interface Settings {
  scheduleStart: number;
  scheduleEnd: number;
  notificationEnabled: boolean;
}

const DEFAULTS: Settings = {
  scheduleStart: 9,
  scheduleEnd: 18,
  notificationEnabled: false,
};

const KEY = "hourlog_settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch (_) {
      /* ignore */
    }
    return DEFAULTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch (_) {
      /* ignore */
    }
  }, [settings]);

  const update = (partial: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...partial }));

  return { settings, update };
}
