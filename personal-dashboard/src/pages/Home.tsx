import { useApp } from "../contexts/AppContext";
import type { Page } from "../types";

const newsHeadlines = [
  { cat: "Tech", text: "OpenAI releases GPT-5 with multimodal reasoning capabilities" },
  { cat: "Science", text: "NASA confirms water ice deposits near lunar south pole" },
  { cat: "Tech", text: "Apple unveils Vision Pro 2 with improved spatial computing features" },
  { cat: "Business", text: "S&P 500 reaches record high amid strong earnings season" },
  { cat: "Health", text: "Researchers discover breakthrough in Alzheimer's treatment" },
  { cat: "Tech", text: "Google DeepMind's AlphaFold 3 predicts protein interactions with 95% accuracy" },
  { cat: "World", text: "G7 nations agree on new framework for AI governance and safety" },
  { cat: "Science", text: "James Webb Space Telescope captures oldest galaxy ever observed" },
  { cat: "Business", text: "Electric vehicle sales surpass gasoline cars in Europe for the first time" },
  { cat: "Health", text: "New study links gut microbiome diversity to improved mental health" },
];

export default function Home() {
  const { tasks, goals, pomodoroMode, pomodoroRunning, pomodoroSessions, setCurrentPage, events } = useApp();
  const now = new Date();
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const todayStr = now.toISOString().split("T")[0];
  const todayEvents = events.filter((e) => e.date === todayStr);
  const avgGoalProgress = goals.length
    ? Math.round(goals.reduce((acc, g) => acc + (g.current / g.target) * 100, 0) / goals.length)
    : 0;

  const greetingHour = now.getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="fade-up">
        <h1 className="text-2xl font-bold text-foreground">{greeting}, Sajal 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-up">
        <StatCard
          label="Pending Tasks"
          value={pendingTasks.toString()}
          sub={`${completedTasks} completed`}
          color="text-purple-400"
          bg="bg-purple-500/10"
          icon="✅"
          onClick={() => setCurrentPage("tasks")}
        />
        <StatCard
          label="Goal Progress"
          value={`${avgGoalProgress}%`}
          sub={`${goals.length} active goals`}
          color="text-blue-400"
          bg="bg-blue-500/10"
          icon="🎯"
          onClick={() => setCurrentPage("goals")}
        />
        <StatCard
          label="Pomodoro"
          value={`${pomodoroSessions}`}
          sub={pomodoroRunning ? `${pomodoroMode} mode • running` : "sessions today"}
          color="text-orange-400"
          bg="bg-orange-500/10"
          icon="⏱"
          onClick={() => setCurrentPage("pomodoro")}
        />
        <StatCard
          label="Today's Events"
          value={todayEvents.length.toString()}
          sub="scheduled today"
          color="text-green-400"
          bg="bg-green-500/10"
          icon="📅"
          onClick={() => setCurrentPage("calendar")}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* News ticker */}
        <div className="col-span-full bg-card border border-border rounded-2xl p-4 overflow-hidden fade-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live News</p>
          </div>
          <div className="flex overflow-hidden">
            <div className="flex gap-8 ticker whitespace-nowrap">
              {[...newsHeadlines, ...newsHeadlines].map((h, i) => (
                <span key={i} className="text-sm text-foreground">
                  <span className="text-primary font-semibold mr-2">[{h.cat}]</span>{h.text}
                  <span className="mx-4 text-muted-foreground">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-card border border-border rounded-2xl p-5 fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Recent Tasks</h3>
            <button onClick={() => setCurrentPage("tasks")} className="text-xs text-primary hover:text-primary/80 transition-colors">View all →</button>
          </div>
          {tasks.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">No tasks yet. Add some!</p>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2.5 bg-secondary/50 rounded-xl">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${task.priority === "high" ? "bg-red-400" : task.priority === "normal" ? "bg-yellow-400" : "bg-green-400"}`} />
                  <span className={`text-sm flex-1 truncate ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${task.priority === "high" ? "priority-high" : task.priority === "normal" ? "priority-normal" : "priority-low"}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals Overview */}
        <div className="bg-card border border-border rounded-2xl p-5 fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Goal Progress</h3>
            <button onClick={() => setCurrentPage("goals")} className="text-xs text-primary hover:text-primary/80 transition-colors">View all →</button>
          </div>
          {goals.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">No goals yet. Add some!</p>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 3).map((goal) => {
                const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{goal.title}</span>
                      <span className="text-xs text-muted-foreground">{goal.current}/{goal.target} {goal.unit}</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: goal.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Today's Events */}
        <div className="bg-card border border-border rounded-2xl p-5 fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Today's Events</h3>
            <button onClick={() => setCurrentPage("calendar")} className="text-xs text-primary hover:text-primary/80 transition-colors">View calendar →</button>
          </div>
          {todayEvents.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">No events scheduled for today.</p>
          ) : (
            <div className="space-y-2">
              {todayEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2.5 bg-secondary/50 rounded-xl">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: event.color }} />
                  <span className="text-sm text-foreground">{event.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pomodoro Status */}
        <div className="bg-card border border-border rounded-2xl p-5 fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">Pomodoro Status</h3>
            <button onClick={() => setCurrentPage("pomodoro")} className="text-xs text-primary hover:text-primary/80 transition-colors">Open timer →</button>
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${pomodoroRunning ? "bg-orange-500/20 border border-orange-500/30" : "bg-secondary"}`}>
              ⏱
            </div>
            <div>
              <p className="text-foreground font-medium capitalize">{pomodoroMode} mode</p>
              <p className="text-muted-foreground text-sm">{pomodoroRunning ? "Timer is running..." : "Timer is stopped"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{pomodoroSessions} session{pomodoroSessions !== 1 ? "s" : ""} completed today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color, bg, icon, onClick }: {
  label: string; value: string; sub: string; color: string; bg: string; icon: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="bg-card border border-border rounded-2xl p-4 text-left hover:border-primary/30 transition-all group w-full">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-lg`}>{icon}</div>
        <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-foreground font-medium mt-0.5">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </button>
  );
}
