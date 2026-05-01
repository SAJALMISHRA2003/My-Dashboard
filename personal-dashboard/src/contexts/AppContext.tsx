import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Task, Goal, PlannerEntry, CalendarEvent, ChatMessage, PomodoroMode, Page } from "../types";

interface AppContextValue {
  // Auth
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Navigation
  currentPage: Page;
  setCurrentPage: (page: Page) => void;

  // Tasks
  tasks: Task[];
  addTask: (title: string, priority: Task["priority"]) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, current: number) => void;
  deleteGoal: (id: string) => void;

  // Planner
  planner: PlannerEntry[];
  updatePlanner: (hour: number, text: string) => void;

  // Calendar Events
  events: CalendarEvent[];
  addEvent: (date: string, title: string, color: string) => void;
  deleteEvent: (id: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (role: "user" | "assistant", content: string) => void;
  clearChat: () => void;

  // Pomodoro state (for home dashboard)
  pomodoroMode: PomodoroMode;
  setPomodoroMode: (mode: PomodoroMode) => void;
  pomodoroRunning: boolean;
  setPomodoroRunning: (running: boolean) => void;
  pomodoroSessions: number;
  setPomodoroSessions: (sessions: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`dashboard_${key}`);
    if (stored) return JSON.parse(stored) as T;
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`dashboard_${key}`, JSON.stringify(value));
  } catch {}
}

const defaultPlanner: PlannerEntry[] = Array.from({ length: 18 }, (_, i) => ({
  hour: 6 + i,
  text: "",
}));

const defaultGoals: Goal[] = [
  { id: "1", title: "Daily Reading", current: 20, target: 30, unit: "pages", color: "#7c3aed" },
  { id: "2", title: "Exercise", current: 3, target: 5, unit: "days/week", color: "#059669" },
  { id: "3", title: "Water Intake", current: 6, target: 8, unit: "glasses", color: "#0ea5e9" },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => loadFromStorage("loggedIn", false));
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage("tasks", []));
  const [goals, setGoals] = useState<Goal[]>(() => loadFromStorage("goals", defaultGoals));
  const [planner, setPlanner] = useState<PlannerEntry[]>(() => loadFromStorage("planner", defaultPlanner));
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadFromStorage("events", []));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadFromStorage("chat", []));
  const [pomodoroMode, setPomodoroMode] = useState<PomodoroMode>("work");
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSessions, setPomodoroSessions] = useState(() => loadFromStorage("pomodoroSessions", 0));

  useEffect(() => { saveToStorage("loggedIn", isLoggedIn); }, [isLoggedIn]);
  useEffect(() => { saveToStorage("tasks", tasks); }, [tasks]);
  useEffect(() => { saveToStorage("goals", goals); }, [goals]);
  useEffect(() => { saveToStorage("planner", planner); }, [planner]);
  useEffect(() => { saveToStorage("events", events); }, [events]);
  useEffect(() => { saveToStorage("chat", chatMessages); }, [chatMessages]);
  useEffect(() => { saveToStorage("pomodoroSessions", pomodoroSessions); }, [pomodoroSessions]);

  const login = useCallback((email: string, password: string): boolean => {
    if (email === "sajalmishra8687@gmail.com" && password === "Sajal@123") {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentPage("home");
  }, []);

  const addTask = useCallback((title: string, priority: Task["priority"]) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, "id">) => {
    setGoals((prev) => [...prev, { ...goal, id: crypto.randomUUID() }]);
  }, []);

  const updateGoal = useCallback((id: string, current: number) => {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, current: Math.min(current, g.target) } : g));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const updatePlanner = useCallback((hour: number, text: string) => {
    setPlanner((prev) => prev.map((p) => p.hour === hour ? { ...p, text } : p));
  }, []);

  const addEvent = useCallback((date: string, title: string, color: string) => {
    const event: CalendarEvent = { id: crypto.randomUUID(), date, title, color };
    setEvents((prev) => [...prev, event]);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addChatMessage = useCallback((role: "user" | "assistant", content: string) => {
    const msg: ChatMessage = { id: crypto.randomUUID(), role, content, timestamp: new Date().toISOString() };
    setChatMessages((prev) => [...prev, msg]);
  }, []);

  const clearChat = useCallback(() => { setChatMessages([]); }, []);

  return (
    <AppContext.Provider value={{
      isLoggedIn, login, logout,
      currentPage, setCurrentPage,
      tasks, addTask, toggleTask, deleteTask,
      goals, addGoal, updateGoal, deleteGoal,
      planner, updatePlanner,
      events, addEvent, deleteEvent,
      chatMessages, addChatMessage, clearChat,
      pomodoroMode, setPomodoroMode,
      pomodoroRunning, setPomodoroRunning,
      pomodoroSessions, setPomodoroSessions,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
