import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import type { Goal } from "../types";

const COLORS = ["#7c3aed", "#059669", "#0ea5e9", "#f59e0b", "#ec4899", "#14b8a6", "#f97316"];

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", current: 0, target: 10, unit: "", color: COLORS[0] });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.unit.trim()) return;
    addGoal({ ...form, current: Number(form.current), target: Number(form.target) });
    setForm({ title: "", current: 0, target: 10, unit: "", color: COLORS[0] });
    setShowForm(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 fade-up">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Goals</h2>
            <p className="text-muted-foreground text-sm">{goals.length} active goals</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors glow-primary"
          >
            + Add Goal
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-card border border-primary/30 rounded-2xl p-5 mb-6 fade-up space-y-3">
            <h3 className="font-semibold text-foreground text-sm">New Goal</h3>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Goal title..."
              required
              className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Current</label>
                <input
                  type="number"
                  value={form.current}
                  onChange={(e) => setForm({ ...form, current: Number(e.target.value) })}
                  min={0}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Target</label>
                <input
                  type="number"
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: Number(e.target.value) })}
                  min={1}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Unit</label>
                <input
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="pages, days..."
                  required
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Color</label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className={`w-7 h-7 rounded-full transition-all ${form.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-card scale-110" : "hover:scale-110"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">Save Goal</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-secondary text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground fade-up">
              <p className="text-4xl mb-3">🎯</p>
              <p className="text-sm">No goals yet. Add your first goal!</p>
            </div>
          ) : (
            goals.map((goal, i) => <GoalCard key={goal.id} goal={goal} onUpdate={updateGoal} onDelete={deleteGoal} delay={i * 50} />)
          )}
        </div>
      </div>
    </div>
  );
}

function GoalCard({ goal, onUpdate, onDelete, delay }: { goal: Goal; onUpdate: (id: string, current: number) => void; onDelete: (id: string) => void; delay: number }) {
  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(goal.current.toString());

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all fade-up group" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground text-sm">{goal.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {goal.current} / {goal.target} {goal.unit}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: goal.color }}>{pct}%</span>
          <button onClick={() => onDelete(goal.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: goal.color, boxShadow: `0 0 8px ${goal.color}60` }}
        />
      </div>

      {/* Update progress */}
      {editing ? (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            min={0}
            max={goal.target}
            className="flex-1 bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={() => { onUpdate(goal.id, Number(val)); setEditing(false); }}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
          <button onClick={() => setEditing(false)} className="px-3 py-1.5 bg-secondary text-foreground rounded-lg text-xs hover:bg-muted transition-colors">Cancel</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(goal.id, Math.min(goal.target, goal.current + 1))}
            className="flex-1 py-1.5 text-xs bg-secondary hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >+ 1</button>
          <button
            onClick={() => setEditing(true)}
            className="flex-1 py-1.5 text-xs bg-secondary hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >Update</button>
          {pct >= 100 && <span className="text-xs text-green-400 font-medium flex items-center gap-1">✓ Complete!</span>}
        </div>
      )}
    </div>
  );
}
