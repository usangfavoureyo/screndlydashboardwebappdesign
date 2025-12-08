import { X, ChevronRight, LogOut, Key, FileText, Mail, Video, MessageSquare, Rss, AlertCircle, Trash2, Palette, Smartphone, Clapperboard, Bell, Film, Search, Download, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { useTheme } from './ThemeProvider';
import { useState } from 'react';
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

  // Define all settings items with searchable terms
  const settingsItems = [
    { id: 'apikeys', label: 'API Keys', icon: Key, keywords: ['api', 'keys', 'youtube', 'openai', 'serper', 'tmdb', 's3', 'backblaze', 'b2', 'redis', 'database', 'integration'] },
    { id: 'video', label: 'Video', icon: Video, keywords: ['video', 'fetch', 'interval', 'region', 'filter', 'trailer', 'monitoring'] },
    { id: 'comment', label: 'Comment Automation', icon: MessageSquare, keywords: ['comment', 'reply', 'automation', 'ai', 'blacklist', 'throttle', 'frequency'] },
    { id: 'rss', label: 'RSS Feeds', icon: Rss, keywords: ['rss', 'feed', 'posting', 'image', 'platform', 'deduplication', 'fetch'] },
    { id: 'tmdb', label: 'TMDb Feeds', icon: Clapperboard, keywords: ['tmdb', 'movie', 'database', 'feeds', 'anniversary', 'scheduler'] },
    { id: 'videostudio', label: 'Video Studio', icon: Film, keywords: ['video', 'studio', 'generation', 'llm', 'shotstack', 'gpt', 'openai', 'caption'] },
    { id: 'timezone', label: 'Timezone', icon: Globe, keywords: ['timezone', 'time', 'zone', 'schedule', 'scheduling', 'generation', 'feeds', 'utc', 'gmt'] },
    { id: 'error', label: 'Error Handling', icon: AlertCircle, keywords: ['error', 'handling', 'retry', 'logging', 'failure', 'alert'] },
    { id: 'cleanup', label: 'Cleanup', icon: Trash2, keywords: ['cleanup', 'storage', 'retention', 'maintenance', 'delete', 'purge'] },
    { id: 'haptic', label: 'Haptic Feedback', icon: Smartphone, keywords: ['haptic', 'vibration', 'feedback', 'mobile', 'touch'] },
    { id: 'appearance', label: 'Appearance', icon: Palette, keywords: ['appearance', 'theme', 'dark', 'light', 'mode', 'color'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, keywords: ['notifications', 'email', 'push', 'alert', 'notify'] },
    { id: 'pwa', label: 'Progressive Web App', icon: Download, keywords: ['pwa', 'progressive', 'web', 'app', 'install', 'offline', 'cache', 'service', 'worker'] },
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
          onClick={() => setActiveSettingsPage(null)}
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                onClick={() => {
                  haptics.light();
                  setActiveSettingsPage(item.id);
                }}
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
                        haptics.light();
                        onNavigate(item.id);
                        onClose(); // Close settings panel after navigation
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