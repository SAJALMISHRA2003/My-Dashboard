import { useState } from "react";
import { useApp } from "../contexts/AppContext";

const EVENT_COLORS = ["#7c3aed", "#059669", "#0ea5e9", "#f59e0b", "#ec4899", "#14b8a6", "#f97316", "#ef4444"];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function Calendar() {
  const { events, addEvent, deleteEvent } = useApp();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(today.toISOString().split("T")[0]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventColor, setNewEventColor] = useState(EVENT_COLORS[0]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const getEventsForDate = (dateStr: string) => events.filter((e) => e.date === dateStr);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !selectedDate) return;
    addEvent(selectedDate, newEventTitle.trim(), newEventColor);
    setNewEventTitle("");
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const todayStr = today.toISOString().split("T")[0];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6 fade-up">
            <h2 className="text-2xl font-bold text-foreground">Calendar</h2>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 fade-up">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-5">
              <button onClick={prevMonth} className="w-8 h-8 rounded-xl bg-secondary hover:bg-muted flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h3 className="text-base font-semibold text-foreground">{MONTHS[month]} {year}</h3>
              <button onClick={nextMonth} className="w-8 h-8 rounded-xl bg-secondary hover:bg-muted flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const dayEvents = getEventsForDate(dateStr);
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`relative aspect-square rounded-xl text-sm flex flex-col items-center justify-start pt-1.5 transition-all ${
                      isSelected ? "bg-primary text-primary-foreground" :
                      isToday ? "bg-primary/20 text-primary border border-primary/40" :
                      "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <span className="font-medium text-xs">{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <div key={ev.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? "white" : ev.color }} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Events panel */}
        <div className="fade-up">
          <h3 className="text-base font-semibold text-foreground mb-4">
            {selectedDate ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "Select a date"}
          </h3>

          {/* Add event */}
          {selectedDate && (
            <form onSubmit={handleAddEvent} className="bg-card border border-border rounded-2xl p-4 mb-4">
              <input
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="New event..."
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
              />
              <div className="flex gap-1.5 flex-wrap mb-3">
                {EVENT_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setNewEventColor(c)}
                    className={`w-6 h-6 rounded-full transition-all ${newEventColor === c ? "ring-2 ring-white ring-offset-1 ring-offset-card scale-110" : "hover:scale-110"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <button type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                + Add Event
              </button>
            </form>
          )}

          {/* Events list */}
          <div className="space-y-2">
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No events for this day</p>
            ) : (
              selectedEvents.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl group">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                  <span className="text-sm text-foreground flex-1">{ev.title}</span>
                  <button onClick={() => deleteEvent(ev.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
