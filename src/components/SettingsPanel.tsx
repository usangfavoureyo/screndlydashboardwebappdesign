import { X, ChevronRight, LogOut, Key, FileText, Mail, Video, MessageSquare, Rss, AlertCircle, Trash2, Palette, Smartphone, Clapperboard, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { useTheme } from './ThemeProvider';
import { useState, useEffect } from 'react';
import { haptics, setHapticsEnabled } from '../utils/haptics';
import { TMDbSettings } from './settings/TMDbSettings';
import { ApiKeysSettings } from './settings/ApiKeysSettings';
import { VideoSettings } from './settings/VideoSettings';
import { CommentReplySettings } from './settings/CommentReplySettings';
import { RssSettings } from './settings/RssSettings';
import { TmdbFeedsSettings } from './settings/TmdbFeedsSettings';
import { ErrorHandlingSettings } from './settings/ErrorHandlingSettings';
import { CleanupSettings } from './settings/CleanupSettings';
import { HapticSettings } from './settings/HapticSettings';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { NotificationsSettings } from './settings/NotificationsSettings';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  pageBeforeSettings?: string;
  onNewNotification?: (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning', source: 'upload' | 'rss' | 'tmdb' | 'system') => void;
  initialPage?: string | null;
}

export function SettingsPanel({ isOpen, onClose, onLogout, onNavigate, onNewNotification, initialPage }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('screndlySettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all new fields exist
        return {
          ...getDefaultSettings(),
          ...parsed,
          // Ensure platform blacklists exist
          xCommentBlacklist: parsed.xCommentBlacklist || getDefaultSettings().xCommentBlacklist,
          threadsCommentBlacklist: parsed.threadsCommentBlacklist || getDefaultSettings().threadsCommentBlacklist,
          facebookCommentBlacklist: parsed.facebookCommentBlacklist || getDefaultSettings().facebookCommentBlacklist,
          instagramCommentBlacklist: parsed.instagramCommentBlacklist || getDefaultSettings().instagramCommentBlacklist,
          youtubeCommentBlacklist: parsed.youtubeCommentBlacklist || getDefaultSettings().youtubeCommentBlacklist,
        };
      } catch (e) {
        // If parsing fails, use defaults
      }
    }
    
    return getDefaultSettings();
  });

  function getDefaultSettings() {
    const hapticsEnabled = localStorage.getItem('hapticsEnabled');
    return {
      // API Keys
      youtubeKey: '••••••••••••••••',
      openaiKey: '••••••••••••••••',
      serperKey: '••••••••••••••••',
      tmdbKey: '••••••••••••••••',
      s3Key: '••••••••••••••••',
      redisUrl: 'redis://localhost:6379',
      databaseUrl: 'postgresql://localhost/screndly',
      
      // Video
      fetchInterval: '10',
      regionFilter: 'US,UK',
      advancedFilters: 'trailer, official, teaser',
      
      // Comment Reply
      commentRepliesActive: true,
      totalCommentsProcessed: 1247,
      repliesPosted: 1189,
      commentErrors: 4,
      commentBlacklistUsernames: '',
      commentBlacklistKeywords: '',
      commentReplyFrequency: 'instant',
      commentThrottle: 'low', // low, medium, high
      
      // Per-platform comment settings
      xCommentBlacklist: {
        active: true,
        usernames: '',
        keywords: '',
        noEmojiOnly: false,
        noLinks: false,
        pauseOldPosts: true,
        pauseAfterHours: '24',
      },
      threadsCommentBlacklist: {
        active: false,
        usernames: '',
        keywords: '',
        noEmojiOnly: false,
        noLinks: false,
        pauseOldPosts: true,
        pauseAfterHours: '24',
      },
      facebookCommentBlacklist: {
        active: false,
        usernames: '',
        keywords: '',
        noEmojiOnly: false,
        noLinks: false,
        pauseOldPosts: true,
        pauseAfterHours: '24',
      },
      instagramCommentBlacklist: {
        active: true,
        usernames: '',
        keywords: '',
        noEmojiOnly: false,
        noLinks: false,
        pauseOldPosts: true,
        pauseAfterHours: '24',
      },
      youtubeCommentBlacklist: {
        active: false,
        usernames: '',
        keywords: '',
        noEmojiOnly: false,
        noLinks: false,
        pauseOldPosts: true,
        pauseAfterHours: '24',
      },
      
      // RSS
      rssEnabled: false,
      rssImageCount: 'random',
      rssPlatforms: ['x', 'threads'],
      rssFetchInterval: '5',
      rssPostingInterval: '10',
      rssDeduplication: true,
      rssLogLevel: 'standard',
      
      // Cleanup
      cleanupEnabled: true,
      cleanupInterval: 'daily',
      storageRetention: '48',
      
      // Appearance
      darkMode: true,
      hapticsEnabled: hapticsEnabled === null ? true : hapticsEnabled === 'true',

      // Notifications
      emailNotifications: true,
      pushNotifications: false,
    };
  }

  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save effect with debounce
  useEffect(() => {
    if (!isOpen) return; // Don't save if panel is closed

    const timer = setTimeout(() => {
      saveSettings();
    }, 1000); // Save 1 second after last change

    return () => clearTimeout(timer);
  }, [settings, isOpen]);

  const saveSettings = () => {
    setIsSaving(true);
    // Save settings to localStorage
    localStorage.setItem('screndlySettings', JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleTimeString());
    }, 300);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const [activeSettingsPage, setActiveSettingsPage] = useState<string | null>(initialPage || null);

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
        <TmdbFeedsSettings onSave={saveSettings} onBack={() => setActiveSettingsPage(null)} />
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

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 lg:pl-64"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full lg:w-[600px] bg-white dark:bg-[#000000] z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333] p-4 flex items-center justify-between">
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

        <div className="p-6 space-y-4">
          {/* Settings Navigation Items */}
          <div className="space-y-1">
            <button
              onClick={() => {
                haptics.light();
                setActiveSettingsPage('apikeys');
              }}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-[#ec1e24]" />
                <span className="text-gray-900 dark:text-white">API Keys</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                haptics.light();
                setActiveSettingsPage('video');
              }}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-[#ec1e24]" />
                <span className="text-gray-900 dark:text-white">Video Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                haptics.light();
                setActiveSettingsPage('comment');
              }}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#ec1e24]" />
                <span className="text-gray-900 dark:text-white">Comment Automation</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                haptics.light();
                setActiveSettingsPage('rss');
              }}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Rss className="w-5 h-5 text-[#ec1e24]" />
                <span className="text-gray-900 dark:text-white">RSS Posting</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                haptics.light();
                setActiveSettingsPage('tmdb');
              }}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clapperboard className="w-5 h-5 text-[#ec1e24]" />
                <span className="text-gray-900 dark:text-white">TMDb Feeds</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                haptics.light();
                setActiveSettingsPage('error');
              }}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#ec1e24]" />
                <span className="text-gray-900 dark:text-white">Error Handling</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                haptics.light();
                setActiveSettingsPage('cleanup');
              }}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-[#ec1e24]" />
                <span className="text-gray-900 dark:text-white">Cleanup</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                haptics.light();
                setActiveSettingsPage('haptic');
              }}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#ec1e24]" />
                <span className="text-gray-900 dark:text-white">Haptic Feedback</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                haptics.light();
                setActiveSettingsPage('appearance');
              }}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-[#ec1e24]" />
                <span className="text-gray-900 dark:text-white">Appearance</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                haptics.light();
                setActiveSettingsPage('notifications');
              }}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#ec1e24]" />
                <span className="text-gray-900 dark:text-white">Notifications</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <Separator className="bg-gray-200 dark:bg-[#1F1F1F] my-4" />

          {/* Legal */}
          <div>
            <div className="flex items-center gap-2 px-4 mb-2">
              <FileText className="w-5 h-5 text-[#ec1e24]" />
              <h3 className="text-gray-900 dark:text-white">Legal</h3>
            </div>
            <div className="space-y-1">
              <button 
                onClick={() => {
                  haptics.light();
                  onNavigate('privacy');
                }} 
                className="block text-gray-600 dark:text-[#9CA3AF] hover:text-[#ec1e24] text-left w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => {
                  haptics.light();
                  onNavigate('terms');
                }} 
                className="block text-gray-600 dark:text-[#9CA3AF] hover:text-[#ec1e24] text-left w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => {
                  haptics.light();
                  onNavigate('disclaimer');
                }} 
                className="block text-gray-600 dark:text-[#9CA3AF] hover:text-[#ec1e24] text-left w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
              >
                Disclaimer
              </button>
              <button 
                onClick={() => {
                  haptics.light();
                  onNavigate('cookie');
                }} 
                className="block text-gray-600 dark:text-[#9CA3AF] hover:text-[#ec1e24] text-left w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
              >
                Cookie Policy
              </button>
            </div>
          </div>

          <Separator className="bg-[#374151]" />

          {/* Company */}
          <div>
            <div className="flex items-center gap-2 px-4 mb-2">
              <Mail className="w-5 h-5 text-[#ec1e24]" />
              <h3 className="text-gray-900 dark:text-white">Company</h3>
            </div>
            <div className="space-y-1">
              <button 
                onClick={() => {
                  haptics.light();
                  onNavigate('contact');
                }} 
                className="block text-gray-600 dark:text-[#9CA3AF] hover:text-[#ec1e24] text-left w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
              >
                Contact
              </button>
              <button 
                onClick={() => {
                  haptics.light();
                  onNavigate('about');
                }} 
                className="block text-gray-600 dark:text-[#9CA3AF] hover:text-[#ec1e24] text-left w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
              >
                About
              </button>
            </div>
          </div>

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
        </div>
      </div>
    </>
  );
}