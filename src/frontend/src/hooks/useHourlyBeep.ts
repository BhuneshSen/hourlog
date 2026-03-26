import { useCallback, useEffect, useRef, useState } from "react";

export interface HourlyBeepState {
  showModal: boolean;
  currentHour: number;
  openModal: (hour?: number) => void;
  closeModal: () => void;
}

export function useHourlyBeep(
  scheduleStart: number,
  scheduleEnd: number,
): HourlyBeepState {
  const [showModal, setShowModal] = useState(false);
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());
  const lastBeepedHour = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
      // Double beep
      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(1000, ctx.currentTime);
          gain2.gain.setValueAtTime(0.25, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + 0.25,
          );
          osc2.start(ctx.currentTime);
          osc2.stop(ctx.currentTime + 0.25);
        } catch (_) {
          /* ignore */
        }
      }, 350);
    } catch (_) {
      /* Audio not available */
    }
  }, []);

  const showNotification = useCallback((hour: number) => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;
    const label = new Date(2000, 0, 1, hour).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    try {
      new Notification("HourLog ⏰", {
        body: `It's ${label}! What did you accomplish this hour?`,
        icon: "/assets/icon-192.png",
        badge: "/assets/icon-192.png",
        tag: "hourlog-beep",
        requireInteraction: true,
      });
    } catch (_) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const second = now.getSeconds();

      if (
        minute === 0 &&
        second < 30 &&
        hour >= scheduleStart &&
        hour < scheduleEnd &&
        lastBeepedHour.current !== hour
      ) {
        lastBeepedHour.current = hour;
        setCurrentHour(hour);
        playBeep();
        showNotification(hour);
        setShowModal(true);
      }
    };

    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [scheduleStart, scheduleEnd, playBeep, showNotification]);

  const openModal = useCallback((hour?: number) => {
    setCurrentHour(hour ?? new Date().getHours());
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return { showModal, currentHour, openModal, closeModal };
}
