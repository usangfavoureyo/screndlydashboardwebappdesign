import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { DashboardOverview } from "./components/DashboardOverview";
import { ChannelsPage } from "./components/ChannelsPage";
import { PlatformsPage } from "./components/PlatformsPage";
import { LogsPage } from "./components/LogsPage";
import { RecentActivityPage } from "./components/RecentActivityPage";
import { DesignSystemPage } from "./components/DesignSystemPage";
import { RSSPage } from "./components/RSSPage";
import { RSSActivityPage } from "./components/RSSActivityPage";
import { TMDbFeedsPage } from "./components/TMDbFeedsPage";
import { TMDbActivityPage } from "./components/TMDbActivityPage";
import { VideoDetailsPage } from "./components/VideoDetailsPage";
import { VideoStudioPage } from "./components/VideoStudioPage";
import { VideoStudioActivityPage } from "./components/VideoStudioActivityPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { TermsPage } from "./components/TermsPage";
import { DisclaimerPage } from "./components/DisclaimerPage";
import { CookiePage } from "./components/CookiePage";
import { ContactPage } from "./components/ContactPage";
import { AboutPage } from "./components/AboutPage";
import { DataDeletionPage } from "./components/DataDeletionPage";
import { AppInfoPage } from "./components/AppInfoPage";
import { APIUsage } from "./components/APIUsage";
import { CommentAutomationPage } from "./components/CommentAutomationPage";
import { UploadManagerPage } from "./components/jobs/UploadManagerPage";
import { Navigation } from "./components/Navigation";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { SettingsPanel } from "./components/SettingsPanel";
import { NotificationPanel } from "./components/NotificationPanel";
import { SplashScreen } from "./components/SplashScreen";
import { ThemeProvider } from "./components/ThemeProvider";
import { TMDbPostsProvider } from "./contexts/TMDbPostsContext";
import { ToastContainer, ToastAction } from "./components/Toast";
import { InstallPrompt } from "./components/InstallPrompt";
import { setFavicon } from "./utils/favicon";
import { useSwipeNavigation } from "./hooks/useSwipeNavigation";
import { haptics } from "./utils/haptics";
import { desktopNotifications } from "./utils/desktopNotifications";
import { registerServiceWorker, setupInstallPrompt } from "./utils/pwa";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [pageBeforeSettings, setPageBeforeSettings] = useState("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialPage, setSettingsInitialPage] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);
  const [isCaptionEditorOpen, setIsCaptionEditorOpen] = useState(false);
  
  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "success" as const,
      title: "Upload Complete",
      message:
        "Dune: Part Three - Official Trailer uploaded successfully to YouTube",
      timestamp: "2 minutes ago",
      read: false,
      source: "upload" as const,
    },
    {
      id: "2",
      type: "success" as const,
      title: "Video Generated",
      message: "Gladiator II - Trailer Review video created successfully",
      timestamp: "8 minutes ago",
      read: false,
      source: "videostudio" as const,
    },
    {
      id: "3",
      type: "success" as const,
      title: "RSS Article Posted",
      message: "Variety: Breaking box office records - Auto-posted to X and Threads",
      timestamp: "10 minutes ago",
      read: false,
      source: "rss" as const,
    },
    {
      id: "4",
      type: "info" as const,
      title: "TMDb Feed Generated",
      message:
        "3 new releases scheduled for today - Gladiator II, Wicked, Red One",
      timestamp: "25 minutes ago",
      read: false,
      source: "tmdb" as const,
    },
    {
      id: "5",
      type: "success" as const,
      title: "TMDb Anniversary Posted",
      message: "The Matrix 25th Anniversary - Auto-posted to all platforms",
      timestamp: "45 minutes ago",
      read: true,
      source: "tmdb" as const,
    },
  ]);
  
  // Toast notifications state
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
    action?: ToastAction;
    duration?: number;
  }>>([]);

  // Set favicon on app load
  useEffect(() => {
    setFavicon();
    
    // Register PWA service worker
    registerServiceWorker().then((registration) => {
      if (registration) {
        console.log('PWA Service Worker registered successfully');
      }
    });
    
    // Setup install prompt
    setupInstallPrompt();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("dashboard");
    setIsSettingsOpen(false);
    setIsNotificationsOpen(false);
  };

  const handleNavigate = (page: string, fromPage?: string) => {
    const staticPages = ['privacy', 'terms', 'disclaimer', 'cookie', 'contact', 'about', 'data-deletion', 'app-info'];
    
    // Handle special settings sub-pages
    const settingsPages = ['settings-comment-reply', 'settings-apikeys', 'settings-video', 'settings-rss', 'settings-tmdb', 'settings-videostudio', 'settings-error', 'settings-cleanup', 'settings-haptic', 'settings-appearance', 'settings-notifications'];
    
    if (page === 'settings') {
      setSettingsInitialPage(null);
      setIsSettingsOpen(true);
      setIsNotificationsOpen(false);
    } else if (settingsPages.includes(page)) {
      // Extract the settings page name (e.g., 'settings-comment-reply' -> 'comment')
      const settingsPage = page.replace('settings-', '').replace('-reply', '');
      setSettingsInitialPage(settingsPage);
      setIsSettingsOpen(true);
      setIsNotificationsOpen(false);
    } else if (page === 'login') {
      // Reset to login page (used when going back from static pages in unauthenticated state)
      setCurrentPage('dashboard');
    } else {
      // If navigating to a static page, close settings first
      if (staticPages.includes(page)) {
        setIsSettingsOpen(false);
      }
      // Track where we came from (if provided)
      if (fromPage) {
        setPreviousPage(fromPage);
      } else {
        // Otherwise, set current page as previous
        setPreviousPage(currentPage);
      }
      setCurrentPage(page);
      // Reset scroll position instantly without animation
      window.scrollTo(0, 0);
    }
  };

  const toggleSettings = () => {
    if (!isSettingsOpen) {
      // Save current page before opening settings
      const staticPages = ['privacy', 'terms', 'disclaimer', 'cookie', 'contact', 'about', 'data-deletion', 'app-info'];
      if (!staticPages.includes(currentPage)) {
        setPageBeforeSettings(currentPage);
      }
    }
    setIsSettingsOpen(!isSettingsOpen);
    setIsNotificationsOpen(false);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    const staticPages = ['privacy', 'terms', 'disclaimer', 'cookie', 'contact', 'about', 'data-deletion', 'app-info'];
    // If currently on a static page, go back to the page before settings
    if (staticPages.includes(currentPage)) {
      setCurrentPage(pageBeforeSettings);
    }
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

  const addNotification = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning', source: 'upload' | 'rss' | 'tmdb' | 'videostudio' | 'system') => {
    const newNotification = {
      id: Date.now().toString(),
      type: type as const,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      source: source as const,
    };
    setNotifications([newNotification, ...notifications]);
    
    // Also send desktop notification if enabled
    const savedSettings = localStorage.getItem('screndlySettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.desktopNotifications) {
          desktopNotifications.sendTyped(type, title, message);
        }
      } catch (e) {
        // Silently fail
      }
    }
  };
  
  // Toast notification helper
  const showToast = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message?: string,
    action?: ToastAction,
    duration?: number
  ) => {
    const toast = {
      id: Date.now().toString(),
      type,
      title,
      message,
      action,
      duration,
    };
    setToasts(prev => [...prev, toast]);
  };
  
  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Handle notification actions (approve, schedule, view, dismiss)
  const handleNotificationAction = (notificationId: string, actionType: string) => {
    haptics.medium();
    
    // Handle different action types
    switch (actionType) {
      case 'approve':
        showToast('success', 'Approved', 'Post has been approved and scheduled');
        // Remove the notification after action
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        break;
      case 'schedule':
        showToast('info', 'Scheduling', 'Opening schedule dialog...');
        // Navigate to appropriate page
        break;
      case 'view':
        showToast('info', 'Opening details');
        // Navigate to details page
        break;
      case 'dismiss':
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        break;
    }
  };

  // Bottom navigation pages in order
  const bottomNavPages = ['dashboard', 'channels', 'platforms', 'rss', 'tmdb', 'video-studio'];

  // Swipe navigation handlers
  const handleSwipeLeft = () => {
    // Disable swipe when caption editor is open
    if (isCaptionEditorOpen) {
      return;
    }
    
    // If notifications panel is open, close it (swipe to dashboard)
    if (isNotificationsOpen) {
      haptics.light();
      setIsNotificationsOpen(false);
      return;
    }
    
    // Disable swipe left when settings panel is open
    if (isSettingsOpen) {
      return;
    }
    
    const currentIndex = bottomNavPages.indexOf(currentPage);
    
    // Special case: Swipe left on video-studio page opens settings
    if (currentPage === 'video-studio') {
      haptics.light();
      toggleSettings();
      return;
    }
    
    if (currentIndex !== -1 && currentIndex < bottomNavPages.length - 1) {
      haptics.light();
      handleNavigate(bottomNavPages[currentIndex + 1]);
    }
  };

  const handleSwipeRight = () => {
    // Disable swipe when caption editor is open
    if (isCaptionEditorOpen) {
      return;
    }
    
    // Disable swipe right when notifications panel is open
    if (isNotificationsOpen) {
      return;
    }
    
    // If settings panel is open, close it (swipe to logs page)
    if (isSettingsOpen) {
      haptics.light();
      handleCloseSettings();
      return;
    }
    
    const currentIndex = bottomNavPages.indexOf(currentPage);
    
    // Special case: Swipe right on dashboard opens notifications
    if (currentPage === 'dashboard') {
      haptics.light();
      toggleNotifications();
      return;
    }
    
    if (currentIndex > 0) {
      haptics.light();
      handleNavigate(bottomNavPages[currentIndex - 1]);
    }
  };

  // Only enable swipe navigation on bottom nav pages or when notifications/settings are open
  // Disable swipe when caption editor is open
  const isBottomNavPage = bottomNavPages.includes(currentPage);
  const isSwipeEnabled = (isBottomNavPage || isNotificationsOpen || isSettingsOpen) && !isCaptionEditorOpen;

  useSwipeNavigation({
    onSwipeLeft: isSwipeEnabled ? handleSwipeLeft : () => {},
    onSwipeRight: isSwipeEnabled ? handleSwipeRight : () => {},
    // Decreased sensitivity (increased swipe distance) - 80px default, 120px for logs
    minSwipeDistance: 80,
    increasedMinSwipeDistance: currentPage === 'logs' ? 120 : undefined,
  });

  if (isLoading) {
    return (
      <ThemeProvider>
        <SplashScreen onComplete={() => setIsLoading(false)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <TMDbPostsProvider>
        {!isAuthenticated ? (
          <>
            {currentPage === 'terms' ? (
              <TermsPage onNavigate={handleNavigate} isAuthenticated={false} />
            ) : currentPage === 'privacy' ? (
              <PrivacyPage onNavigate={handleNavigate} isAuthenticated={false} />
            ) : currentPage === 'disclaimer' ? (
              <DisclaimerPage onNavigate={handleNavigate} isAuthenticated={false} />
            ) : (
              <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />
            )}
          </>
        ) : (
          <div className="min-h-screen bg-white dark:bg-[#000000]">
            <Navigation
              currentPage={currentPage}
              onNavigate={handleNavigate}
              onToggleSettings={toggleSettings}
              onToggleNotifications={toggleNotifications}
              onLogout={handleLogout}
              unreadNotifications={unreadCount}
            />
            <main className="lg:ml-64 pb-16 lg:pb-0">
              <div className="p-4 sm:p-6 lg:p-8 transition-opacity duration-200">
                {currentPage === "dashboard" && (
                  <DashboardOverview
                    onNavigate={handleNavigate}
                  />
                )}
                {currentPage === "channels" && <ChannelsPage />}
                {currentPage === "platforms" && <PlatformsPage />}
                {currentPage === "logs" && <LogsPage onNewNotification={addNotification} onNavigate={handleNavigate} />}
                {currentPage === "activity" && (
                  <RecentActivityPage onNavigate={handleNavigate} />
                )}
                {currentPage === "design-system" && (
                  <DesignSystemPage onNavigate={handleNavigate} />
                )}
                {currentPage === "rss" && (
                  <RSSPage onNavigate={handleNavigate} />
                )}
                {currentPage === "rss-activity" && (
                  <RSSActivityPage onNavigate={handleNavigate} previousPage={previousPage} />
                )}
                {currentPage === "tmdb" && (
                  <TMDbFeedsPage onNavigate={handleNavigate} previousPage={previousPage} />
                )}
                {currentPage === "tmdb-activity" && (
                  <TMDbActivityPage onNavigate={handleNavigate} previousPage={previousPage} />
                )}
                {currentPage === "video-details" && (
                  <VideoDetailsPage onNavigate={handleNavigate} previousPage={previousPage} />
                )}
                {currentPage === "video-studio" && (
                  <VideoStudioPage onNavigate={handleNavigate} previousPage={previousPage} onCaptionEditorChange={setIsCaptionEditorOpen} />
                )}
                {currentPage === "video-studio-activity" && (
                  <VideoStudioActivityPage onNavigate={handleNavigate} previousPage={previousPage} />
                )}
                {currentPage === "privacy" && <PrivacyPage onNavigate={handleNavigate} />}
                {currentPage === "terms" && <TermsPage onNavigate={handleNavigate} />}
                {currentPage === "disclaimer" && <DisclaimerPage onNavigate={handleNavigate} />}
                {currentPage === "cookie" && <CookiePage onNavigate={handleNavigate} />}
                {currentPage === "contact" && <ContactPage onNavigate={handleNavigate} />}
                {currentPage === "about" && <AboutPage onNavigate={handleNavigate} />}
                {currentPage === "data-deletion" && <DataDeletionPage onNavigate={handleNavigate} />}
                {currentPage === "app-info" && <AppInfoPage onNavigate={handleNavigate} />}
                {currentPage === "api-usage" && <APIUsage onBack={() => handleNavigate(previousPage || "dashboard")} previousPage={previousPage} />}
                {currentPage === "comment-automation" && <CommentAutomationPage onBack={() => handleNavigate(previousPage || "dashboard")} previousPage={previousPage} />}
                {currentPage === "upload-manager" && <UploadManagerPage onBack={() => handleNavigate(previousPage || "dashboard")} />}
              </div>
            </main>
            <MobileBottomNav
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />
            {isSettingsOpen && (
              <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={handleCloseSettings}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
                pageBeforeSettings={pageBeforeSettings}
                onNewNotification={addNotification}
                initialPage={settingsInitialPage}
              />
            )}
            <NotificationPanel
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onClearAll={clearAllNotifications}
              onNotificationAction={handleNotificationAction}
            />
            
            {/* Toast Container */}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
            
            {/* PWA Install Prompt */}
            <InstallPrompt />
          </div>
        )}
      </TMDbPostsProvider>
    </ThemeProvider>
  );
}