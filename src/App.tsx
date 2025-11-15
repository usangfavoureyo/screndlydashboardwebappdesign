import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { DashboardOverview } from "./components/DashboardOverview";
import { ChannelsPage } from "./components/ChannelsPage";
import { PlatformsPage } from "./components/PlatformsPage";
import { LogsPage } from "./components/LogsPage";
import { RecentActivityPage } from "./components/RecentActivityPage";
import { ThumbnailDesignerPage } from "./components/ThumbnailDesignerPage";
import { Navigation } from "./components/Navigation";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { SettingsPanel } from "./components/SettingsPanel";
import { NotificationPanel } from "./components/NotificationPanel";
import { SplashScreen } from "./components/SplashScreen";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "success" as const,
      title: "Upload Complete",
      message:
        "Dune: Part Three - Official Trailer uploaded successfully to YouTube",
      timestamp: "2 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "success" as const,
      title: "Post Published",
      message: "New trailer posted to Instagram and TikTok",
      timestamp: "15 minutes ago",
      read: false,
    },
    {
      id: "3",
      type: "error" as const,
      title: "Upload Failed",
      message:
        "Failed to upload to Facebook. API rate limit exceeded.",
      timestamp: "1 hour ago",
      read: false,
    },
    {
      id: "4",
      type: "info" as const,
      title: "New Channel Added",
      message: "Marvel Entertainment is now being monitored",
      timestamp: "3 hours ago",
      read: true,
    },
    {
      id: "5",
      type: "warning" as const,
      title: "API Key Expiring",
      message: "Your YouTube API key will expire in 7 days",
      timestamp: "1 day ago",
      read: true,
    },
  ]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("dashboard");
    setIsSettingsOpen(false);
    setIsNotificationsOpen(false);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsSettingsOpen(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, read: true })),
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(
    (n) => !n.read,
  ).length;

  if (isLoading) {
    return (
      <SplashScreen onComplete={() => setIsLoading(false)} />
    );
  }

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div className="min-h-screen bg-white dark:bg-[#000000]">
          <Navigation
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onToggleSettings={toggleSettings}
            onToggleNotifications={toggleNotifications}
            onLogout={handleLogout}
            unreadNotifications={unreadCount}
          />
          <main className="lg:ml-64 pb-16 lg:pb-0">
            <div className="p-4 sm:p-6 lg:p-8">
              {currentPage === "dashboard" && (
                <DashboardOverview
                  onNavigate={setCurrentPage}
                />
              )}
              {currentPage === "channels" && <ChannelsPage />}
              {currentPage === "platforms" && <PlatformsPage />}
              {currentPage === "logs" && <LogsPage />}
              {currentPage === "activity" && (
                <RecentActivityPage />
              )}
              {currentPage === "thumbnail" && (
                <ThumbnailDesignerPage />
              )}
            </div>
          </main>
          <MobileBottomNav
            currentPage={currentPage}
            onNavigate={setCurrentPage}
          />
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onLogout={handleLogout}
          />
          <NotificationPanel
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onClearAll={clearAllNotifications}
          />
        </div>
      )}
    </ThemeProvider>
  );
}