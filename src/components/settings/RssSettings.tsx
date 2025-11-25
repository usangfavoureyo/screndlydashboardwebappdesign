import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { toast } from 'sonner';
import { haptics } from '../../utils/haptics';

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
        <h2 className="text-gray-900 dark:text-white text-xl">RSS Feeds</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Caption Generation Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white mb-1">Caption Generation (Social Media)</h3>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
              AI-powered caption generation from RSS article content for social media publishing
            </p>
          </div>

          {/* Caption AI Model */}
          <div>
            <Label htmlFor="rss-caption-model" className="text-[#9CA3AF]">Caption AI Model</Label>
            <Select
              value={settings.rssCaptionModel || 'gpt-4o'}
              onValueChange={(value) => {
                haptics.light();
                updateSetting('rssCaptionModel', value);
                toast.success(`Caption AI Model changed to ${value}`);
              }}
            >
              <SelectTrigger id="rss-caption-model" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              GPT-4o balances creativity and cost for engaging social media captions
            </p>
          </div>

          {/* Caption Creativity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-[#9CA3AF]">Caption Creativity (Temperature)</Label>
              <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">
                {settings.rssCaptionTemperature || 0.7} - Balanced
              </span>
            </div>
            <Slider
              value={[settings.rssCaptionTemperature || 0.7]}
              onValueChange={(value) => {
                haptics.light();
                updateSetting('rssCaptionTemperature', value[0]);
              }}
              min={0}
              max={1}
              step={0.1}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-2">
              Recommended: 0.7 — Balanced creativity for engaging yet relevant captions
            </p>
          </div>

          {/* Caption Tone */}
          <div>
            <Label htmlFor="rss-caption-tone" className="text-[#9CA3AF]">Caption Tone</Label>
            <Select
              value={settings.rssCaptionTone || 'Engaging'}
              onValueChange={(value) => {
                haptics.light();
                updateSetting('rssCaptionTone', value);
              }}
            >
              <SelectTrigger id="rss-caption-tone" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engaging">Engaging (Recommended)</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Informative">Informative</SelectItem>
                <SelectItem value="Exciting">Exciting</SelectItem>
                <SelectItem value="Mysterious">Mysterious</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              Sets the overall tone and style for generated captions
            </p>
          </div>

          {/* Max Caption Length */}
          <div>
            <Label htmlFor="rss-caption-length" className="text-[#9CA3AF]">Max Caption Length (Characters)</Label>
            <Input
              id="rss-caption-length"
              type="number"
              value={settings.rssCaptionMaxLength || 280}
              onChange={(e) => {
                haptics.light();
                updateSetting('rssCaptionMaxLength', parseInt(e.target.value));
              }}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              280 for X/Twitter compatibility, 2200 for Instagram, 63,206 for Facebook
            </p>
          </div>

          {/* Caption Generation Prompt */}
          <div>
            <Label htmlFor="rss-caption-prompt" className="text-[#9CA3AF]">Caption Generation Prompt</Label>
            <textarea
              id="rss-caption-prompt"
              value={settings.rssCaptionPrompt || `You are a social media caption writer for Screen Render, a movie and TV trailer news platform. Create engaging, platform-optimized captions for RSS article content.

INPUT: RSS article title, description, and content
OUTPUT: Engaging social media caption with emojis, hashtags, and hook

Guidelines:
- Hook in first line (7-10 words max)
- Include 3 relevant emoji and hashtags
- Add 2-3 strategically placed emojis
- Keep total under {maxLength} characters for platform compatibility
- Match the tone of the article content
- No generic "Check this out" openers
- Focus on the key news or reveal from the article
- Make it shareable and clickable`}
              onChange={(e) => {
                haptics.light();
                updateSetting('rssCaptionPrompt', e.target.value);
              }}
              rows={16}
              className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono mt-1 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              Instructions for generating captions from RSS article content
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-[#333333]"></div>

        {/* Existing Settings */}
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