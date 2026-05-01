export interface Task {
  id: string;
  title: string;
  priority: "high" | "normal" | "low";
  completed: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export interface PlannerEntry {
  hour: number;
  text: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type PomodoroMode = "work" | "short" | "long";

export type Page =
  | "home"
  | "news"
  | "tasks"
  | "goals"
  | "planner"
  | "calendar"
  | "pomodoro"
  | "tictactoe"
  | "ai";
