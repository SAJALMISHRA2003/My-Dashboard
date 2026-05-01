import { useApp } from "../contexts/AppContext";

function formatHour(hour: number) {
  if (hour === 0) return "12:00 AM";
  if (hour === 12) return "12:00 PM";
  return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
}

export default function Planner() {
  const { planner, updatePlanner } = useApp();
  const now = new Date();
  const currentHour = now.getHours();

  const today = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const filled = planner.filter((p) => p.text.trim()).length;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 fade-up">
          <h2 className="text-2xl font-bold text-foreground">Daily Planner</h2>
          <p className="text-muted-foreground text-sm">{today} · {filled} slots filled</p>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden fade-up">
          <div className="p-4 border-b border-border bg-secondary/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Schedule (6 AM – 11 PM)</p>
          </div>
          <div className="divide-y divide-border">
            {planner.map((entry) => {
              const isCurrent = entry.hour === currentHour;
              const isPast = entry.hour < currentHour;
              return (
                <div
                  key={entry.hour}
                  className={`flex items-center group transition-all ${isCurrent ? "bg-primary/5 border-l-2 border-primary" : isPast ? "opacity-50" : ""}`}
                >
                  <div className={`w-24 shrink-0 px-4 py-3 text-xs font-medium ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                    {formatHour(entry.hour)}
                    {isCurrent && <div className="text-xs text-primary mt-0.5 font-bold">NOW</div>}
                  </div>
                  <div className="flex-1 px-3 py-2">
                    <input
                      value={entry.text}
                      onChange={(e) => updatePlanner(entry.hour, e.target.value)}
                      placeholder={isCurrent ? "What are you working on right now?" : "Add task..."}
                      className={`w-full bg-transparent text-sm focus:outline-none transition-colors ${
                        entry.text ? "text-foreground" : "text-muted-foreground"
                      } placeholder:text-muted-foreground/50 group-hover:placeholder:text-muted-foreground`}
                    />
                  </div>
                  {entry.text && (
                    <button
                      onClick={() => updatePlanner(entry.hour, "")}
                      className="px-3 py-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">Changes are saved automatically</p>
      </div>
    </div>
  );
}
