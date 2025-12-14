import { useState, lazy, Suspense, useEffect } from "react";
import { LoginPage } from "./LoginPage";
import { DashboardOverview } from "./DashboardOverview";
import { Navigation } from "./Navigation";
import { MobileBottomNav } from "./MobileBottomNav";
import { SettingsPanel } from "./SettingsPanel";
import { NotificationPanel } from "./NotificationPanel";
import { InstallPrompt } from "./InstallPrompt";
import { NotFoundPage } from "./NotFoundPage";
import { UndoToast } from "./UndoToast";
import { ShortcutsHelp } from "./ShortcutsHelp";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import { useDesktopShortcuts } from "../hooks/useDesktopShortcuts";
import { haptics } from "../utils/haptics";
import { useNotifications } from "../contexts/NotificationsContext";
import { setupInstallPrompt, registerServiceWorker } from "../utils/pwa";

// Lazy load heavy components for better performance
const ChannelsPage = lazy(() => import("./ChannelsPage").then(m => ({ default: m.ChannelsPage })));
const PlatformsPage = lazy(() => import("./PlatformsPage").then(m => ({ default: m.PlatformsPage })));
const LogsPage = lazy(() => import("./LogsPage").then(m => ({ default: m.LogsPage })));
const RecentActivityPage = lazy(() => import("./RecentActivityPage").then(m => ({ default: m.RecentActivityPage })));
const DesignSystemPage = lazy(() => import("./DesignSystemPage").then(m => ({ default: m.DesignSystemPage })));
const RSSPage = lazy(() => import("./RSSPage").then(m => ({ default: m.RSSPage })));
const RSSActivityPage = lazy(() => import("./RSSActivityPage").then(m => ({ default: m.RSSActivityPage })));
const TMDbFeedsPage = lazy(() => import("./TMDbFeedsPage").then(m => ({ default: m.TMDbFeedsPage })));
const TMDbActivityPage = lazy(() => import("./TMDbActivityPage").then(m => ({ default: m.TMDbActivityPage })));
const VideoDetailsPage = lazy(() => import("./VideoDetailsPage").then(m => ({ default: m.VideoDetailsPage })));
const VideoActivityPage = lazy(() => import("./VideoActivityPage").then(m => ({ default: m.VideoActivityPage })));
const VideoStudioPage = lazy(() => import("./VideoStudioPage").then(m => ({ default: m.VideoStudioPage })));
const VideoStudioActivityPage = lazy(() => import("./VideoStudioActivityPage").then(m => ({ default: m.VideoStudioActivityPage })));
const PrivacyPage = lazy(() => import("./PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./TermsPage").then(m => ({ default: m.TermsPage })));
const DisclaimerPage = lazy(() => import("./DisclaimerPage").then(m => ({ default: m.DisclaimerPage })));
const CookiePage = lazy(() => import("./CookiePage").then(m => ({ default: m.CookiePage })));
const ContactPage = lazy(() => import("./ContactPage").then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import("./AboutPage").then(m => ({ default: m.AboutPage })));
const DataDeletionPage = lazy(() => import("./DataDeletionPage").then(m => ({ default: m.DataDeletionPage })));
const AppInfoPage = lazy(() => import("./AppInfoPage").then(m => ({ default: m.AppInfoPage })));
const APIUsage = lazy(() => import("./APIUsage").then(m => ({ default: m.APIUsage })));
const CommentAutomationPage = lazy(() => import("./CommentAutomationPage").then(m => ({ default: m.CommentAutomationPage })));
const UploadManagerPage = lazy(() => import("./jobs/UploadManagerPage").then(m => ({ default: m.UploadManagerPage })));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec1e24]"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

