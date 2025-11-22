# Screndly App Structure & Implementation Guide

## Overview
Screndly is an automation dashboard web app for movie/TV trailer downloading, posting, and engagement through AI agents for Screen Render. The app features a clean, modern, cinematic IFTTT-inspired design with modular cards, soft shadows, and minimalist typography.

## Brand Colors
- Primary Red: `#ec1e24`
- White: `#FFFFFF`
- Black: `#000000`
- Dark Background: `#0A0A0A` (for cards)
- Border: `#333333` (dark mode borders)

---

## 📋 Table of Contents
1. [Component Dependency Graph](#component-dependency-graph)
2. [State Flow Diagrams](#state-flow-diagrams)
3. [Mock Data Examples](#mock-data-examples)
4. [Code Implementation Snippets](#code-implementation-snippets)
5. [Critical User Flows](#critical-user-flows)
6. [Main Pages & Navigation](#main-pages--navigation)
7. [Settings Structure](#settings-structure)
8. [Testing Scenarios](#testing-scenarios)

---

## Component Dependency Graph

```
App.tsx (ROOT)
├── State Management
│   ├── isAuthenticated: boolean
│   ├── currentPage: string
│   ├── isSettingsOpen: boolean
│   ├── settingsInitialPage: string | null
│   ├── isNotificationsOpen: boolean
│   ├── notifications: Notification[]
│   └── pageBeforeSettings: string
│
├── Navigation.tsx (Desktop Sidebar)
│   ├── Receives: currentPage, handleNavigate
│   └── Renders: 6 nav items + Settings + Notifications
│
├── MobileBottomNav.tsx (Mobile)
│   ├── Receives: currentPage, handleNavigate
│   └── Renders: 6 bottom nav icons
│
├── NotificationPanel.tsx
│   ├── Receives: notifications, isOpen, onClose
│   ├── Manages: mark read/unread, clear all
│   └── Icons: Clapperboard (TMDb), Rss, Upload, AlertCircle
│
├── SettingsPanel.tsx
│   ├── Receives: isOpen, initialPage, onBack
│   ├── State: currentSettingsPage
│   └── Children: 10 settings components + 6 legal pages
│
├── DashboardOverview.tsx
│   ├── Receives: onNavigate
│   ├── Stats Cards → Navigate to pages
│   ├── Widgets:
│   │   ├── RSSFeedsWidget
│   │   ├── CommentAutomationWidget
│   │   ├── TMDbFeedsWidget (uses screndly_tmdb_settings from localStorage)
│   │   ├── VideoProcessingChart (recharts)
│   │   └── PlatformDistributionChart (recharts)
│   └── All cards clickable with haptics.light()
│
├── ChannelsPage.tsx
│   ├── Receives: onNavigate
│   └── Manages: YouTube channels list
│
├── PlatformsPage.tsx
│   ├── Receives: onNavigate
│   ├── Platform cards: X, Threads, Facebook ONLY
│   ├── Each card has clickable logo → Opens profile URL
│   └── Uses: platformConnections from localStorage
│
├── RSSPage.tsx
│   ├── Receives: onNavigate
│   ├── RSS feed list with status
│   └── Auto-post platforms: X, Threads, Facebook
│
├── TMDbFeedsPage.tsx
│   ├── Receives: onNavigate
│   ├── State: viewMode ('grid' | 'calendar'), filterType
│   ├── Children:
│   │   ├── TMDbStatsPanel (calculates from feeds array)
│   │   ├── TMDbFeedCard (each feed item)
│   │   └── TMDbCalendarView (calendar visualization)
│   └── Uses: screndly_tmdb_settings from localStorage
│
├── CommentAutomationPage.tsx
│   ├── Receives: onNavigate
│   ├── Daily/recent comment replies per platform
│   ├── Overall performance metrics
│   ├── Platform breakdowns with success rates
│   └── Recent AI-generated responses display
│
└── LogsPage.tsx
    ├── Receives: onNavigate
    ├── System logs with filters
    └── Platform tags are clickable → Opens profile URLs

SETTINGS PANEL TREE:
SettingsPanel.tsx
├── ApiKeysSettings.tsx
├── VideoSettings.tsx (with OpenAI model selector)
├── CommentReplySettings.tsx
├── RssSettings.tsx (with OpenAI model selector)
├── TmdbFeedsSettings.tsx
│   ├── TMDbScheduler.tsx (integrated component)
│   └── TMDbSettings.tsx (with OpenAI model selector)
├── ErrorHandlingSettings.tsx
├── CleanupSettings.tsx (separate video/image storage settings)
├── HapticSettings.tsx
├── AppearanceSettings.tsx
└── NotificationsSettings.tsx
```

---

## State Flow Diagrams

### 1. Settings Deep-Linking Flow

```typescript
// SCENARIO: User clicks "Comment Replies (87%)" on Dashboard

// Step 1: Dashboard stat card onClick
<div 
  onClick={() => {
    haptics.light();
    onNavigate('settings-comment-reply');
  }}
>
  Comment Replies: 87%
</div>

// Step 2: App.tsx handleNavigate receives 'settings-comment-reply'
const handleNavigate = (page: string) => {
  // Check if it's a settings page (starts with 'settings-')
  if (page.startsWith('settings-')) {
    // Extract the specific settings page
    // 'settings-comment-reply' → 'comment'
    // 'settings-apikeys' → 'apikeys'
    const settingsPage = page.replace('settings-', '');
    
    // Save current page to return to later
    setPageBeforeSettings(currentPage);
    
    // Open settings panel with specific page
    setSettingsInitialPage(settingsPage);
    setIsSettingsOpen(true);
  } else {
    // Regular page navigation
    setCurrentPage(page);
  }
};

// Step 3: SettingsPanel receives initialPage='comment'
export function SettingsPanel({ 
  isOpen, 
  initialPage, 
  onBack 
}: SettingsPanelProps) {
  const [currentPage, setCurrentPage] = useState(initialPage || 'apikeys');
  
  useEffect(() => {
    if (initialPage) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);
  
  // Render the correct settings component
  const renderContent = () => {
    switch (currentPage) {
      case 'comment': return <CommentReplySettings />;
      case 'apikeys': return <ApiKeysSettings />;
      case 'tmdb': return <TmdbFeedsSettings />;
      // ... etc
    }
  };
}

// Step 4: Back button returns to previous page
const handleBack = () => {
  setIsSettingsOpen(false);
  setCurrentPage(pageBeforeSettings);
  setPageBeforeSettings('dashboard');
};
```

### 2. TMDb Settings → TMDb Feeds Page Sync

```typescript
// SCENARIO: User enables "Today Feeds" in settings, then views TMDb Feeds page

// Step 1: User toggles Today feed in TmdbFeedsSettings
// File: /components/settings/TMDbSettings.tsx
const [tmdbSettings, setTMDbSettings] = useState(defaultSettings);

const updateSetting = (key: string, value: any) => {
  setTMDbSettings(prev => ({ ...prev, [key]: value }));
  
  // Auto-save to localStorage
  localStorage.setItem('screndly_tmdb_settings', JSON.stringify({
    ...tmdbSettings,
    [key]: value
  }));
  
  // Show toast confirmation
  if (key === 'enableToday') {
    toast.success(value ? "Today's Releases feed enabled" : "Today's Releases feed disabled");
  }
};

// Step 2: TMDbFeedsPage loads settings from localStorage
// File: /components/TMDbFeedsPage.tsx
const [feeds, setFeeds] = useState([]);

useEffect(() => {
  // Load TMDb settings
  const savedSettings = localStorage.getItem('screndly_tmdb_settings');
  const tmdbSettings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  
  // Filter feeds based on enabled types
  const filteredFeeds = allFeeds.filter(feed => {
    if (feed.source === 'tmdb_today' && !tmdbSettings.enableToday) return false;
    if (feed.source === 'tmdb_weekly' && !tmdbSettings.enableWeekly) return false;
    if (feed.source === 'tmdb_monthly' && !tmdbSettings.enableMonthly) return false;
    if (feed.source === 'tmdb_anniversary' && !tmdbSettings.enableAnniversaries) return false;
    return true;
  });
  
  setFeeds(filteredFeeds);
}, []);
```

### 3. Notification Creation & Display Flow

```typescript
// SCENARIO: TMDb feed is posted, notification appears

// Step 1: Create notification when feed posts
const createNotification = (feed: TMDbFeed) => {
  const notification: Notification = {
    id: Date.now().toString(),
    type: 'success',
    source: 'tmdb',
    title: 'TMDb Feed Posted',
    message: `${feed.title} posted to ${getPlatformsText(feed.platforms)}`,
    timestamp: new Date().toISOString(),
    read: false,
    actionPage: 'tmdb' // Clicking notification opens TMDb page
  };
  
  // Add to notifications array
  setNotifications(prev => [notification, ...prev]);
};

// Step 2: NotificationPanel displays with correct icon
<div className="notification-item">
  {/* Source-specific icon */}
  {notification.source === 'tmdb' && (
    <Clapperboard className="w-5 h-5 text-[#ec1e24]" />
  )}
  {notification.source === 'rss' && (
    <Rss className="w-5 h-5 text-blue-500" />
  )}
  
  {/* Notification content */}
  <div>{notification.message}</div>
  
  {/* Click to navigate */}
  <button onClick={() => {
    haptics.light();
    markAsRead(notification.id);
    onNavigate(notification.actionPage);
    onClose();
  }}>
    View
  </button>
</div>

// Step 3: Badge count updates
const unreadCount = notifications.filter(n => !n.read).length;
```

---

## Mock Data Examples

### TMDb Feed Object
```typescript
interface TMDbFeed {
  id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  year: number;
  releaseDate: string; // ISO format: '2024-11-17'
  caption: string;
  imageUrl: string;
  imageType: 'poster' | 'backdrop';
  scheduledTime: string; // ISO format: '2024-11-17T08:00:00Z'
  source: 'tmdb_today' | 'tmdb_weekly' | 'tmdb_monthly' | 'tmdb_anniversary';
  platforms: {
    x: boolean;
    threads: boolean;
    facebook: boolean;
  };
  status: 'pending' | 'posted' | 'failed';
  anniversaryYear?: number; // Only for anniversary feeds
}

// Example Today Feed
const todayFeed: TMDbFeed = {
  id: '0',
  tmdbId: 558449,
  mediaType: 'movie',
  title: 'Gladiator II',
  year: 2024,
  releaseDate: '2024-11-17',
  caption: '#GladiatorII arrives in theaters TODAY! 🎬⚔️ Paul Mescal, Pedro Pascal & Denzel Washington star in this epic sequel.',
  imageUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
  imageType: 'poster',
  scheduledTime: '2024-11-17T08:00:00Z',
  source: 'tmdb_today',
  platforms: { x: true, threads: true, facebook: false },
  status: 'pending'
};

// Example Anniversary Feed
const anniversaryFeed: TMDbFeed = {
  id: '5',
  tmdbId: 155,
  mediaType: 'movie',
  title: 'The Dark Knight',
  year: 2008,
  releaseDate: '2008-07-18',
  caption: '15 years ago today, Christopher Nolan\'s The Dark Knight redefined superhero cinema. 🦇',
  imageUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  imageType: 'backdrop',
  scheduledTime: '2024-07-18T14:00:00Z',
  source: 'tmdb_anniversary',
  platforms: { x: true, threads: false, facebook: false },
  status: 'pending',
  anniversaryYear: 15
};
```

### Notification Object
```typescript
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  source: 'upload' | 'rss' | 'tmdb' | 'system';
  title: string;
  message: string;
  timestamp: string; // ISO format
  read: boolean;
  actionPage?: string; // Page to navigate to when clicked
}

// Example TMDb Notification
const tmdbNotification: Notification = {
  id: '1732012800000',
  type: 'success',
  source: 'tmdb',
  title: 'TMDb Feed Posted',
  message: 'Gladiator II posted to X and Threads',
  timestamp: '2024-11-17T08:00:00Z',
  read: false,
  actionPage: 'tmdb'
};

// Example Error Notification
const errorNotification: Notification = {
  id: '1732013400000',
  type: 'error',
  source: 'system',
  title: 'API Error',
  message: 'TMDb API rate limit exceeded. Retrying in 5 minutes.',
  timestamp: '2024-11-17T08:10:00Z',
  read: false,
  actionPage: 'logs'
};
```

### TMDb Settings Object
```typescript
interface TMDbSettings {
  openaiModel: 'gpt-5-nano' | 'gpt-4o-mini' | 'gpt-4o' | 'gpt-3.5-turbo' | 'gpt-4-turbo' | 'gpt-4';
  enableToday: boolean;
  enableWeekly: boolean;
  enableMonthly: boolean;
  enableAnniversaries: boolean;
  anniversaryYears: string[]; // ['1', '2', '3', '5', '10', '15', '20', '25']
  maxPerAnniversary: string; // '1' to '5'
  captionMaxLength: string; // '50' to '200'
  includeCast: boolean;
  includeDate: boolean;
  preferredImage: 'poster' | 'backdrop' | 'random';
  rehostImages: boolean;
  dedupeWindow: string; // Days: '1' to '90'
  discoveryCacheTTL: string; // Hours: '1' to '48'
  creditsCacheTTL: string; // Days: '1' to '90'
  captionCacheTTL: string; // Days: '1' to '90'
  timezone: string; // IANA timezone
  todayAutoPost: boolean;
  weeklyAutoPost: boolean;
  monthlyAutoPost: boolean;
  anniversaryAutoPost: boolean;
  todayPlatforms: { x: boolean; threads: boolean; facebook: boolean; };
  weeklyPlatforms: { x: boolean; threads: boolean; facebook: boolean; };
  monthlyPlatforms: { x: boolean; threads: boolean; facebook: boolean; };
  anniversaryPlatforms: { x: boolean; threads: boolean; facebook: boolean; };
}

// Default Settings
const defaultTMDbSettings: TMDbSettings = {
  openaiModel: 'gpt-4o-mini',
  enableToday: true,
  enableWeekly: true,
  enableMonthly: true,
  enableAnniversaries: true,
  anniversaryYears: ['1', '2', '3', '5', '10', '15', '20', '25'],
  maxPerAnniversary: '2',
  captionMaxLength: '100',
  includeCast: true,
  includeDate: true,
  preferredImage: 'poster',
  rehostImages: true,
  dedupeWindow: '30',
  discoveryCacheTTL: '12',
  creditsCacheTTL: '30',
  captionCacheTTL: '30',
  timezone: 'Africa/Lagos',
  todayAutoPost: false,
  weeklyAutoPost: false,
  monthlyAutoPost: false,
  anniversaryAutoPost: false,
  todayPlatforms: { x: true, threads: true, facebook: false },
  weeklyPlatforms: { x: true, threads: true, facebook: false },
  monthlyPlatforms: { x: true, threads: true, facebook: false },
  anniversaryPlatforms: { x: true, threads: false, facebook: false }
};
```

### Platform Connections Object
```typescript
interface PlatformConnections {
  [platform: string]: {
    connected: boolean;
    profileUrl?: string;
    username?: string;
    lastSync?: string;
  };
}

// Example platform connections
const platformConnections: PlatformConnections = {
  x: {
    connected: true,
    profileUrl: 'https://x.com/screenrender',
    username: '@screenrender',
    lastSync: '2024-11-17T08:00:00Z'
  },
  threads: {
    connected: true,
    profileUrl: 'https://threads.net/@screenrender',
    username: '@screenrender',
    lastSync: '2024-11-17T08:00:00Z'
  },
  facebook: {
    connected: false,
    profileUrl: 'https://facebook.com/screenrender', // Fallback
    username: undefined,
    lastSync: undefined
  }
};

// Screen Render fallback URLs
const screenRenderUrls = {
  x: 'https://x.com/screenrender',
  threads: 'https://threads.net/@screenrender',
  facebook: 'https://facebook.com/screenrender'
};
```

### Video Settings Object
```typescript
interface VideoSettings {
  videoOpenaiModel: 'gpt-5-nano' | 'gpt-4o-mini' | 'gpt-4o' | 'gpt-3.5-turbo' | 'gpt-4-turbo' | 'gpt-4';
  fetchInterval: string; // Polling interval in minutes (1-60)
  postInterval: string; // Post interval in minutes (1-1440)
  advancedFilters: string; // Comma-separated trailer keywords
  regionFilter: string; // Optional region filter (US,UK,CA)
}

// Default Settings
const defaultVideoSettings: VideoSettings = {
  videoOpenaiModel: 'gpt-4o-mini',
  fetchInterval: '5',
  postInterval: '60',
  advancedFilters: 'trailer, official trailer, teaser',
  regionFilter: ''
};
```

### RSS Settings Object
```typescript
interface RssSettings {
  rssOpenaiModel: 'gpt-5-nano' | 'gpt-4o-mini' | 'gpt-4o' | 'gpt-3.5-turbo' | 'gpt-4-turbo' | 'gpt-4';
  rssLogLevel: 'minimal' | 'standard' | 'full';
}

// Default Settings
const defaultRssSettings: RssSettings = {
  rssOpenaiModel: 'gpt-4o-mini',
  rssLogLevel: 'standard'
};
```

### Cleanup Settings Object
```typescript
interface CleanupSettings {
  // Video Storage
  videoStorageEnabled: boolean;
  videoStorageDays: string; // Days: '1' to '365'
  
  // Image Storage
  imageStorageEnabled: boolean;
  imageStorageDays: string; // Days: '1' to '365'
  
  // Other cleanup settings
  logRetentionDays: string;
  notificationRetentionDays: string;
}

// Default Settings
const defaultCleanupSettings: CleanupSettings = {
  videoStorageEnabled: true,
  videoStorageDays: '30',
  imageStorageEnabled: true,
  imageStorageDays: '90',
  logRetentionDays: '14',
  notificationRetentionDays: '7'
};
```

---

## Code Implementation Snippets

### 1. TMDb Scheduler - Next Monday Calculation

```typescript
// File: /components/tmdb/TMDbScheduler.tsx

export function TMDbScheduler() {
  // Calculate next Monday 00:00 UTC
  const getNextMonday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // If Sunday (0), add 1 day; otherwise add (8 - dayOfWeek) days
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0); // Set to 00:00:00
    
    return nextMonday;
  };

  // Calculate time remaining until next refresh
  const getTimeUntilRefresh = () => {
    const now = new Date();
    const nextMonday = getNextMonday();
    const diffMs = nextMonday.getTime() - now.getTime();
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Calculate last Monday 00:00
  const getLastMonday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysSinceMonday = (dayOfWeek + 6) % 7; // 0 if Monday, 1 if Tuesday, etc.
    
    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() - daysSinceMonday);
    lastMonday.setHours(0, 0, 0, 0);
    
    return lastMonday;
  };

  const lastRefresh = getLastMonday();
  const nextRefresh = getNextMonday();
  const timeUntilRefresh = getTimeUntilRefresh();

  // Manual refresh handler
  const handleManualRefresh = () => {
    haptics.light();
    toast.loading('Refreshing TMDb feeds...', { id: 'tmdb-refresh' });
    
    // Simulate API call
    setTimeout(() => {
      toast.success('TMDb feeds refreshed successfully!', {
        id: 'tmdb-refresh',
        description: 'New feeds have been generated and scheduled',
      });
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200 dark:border-[#333333] p-6">
      {/* Display last and next refresh times */}
      <p>Last Refresh: {lastRefresh.toLocaleString()}</p>
      <p>Next Refresh: {nextRefresh.toLocaleString()}</p>
      <p>Time Until Refresh: {timeUntilRefresh}</p>
      
      <button onClick={handleManualRefresh}>
        Refresh Now
      </button>
    </div>
  );
}
```

### 2. Settings Deep-Linking Implementation

```typescript
// File: /App.tsx

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialPage, setSettingsInitialPage] = useState<string | null>(null);
  const [pageBeforeSettings, setPageBeforeSettings] = useState('dashboard');

  const handleNavigate = (page: string) => {
    haptics.light();
    
    // Check if navigating to a settings page
    if (page.startsWith('settings-')) {
      // Extract settings page name
      // Examples:
      // 'settings-comment-reply' → 'comment'
      // 'settings-apikeys' → 'apikeys'
      // 'settings-tmdb' → 'tmdb'
      const settingsPageMap: Record<string, string> = {
        'settings-comment-reply': 'comment',
        'settings-apikeys': 'apikeys',
        'settings-video': 'video',
        'settings-rss': 'rss',
        'settings-tmdb': 'tmdb',
        'settings-error': 'error',
        'settings-cleanup': 'cleanup',
        'settings-haptic': 'haptic',
        'settings-appearance': 'appearance',
        'settings-notifications': 'notifications'
      };
      
      const settingsPage = settingsPageMap[page] || 'apikeys';
      
      // Save current page to return to
      setPageBeforeSettings(currentPage);
      
      // Open settings with specific page
      setSettingsInitialPage(settingsPage);
      setIsSettingsOpen(true);
    } else {
      // Regular navigation
      setCurrentPage(page);
      setIsSettingsOpen(false);
      setIsNotificationsOpen(false);
    }
  };

  const handleSettingsBack = () => {
    setIsSettingsOpen(false);
    setSettingsInitialPage(null);
    setCurrentPage(pageBeforeSettings);
  };

  return (
    <div className="app">
      {/* Main pages */}
      {currentPage === 'dashboard' && <DashboardOverview onNavigate={handleNavigate} />}
      {currentPage === 'tmdb' && <TMDbFeedsPage onNavigate={handleNavigate} />}
      {/* ... other pages */}
      
      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        initialPage={settingsInitialPage}
        onBack={handleSettingsBack}
      />
    </div>
  );
}
```

### 3. TMDb Stats Calculations

```typescript
// File: /components/tmdb/TMDbStatsPanel.tsx

interface TMDbStatsPanelProps {
  feeds: TMDbFeed[];
  onFilterChange: (filter: string) => void;
}

export function TMDbStatsPanel({ feeds, onFilterChange }: TMDbStatsPanelProps) {
  // Calculate ready to post (next 24 hours)
  const getReadyToPost = () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return feeds.filter(feed => {
      const scheduledTime = new Date(feed.scheduledTime);
      return scheduledTime >= now && scheduledTime <= tomorrow && feed.status === 'pending';
    }).length;
  };

  // Calculate cache hit rate
  const getCacheHitRate = () => {
    // Mock calculation - in real app, would come from API
    // (cached requests / total requests) * 100
    const totalRequests = 150;
    const cachedRequests = 130;
    return Math.round((cachedRequests / totalRequests) * 100);
  };

  // Estimate tokens used
  const getTokensUsed = () => {
    // Mock calculation - in real app, would sum actual token usage
    // Average ~150 tokens per caption
    const averageTokensPerCaption = 150;
    const totalFeeds = feeds.length;
    return totalFeeds * averageTokensPerCaption;
  };

  // Count TMDb API calls
  const getTMDbAPICalls = () => {
    // Mock calculation - in real app, would come from API logs
    // Each feed requires: 1 discovery call + 1 credits call
    return feeds.length * 2;
  };

  const readyToPost = getReadyToPost();
  const cacheHitRate = getCacheHitRate();
  const tokensUsed = getTokensUsed();
  const apiCalls = getTMDbAPICalls();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Ready to Post */}
      <div 
        className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200 dark:border-[#333333] p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => {
          haptics.light();
          onFilterChange('pending');
        }}
      >
        <p className="text-2xl text-gray-900 dark:text-white">{readyToPost}</p>
        <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Ready to Post</p>
        <p className="text-xs text-[#9CA3AF]">Next 24 hours</p>
      </div>

      {/* Cache Hit Rate */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200 dark:border-[#333333] p-4">
        <p className="text-2xl text-gray-900 dark:text-white">{cacheHitRate}%</p>
        <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Cache Hit Rate</p>
        <p className="text-xs text-green-500">Excellent</p>
      </div>

      {/* Tokens Used */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200 dark:border-[#333333] p-4">
        <p className="text-2xl text-gray-900 dark:text-white">{tokensUsed.toLocaleString()}</p>
        <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Tokens Used</p>
        <p className="text-xs text-[#9CA3AF]">Caption generation</p>
      </div>

      {/* API Calls */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200 dark:border-[#333333] p-4">
        <p className="text-2xl text-gray-900 dark:text-white">{apiCalls}</p>
        <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">TMDb API Calls</p>
        <p className="text-xs text-[#9CA3AF]">This week</p>
      </div>
    </div>
  );
}
```

### 4. Platform Logo Clickable Links

```typescript
// File: /components/PlatformsPage.tsx

export function PlatformsPage({ onNavigate }: PlatformsPageProps) {
  // Load platform connections from localStorage
  const [platformConnections, setPlatformConnections] = useState<PlatformConnections>({});

  useEffect(() => {
    const saved = localStorage.getItem('platformConnections');
    if (saved) {
      setPlatformConnections(JSON.parse(saved));
    }
  }, []);

  // Screen Render fallback URLs
  const screenRenderUrls = {
    x: 'https://x.com/screenrender',
    threads: 'https://threads.net/@screenrender',
    facebook: 'https://facebook.com/screenrender'
  };

  // Get profile URL (user's connected account or Screen Render's)
  const getProfileUrl = (platform: string): string => {
    const connection = platformConnections[platform];
    return connection?.connected && connection?.profileUrl 
      ? connection.profileUrl 
      : screenRenderUrls[platform as keyof typeof screenRenderUrls];
  };

  const handleLogoClick = (platform: string) => {
    haptics.light();
    const url = getProfileUrl(platform);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="platforms-page">
      {/* X Platform Card */}
      <div className="platform-card">
        <button
          onClick={() => handleLogoClick('x')}
          className="logo-button cursor-pointer hover:opacity-80 transition-opacity"
          title="Open X profile"
        >
          <XIcon className="w-8 h-8" />
        </button>
        <h3>X (Twitter)</h3>
        <p>{platformConnections.x?.connected ? 'Connected' : 'Not Connected'}</p>
      </div>

      {/* Similar for Threads and Facebook */}
    </div>
  );
}

// File: /components/LogsPage.tsx - Clickable platform tags

export function LogsPage({ onNavigate }: LogsPageProps) {
  const handlePlatformTagClick = (platform: string) => {
    haptics.light();
    
    const platformConnections = JSON.parse(
      localStorage.getItem('platformConnections') || '{}'
    );
    
    const screenRenderUrls = {
      x: 'https://x.com/screenrender',
      threads: 'https://threads.net/@screenrender',
      facebook: 'https://facebook.com/screenrender'
    };
    
    const url = platformConnections[platform]?.profileUrl || screenRenderUrls[platform];
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="logs-page">
      {logs.map(log => (
        <div key={log.id} className="log-entry">
          <p>{log.message}</p>
          
          {/* Clickable platform tag */}
          {log.platform && (
            <button
              onClick={() => handlePlatformTagClick(log.platform)}
              className="platform-tag cursor-pointer hover:bg-gray-200 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              {log.platform === 'x' && <XIcon className="w-3 h-3" />}
              {log.platform === 'threads' && <ThreadsIcon className="w-3 h-3" />}
              {log.platform === 'facebook' && <FacebookIcon className="w-4 h-4" />}
              {log.platform.toUpperCase()}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 5. Swipe Navigation Hook

```typescript
// File: /hooks/useSwipeNavigation.ts

import { useEffect, useRef } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minSwipeDistance?: number; // Default: 50px
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50
}: SwipeConfig) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }

    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
}

// Usage in App.tsx
const pages = ['dashboard', 'channels', 'platforms', 'rss', 'tmdb', 'logs'];

useSwipeNavigation({
  onSwipeLeft: () => {
    // Next page
    if (currentPage === 'dashboard') {
      // Dashboard swipe left: nothing (or go to channels)
    } else if (currentPage === 'logs') {
      // Logs swipe left: open settings
      setIsSettingsOpen(true);
    } else {
      const currentIndex = pages.indexOf(currentPage);
      if (currentIndex < pages.length - 1) {
        setCurrentPage(pages[currentIndex + 1]);
      }
    }
  },
  onSwipeRight: () => {
    // Previous page
    if (currentPage === 'dashboard') {
      // Dashboard swipe right: open notifications
      setIsNotificationsOpen(true);
    } else {
      const currentIndex = pages.indexOf(currentPage);
      if (currentIndex > 0) {
        setCurrentPage(pages[currentIndex - 1]);
      }
    }
  }
});
```

---

## Critical User Flows

### Flow 1: Settings Deep-Link (Comment Automation)

**User Journey:**
1. User on Dashboard
2. Clicks "Comment Replies (87%)" stat card
3. Settings panel slides in from right
4. Comment Reply Automation page is displayed
5. User makes changes (auto-saved)
6. User clicks back button
7. Returns to Dashboard

**Implementation Checklist:**
- [ ] Dashboard stat card has `onClick={() => onNavigate('settings-comment-reply')}`
- [ ] `handleNavigate` detects `settings-` prefix
- [ ] Extracts `comment` from `settings-comment-reply`
- [ ] Sets `settingsInitialPage='comment'`
- [ ] Opens settings panel
- [ ] SettingsPanel receives and uses `initialPage` prop
- [ ] Back button calls `onBack()` which restores previous page

### Flow 2: TMDb Feed Creation & Posting

**User Journey:**
1. User opens Settings → TMDb Feeds
2. Enables "Today Feeds" toggle
3. Selects platforms: X ✓, Threads ✓, Facebook ✗
4. Sets OpenAI model to GPT-4
5. Closes settings (auto-saved to localStorage)
6. Navigates to TMDb Feeds page
7. Sees Today feeds in grid view
8. Clicks feed card to edit caption
9. Caption editor opens (black bg, #333 border)
10. Saves caption
11. Feed posts at scheduled time
12. Notification appears with Clapperboard icon
13. User clicks notification → opens TMDb page

**Implementation Checklist:**
- [ ] TMDbSettings saves to localStorage on toggle change
- [ ] TMDbFeedsPage loads settings from localStorage
- [ ] Feeds filtered based on enabled types
- [ ] Feed cards display with correct styling
- [ ] Caption editor has correct styling: `bg-[#000000] border-[#333333]`
- [ ] Platform toggles on feed card reflect settings
- [ ] Notification created with `source: 'tmdb'`
- [ ] Clapperboard icon displays for TMDb notifications
- [ ] Clicking notification navigates to TMDb page

### Flow 3: Platform Logo Click

**User Journey:**
1. User on Platforms page
2. Clicks X platform logo
3. New tab opens with user's connected X profile
4. If not connected, opens Screen Render's X profile

**Implementation Checklist:**
- [ ] Load platformConnections from localStorage
- [ ] Check if platform is connected
- [ ] Use connected profile URL if exists
- [ ] Fallback to Screen Render URL if not connected
- [ ] `window.open(url, '_blank', 'noopener,noreferrer')`
- [ ] Haptic feedback on click
- [ ] Same logic applies to Logs page platform tags

### Flow 4: Monday 00:00 UTC Refresh Display

**User Journey:**
1. User opens Settings → TMDb Feeds
2. Sees TMDb Scheduler component at top
3. Last Refresh shows previous Monday 00:00
4. Next Refresh shows upcoming Monday 00:00
5. Countdown displays "2d 5h" until next refresh
6. User clicks "Refresh Now" button
7. Loading toast appears
8. Success toast shows after 2 seconds
9. Feeds regenerate

**Implementation Checklist:**
- [ ] `getLastMonday()` calculates correctly for all days of week
- [ ] `getNextMonday()` calculates correctly for all days of week
- [ ] Countdown timer updates in real-time
- [ ] Manual refresh button triggers API call (or mock)
- [ ] Toast notifications display correctly
- [ ] Distribution strategy cards show correct info for each feed type

### Flow 5: Swipe Navigation

**User Journey:**
1. User on Dashboard (mobile)
2. Swipes right → Notifications panel opens
3. Closes notifications
4. Swipes left → Goes to Channels page
5. Swipes left → Goes to Platforms page
6. Continues swiping through pages
7. On Logs page, swipes left → Settings opens

**Implementation Checklist:**
- [ ] Touch events captured with `useSwipeNavigation` hook
- [ ] Minimum swipe distance is 50px
- [ ] Dashboard swipe right opens notifications
- [ ] Logs swipe left opens settings
- [ ] Other pages swipe left/right to navigate sequentially
- [ ] Haptic feedback on swipe (if enabled)
- [ ] Page transitions smooth

---

## Main Pages & Navigation

### 1. Dashboard (`/components/DashboardOverview.tsx`)

**Stats Cards (All Clickable & Linked):**
```typescript
const statsCards = [
  {
    title: 'TMDb Feeds Ready',
    value: 5,
    icon: Film,
    color: 'text-[#ec1e24]',
    onClick: () => onNavigate('tmdb')
  },
  {
    title: 'RSS Feeds Active',
    value: 15,
    icon: Rss,
    color: 'text-blue-500',
    onClick: () => onNavigate('rss')
  },
  {
    title: 'Comment Replies',
    value: '87%',
    icon: MessageSquare,
    color: 'text-green-500',
    onClick: () => onNavigate('settings-comment-reply')
  },
  {
    title: 'Total Posts Today',
    value: 12,
    icon: TrendingUp,
    color: 'text-purple-500',
    onClick: () => onNavigate('platforms')
  },
  {
    title: 'Active Channels',
    value: 23,
    icon: Video,
    color: 'text-orange-500',
    onClick: () => onNavigate('channels')
  },
  {
    title: 'Cache Hit Rate',
    value: '87%',
    icon: Zap,
    color: 'text-yellow-500',
    onClick: () => onNavigate('tmdb')
  },
  {
    title: 'API Usage',
    value: '342/1000',
    icon: Database,
    color: 'text-gray-500',
    onClick: undefined // Non-clickable
  },
  {
    title: 'System Errors',
    value: 2,
    icon: AlertCircle,
    color: 'text-red-500',
    onClick: () => onNavigate('logs')
  }
];
```

**Widgets:**
- RSS Feeds Widget → Shows 4 feeds with status indicators
- Comment Automation Widget → Shows 142 replies today, 87% success rate
- TMDb Feeds Widget → Shows next 7 days schedule, Monday 00:00 refresh countdown
- Video Processing Trends Chart → Line chart using recharts
- Platform Distribution Chart → Bar chart showing X, Threads, Facebook distribution
- Recent Activity Feed → List of recent posts/actions

### 2. Channels Page (`/components/ChannelsPage.tsx`)
- YouTube channel monitoring
- Add/remove channels
- Channel stats and activity
- Channel cards with thumbnails

### 3. Platforms Page (`/components/PlatformsPage.tsx`)
- **Available Platforms:** X (Twitter), Threads, Facebook ONLY
- **Removed:** Instagram, YouTube, TikTok
- Platform cards with clickable logos
- Auto-post toggles for each platform
- Connection status (connected/not connected)
- Profile URL display

### 4. RSS Page (`/components/RSSPage.tsx`)
- RSS feed management
- Add new feed with URL input
- Feed activity monitoring
- Post scheduling
- RSS-to-social automation
- Auto-post to X, Threads, Facebook only
- Feed status indicators (active, paused, error)

### 5. TMDb Feeds Page (`/components/TMDbFeedsPage.tsx`)

**Components:**
- `TMDbStatsPanel` - Real-time stats calculations
- `TMDbFeedCard` - Individual feed items
- `TMDbCalendarView` - Calendar visualization

**Feed Types with Color Coding:**
- **Today Feeds** (Blue - #3b82f6): Movies/TV releasing today, 3hr gaps
- **Weekly Feeds** (Green - #22c55e): Next 7 days, 2-3 posts/day
- **Monthly Feeds** (Purple - #a855f7): 1 month away, 1-3 posts/day
- **Anniversary Feeds** (Orange - #f97316): Milestones, 2-3 posts/day

**View Modes:**
- Grid view with filter tabs
- Calendar view with date selection
- Filter by: All, Today, Weekly, Monthly, Anniversary

**Feed Card Actions:**
- Edit caption (inline with black bg, #333 border)
- Delete feed
- Approve feed
- Toggle platforms (X, Threads, Facebook)
- Reschedule time

### 6. Logs Page (`/components/LogsPage.tsx`)
- System logs with timestamp
- Error tracking with stack traces
- Activity monitoring
- Filter by: All, Errors, Warnings, Info, Success
- Search functionality
- Platform tags (clickable)
- Export logs button

---

## Settings Structure

All settings pages are in `/components/settings/` directory.

### Settings Panel Navigation Map

```typescript
const settingsPages = {
  'apikeys': 'API Keys',
  'video': 'Video Settings',
  'comment': 'Comment Reply Automation',
  'rss': 'RSS Posting',
  'tmdb': 'TMDb Feeds',
  'error': 'Error Handling',
  'cleanup': 'Cleanup',
  'haptic': 'Haptic Feedback',
  'appearance': 'Appearance',
  'notifications': 'Notifications'
};

// Deep-link mapping
const deepLinkMap = {
  'settings-comment-reply': 'comment',
  'settings-apikeys': 'apikeys',
  'settings-video': 'video',
  'settings-rss': 'rss',
  'settings-tmdb': 'tmdb',
  'settings-error': 'error',
  'settings-cleanup': 'cleanup',
  'settings-haptic': 'haptic',
  'settings-appearance': 'appearance',
  'settings-notifications': 'notifications'
};
```

### 1. API Keys (`ApiKeysSettings.tsx`)
```typescript
const apiKeys = {
  youtubeApiKey: string;
  openaiApiKey: string;
  serperApiKey: string;
  tmdbApiKey: string;
  s3AccessKey: string;
  s3SecretKey: string;
  s3BucketName: string;
  redisUrl: string;
  databaseUrl: string;
};
```

### 2. Comment Reply Automation (`CommentReplySettings.tsx`)
```typescript
const commentSettings = {
  enabled: boolean;
  platforms: {
    x: { enabled: boolean; replyRate: number; };
    threads: { enabled: boolean; replyRate: number; };
    facebook: { enabled: boolean; replyRate: number; };
    instagram: { enabled: boolean; replyRate: number; };
    youtube: { enabled: boolean; replyRate: number; };
  };
  blacklistUsernames: string[];
  blacklistKeywords: string[];
  throttleMinutes: number;
  pauseOldPostsHours: number;
};
```

### 3. TMDb Feeds Settings (`TmdbFeedsSettings.tsx`)

**Structure:**
```typescript
<div className="tmdb-feeds-settings">
  {/* Top Section: TMDb Scheduler */}
  <TMDbScheduler />
  
  {/* Configuration Section */}
  <TMDbSettings onSave={handleSave} />
</div>
```

**TMDbScheduler Component (integrated at top):**
- Weekly Monday 00:00 UTC refresh schedule
- Last refresh timestamp
- Next refresh countdown
- Distribution strategy cards (Today/Weekly/Monthly/Anniversary)
- Manual "Refresh Now" button
- Summary stats grid

**TMDbSettings Component (below scheduler):**
- OpenAI model selection
- Feed type toggles
- Anniversary year tracking
- Caption settings
- Image preferences
- Cache settings
- Platform selection per feed type

### LocalStorage Persistence Pattern

```typescript
// Every settings component follows this pattern:

export function SettingsComponent({ onSave }: Props) {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load on mount
  useEffect(() => {
    const saved = localStorage.getItem('screndly_[component]_settings');
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Auto-save on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('screndly_[component]_settings', JSON.stringify(settings));
      if (onSave) {
        setTimeout(onSave, 100);
      }
    }
  }, [settings, isLoaded, onSave]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Setting updated');
  };

  return (
    // Settings UI
  );
}
```

---

## Testing Scenarios

### Scenario 1: Settings Deep-Link Flow

**Test Steps:**
1. Open app on Dashboard
2. Click "Comment Replies (87%)" stat card
3. **Expected:** Settings panel slides in from right
4. **Expected:** Comment Reply Automation page is displayed
5. Toggle X platform reply automation
6. **Expected:** Toast notification appears
7. **Expected:** Settings auto-saved to localStorage
8. Click back button
9. **Expected:** Returns to Dashboard
10. Re-open settings via Settings button
11. **Expected:** Comment page still shows updated toggle

**Verification:**
```typescript
// Check localStorage
const saved = localStorage.getItem('screndly_comment_settings');
const settings = JSON.parse(saved);
assert(settings.platforms.x.enabled === true);

// Check UI state
const toggle = document.querySelector('[data-testid="x-platform-toggle"]');
assert(toggle.checked === true);
```

### Scenario 2: TMDb Scheduler Calculation Accuracy

**Test Steps:**
1. Open Settings → TMDb Feeds
2. Note current day and time
3. Check "Last Refresh" display
4. Check "Next Refresh" display
5. Check countdown timer

**Test Cases:**

| Current Day | Expected Last Monday | Expected Next Monday |
|-------------|---------------------|---------------------|
| Monday 10:00 | Today 00:00 | Next Monday 00:00 (7 days) |
| Tuesday 15:00 | Yesterday 00:00 | In 6 days |
| Wednesday 08:00 | 2 days ago | In 5 days |
| Thursday 12:00 | 3 days ago | In 4 days |
| Friday 20:00 | 4 days ago | In 3 days |
| Saturday 14:00 | 5 days ago | In 2 days |
| Sunday 09:00 | 6 days ago | Tomorrow 00:00 |

**Verification Code:**
```typescript
const testScheduler = () => {
  // Test Sunday
  const sunday = new Date('2024-11-17T09:00:00Z'); // Sunday
  const lastMonday = getLastMonday(sunday);
  const nextMonday = getNextMonday(sunday);
  
  assert(lastMonday.toISOString().startsWith('2024-11-11T00:00:00'));
  assert(nextMonday.toISOString().startsWith('2024-11-18T00:00:00'));
  
  // Test Monday
  const monday = new Date('2024-11-18T10:00:00Z'); // Monday
  const lastMondayFromMonday = getLastMonday(monday);
  const nextMondayFromMonday = getNextMonday(monday);
  
  assert(lastMondayFromMonday.toISOString().startsWith('2024-11-18T00:00:00'));
  assert(nextMondayFromMonday.toISOString().startsWith('2024-11-25T00:00:00'));
};
```

### Scenario 3: Platform Logo Click (Connected vs Not Connected)

**Test Steps:**
1. Clear localStorage
2. Open Platforms page
3. Click X logo
4. **Expected:** Opens https://x.com/screenrender (Screen Render fallback)
5. Mock connect to X
6. Save profileUrl to localStorage
7. Click X logo again
8. **Expected:** Opens user's connected profile URL
9. Repeat for Logs page platform tags

**Verification:**
```typescript
// Scenario A: Not connected
localStorage.removeItem('platformConnections');
const url1 = getProfileUrl('x');
assert(url1 === 'https://x.com/screenrender');

// Scenario B: Connected
const connections = {
  x: {
    connected: true,
    profileUrl: 'https://x.com/myusername',
    username: '@myusername'
  }
};
localStorage.setItem('platformConnections', JSON.stringify(connections));
const url2 = getProfileUrl('x');
assert(url2 === 'https://x.com/myusername');
```

### Scenario 4: Swipe Navigation Edge Cases

**Test Steps:**
1. Open app on Dashboard (mobile)
2. Swipe right
3. **Expected:** Notifications panel opens
4. Close notifications
5. On Dashboard, swipe left
6. **Expected:** Navigate to Channels page
7. Continue swiping left through all pages
8. On Logs page, swipe left
9. **Expected:** Settings panel opens
10. On Logs page, swipe right
11. **Expected:** Navigate back to TMDb page

**Edge Cases to Test:**
- Very small swipe (< 50px) should not trigger navigation
- Vertical scroll should not trigger swipe
- Swipe while settings/notifications open should not navigate pages
- Fast swipe should only navigate once

### Scenario 5: TMDb Feed Type Filtering

**Test Steps:**
1. Open Settings → TMDb Feeds
2. Disable "Weekly Feeds" toggle
3. Enable "Today Feeds" toggle
4. Navigate to TMDb Feeds page
5. **Expected:** Only Today feeds visible in grid
6. Click "Weekly" filter tab
7. **Expected:** "No weekly feeds" message (since disabled in settings)
8. Go back to Settings
9. Enable "Weekly Feeds"
10. Return to TMDb Feeds page
11. **Expected:** Weekly feeds now visible

**Verification:**
```typescript
// Check settings sync
const settings = JSON.parse(localStorage.getItem('screndly_tmdb_settings'));
assert(settings.enableToday === true);
assert(settings.enableWeekly === false);

// Check feeds filtered correctly
const visibleFeeds = feeds.filter(feed => {
  if (feed.source === 'tmdb_today' && !settings.enableToday) return false;
  if (feed.source === 'tmdb_weekly' && !settings.enableWeekly) return false;
  // ... etc
  return true;
});
```

### Scenario 6: Notification Badge Count

**Test Steps:**
1. Clear all notifications
2. **Expected:** Badge shows no count
3. Create 3 unread notifications
4. **Expected:** Badge shows "3"
5. Mark 1 as read
6. **Expected:** Badge shows "2"
7. Mark all as read
8. **Expected:** Badge disappears
9. Create 10+ unread notifications
10. **Expected:** Badge shows "9+" (if using max display)

**Verification:**
```typescript
const getUnreadCount = (notifications: Notification[]) => {
  return notifications.filter(n => !n.read).length;
};

// Test
let notifications = [];
assert(getUnreadCount(notifications) === 0);

notifications = [
  { id: '1', read: false, /* ... */ },
  { id: '2', read: false, /* ... */ },
  { id: '3', read: true, /* ... */ }
];
assert(getUnreadCount(notifications) === 2);
```

---

## Platform Configuration

### Supported Platforms (ONLY THESE THREE)
```typescript
const SUPPORTED_PLATFORMS = ['x', 'threads', 'facebook'] as const;
type SupportedPlatform = typeof SUPPORTED_PLATFORMS[number];

// Platform metadata
const platformMetadata = {
  x: {
    name: 'X',
    displayName: 'X (Twitter)',
    icon: XIcon,
    iconSize: 'w-4 h-4',
    color: '#000000',
    fallbackUrl: 'https://x.com/screenrender'
  },
  threads: {
    name: 'Threads',
    displayName: 'Threads',
    icon: ThreadsIcon,
    iconSize: 'w-5 h-5',
    color: '#000000',
    fallbackUrl: 'https://threads.net/@screenrender'
  },
  facebook: {
    name: 'Facebook',
    displayName: 'Facebook',
    icon: FacebookIcon,
    iconSize: 'w-6 h-6',
    color: '#1877f2',
    fallbackUrl: 'https://facebook.com/screenrender'
  }
};
```

### Removed Platforms (DO NOT USE ANYWHERE)
- Instagram - Completely removed from all auto-post options
- YouTube - Completely removed from all auto-post options
- TikTok - Completely removed from all auto-post options

**Note:** Comment Reply Automation still shows Instagram and YouTube because those platforms support comment replies, but they are NOT available for auto-posting content.

---

## Styling Guidelines

### Typography (CRITICAL)
```typescript
// ❌ NEVER USE (unless user specifically requests):
className="text-2xl font-bold leading-none"

// ✅ ALWAYS USE:
className="text-gray-900 dark:text-white"
// Let globals.css handle font-size, font-weight, line-height
```

### Card Styling Template
```tsx
<div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200 dark:border-[#333333] p-6 shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow cursor-pointer">
  {/* Card content */}
</div>
```

### TMDb Caption Box (EXACT STYLING)
```tsx
<textarea 
  className="w-full bg-[#000000] border border-[#333333] text-white p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#ec1e24]"
  rows={4}
  placeholder="Edit caption..."
/>
```

### Button Variants
```tsx
// Primary (Red)
<button className="bg-[#ec1e24] hover:bg-[#d11b20] text-white px-4 py-2 rounded-lg transition-colors">
  Primary Action
</button>

// Secondary (Gray)
<button className="bg-gray-100 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] text-gray-900 dark:text-white px-4 py-2 rounded-lg transition-colors">
  Secondary Action
</button>

// Icon Button
<button className="p-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg transition-colors">
  <Icon className="w-5 h-5 text-gray-600 dark:text-[#9CA3AF]" />
</button>
```

### Color Palette Reference
```typescript
const colors = {
  // Brand
  primary: '#ec1e24',
  primaryHover: '#d11b20',
  
  // Backgrounds
  bgLight: '#FFFFFF',
  bgDark: '#000000',
  bgCardDark: '#0A0A0A',
  bgSecondaryDark: '#1A1A1A',
  
  // Borders
  borderLight: '#e5e7eb', // gray-200
  borderDark: '#333333',
  
  // Text
  textLight: '#111827', // gray-900
  textDark: '#FFFFFF',
  textMuted: '#9CA3AF', // gray-400
  textMutedDark: '#6B7280', // gray-500
  
  // Feed Types
  today: '#3b82f6', // blue-500
  weekly: '#22c55e', // green-500
  monthly: '#a855f7', // purple-500
  anniversary: '#f97316' // orange-500
};
```

---

## Data Persistence

### LocalStorage Keys Reference
```typescript
const STORAGE_KEYS = {
  // Settings
  TMDB_SETTINGS: 'screndly_tmdb_settings',
  COMMENT_SETTINGS: 'screndly_comment_settings',
  RSS_SETTINGS: 'screndly_rss_settings',
  API_KEYS: 'screndly_api_keys',
  VIDEO_SETTINGS: 'screndly_video_settings',
  ERROR_SETTINGS: 'screndly_error_settings',
  CLEANUP_SETTINGS: 'screndly_cleanup_settings',
  NOTIFICATION_SETTINGS: 'screndly_notification_settings',
  
  // User Preferences
  HAPTICS_ENABLED: 'hapticsEnabled',
  THEME: 'theme',
  
  // Connections
  PLATFORM_CONNECTIONS: 'platformConnections',
  
  // App State
  NOTIFICATIONS: 'screndly_notifications',
  LAST_PAGE: 'screndly_last_page'
} as const;
```

### Auto-Save Implementation
```typescript
// Debounced auto-save pattern
let saveTimeout: NodeJS.Timeout;

const autoSave = (key: string, data: any) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`Auto-saved ${key}`);
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      toast.error('Failed to save settings');
    }
  }, 1000); // 1 second debounce
};
```

---

## Design System & UI Guidelines

### Icon Styling Standards
```typescript
// All icons follow consistent styling:
const iconStyles = {
  // Brand red color for all icons
  color: '#ec1e24',
  
  // No circular backgrounds
  background: 'transparent',
  
  // Standard sizes
  size: {
    small: 16,
    medium: 20,
    large: 24
  }
};

// Examples across components:
// - Navigation icons
// - Stat card icons
// - Platform logos
// - Notification icons (Clapperboard for TMDb)
// - Settings icons
// - Action buttons
```

### Toggle Switch States (Dark Mode)
```css
/* Switch "On" State */
background: #ec1e24; /* Brand red */

/* Switch "Off" State */
background: #1A1A1A; /* Darker gray for better contrast */
```

### Feed Icon Handling
```typescript
// FeedCard component uses proper error handling
// for web favicons with Globe icon fallback

const [iconError, setIconError] = useState(false);

{iconError ? (
  <Globe className="w-5 h-5 text-[#ec1e24]" />
) : (
  <img
    src={`https://www.google.com/s2/favicons?domain=${feedUrl}&sz=64`}
    alt=""
    className="w-5 h-5"
    onError={() => setIconError(true)}
  />
)}
```

### Component-Specific Updates
- **FeedEditor**: Removed redundant "Delete" button
- **FeedCard**: Fixed Variety feed web icon with proper error handling
- **All Components**: Icons changed to brand red (#ec1e24) with transparent backgrounds

---

## File Structure

```
screndly/
├── App.tsx (Main router & state management)
├── /components
│   ├── DashboardOverview.tsx
│   ├── ChannelsPage.tsx
│   ├── PlatformsPage.tsx
│   ├── RSSPage.tsx
│   ├── TMDbFeedsPage.tsx
│   ├── CommentAutomationPage.tsx (Daily/recent replies & performance metrics)
│   ├── LogsPage.tsx
│   ├── RecentActivityPage.tsx
│   ├── SettingsPanel.tsx
│   ├── NotificationPanel.tsx
│   ├── Navigation.tsx
│   ├── MobileBottomNav.tsx
│   ├── ThemeProvider.tsx
│   │
│   ├── /settings
│   │   ├── ApiKeysSettings.tsx
│   │   ├── VideoSettings.tsx (with OpenAI model selector)
│   │   ├── CommentReplySettings.tsx
│   │   ├── RssSettings.tsx (with OpenAI model selector)
│   │   ├── TmdbFeedsSettings.tsx (contains TMDbScheduler + TMDbSettings)
│   │   ├── ErrorHandlingSettings.tsx
│   │   ├── CleanupSettings.tsx (separate video/image storage settings)
│   │   ├── HapticSettings.tsx
│   │   ├── AppearanceSettings.tsx
│   │   └── NotificationsSettings.tsx
│   │
│   ├── /tmdb
│   │   ├── TMDbStatsPanel.tsx
│   │   ├── TMDbScheduler.tsx (used in TmdbFeedsSettings)
│   │   ├── TMDbSettings.tsx (used in TmdbFeedsSettings)
│   │   ├── TMDbFeedCard.tsx
│   │   └── TMDbCalendarView.tsx
│   │
│   ├── /rss
│   │   ├── RSSFeedCard.tsx
│   │   └── RSSFeedsWidget.tsx
│   │
│   ├── /icons
│   │   ├── XIcon.tsx
│   │   ├── ThreadsIcon.tsx
│   │   └── FacebookIcon.tsx
│   │
│   └── /ui (ShadCN components)
│       ├── button.tsx
│       ├── input.tsx
│       ├── switch.tsx
│       ├── select.tsx
│       ├── card.tsx
│       └── ... (other ShadCN components)
│
├── /utils
│   ├── haptics.ts
│   └── favicon.ts
│
├── /hooks
│   └── useSwipeNavigation.ts
│
└── /styles
    └── globals.css (typography defaults, no font classes!)
```

---

## Implementation Priority Checklist

### Phase 1: Core Structure ✅ (High Confidence - 95%)
- [x] All page components created
- [x] Settings panel with 10 pages
- [x] Navigation components (desktop + mobile)
- [x] NotificationPanel component
- [x] Basic routing in App.tsx
- [x] LocalStorage persistence pattern
- [x] Theme provider (dark/light mode)
- [x] Haptic feedback utility

### Phase 2: Navigation & Linking ⚠️ (Medium-High Confidence - 85%)
- [ ] Settings deep-linking logic
  - [ ] `handleNavigate` parsing logic
  - [ ] `settingsPageMap` implementation
  - [ ] Back button state restoration
- [ ] Dashboard stat card onClick handlers
- [ ] Swipe navigation hook
  - [ ] Touch event listeners
  - [ ] Minimum distance calculation
  - [ ] Special cases (Dashboard right, Logs left)
- [ ] Notification click navigation

### Phase 3: TMDb System ⚠️ (Medium Confidence - 75%)
- [ ] TMDb Scheduler calculations
  - [ ] `getLastMonday()` - Test all 7 days of week
  - [ ] `getNextMonday()` - Test all 7 days of week
  - [ ] Countdown timer real-time updates
- [ ] TMDb Stats calculations
  - [ ] Ready to Post (next 24hrs filter)
  - [ ] Cache hit rate calculation
  - [ ] Token usage estimation
  - [ ] API calls counter
- [ ] TMDb Settings sync
  - [ ] Settings → localStorage → TMDb page
  - [ ] Platform toggles per feed type
  - [ ] Feed filtering based on enabled types

### Phase 4: Platform Integration ✅ (High Confidence - 90%)
- [ ] Platform logo click handlers
  - [ ] Load platformConnections from localStorage
  - [ ] Fallback to Screen Render URLs
  - [ ] `window.open()` with `noopener,noreferrer`
- [ ] Platform tags in Logs page (clickable)
- [ ] Remove Instagram/YouTube/TikTok from auto-post
- [ ] Only X, Threads, Facebook in selectors

### Phase 5: Notifications ✅ (High Confidence - 90%)
- [ ] Notification creation on events
- [ ] Source-specific icons (Clapperboard for TMDb)
- [ ] Mark as read/unread toggle
- [ ] Mark all as read
- [ ] Clear all notifications
- [ ] Unread badge count
- [ ] Click notification → navigate to actionPage

### Phase 6: Polish & Edge Cases ⚠️ (Medium Confidence - 70%)
- [ ] Auto-save debouncing (1 second)
- [ ] Toast notifications for all actions
- [ ] Error handling for localStorage failures
- [ ] Mobile responsive breakpoints
- [ ] Loading states
- [ ] Empty states (no feeds, no notifications, etc.)
- [ ] Accessibility (keyboard navigation, ARIA labels)

---

## Backend Integration Points

### API Endpoints Needed
```typescript
// TMDb Feeds
GET  /api/tmdb/feeds              // Get all feeds
POST /api/tmdb/feeds              // Create feed
PUT  /api/tmdb/feeds/:id          // Update feed
DELETE /api/tmdb/feeds/:id        // Delete feed
POST /api/tmdb/feeds/refresh      // Manual refresh

// RSS Feeds
GET  /api/rss/feeds               // Get all RSS feeds
POST /api/rss/feeds               // Add RSS feed
DELETE /api/rss/feeds/:id         // Remove RSS feed

// Comments
GET  /api/comments                // Get recent comments
POST /api/comments/:id/reply      // Reply to comment
GET  /api/comments/stats          // Get comment stats

// Channels
GET  /api/channels                // Get YouTube channels
POST /api/channels                // Add channel
DELETE /api/channels/:id          // Remove channel

// Platforms
POST /api/platforms/post          // Post to platforms
GET  /api/platforms/connections   // Get connection status
POST /api/platforms/connect       // Connect platform
POST /api/platforms/disconnect    // Disconnect platform

// Settings
GET  /api/settings                // Get all settings
PUT  /api/settings                // Update settings

// Logs
GET  /api/logs                    // Get system logs
GET  /api/logs/errors             // Get errors only

// Notifications
GET  /api/notifications           // Get all notifications
PUT  /api/notifications/:id/read  // Mark as read
POST /api/notifications/clear     // Clear all
```

### Cron Jobs
```typescript
// Monday 00:00 UTC - TMDb Feed Refresh
// Pseudo-code:
async function tmdbWeeklyRefresh() {
  const settings = await getSettings('tmdb');
  
  if (settings.enableToday) {
    await generateTodayFeeds(); // This week Mon-Sun
  }
  
  if (settings.enableWeekly) {
    await generateWeeklyFeeds(); // Next 7 days
  }
  
  if (settings.enableMonthly) {
    await generateMonthlyFeeds(); // 1 month forecast
  }
  
  if (settings.enableAnniversaries) {
    await generateAnniversaryFeeds(); // Milestones
  }
  
  await scheduleFeeds(); // Distribute with proper gaps
}

// Every 5 minutes - RSS Feed Check
async function checkRSSFeeds() {
  const feeds = await getRSSFeeds();
  for (const feed of feeds) {
    await fetchAndProcessFeed(feed);
  }
}

// Every 1 minute - Comment Monitoring
async function monitorComments() {
  const settings = await getSettings('comment');
  if (!settings.enabled) return;
  
  for (const platform of settings.platforms) {
    if (platform.enabled) {
      await checkAndReplyComments(platform);
    }
  }
}

// Daily 00:00 - Cleanup
async function dailyCleanup() {
  const settings = await getSettings('cleanup');
  await cleanupOldLogs(settings.logRetentionDays);
  await cleanupOldFeeds(settings.feedRetentionDays);
  await cleanupCache(settings.cacheRetentionDays);
}
```

---

## Quick Reference: Common Tasks

### How to add a new settings page:
1. Create `/components/settings/MyNewSettings.tsx`
2. Follow the localStorage persistence pattern
3. Add to `SettingsPanel.tsx` switch statement
4. Add to `settingsPages` map
5. Add deep-link to `deepLinkMap` in App.tsx

### How to add a new stat card to Dashboard:
1. Add object to `statsCards` array
2. Include `onClick: () => onNavigate('page')`
3. Choose appropriate icon from `lucide-react`
4. Use brand colors or semantic colors

### How to add a new platform:
1. Add to `SUPPORTED_PLATFORMS` array
2. Create icon component in `/components/icons/`
3. Add to `platformMetadata`
4. Add to all platform selectors (TMDb, RSS, etc.)
5. Add to Platforms page
6. Update `platformConnections` interface

### How to create a notification:
```typescript
const notification: Notification = {
  id: Date.now().toString(),
  type: 'success', // or 'error', 'warning', 'info'
  source: 'tmdb', // or 'rss', 'upload', 'system'
  title: 'Action Complete',
  message: 'Details about what happened',
  timestamp: new Date().toISOString(),
  read: false,
  actionPage: 'tmdb' // Optional: page to navigate to
};
setNotifications(prev => [notification, ...prev]);
```

---

## Recent Updates & Changes

### November 22, 2024 - OpenAI Model Selection & UI Refinements

#### OpenAI Model Selectors Added
- **Video Settings**: Added OpenAI model dropdown with GPT-5 Nano, GPT-4o Mini, GPT-4o, GPT-3.5 Turbo, GPT-4 Turbo, GPT-4
- **RSS Settings**: Added OpenAI model dropdown with same model options
- **TMDb Settings**: Added OpenAI model dropdown with same model options
- All three settings pages now have consistent model selection with toast notifications on change

#### Cleanup Settings Enhanced
- Separated storage cleanup into two distinct sections:
  - **Video Storage**: Independent toggle and retention days (1-365 days)
  - **Image Storage**: Independent toggle and retention days (1-365 days)
- Both can be configured independently for better control

#### UI/UX Improvements
- **Dark Mode Toggle Switches**: "Off" state background changed to #1A1A1A for better contrast
- **Icon Standardization**: All icons now use brand red (#ec1e24) with transparent backgrounds
- **Feed Icons**: Improved error handling with Globe icon fallback for failed favicons
- **FeedEditor**: Removed redundant "Delete" button for cleaner interface
- **FeedCard**: Fixed Variety feed web icon display with proper error handling

#### Component Additions
- **CommentAutomationPage**: New dedicated page showing daily/recent comment replies with:
  - Platform-specific daily reply counts
  - Overall performance metrics
  - Platform breakdowns with success rates
  - Recent AI-generated responses display

### November 17, 2024 - TMDb Feeds & Platform Updates

#### TMDb Feed System
- Implemented TMDb weekly/monthly/anniversary feeds with dedicated "TMDb Feeds" page
- Added "Today" feed type showing movies/TV shows releasing on current day
- Integrated TMDb notifications with special Clapperboard icons
- Monday 00:00 UTC weekly refresh scheduler

#### Platform Configuration Changes
- **Removed Globally**: Instagram, YouTube, TikTok from all auto-post options
- **Available Platforms**: Only X (Twitter), Threads, and Facebook for auto-posting
- Note: Instagram and YouTube still available in Comment Reply settings for comment automation

#### Features Added
- API Usage feature on dashboard
- Comprehensive notification system with source-based icons
- Icon styling standardization across all components

---

**Last Updated:** November 22, 2024  
**Version:** 2.1 - Complete Feature Documentation  
**Confidence Level:** 95%+ for Cursor 2.0 Implementation  
**Status:** Ready for Development 🚀
