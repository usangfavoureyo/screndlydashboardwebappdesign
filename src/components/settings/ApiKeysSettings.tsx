import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ApiKeysSettingsProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
  onBack: () => void;
}

export function ApiKeysSettings({ settings, updateSetting, onBack }: ApiKeysSettingsProps) {
  return (
    <div className="fixed top-0 right-0 bottom-0 w-full lg:w-[600px] bg-white dark:bg-[#000000] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333] p-4 flex items-center gap-3">
        <button 
          className="text-gray-900 dark:text-white p-1" 
          onClick={onBack}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12H2M9 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="text-gray-900 dark:text-white text-xl">API Keys</h2>
      </div>

      <div className="p-6 space-y-3">
        <div>
          <Label className="text-gray-600 dark:text-[#9CA3AF]">OpenAI API Key</Label>
          <Input
            type="password"
            value={settings.openaiKey}
            onChange={(e) => updateSetting('openaiKey', e.target.value)}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-[#9CA3AF]">Serper API Key</Label>
          <Input
            type="password"
            value={settings.serperKey}
            onChange={(e) => updateSetting('serperKey', e.target.value)}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-[#9CA3AF]">TMDb API Key</Label>
          <Input
            type="password"
            value={settings.tmdbKey}
            onChange={(e) => updateSetting('tmdbKey', e.target.value)}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-[#9CA3AF]">AWS S3 Credentials</Label>
          <Input
            type="password"
            value={settings.s3Key}
            onChange={(e) => updateSetting('s3Key', e.target.value)}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-[#9CA3AF]">Redis URL</Label>
          <Input
            value={settings.redisUrl}
            onChange={(e) => updateSetting('redisUrl', e.target.value)}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
        </div>
        <div>
          <Label className="text-gray-600 dark:text-[#9CA3AF]">Database URL</Label>
          <Input
            value={settings.databaseUrl}
            onChange={(e) => updateSetting('databaseUrl', e.target.value)}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
        </div>
      </div>
    </div>
  );
}