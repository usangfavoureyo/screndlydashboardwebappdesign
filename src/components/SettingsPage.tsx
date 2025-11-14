import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Key, Database, Save } from 'lucide-react';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    tmdbKey: '••••••••••••••••',
    youtubeKey: '••••••••••••••••',
    openaiKey: '••••••••••••••••',
    s3Bucket: 'trailerflux-media',
    redisUrl: 'redis://localhost:6379',
    databaseUrl: 'postgresql://localhost/trailerflux',
    cleanupSchedule: 'weekly',
  });

  const handleSave = () => {
    // Save settings logic here
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-[#111827] dark:text-white mb-2">Settings</h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF]">Configure API keys and automation settings.</p>
      </div>

      {/* API Keys Section */}
      <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Key className="w-5 h-5 text-[#F45247]" />
          <h2 className="text-[#111827] dark:text-white">API Keys</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tmdb-key">TMDb API Key</Label>
            <Input
              id="tmdb-key"
              type="password"
              value={settings.tmdbKey}
              onChange={(e) => setSettings({ ...settings, tmdbKey: e.target.value })}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube-key">YouTube API Key</Label>
            <Input
              id="youtube-key"
              type="password"
              value={settings.youtubeKey}
              onChange={(e) => setSettings({ ...settings, youtubeKey: e.target.value })}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type="password"
              value={settings.openaiKey}
              onChange={(e) => setSettings({ ...settings, openaiKey: e.target.value })}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Database & Storage Section */}
      <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Database className="w-5 h-5 text-[#F45247]" />
          <h2 className="text-[#111827] dark:text-white">Database & Storage</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="s3-bucket">S3 Bucket Name</Label>
            <Input
              id="s3-bucket"
              value={settings.s3Bucket}
              onChange={(e) => setSettings({ ...settings, s3Bucket: e.target.value })}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="redis-url">Redis URL</Label>
            <Input
              id="redis-url"
              value={settings.redisUrl}
              onChange={(e) => setSettings({ ...settings, redisUrl: e.target.value })}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="database-url">Database URL</Label>
            <Input
              id="database-url"
              value={settings.databaseUrl}
              onChange={(e) => setSettings({ ...settings, databaseUrl: e.target.value })}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Cleanup Schedule */}
      <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm p-6">
        <h2 className="text-[#111827] dark:text-white mb-6">Data Cleanup</h2>
        <div className="space-y-2">
          <Label htmlFor="cleanup-schedule">Cleanup Schedule</Label>
          <Select
            value={settings.cleanupSchedule}
            onValueChange={(value) => setSettings({ ...settings, cleanupSchedule: value })}
          >
            <SelectTrigger id="cleanup-schedule" className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">
            Automatically remove old processed videos and logs
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="rounded-xl gap-2"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}