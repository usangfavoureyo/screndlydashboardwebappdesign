import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface RssSettingsProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
  onBack: () => void;
}

export function RssSettings({ settings, updateSetting, onBack }: RssSettingsProps) {
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
        <h2 className="text-gray-900 dark:text-white text-xl">RSS Posting</h2>
      </div>

      <div className="p-6 space-y-4">
        {/* OpenAI Model Selection */}
        <div>
          <Label htmlFor="rss-openai-model" className="text-[#9CA3AF]">OpenAI Model</Label>
          <Select
            value={settings.rssOpenaiModel || 'gpt-4o-mini'}
            onValueChange={(value) => {
              updateSetting('rssOpenaiModel', value);
              toast.success(`AI Model changed to ${value}`);
            }}
          >
            <SelectTrigger id="rss-openai-model" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-5-nano">GPT-5 Nano (Latest)</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini (Cheapest)</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[#9CA3AF]">Log Level</Label>
          <Select
            value={settings.rssLogLevel}
            onValueChange={(value) => updateSetting('rssLogLevel', value)}
          >
            <SelectTrigger className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
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
  );
}