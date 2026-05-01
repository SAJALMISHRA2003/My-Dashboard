import { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "../contexts/AppContext";
import type { PomodoroMode } from "../types";

const DURATIONS: Record<PomodoroMode, number> = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const MODE_LABELS: Record<PomodoroMode, string> = {
  work: "Focus Time",
  short: "Short Break",
  long: "Long Break",
};

const MODE_COLORS: Record<PomodoroMode, string> = {
  work: "#7c3aed",
  short: "#059669",
  long: "#0ea5e9",
};

function playChime() {
  try {
    const ctx = new AudioContext();
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.25);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.25 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 0.8);
      osc.start(ctx.currentTime + i * 0.25);
      osc.stop(ctx.currentTime + i * 0.25 + 0.8);
    });
  } catch {}
}

function requestNotification(title: string, body: string) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") new Notification(title, { body });
      });
    }
  }
}

export default function Pomodoro() {
  const { pomodoroMode, setPomodoroMode, pomodoroRunning, setPomodoroRunning, pomodoroSessions, setPomodoroSessions } = useApp();
  const [timeLeft, setTimeLeft] = useState(DURATIONS[pomodoroMode]);
  const [totalTime, setTotalTime] = useState(DURATIONS[pomodoroMode]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback((mode: PomodoroMode) => {
    setPomodoroRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(DURATIONS[mode]);
    setTotalTime(DURATIONS[mode]);
  }, [setPomodoroRunning]);

  const switchMode = useCallback((mode: PomodoroMode) => {
    setPomodoroMode(mode);
    reset(mode);
  }, [setPomodoroMode, reset]);

  useEffect(() => {
    if (!pomodoroRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setPomodoroRunning(false);
          playChime();
          if (pomodoroMode === "work") {
            setPomodoroSessions((s) => s + 1);
            requestNotification("Pomodoro Complete!", "Great work! Time for a break.");
          } else {
            requestNotification("Break Over!", "Time to get back to work!");
          }
          return 0;
        }
        // Notify at 1 minute remaining
        if (prev === 61) {
          requestNotification("1 Minute Left!", `Your ${MODE_LABELS[pomodoroMode]} ends in 1 minute.`);
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [pomodoroRunning, pomodoroMode, setPomodoroRunning, setPomodoroSessions]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = 1 - timeLeft / totalTime;

  const size = 240;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const color = MODE_COLORS[pomodoroMode];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-lg mx-auto">
        <div className="mb-6 fade-up">
          <h2 className="text-2xl font-bold text-foreground">Pomodoro Timer</h2>
          <p className="text-muted-foreground text-sm">{pomodoroSessions} session{pomodoroSessions !== 1 ? "s" : ""} completed today</p>
        </div>

        {/* Mode selector */}
        <div className="flex gap-2 mb-8 bg-card border border-border rounded-2xl p-1.5 fade-up">
          {(["work", "short", "long"] as PomodoroMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => switchMode(mode)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                pomodoroMode === mode ? "text-white" : "text-muted-foreground hover:text-foreground"
              }`}
              style={pomodoroMode === mode ? { backgroundColor: color } : {}}
            >
              {mode === "work" ? "Focus" : mode === "short" ? "Short Break" : "Long Break"}
            </button>
          ))}
        </div>

        {/* Ring */}
        <div className="flex flex-col items-center mb-8 fade-up">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className={pomodoroRunning ? "ring-pulse" : ""}>
              {/* Background ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth={strokeWidth}
              />
              {/* Progress ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                className="pomodoro-ring"
                style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold font-mono text-foreground tracking-tight">
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </span>
              <span className="text-sm text-muted-foreground mt-1">{MODE_LABELS[pomodoroMode]}</span>
              {pomodoroRunning && <span className="text-xs text-green-400 mt-1 animate-pulse">● Running</span>}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => reset(pomodoroMode)}
              className="w-12 h-12 rounded-full bg-card border border-border hover:bg-secondary flex items-center justify-center transition-all text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button
              onClick={() => setPomodoroRunning(!pomodoroRunning)}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all text-white font-bold text-xl shadow-lg"
              style={{ backgroundColor: color, boxShadow: `0 0 30px ${color}60` }}
            >
              {pomodoroRunning ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <button
              onClick={() => {
                const modes: PomodoroMode[] = ["work", "short", "long"];
                const next = modes[(modes.indexOf(pomodoroMode) + 1) % modes.length];
                switchMode(next);
              }}
              className="w-12 h-12 rounded-full bg-card border border-border hover:bg-secondary flex items-center justify-center transition-all text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 fade-up">
          {(["work", "short", "long"] as PomodoroMode[]).map((mode) => (
            <div key={mode} className={`bg-card border rounded-xl p-3 text-center ${pomodoroMode === mode ? "border-primary/40" : "border-border"}`}>
              <p className="text-xs text-muted-foreground capitalize mb-1">{mode === "work" ? "Focus" : mode === "short" ? "Short Break" : "Long Break"}</p>
              <p className="text-sm font-bold text-foreground">{DURATIONS[mode] / 60} min</p>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-card border border-border rounded-xl p-3 text-center fade-up">
          <p className="text-xs text-muted-foreground">
            {Notification.permission === "granted"
              ? "🔔 Browser notifications enabled"
              : "⚠️ Click play to enable browser notifications"}
          </p>
        </div>
      </div>
    </div>
  );
}
