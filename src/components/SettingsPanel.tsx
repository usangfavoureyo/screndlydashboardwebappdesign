import { X, ChevronRight, LogOut, Key, FileText, Mail, Video, MessageSquare, Rss, AlertCircle, Trash2, Palette, Smartphone, Clapperboard, Bell, Film, Search, Download, Globe, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { useTheme } from './ThemeProvider';
import { useState, useRef, useLayoutEffect } from 'react';
import { haptics, setHapticsEnabled } from '../utils/haptics';
import { useSettings } from '../contexts/SettingsContext';
import { TMDbSettings } from './settings/TMDbSettings';
import { ApiKeysSettings } from './settings/ApiKeysSettings';
import { VideoSettings } from './settings/VideoSettings';
import { CommentReplySettings } from './settings/CommentReplySettings';
import { RssSettings } from './settings/RssSettings';
import { TmdbFeedsSettings } from './settings/TmdbFeedsSettings';
import { VideoStudioSettings } from './settings/VideoStudioSettings';
import { ErrorHandlingSettings } from './settings/ErrorHandlingSettings';
import { CleanupSettings } from './settings/CleanupSettings';
import { HapticSettings } from './settings/HapticSettings';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { NotificationsSettings } from './settings/NotificationsSettings';
import { PWASettings } from './settings/PWASettings';
import { TimezoneSettings } from './settings/TimezoneSettings';
import { ThumbnailSettings } from './settings/ThumbnailSettings';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  pageBeforeSettings?: string;
  onNewNotification?: (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning', source: 'upload' | 'rss' | 'tmdb' | 'videostudio' | 'system') => void;
  initialPage?: string | null;
}

export function SettingsPanel({ isOpen, onClose, onLogout, onNavigate, onNewNotification, initialPage }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting } = useSettings();
  
  const [activeSettingsPage, setActiveSettingsPage] = useState<string | null>(initialPage || null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  // Restore scroll position when SettingsPanel opens
  useLayoutEffect(() => {
    if (isOpen && activeSettingsPage === null && scrollContainerRef.current) {
      // First check if we're returning from a static page (mobile/tablet only)
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        const savedStaticPageScroll = sessionStorage.getItem('settingsPanelScrollFromStaticPage');
        if (savedStaticPageScroll) {
          scrollContainerRef.current.scrollTop = parseInt(savedStaticPageScroll, 10);
          sessionStorage.removeItem('settingsPanelScrollFromStaticPage');
          return;
        }
      }
      // Otherwise restore from regular settings sub-page navigation
      scrollContainerRef.current.scrollTop = savedScrollPosition;
    }
  }, [activeSettingsPage, savedScrollPosition, isOpen]);

  const handleOpenSettingsPage = (pageId: string) => {
    if (scrollContainerRef.current) {
      setSavedScrollPosition(scrollContainerRef.current.scrollTop);
    }
    haptics.light();
    setActiveSettingsPage(pageId);
  };

  // Define all settings items with searchable terms
  const settingsItems = [
    { 
      id: 'apikeys', 
      label: 'API Keys', 
      icon: Key, 
      keywords: [
        'api', 'keys', 'credentials', 'integration', 'authentication',
        'openai', 'openai api key', 'gpt', 'chatgpt',
        'serper', 'serper api key', 'search',
        'tmdb', 'tmdb api key', 'movie database',
        'google video intelligence', 'google video intelligence api key', 'video analysis',
        'shotstack', 'shotstack api key', 'video generation',
        'google search', 'google search api key', 'custom search engine', 'cx',
        's3', 'aws', 'aws s3', 'amazon',
        'backblaze', 'b2', 'backblaze b2', 'key id', 'application key', 'bucket', 'bucket name',
        'general storage', 'trailers', 'uploads',
        'videos bucket', 'movies', 'tv shows', 'video scenes', 'scenes module'
      ] 
    },
    { 
      id: 'video', 
      label: 'Video', 
      icon: Video, 
      keywords: [
        'video', 'trailer', 'monitoring', 'fetch', 'tracking',
        'interval', 'fetch interval', 'check frequency', 'polling',
        'region', 'region filter', 'location', 'country', 'geographic',
        'enabled', 'disable', 'turn off', 'turn on',
        'automatic', 'auto fetch', 'auto check'
      ] 
    },
    { 
      id: 'thumbnail', 
      label: 'Thumbnail Overlay', 
      icon: Image, 
      keywords: [
        'thumbnail', 'template', 'logo', 'position', 'overlay', 'image',
        'youtube', 'twitter', 'x', 'facebook', 'instagram', 'tiktok', 'platform',
        'backdrop', 'poster', 'cover', 'banner',
        'movie', 'tv', 'show', 'media',
        'auto', 'scale', 'size', 'resize', 'scaling',
        'placement', 'positioning', 'location',
        'preview', 'live preview',
        'top left', 'top center', 'top right', 'middle left', 'middle center', 'middle right', 'bottom left', 'bottom center', 'bottom right',
        'upload', 'custom logo', 'logo upload'
      ] 
    },
    { 
      id: 'comment', 
      label: 'Comment Automation', 
      icon: MessageSquare, 
      keywords: [
        'comment', 'reply', 'automation', 'auto reply', 'automatic reply',
        'ai', 'artificial intelligence', 'openai', 'gpt', 'llm',
        'model', 'ai model', 'openai model',
        'blacklist', 'block', 'filter', 'ignore', 'banned words',
        'throttle', 'rate limit', 'frequency', 'limit',
        'retention', 'history', 'keep', 'delete', 'cleanup',
        'activity', 'log', 'tracking', 'record',
        'enable', 'disable', 'turn on', 'turn off'
      ] 
    },
    { 
      id: 'rss', 
      label: 'RSS Feeds', 
      icon: Rss, 
      keywords: [
        'rss', 'feed', 'feeds', 'syndication',
        'posting', 'post', 'share', 'publish',
        'image', 'photo', 'thumbnail', 'media',
        'platform', 'social media', 'youtube', 'twitter', 'x', 'facebook', 'instagram',
        'deduplication', 'duplicate', 'unique', 'prevent duplicates',
        'fetch', 'check', 'poll', 'interval', 'frequency',
        'url', 'feed url', 'source',
        'enable', 'disable', 'turn on', 'turn off'
      ] 
    },
    { 
      id: 'tmdb', 
      label: 'TMDb Feeds', 
      icon: Clapperboard, 
      keywords: [
        'tmdb', 'the movie database', 'movie', 'database', 'film',
        'feeds', 'feed', 'content',
        'anniversary', 'birthday', 'release date', 'celebration',
        'scheduler', 'schedule', 'timing', 'frequency',
        'popular', 'trending', 'now playing', 'upcoming', 'top rated',
        'enable', 'disable', 'turn on', 'turn off',
        'interval', 'fetch interval', 'check frequency'
      ] 
    },
    { 
      id: 'videostudio', 
      label: 'Video Studio', 
      icon: Film, 
      keywords: [
        'video', 'studio', 'generation', 'create', 'generate',
        'llm', 'language model', 'ai', 'artificial intelligence',
        'shotstack', 'video editing', 'rendering',
        'gpt', 'openai', 'chatgpt', 'model',
        'caption', 'captions', 'subtitles', 'text',
        'scenes', 'scene detection', 'segments',
        'web search', 'search', 'google', 'serper', 'context',
        'provider', 'search provider',
        'max results', 'result limit',
        'enable', 'disable', 'turn on', 'turn off'
      ] 
    },
    { 
      id: 'timezone', 
      label: 'Timezone', 
      icon: Globe, 
      keywords: [
        'timezone', 'time zone', 'time', 'zone', 'clock',
        'schedule', 'scheduling', 'timing',
        'generation', 'post timing', 'publish time',
        'feeds', 'rss', 'tmdb',
        'utc', 'gmt', 'offset',
        'location', 'region', 'area',
        'america', 'europe', 'asia', 'pacific', 'new york', 'los angeles', 'london', 'tokyo'
      ] 
    },
    { 
      id: 'error', 
      label: 'Error Handling', 
      icon: AlertCircle, 
      keywords: [
        'error', 'errors', 'failure', 'failed', 'problem',
        'handling', 'management', 'recovery',
        'retry', 'retry attempts', 'max retries', 'retry limit',
        'logging', 'log', 'record', 'track',
        'alert', 'notification', 'notify', 'warning',
        'automatic', 'auto retry', 'automatic retry',
        'enable', 'disable', 'turn on', 'turn off'
      ] 
    },
    { 
      id: 'cleanup', 
      label: 'Cleanup', 
      icon: Trash2, 
      keywords: [
        'cleanup', 'clean', 'maintenance', 'housekeeping',
        'storage', 'disk', 'space', 'memory',
        'retention', 'keep', 'preserve', 'duration',
        'delete', 'remove', 'purge', 'clear',
        'comment', 'comments', 'comment activity', 'comment logs',
        'logs', 'log files', 'activity logs',
        'activity', 'history', 'recent activity',
        'recent', 'recent videos', 'recent uploads',
        'combined', 'combined activity', 'all activity',
        'automatic', 'auto delete', 'auto cleanup',
        'days', 'retention days', 'keep for days',
        'enable', 'disable', 'turn on', 'turn off'
      ] 
    },
    { 
      id: 'haptic', 
      label: 'Haptic Feedback', 
      icon: Smartphone, 
      keywords: [
        'haptic', 'haptics', 'vibration', 'vibrate', 'buzz',
        'feedback', 'tactile', 'touch',
        'mobile', 'phone', 'device',
        'enable', 'disable', 'turn on', 'turn off'
      ] 
    },
    { 
      id: 'appearance', 
      label: 'Appearance', 
      icon: Palette, 
      keywords: [
        'appearance', 'theme', 'style', 'look', 'visual',
        'dark', 'dark mode', 'dark theme', 'night mode',
        'light', 'light mode', 'light theme', 'day mode',
        'mode', 'color', 'colors', 'scheme', 'color scheme',
        'switch', 'toggle', 'change'
      ] 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      keywords: [
        'notifications', 'notification', 'alerts', 'alert',
        'email', 'email notification', 'mail',
        'push', 'push notification', 'browser notification',
        'notify', 'inform', 'update',
        'enable', 'disable', 'turn on', 'turn off',
        'sound', 'badge', 'banner'
      ] 
    },
    { 
      id: 'pwa', 
      label: 'Progressive Web App', 
      icon: Download, 
      keywords: [
        'pwa', 'progressive web app', 'progressive',
        'web', 'app', 'application',
        'install', 'installation', 'add to home', 'add to homescreen',
        'offline', 'offline mode', 'work offline',
        'cache', 'caching', 'cached',
        'service', 'worker', 'service worker',
        'update', 'version', 'latest version'
      ] 
    },
  ];

  const legalItems = [
    { id: 'privacy', label: 'Privacy Policy', keywords: ['privacy', 'policy', 'data', 'gdpr'] },
    { id: 'terms', label: 'Terms of Service', keywords: ['terms', 'service', 'agreement', 'legal'] },
    { id: 'disclaimer', label: 'Disclaimer', keywords: ['disclaimer', 'liability', 'legal'] },
    { id: 'cookie', label: 'Cookie Policy', keywords: ['cookie', 'tracking', 'privacy'] },
  ];

  const companyItems = [
    { id: 'contact', label: 'Contact', keywords: ['contact', 'support', 'help', 'email'] },
    { id: 'about', label: 'About', keywords: ['about', 'company', 'screen', 'render'] },
    { id: 'design-system', label: 'Design System', keywords: ['design', 'system', 'tokens', 'components', 'ui'] },
  ];

  // Filter items based on search query
  const filterItems = (items: typeof settingsItems) => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.label.toLowerCase().includes(query) || 
      item.keywords.some(keyword => keyword.includes(query))
    );
  };

  const filteredSettings = filterItems(settingsItems);
  const filteredLegal = filterItems(legalItems.map(item => ({ ...item, icon: FileText })));
  const filteredCompany = filterItems(companyItems.map(item => ({ ...item, icon: Mail })));

  const hasResults = filteredSettings.length > 0 || filteredLegal.length > 0 || filteredCompany.length > 0;

  if (!isOpen) return null;

  // Render sub-page if one is active
  if (activeSettingsPage === 'apikeys') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <ApiKeysSettings settings={settings} updateSetting={updateSetting} onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'video') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <VideoSettings settings={settings} updateSetting={updateSetting} onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'comment') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <CommentReplySettings settings={settings} updateSetting={updateSetting} onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'rss') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <RssSettings settings={settings} updateSetting={updateSetting} onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'tmdb') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <TmdbFeedsSettings onSave={updateSetting} onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'videostudio') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => {
            haptics.light();
            setActiveSettingsPage(null);
          }}
        />
        <VideoStudioSettings onSave={updateSetting} onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'error') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <ErrorHandlingSettings onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'cleanup') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <CleanupSettings settings={settings} updateSetting={updateSetting} onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'haptic') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <HapticSettings settings={settings} updateSetting={updateSetting} onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'appearance') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <AppearanceSettings theme={theme} setTheme={setTheme} updateSetting={updateSetting} onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'notifications') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <NotificationsSettings settings={settings} updateSetting={updateSetting} onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'pwa') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <PWASettings onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'timezone') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <TimezoneSettings onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }
  if (activeSettingsPage === 'thumbnail') {
    return (
      <>
        {/* Overlay for inner settings */}
        <div 
          className="hidden lg:block fixed inset-0 bg-black/50 z-40 lg:pl-64"
          onClick={() => setActiveSettingsPage(null)}
        />
        <ThumbnailSettings onBack={() => setActiveSettingsPage(null)} />
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 lg:pl-64"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div 
        ref={scrollContainerRef}
        className="fixed top-0 right-0 bottom-0 w-full lg:w-[600px] bg-white dark:bg-[#000000] z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333] p-4 flex items-center justify-between z-10">
          <h2 className="text-gray-900 dark:text-white text-xl">Settings</h2>
          <button 
            className="text-gray-900 dark:text-white p-1" 
            onClick={() => {
              try {
                haptics.light();
              } catch (e) {
                // Silently fail if haptics not available
              }
              onClose();
            }}
          >
            <X className="w-[26px] h-[26px] stroke-1" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => {
                haptics.light();
                setSearchQuery(e.target.value);
              }}
              onFocus={() => haptics.light()}
              className="pl-10 bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  haptics.light();
                  setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Settings Navigation Items */}
          <div className="space-y-1">
            {filteredSettings.map(item => (
              <button
                key={item.id}
                onClick={() => handleOpenSettingsPage(item.id)}
                className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-[#ec1e24]" />
                  <span className="text-gray-900 dark:text-white">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>

          {filteredLegal.length > 0 && (
            <>
              <Separator className="bg-gray-200 dark:bg-[#1F1F1F] my-4" />

              {/* Legal */}
              <div>
                <div className="flex items-center gap-2 px-4 mb-2">
                  <FileText className="w-5 h-5 text-[#ec1e24]" />
                  <h3 className="text-gray-900 dark:text-white">Legal</h3>
                </div>
                <div className="space-y-1">
                  {filteredLegal.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => {
                        // Save scroll position to sessionStorage on mobile/tablet only (not desktop)
                        const isDesktop = window.innerWidth >= 1024;
                        if (!isDesktop && scrollContainerRef.current) {
                          sessionStorage.setItem('settingsPanelScrollFromStaticPage', scrollContainerRef.current.scrollTop.toString());
                        }
                        haptics.light();
                        onNavigate(item.id);
                      }} 
                      className="block text-gray-600 dark:text-[#9CA3AF] hover:text-[#ec1e24] text-left w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {filteredCompany.length > 0 && (
            <>
              <Separator className="bg-[#374151]" />

              {/* Company */}
              <div>
                <div className="flex items-center gap-2 px-4 mb-2">
                  <Mail className="w-5 h-5 text-[#ec1e24]" />
                  <h3 className="text-gray-900 dark:text-white">Company</h3>
                </div>
                <div className="space-y-1">
                  {filteredCompany.map(item => (
                    <button 
                      key={item.id}
                      onClick={() => {
                        // Save scroll position to sessionStorage on mobile/tablet only (not desktop)
                        const isDesktop = window.innerWidth >= 1024;
                        if (!isDesktop && scrollContainerRef.current) {
                          sessionStorage.setItem('settingsPanelScrollFromStaticPage', scrollContainerRef.current.scrollTop.toString());
                        }
                        haptics.light();
                        onNavigate(item.id);
                        // Don't call onClose() here - handleNavigate handles closing settings for static pages
                      }} 
                      className="block text-gray-600 dark:text-[#9CA3AF] hover:text-[#ec1e24] text-left w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* No Results State */}
          {!hasResults && searchQuery && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-gray-600 dark:text-[#9CA3AF]">
                Try searching for "api", "video", "theme", or "notifications"
              </p>
              <button
                onClick={() => {
                  haptics.light();
                  setSearchQuery('');
                }}
                className="mt-4 text-[#ec1e24] hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Always show Logout button */}
          {!searchQuery && (
            <>
              <Separator className="bg-[#374151]" />

              {/* Logout */}
              <div>
                <Button
                  onClick={() => {
                    haptics.medium();
                    onLogout();
                  }}
                  variant="outline"
                  className="w-full gap-2 text-[#EF4444] border-[#EF4444] hover:bg-[#EF4444] hover:text-white bg-white dark:bg-black"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}