export function AppContent() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, addNotification, deleteNotification } = useNotifications();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [pageBeforeSettings, setPageBeforeSettings] = useState("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialPage, setSettingsInitialPage] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCaptionEditorOpen, setIsCaptionEditorOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [isNavDragging, setIsNavDragging] = useState(false);

  // List of all valid pages
  const validPages = [
    'dashboard', 'channels', 'platforms', 'logs', 'activity', 'design-system',
    'rss', 'rss-activity', 'tmdb', 'tmdb-activity', 'video-details', 'video-activity',
    'video-studio', 'video-studio-activity', 'privacy', 'terms', 'disclaimer',
    'cookie', 'contact', 'about', 'data-deletion', 'app-info', 'api-usage',
    'comment-automation', 'upload-manager', 'not-found'
  ];

  // Check if current page is valid, if not show 404
  const displayPage = validPages.includes(currentPage) ? currentPage : 'not-found';

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
    const staticPages = ['privacy', 'terms', 'disclaimer', 'cookie', 'contact', 'about', 'data-deletion', 'app-info', 'design-system'];
    
    // Handle special settings sub-pages
    const settingsPages = ['settings-comment-reply', 'settings-apikeys', 'settings-video', 'settings-rss', 'settings-tmdb', 'settings-videostudio', 'settings-error', 'settings-cleanup', 'settings-haptic', 'settings-appearance', 'settings-notifications', 'settings-thumbnail'];
    
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
    } else if (page === 'shortcuts-help') {
      // Open shortcuts help modal
      setIsShortcutsHelpOpen(true);
    } else if (page === 'login') {
      // Reset to login page (used when going back from static pages in unauthenticated state)
      setCurrentPage('dashboard');
    } else {
      // Track where we came from (if provided)
      if (fromPage) {
        setPreviousPage(fromPage);
      } else {
        // Otherwise, set current page as previous
        setPreviousPage(currentPage);
      }
      setCurrentPage(page);
      // If navigating to a static page, close settings after setting the page
      if (staticPages.includes(page)) {
        setIsSettingsOpen(false);
      }
      // Reset scroll position instantly without animation
      window.scrollTo(0, 0);
    }
  };

  const toggleSettings = () => {
    if (!isSettingsOpen) {
      // Save current page before opening settings
      const staticPages = ['privacy', 'terms', 'disclaimer', 'cookie', 'contact', 'about', 'data-deletion', 'app-info', 'design-system'];
      if (!staticPages.includes(currentPage)) {
        setPageBeforeSettings(currentPage);
      }
    }
    setIsSettingsOpen(!isSettingsOpen);
    setIsNotificationsOpen(false);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    const staticPages = ['privacy', 'terms', 'disclaimer', 'cookie', 'contact', 'about', 'data-deletion', 'app-info', 'design-system'];
    // If currently on a static page, go back to the page before settings
    if (staticPages.includes(currentPage)) {
      setCurrentPage(pageBeforeSettings);
    }
  };

  const handleToggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsSettingsOpen(false);
  };
  
  // Handle notification actions (approve, schedule, view, dismiss)
  const handleNotificationAction = (notificationId: string, actionType: string) => {
    haptics.medium();
    
    // Handle different action types
    switch (actionType) {
      case 'approve':
        // Remove the notification after action
        deleteNotification(notificationId);
        break;
      case 'schedule':
        // Navigate to appropriate page
        break;
      case 'view':
        // Navigate to details page
        break;
      case 'dismiss':
        deleteNotification(notificationId);
        break;
    }
  };

  // Bottom navigation pages in order - read from localStorage to match user's custom order
  const [bottomNavPages, setBottomNavPages] = useState<string[]>(() => {
    const savedOrder = localStorage.getItem('bottomNavOrder');
    if (savedOrder) {
      try {
        return JSON.parse(savedOrder);
      } catch {
        return ['dashboard', 'channels', 'platforms', 'rss', 'tmdb', 'video-studio'];
      }
    }
    return ['dashboard', 'channels', 'platforms', 'rss', 'tmdb', 'video-studio'];
  });

  // Listen for changes to bottomNavOrder in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedOrder = localStorage.getItem('bottomNavOrder');
      if (savedOrder) {
        try {
          setBottomNavPages(JSON.parse(savedOrder));
        } catch {
          // Ignore parse errors
        }
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for changes from same tab
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Swipe navigation handlers
  const handleSwipeLeft = () => {
    // Disable swipe when caption editor is open
    if (isCaptionEditorOpen) {
      return;
    }
    
    // If notifications panel is open, close it
    if (isNotificationsOpen) {
      haptics.light();
      handleCloseNotifications();
      return;
    }
    
    const currentIndex = bottomNavPages.indexOf(currentPage);
    
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
    
    if (currentIndex > 0) {
      haptics.light();
      handleNavigate(bottomNavPages[currentIndex - 1]);
    }
  };

  // Only enable swipe navigation on bottom nav pages or when notifications/settings are open
  // Disable swipe when caption editor is open or nav is being dragged
  const isBottomNavPage = bottomNavPages.includes(currentPage);
  const isSwipeEnabled = (isBottomNavPage || isNotificationsOpen || isSettingsOpen) && !isCaptionEditorOpen && !isNavDragging;

  useSwipeNavigation({
    onSwipeLeft: isSwipeEnabled ? handleSwipeLeft : () => {},
    onSwipeRight: isSwipeEnabled ? handleSwipeRight : () => {},
    // Decreased sensitivity (increased swipe distance) - 80px default, 120px for logs
    minSwipeDistance: 80,
    increasedMinSwipeDistance: currentPage === 'logs' ? 120 : undefined,
  });

  // Desktop shortcuts (keyboard + trackpad gestures)
  useDesktopShortcuts({
    onNavigate: handleNavigate,
    onToggleSettings: toggleSettings,
    onToggleNotifications: handleToggleNotifications,
    currentPage,
    isSettingsOpen,
    isNotificationsOpen,
    onCloseSettings: handleCloseSettings,
    onCloseNotifications: () => setIsNotificationsOpen(false),
  });

  // Initialize PWA functionality
  useEffect(() => {
    // Set up the install prompt listener
    setupInstallPrompt();
    
    // Register the service worker
    registerServiceWorker();
  }, []);

  return (
    <>
      {!isAuthenticated ? (
        <>
          {currentPage === 'terms' ? (
            <Suspense fallback={<PageLoader />}><TermsPage onNavigate={handleNavigate} isAuthenticated={false} /></Suspense>
          ) : currentPage === 'privacy' ? (
            <Suspense fallback={<PageLoader />}><PrivacyPage onNavigate={handleNavigate} isAuthenticated={false} /></Suspense>
          ) : currentPage === 'disclaimer' ? (
            <Suspense fallback={<PageLoader />}><DisclaimerPage onNavigate={handleNavigate} isAuthenticated={false} /></Suspense>
          ) : (
            <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />
          )}
        </>
      ) : (
        <div className="min-h-screen bg-white dark:bg-[#000000]">
          {/* Skip to main content link for screen readers */}
          <a href="#main-content" className="skip-to-main">
            Skip to main content
          </a>
          
          <Navigation
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onToggleSettings={toggleSettings}
            onToggleNotifications={handleToggleNotifications}
            onLogout={handleLogout}
            unreadNotifications={unreadCount}
          />
          <main id="main-content" className="lg:ml-64 pb-16 lg:pb-0" role="main">
            <div className="p-4 sm:p-6 lg:p-8 transition-opacity duration-200">
              {displayPage === "dashboard" && (
                <DashboardOverview onNavigate={handleNavigate} />
              )}
              {displayPage === "channels" && <Suspense fallback={<PageLoader />}><ChannelsPage /></Suspense>}
              {displayPage === "platforms" && <Suspense fallback={<PageLoader />}><PlatformsPage /></Suspense>}
              {displayPage === "logs" && <Suspense fallback={<PageLoader />}><LogsPage onNewNotification={addNotification} onNavigate={handleNavigate} /></Suspense>}
              {displayPage === "activity" && (
                <Suspense fallback={<PageLoader />}><RecentActivityPage onNavigate={handleNavigate} /></Suspense>
              )}
              {displayPage === "design-system" && (
                <Suspense fallback={<PageLoader />}><DesignSystemPage onNavigate={handleNavigate} /></Suspense>
              )}
              {displayPage === "rss" && (
                <Suspense fallback={<PageLoader />}><RSSPage onNavigate={handleNavigate} /></Suspense>
              )}
              {displayPage === "rss-activity" && (
                <Suspense fallback={<PageLoader />}><RSSActivityPage onNavigate={handleNavigate} previousPage={previousPage} /></Suspense>
              )}
              {displayPage === "tmdb" && (
                <Suspense fallback={<PageLoader />}><TMDbFeedsPage onNavigate={handleNavigate} previousPage={previousPage} /></Suspense>
              )}
              {displayPage === "tmdb-activity" && (
                <Suspense fallback={<PageLoader />}><TMDbActivityPage onNavigate={handleNavigate} previousPage={previousPage} /></Suspense>
              )}
              {displayPage === "video-details" && (
                <Suspense fallback={<PageLoader />}><VideoDetailsPage onNavigate={handleNavigate} previousPage={previousPage} /></Suspense>
              )}
              {displayPage === "video-activity" && (
                <Suspense fallback={<PageLoader />}><VideoActivityPage onNavigate={handleNavigate} previousPage={previousPage} /></Suspense>
              )}
              {displayPage === "video-studio" && (
                <Suspense fallback={<PageLoader />}><VideoStudioPage onNavigate={handleNavigate} previousPage={previousPage} onCaptionEditorChange={setIsCaptionEditorOpen} /></Suspense>
              )}
              {displayPage === "video-studio-activity" && (
                <Suspense fallback={<PageLoader />}><VideoStudioActivityPage onNavigate={handleNavigate} previousPage={previousPage} /></Suspense>
              )}
              {displayPage === "privacy" && <Suspense fallback={<PageLoader />}><PrivacyPage onNavigate={handleNavigate} /></Suspense>}
              {displayPage === "terms" && <Suspense fallback={<PageLoader />}><TermsPage onNavigate={handleNavigate} /></Suspense>}
              {displayPage === "disclaimer" && <Suspense fallback={<PageLoader />}><DisclaimerPage onNavigate={handleNavigate} /></Suspense>}
              {displayPage === "cookie" && <Suspense fallback={<PageLoader />}><CookiePage onNavigate={handleNavigate} /></Suspense>}
              {displayPage === "contact" && <Suspense fallback={<PageLoader />}><ContactPage onNavigate={handleNavigate} /></Suspense>}
              {displayPage === "about" && <Suspense fallback={<PageLoader />}><AboutPage onNavigate={handleNavigate} /></Suspense>}
              {displayPage === "data-deletion" && <Suspense fallback={<PageLoader />}><DataDeletionPage onNavigate={handleNavigate} /></Suspense>}
              {displayPage === "app-info" && <Suspense fallback={<PageLoader />}><AppInfoPage onNavigate={handleNavigate} /></Suspense>}
              {displayPage === "api-usage" && <Suspense fallback={<PageLoader />}><APIUsage onBack={() => handleNavigate(previousPage || "dashboard")} previousPage={previousPage} /></Suspense>}
              {displayPage === "comment-automation" && <Suspense fallback={<PageLoader />}><CommentAutomationPage onBack={() => handleNavigate(previousPage || "dashboard")} previousPage={previousPage} /></Suspense>}
              {displayPage === "upload-manager" && <Suspense fallback={<PageLoader />}><UploadManagerPage onBack={() => handleNavigate(previousPage || "dashboard")} /></Suspense>}
              {displayPage === "not-found" && <NotFoundPage onNavigate={handleNavigate} />}
            </div>
          </main>
          <MobileBottomNav
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onDragStateChange={setIsNavDragging}
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
            onClearAll={clearAll}
            onDeleteNotification={deleteNotification}
            onNotificationAction={handleNotificationAction}
          />
          
          {/* Undo Toast */}
          <UndoToast />
          
          {/* PWA Install Prompt */}
          <InstallPrompt />
          
          {/* Shortcuts Help */}
          <ShortcutsHelp isOpen={isShortcutsHelpOpen} onClose={() => setIsShortcutsHelpOpen(false)} />
        </div>
      )}
    </>
  );
}