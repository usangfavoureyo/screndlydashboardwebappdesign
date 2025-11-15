import { useState } from 'react';
import { X, Key, Video, MessageSquare, Rss, AlertCircle, Trash2, Palette, FileText, Mail, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { useTheme } from './ThemeProvider';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function SettingsPanel({ isOpen, onClose, onLogout }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
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
    commentBlacklist: '',
    
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

    // Notifications
    emailNotifications: true,
    pushNotifications: false,

    // Cleanup
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 lg:pl-64"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full lg:w-[600px] bg-white dark:bg-[#1F2937] z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1F2937] border-b border-gray-200 dark:border-[#374151] p-4 flex items-center justify-between">
          <h2 className="text-gray-900 dark:text-white text-xl">Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5 text-gray-900 dark:text-white" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Keys Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-[#F45247]" />
              <h3 className="text-gray-900 dark:text-white">API Keys</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-gray-600 dark:text-[#9CA3AF]">YouTube API Key</Label>
                <Input
                  type="password"
                  value={settings.youtubeKey}
                  onChange={(e) => updateSetting('youtubeKey', e.target.value)}
                  className="bg-gray-100 dark:bg-[#374151] border-gray-300 dark:border-[#4B5563] text-gray-900 dark:text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-600 dark:text-[#9CA3AF]">OpenAI API Key</Label>
                <Input
                  type="password"
                  value={settings.openaiKey}
                  onChange={(e) => updateSetting('openaiKey', e.target.value)}
                  className="bg-gray-100 dark:bg-[#374151] border-gray-300 dark:border-[#4B5563] text-gray-900 dark:text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-600 dark:text-[#9CA3AF]">Serper API Key</Label>
                <Input
                  type="password"
                  value={settings.serperKey}
                  onChange={(e) => updateSetting('serperKey', e.target.value)}
                  className="bg-gray-100 dark:bg-[#374151] border-gray-300 dark:border-[#4B5563] text-gray-900 dark:text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-600 dark:text-[#9CA3AF]">TMDb API Key</Label>
                <Input
                  type="password"
                  value={settings.tmdbKey}
                  onChange={(e) => updateSetting('tmdbKey', e.target.value)}
                  className="bg-gray-100 dark:bg-[#374151] border-gray-300 dark:border-[#4B5563] text-gray-900 dark:text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-600 dark:text-[#9CA3AF]">AWS S3 Credentials</Label>
                <Input
                  type="password"
                  value={settings.s3Key}
                  onChange={(e) => updateSetting('s3Key', e.target.value)}
                  className="bg-gray-100 dark:bg-[#374151] border-gray-300 dark:border-[#4B5563] text-gray-900 dark:text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-600 dark:text-[#9CA3AF]">Redis URL</Label>
                <Input
                  value={settings.redisUrl}
                  onChange={(e) => updateSetting('redisUrl', e.target.value)}
                  className="bg-gray-100 dark:bg-[#374151] border-gray-300 dark:border-[#4B5563] text-gray-900 dark:text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-600 dark:text-[#9CA3AF]">Database URL</Label>
                <Input
                  value={settings.databaseUrl}
                  onChange={(e) => updateSetting('databaseUrl', e.target.value)}
                  className="bg-gray-100 dark:bg-[#374151] border-gray-300 dark:border-[#4B5563] text-gray-900 dark:text-white mt-1"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200 dark:bg-[#374151]" />

          {/* Video Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-[#F45247]" />
              <h3 className="text-gray-900 dark:text-white">Video Settings</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-[#9CA3AF]">Fetch Interval (minutes)</Label>
                <Input
                  type="number"
                  value={settings.fetchInterval}
                  onChange={(e) => updateSetting('fetchInterval', e.target.value)}
                  className="bg-[#374151] border-[#4B5563] text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-[#9CA3AF]">Region Filter</Label>
                <Input
                  value={settings.regionFilter}
                  onChange={(e) => updateSetting('regionFilter', e.target.value)}
                  placeholder="US,UK"
                  className="bg-[#374151] border-[#4B5563] text-white mt-1"
                />
                <p className="text-xs text-[#6B7280] mt-1">Comma-separated country codes</p>
              </div>
              <div>
                <Label className="text-[#9CA3AF]">Advanced Filters for Trailer Validation</Label>
                <Input
                  value={settings.advancedFilters}
                  onChange={(e) => updateSetting('advancedFilters', e.target.value)}
                  placeholder="trailer, official, teaser"
                  className="bg-[#374151] border-[#4B5563] text-white mt-1"
                />
                <p className="text-xs text-[#6B7280] mt-1">Keywords to look for in trailer titles before downloading (comma-separated)</p>
              </div>
            </div>
          </div>

          <Separator className="bg-[#374151]" />

          {/* Comment Reply Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-[#F45247]" />
              <h3 className="text-gray-900 dark:text-white">Comment Reply Automation</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Active</span>
                <Switch
                  checked={settings.commentRepliesActive}
                  onCheckedChange={(checked) => updateSetting('commentRepliesActive', checked)}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#374151] p-3 rounded-lg">
                  <p className="text-[#9CA3AF] text-xs">Processed</p>
                  <p className="text-white text-xl mt-1">{settings.totalCommentsProcessed}</p>
                </div>
                <div className="bg-[#374151] p-3 rounded-lg">
                  <p className="text-[#9CA3AF] text-xs">Replies Posted</p>
                  <p className="text-white text-xl mt-1">{settings.repliesPosted}</p>
                </div>
                <div className="bg-[#374151] p-3 rounded-lg">
                  <p className="text-[#9CA3AF] text-xs">Errors</p>
                  <p className="text-[#EF4444] text-xl mt-1">{settings.commentErrors}</p>
                </div>
              </div>

              <div>
                <Label className="text-[#9CA3AF]">Blacklist (usernames/keywords)</Label>
                <Textarea
                  value={settings.commentBlacklist}
                  onChange={(e) => updateSetting('commentBlacklist', e.target.value)}
                  placeholder="spam_user, badword, etc."
                  className="bg-[#374151] border-[#4B5563] text-white mt-1 min-h-[80px]"
                />
                <p className="text-xs text-[#6B7280] mt-1">One per line or comma-separated</p>
              </div>
            </div>
          </div>

          <Separator className="bg-[#374151]" />

          {/* RSS Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Rss className="w-5 h-5 text-[#F45247]" />
              <h3 className="text-gray-900 dark:text-white">RSS Posting</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Enable RSS Posting</span>
                <Switch
                  checked={settings.rssEnabled}
                  onCheckedChange={(checked) => updateSetting('rssEnabled', checked)}
                />
              </div>

              <div>
                <Label className="text-[#9CA3AF]">Image Count</Label>
                <Select
                  value={settings.rssImageCount}
                  onValueChange={(value) => updateSetting('rssImageCount', value)}
                >
                  <SelectTrigger className="bg-[#374151] border-[#4B5563] text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Image</SelectItem>
                    <SelectItem value="2">2 Images</SelectItem>
                    <SelectItem value="3">3 Images</SelectItem>
                    <SelectItem value="random">Random (1-2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#9CA3AF]">Auto-Post Platforms</Label>
                <div className="flex gap-2 mt-2">
                  {['x', 'threads', 'facebook'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => {
                        const current = settings.rssPlatforms;
                        updateSetting(
                          'rssPlatforms',
                          current.includes(platform)
                            ? current.filter(p => p !== platform)
                            : [...current, platform]
                        );
                      }}
                      className={`px-3 py-2 rounded-lg capitalize ${
                        settings.rssPlatforms.includes(platform)
                          ? 'bg-[#F45247] text-white'
                          : 'bg-[#374151] text-[#9CA3AF]'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-[#9CA3AF]">RSS Fetch Interval (minutes)</Label>
                <Select
                  value={settings.rssFetchInterval}
                  onValueChange={(value) => updateSetting('rssFetchInterval', value)}
                >
                  <SelectTrigger className="bg-[#374151] border-[#4B5563] text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="2">2 minutes</SelectItem>
                    <SelectItem value="3">3 minutes</SelectItem>
                    <SelectItem value="4">4 minutes</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#9CA3AF]">Posting Interval (minutes)</Label>
                <Select
                  value={settings.rssPostingInterval}
                  onValueChange={(value) => updateSetting('rssPostingInterval', value)}
                >
                  <SelectTrigger className="bg-[#374151] border-[#4B5563] text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="2">2 minutes</SelectItem>
                    <SelectItem value="3">3 minutes</SelectItem>
                    <SelectItem value="4">4 minutes</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Deduplication</span>
                <Switch
                  checked={settings.rssDeduplication}
                  onCheckedChange={(checked) => updateSetting('rssDeduplication', checked)}
                />
              </div>

              <div>
                <Label className="text-[#9CA3AF]">Log Level</Label>
                <Select
                  value={settings.rssLogLevel}
                  onValueChange={(value) => updateSetting('rssLogLevel', value)}
                >
                  <SelectTrigger className="bg-[#374151] border-[#4B5563] text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal (Errors only)</SelectItem>
                    <SelectItem value="standard">Standard (Success + Failures)</SelectItem>
                    <SelectItem value="full">Full (All entries + Status)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="bg-[#374151]" />

          {/* Error Handling */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-[#F45247]" />
              <h3 className="text-gray-900 dark:text-white">Error Handling</h3>
            </div>
            <div className="bg-[#374151] p-4 rounded-lg">
              <p className="text-[#9CA3AF] text-sm">
                Automatic error reporting is enabled. API failures and rate limits are logged and monitored.
              </p>
            </div>
          </div>

          <Separator className="bg-[#374151]" />

          {/* Cleanup */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="w-5 h-5 text-[#F45247]" />
              <h3 className="text-gray-900 dark:text-white">Cleanup</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Auto Cleanup</span>
                <Switch
                  checked={settings.cleanupEnabled}
                  onCheckedChange={(checked) => updateSetting('cleanupEnabled', checked)}
                />
              </div>

              <div>
                <Label className="text-[#9CA3AF]">Cleanup Interval</Label>
                <Select
                  value={settings.cleanupInterval}
                  onValueChange={(value) => updateSetting('cleanupInterval', value)}
                >
                  <SelectTrigger className="bg-[#374151] border-[#4B5563] text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#9CA3AF]">Storage Retention (hours)</Label>
                <Input
                  type="number"
                  value={settings.storageRetention}
                  onChange={(e) => updateSetting('storageRetention', e.target.value)}
                  className="bg-[#374151] border-[#4B5563] text-white mt-1"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-[#374151]" />

          {/* Appearance */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-[#F45247]" />
              <h3 className="text-gray-900 dark:text-white">Appearance</h3>
            </div>
            <div>
              <Label className="text-[#9CA3AF]">Theme</Label>
              <Select
                value={theme}
                onValueChange={(value: 'dark' | 'light') => {
                  updateSetting('darkMode', value === 'dark');
                  setTheme(value);
                }}
              >
                <SelectTrigger className="bg-gray-100 dark:bg-[#374151] border-gray-300 dark:border-[#4B5563] text-gray-900 dark:text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="light">Light Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="bg-[#374151]" />

          {/* Notifications */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-[#F45247]" />
              <h3 className="text-gray-900 dark:text-white">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Email Notifications</span>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#9CA3AF]">Push Notifications</span>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-[#374151]" />

          {/* Legal */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#F45247]" />
              <h3 className="text-gray-900 dark:text-white">Legal</h3>
            </div>
            <div className="space-y-2">
              <a href="https://screndly.com/privacy" target="_blank" rel="noopener noreferrer" className="block text-[#9CA3AF] hover:text-white">
                Privacy Policy
              </a>
              <a href="https://screndly.com/terms" target="_blank" rel="noopener noreferrer" className="block text-[#9CA3AF] hover:text-white">
                Terms of Service
              </a>
              <a href="https://screndly.com/disclaimer" target="_blank" rel="noopener noreferrer" className="block text-[#9CA3AF] hover:text-white">
                Disclaimer
              </a>
              <a href="https://screndly.com/cookie" target="_blank" rel="noopener noreferrer" className="block text-[#9CA3AF] hover:text-white">
                Cookie Policy
              </a>
            </div>
          </div>

          <Separator className="bg-[#374151]" />

          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-[#F45247]" />
              <h3 className="text-gray-900 dark:text-white">Company</h3>
            </div>
            <div className="space-y-2">
              <a href="https://screndly.com/contact" target="_blank" rel="noopener noreferrer" className="block text-[#9CA3AF] hover:text-white">
                Contact
              </a>
              <a href="https://screndly.com/about" target="_blank" rel="noopener noreferrer" className="block text-[#9CA3AF] hover:text-white">
                About Screndly
              </a>
            </div>
          </div>

          <Separator className="bg-[#374151]" />

          {/* Logout */}
          <div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full gap-2 text-[#EF4444] border-[#EF4444] hover:bg-[#EF4444] hover:text-white"
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