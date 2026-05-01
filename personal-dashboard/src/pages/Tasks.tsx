import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import type { Task } from "../types";

const PRIORITY_ORDER = { high: 0, normal: 1, low: 2 };

export default function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask } = useApp();
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("normal");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [sortByPriority, setSortByPriority] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), newPriority);
    setNewTitle("");
  };

  let filtered = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });
  if (sortByPriority) {
    filtered = [...filtered].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  }

  const pending = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 fade-up">
          <h2 className="text-2xl font-bold text-foreground">Tasks</h2>
          <div className="flex gap-4 mt-2">
            <span className="text-sm text-muted-foreground"><span className="text-primary font-bold">{pending}</span> pending</span>
            <span className="text-sm text-muted-foreground"><span className="text-green-400 font-bold">{completed}</span> completed</span>
          </div>
        </div>

        {/* Add task form */}
        <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-4 mb-6 fade-up">
          <div className="flex gap-3 mb-3">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
              className="bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            + Add Task
          </button>
        </form>

        {/* Filters */}
        <div className="flex items-center justify-between mb-4 fade-up">
          <div className="flex gap-2">
            {(["all", "pending", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortByPriority(!sortByPriority)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${sortByPriority ? "bg-primary/20 text-primary border border-primary/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
            Priority
          </button>
        </div>

        {/* Task list */}
        <div className="space-y-2 fade-up">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-sm">{filter === "completed" ? "No completed tasks yet" : "No tasks found. Add one above!"}</p>
            </div>
          ) : (
            filtered.map((task) => <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />)
          )}
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className={`flex items-center gap-3 p-3.5 bg-card border rounded-2xl transition-all group ${task.completed ? "border-border opacity-60" : "border-border hover:border-primary/30"}`}>
      <button
        onClick={() => onToggle(task.id)}
        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
          task.completed ? "border-primary bg-primary" : `border-muted-foreground hover:border-primary`
        }`}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span className={`flex-1 text-sm ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.priority === "high" ? "priority-high" : task.priority === "normal" ? "priority-normal" : "priority-low"}`}>
        {task.priority}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
