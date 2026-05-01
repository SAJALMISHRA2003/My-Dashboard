import { AppProvider, useApp } from "./contexts/AppContext";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import News from "./pages/News";
import Tasks from "./pages/Tasks";
import Goals from "./pages/Goals";
import Planner from "./pages/Planner";
import Calendar from "./pages/Calendar";
import Pomodoro from "./pages/Pomodoro";
import TicTacToe from "./pages/TicTacToe";
import AIAssistant from "./pages/AIAssistant";

function PageContent() {
  const { currentPage } = useApp();
  switch (currentPage) {
    case "home": return <Home />;
    case "news": return <News />;
    case "tasks": return <Tasks />;
    case "goals": return <Goals />;
    case "planner": return <Planner />;
    case "calendar": return <Calendar />;
    case "pomodoro": return <Pomodoro />;
    case "tictactoe": return <TicTacToe />;
    case "ai": return <AIAssistant />;
    default: return <Home />;
  }
}

function Dashboard() {
  const { isLoggedIn } = useApp();

  if (!isLoggedIn) return <Login />;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <PageContent />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
