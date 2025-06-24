import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
} from "lucide-react";

const Navigation = ({ currentView, onViewChange }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentTime(time);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "daily", label: "Daily Plan", icon: CheckSquare },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "pomodoro", label: "Pomodoro", icon: Clock },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center mr-8">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">StudyPlanner</h1>
            </div>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView === item.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clock */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold shadow-sm">
                {currentTime}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex space-x-1 pb-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  currentView === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4 mb-1" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
