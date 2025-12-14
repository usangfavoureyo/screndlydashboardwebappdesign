import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FacebookIcon } from '../icons/FacebookIcon';
import { ThreadsIcon } from '../icons/ThreadsIcon';
import { XIcon } from '../icons/XIcon';
import { haptics } from '../../utils/haptics';
import { toast } from 'sonner@2.0.3';

interface TMDbSettingsProps {
  onSave?: () => void;
}

// Default settings
const defaultSettings = {
  openaiModel: 'gpt-3.5-turbo',
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
  // Auto-post settings
  todayAutoPost: false,
  weeklyAutoPost: false,
  monthlyAutoPost: false,
  anniversaryAutoPost: false,
  // Platform settings (only X, Threads, Facebook)
  todayPlatforms: { x: true, threads: true, facebook: false },
  weeklyPlatforms: { x: true, threads: true, facebook: false },
  monthlyPlatforms: { x: true, threads: true, facebook: false },
  anniversaryPlatforms: { x: true, threads: false, facebook: false },
  // Caption generation settings - Universal Model
  tmdbCaptionModel: 'gpt-4o',
  // Individual prompts for each feed type
  todayPrompt: `You are a concise caption generator for short social posts. Output must be under 100 characters and use at most 50 tokens. Insert the title as a hashtag somewhere in the sentence. Occasionally include top 1–2 cast names and/or the release date. Tone: punchy, newsy, minimal. No extra hashtags. No CTAs. No quotes. No markdown. End with a period.

User prompt template:
Title: {title}
Type: {movie|tv}
ReleaseDate: {YYYY-MM-DD}
CastTop2: {Actor One, Actor Two}
Context: today_release
Constraints: Max 100 characters. Use title as hashtag #Title inside the sentence. Keep short.

Examples:
1) #InsideOut2 releases today.
2) #TheLastOfUs S2 premieres today.
3) Keanu Reeves stars in #JohnWick4 releasing today.

Instruction: Produce a single-line caption following the constraints.`,
  weeklyPrompt: `You are a concise caption generator for short social posts. Output must be under 100 characters and use at most 50 tokens. Insert the title as a hashtag somewhere in the sentence. Occasionally include top 1–2 cast names and/or the release date. Tone: punchy, newsy, minimal. No extra hashtags. No CTAs. No quotes. No markdown. End with a period.

User prompt template:
Title: {title}
Type: {movie|tv}
ReleaseDate: {YYYY-MM-DD}
CastTop2: {Actor One, Actor Two}
Context: week_release
Constraints: Max 100 characters. Use title as hashtag #Title inside the sentence. Keep short.

Examples:
1) #InsideOut2 releases next week.
2) #TheLastOfUs S2 premieres this week on HBO.
3) Keanu Reeves and Laurence Fishburne return in #TheMatrix next week.

Instruction: Produce a single-line caption following the constraints.`,
  monthlyPrompt: `You are a concise caption generator for short social posts. Output must be under 100 characters and use at most 50 tokens. Insert the title as a hashtag somewhere in the sentence. Occasionally include top 1–2 cast names and/or the release date. Tone: punchy, newsy, minimal. No extra hashtags. No CTAs. No quotes. No markdown. End with a period.

User prompt template:
Title: {title}
Type: {movie|tv}
ReleaseDate: {YYYY-MM-DD}
CastTop2: {Actor One, Actor Two}
Context: month_notice
Constraints: Max 100 characters. Use title as hashtag #Title inside the sentence. Keep short.

Examples:
1) #InsideOut2 releases next month.
2) #TheLastOfUs S2 coming next month to HBO.
3) Keanu Reeves stars in #JohnWick5 next month.

Instruction: Produce a single-line caption following the constraints.`,
  anniversaryPrompt: `You are a concise caption generator for short social posts. Output must be under 100 characters and use at most 50 tokens. Insert the title as a hashtag somewhere in the sentence. Occasionally include top 1–2 cast names and/or the release date. Tone: punchy, newsy, minimal. No extra hashtags. No CTAs. No quotes. No markdown. End with a period.

User prompt template:
Title: {title}
Type: {movie|tv}
ReleaseDate: {YYYY-MM-DD}
CastTop2: {Actor One, Actor Two}
Context: anniversary_N_years
Constraints: Max 100 characters. Use title as hashtag #Title inside the sentence. Keep short.

Examples:
1) #InsideOut released 10 years ago today.
2) #TheLastOfUs S1 premiered two years ago today.
3) Keanu Reeves and Laurence Fishburne created an unforgettable moment in the #Matrix 25 years ago today.

Instruction: Produce a single-line caption following the constraints.`,
};

export function TMDbSettings({ onSave }: TMDbSettingsProps) {
  const [tmdbSettings, setTMDbSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedPrompts, setExpandedPrompts] = useState({
    today: false,
    weekly: false,
    monthly: false,
    anniversary: false
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('screndly_tmdb_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setTMDbSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading TMDb settings:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('screndly_tmdb_settings', JSON.stringify(tmdbSettings));
    }
  }, [tmdbSettings, isLoaded]);

  const platformIcons: Record<string, React.ComponentType<any>> = {
    x: XIcon,
    threads: ThreadsIcon,
    facebook: FacebookIcon,
  };

  const platformLabels: Record<string, string> = {
    x: 'X',
    threads: 'Threads',
    facebook: 'Facebook',
  };

  const updateSetting = (key: string, value: any) => {
    setTMDbSettings(prev => ({ ...prev, [key]: value }));
    
    // Show toast notifications for important settings
    if (key === 'todayAutoPost') {
      toast.success(value ? "Today's Releases auto-post enabled" : "Today's Releases auto-post disabled");
    } else if (key === 'weeklyAutoPost') {
      toast.success(value ? 'Weekly Releases auto-post enabled' : 'Weekly Releases auto-post disabled');
    } else if (key === 'monthlyAutoPost') {
      toast.success(value ? 'Monthly Previews auto-post enabled' : 'Monthly Previews auto-post disabled');
    } else if (key === 'anniversaryAutoPost') {
      toast.success(value ? 'Anniversaries auto-post enabled' : 'Anniversaries auto-post disabled');
    } else if (key === 'enableToday') {
      toast.success(value ? "Today's Releases feed enabled" : "Today's Releases feed disabled");
    } else if (key === 'enableWeekly') {
      toast.success(value ? 'Weekly Releases feed enabled' : 'Weekly Releases feed disabled');
    } else if (key === 'enableMonthly') {
      toast.success(value ? 'Monthly Previews feed enabled' : 'Monthly Previews feed disabled');
    } else if (key === 'enableAnniversaries') {
      toast.success(value ? 'Anniversaries feed enabled' : 'Anniversaries feed disabled');
    } else if (key === 'openaiModel') {
      const modelNames: Record<string, string> = {
        'gpt-5-nano': 'GPT-5 Nano (Latest)',
        'gpt-4o-mini': 'GPT-4o Mini (Cheapest)',
        'gpt-4o': 'GPT-4o',
        'gpt-3.5-turbo': 'GPT-3.5 Turbo',
        'gpt-4-turbo': 'GPT-4 Turbo'
      };
      toast.success(`AI Model changed to ${modelNames[value] || value}`);
    } else if (key === 'timezone') {
      toast.success(`Timezone changed to ${value}`);
    } else if (key === 'preferredImage') {
      toast.success(`Image preference changed to ${value === 'poster' ? 'Poster (Vertical)' : 'Backdrop (Horizontal)'}`);
    } else if (key === 'todayPlatforms' || key === 'weeklyPlatforms' || key === 'monthlyPlatforms' || key === 'anniversaryPlatforms') {
      const platformType = key.replace('Platforms', '');
      const enabledPlatforms = Object.entries(value).filter(([_, enabled]) => enabled).map(([platform]) => platformLabels[platform]);
      if (enabledPlatforms.length > 0) {
        toast.success(`Platforms updated: ${enabledPlatforms.join(', ')}`);
      } else {
        toast.warning('No platforms selected for auto-posting');
      }
    }
    
    if (onSave) {
      setTimeout(onSave, 100);
    }
  };

  const toggleAnniversaryYear = (year: string) => {
    const years = tmdbSettings.anniversaryYears;
    const newYears = years.includes(year)
      ? years.filter(y => y !== year)
      : [...years, year].sort((a, b) => parseInt(a) - parseInt(b));
    updateSetting('anniversaryYears', newYears);
  };

  return (
    <div className="space-y-6">
      {/* Caption Generation Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-gray-900 dark:text-white mb-1">Caption Generation</h3>
          <p className="text-sm text-[#9CA3AF]">
            AI-powered caption generation for TMDb feed posts
          </p>
        </div>

        {/* Universal OpenAI Model Selection */}
        <div>
          <Label htmlFor="tmdb-caption-model" className="text-[#6B7280] dark:text-[#9CA3AF]">Caption AI Model</Label>
          <Select
            value={tmdbSettings.tmdbCaptionModel}
            onValueChange={(value) => {
              haptics.light();
              updateSetting('tmdbCaptionModel', value);
              toast.success(`Caption AI Model changed to ${value}`);
            }}
          >
            <SelectTrigger id="tmdb-caption-model" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-5-nano">GPT-5 Nano (Latest)</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini (Cheapest)</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Today's Releases Prompt */}
        <div className="border border-gray-200 dark:border-[#333333] rounded-lg">
          <button
            onClick={() => {
              haptics.light();
              setExpandedPrompts(prev => ({ ...prev, today: !prev.today }));
            }}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#0A0A0A] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-white">Today's Releases Prompt</span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedPrompts.today ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedPrompts.today && (
            <div className="p-4 pt-0">
              <textarea
                value={tmdbSettings.todayPrompt}
                onFocus={() => haptics.light()}
                onChange={(e) => {
                  haptics.light();
                  updateSetting('todayPrompt', e.target.value);
                }}
                rows={18}
                className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-white mt-2">
                Context: today_release — For movies/TV shows releasing today
              </p>
            </div>
          )}
        </div>

        {/* Weekly Releases Prompt */}
        <div className="border border-gray-200 dark:border-[#333333] rounded-lg">
          <button
            onClick={() => {
              haptics.light();
              setExpandedPrompts(prev => ({ ...prev, weekly: !prev.weekly }));
            }}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#0A0A0A] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-white">Weekly Releases Prompt</span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedPrompts.weekly ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedPrompts.weekly && (
            <div className="p-4 pt-0">
              <textarea
                value={tmdbSettings.weeklyPrompt}
                onFocus={() => haptics.light()}
                onChange={(e) => {
                  haptics.light();
                  updateSetting('weeklyPrompt', e.target.value);
                }}
                rows={18}
                className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-white mt-2">
                Context: week_release — For movies/TV shows releasing next week
              </p>
            </div>
          )}
        </div>

        {/* Monthly Previews Prompt */}
        <div className="border border-gray-200 dark:border-[#333333] rounded-lg">
          <button
            onClick={() => {
              haptics.light();
              setExpandedPrompts(prev => ({ ...prev, monthly: !prev.monthly }));
            }}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#0A0A0A] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-white">Monthly Previews Prompt</span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedPrompts.monthly ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedPrompts.monthly && (
            <div className="p-4 pt-0">
              <textarea
                value={tmdbSettings.monthlyPrompt}
                onFocus={() => haptics.light()}
                onChange={(e) => {
                  haptics.light();
                  updateSetting('monthlyPrompt', e.target.value);
                }}
                rows={18}
                className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-white mt-2">
                Context: month_notice — For movies/TV shows releasing next month
              </p>
            </div>
          )}
        </div>

        {/* Anniversaries Prompt */}
        <div className="border border-gray-200 dark:border-[#333333] rounded-lg">
          <button
            onClick={() => {
              haptics.light();
              setExpandedPrompts(prev => ({ ...prev, anniversary: !prev.anniversary }));
            }}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#0A0A0A] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-white">Anniversaries Prompt</span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedPrompts.anniversary ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedPrompts.anniversary && (
            <div className="p-4 pt-0">
              <textarea
                value={tmdbSettings.anniversaryPrompt}
                onFocus={() => haptics.light()}
                onChange={(e) => {
                  haptics.light();
                  updateSetting('anniversaryPrompt', e.target.value);
                }}
                rows={18}
                className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-white mt-2">
                Context: anniversary_N_years — For movies/TV shows celebrating anniversaries
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-[#333333]"></div>

      {/* Activity Retention Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-gray-900 dark:text-white mb-1">Activity Retention</h3>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Automatically remove published and failed TMDb activity items after a specified time period
          </p>
        </div>

        <div>
          <Label htmlFor="tmdb-activity-retention" className="text-[#6B7280] dark:text-[#9CA3AF]">Activity Retention (hours)</Label>
          <Input
            id="tmdb-activity-retention"
            type="number"
            value={tmdbSettings.tmdbActivityRetention || 24}
            onFocus={() => haptics.light()}
            onChange={(e) => {
              haptics.light();
              updateSetting('tmdbActivityRetention', parseInt(e.target.value));
            }}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
            Published and failed TMDb activity items will be automatically removed after this time period. Scheduled items are kept. (Default: 24 hours)
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-[#333333]"></div>

      {/* Feed Types */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#9CA3AF]">Today's Releases</span>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              Top 5 movies + Top 5 TV shows releasing today
            </p>
          </div>
          <Switch
            checked={tmdbSettings.enableToday}
            onCheckedChange={(checked) => updateSetting('enableToday', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#9CA3AF]">Weekly Releases</span>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              Top 5 movies + Top 5 TV shows releasing next week
            </p>
          </div>
          <Switch
            checked={tmdbSettings.enableWeekly}
            onCheckedChange={(checked) => updateSetting('enableWeekly', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#9CA3AF]">Monthly Previews</span>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              Top 5 movies + Top 5 TV shows for next month
            </p>
          </div>
          <Switch
            checked={tmdbSettings.enableMonthly}
            onCheckedChange={(checked) => updateSetting('enableMonthly', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[#9CA3AF]">Anniversaries</span>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              Daily anniversary posts (1, 2, 3, 5, 10, 15, 20, 25 years)
            </p>
          </div>
          <Switch
            checked={tmdbSettings.enableAnniversaries}
            onCheckedChange={(checked) => updateSetting('enableAnniversaries', checked)}
          />
        </div>
      </div>

      {/* Anniversary Years Selection */}
      {tmdbSettings.enableAnniversaries && (
        <div>
          <Label className="text-[#9CA3AF] mb-2 block">Track Anniversary Years</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {['1', '2', '3', '5', '10', '15', '20', '25'].map(year => (
              <button
                key={year}
                onClick={() => {
                  haptics.light();
                  toggleAnniversaryYear(year);
                }}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  tmdbSettings.anniversaryYears.includes(year)
                    ? 'bg-[#ec1e24] text-white'
                    : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'
                }`}
              >
                {year}y
              </button>
            ))}
          </div>
          <div>
            <Label htmlFor="max-per-anniversary" className="text-[#9CA3AF]">Max items per anniversary</Label>
            <Input
              id="max-per-anniversary"
              type="number"
              min="1"
              max="5"
              value={tmdbSettings.maxPerAnniversary}
              onFocus={() => haptics.light()}
              onChange={(e) => {
                haptics.light();
                updateSetting('maxPerAnniversary', e.target.value);
              }}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
            />
          </div>
        </div>
      )}

      {/* Caption Settings */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="caption-max-length" className="text-[#9CA3AF]">Max Caption Length</Label>
          <Input
            id="caption-max-length"
            type="number"
            min="50"
            max="200"
            value={tmdbSettings.captionMaxLength}
            onFocus={() => haptics.light()}
            onChange={(e) => {
              haptics.light();
              updateSetting('captionMaxLength', e.target.value);
            }}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
            Characters (recommended: 100)
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#9CA3AF]">Include Cast Names</span>
          <Switch
            checked={tmdbSettings.includeCast}
            onCheckedChange={(checked) => updateSetting('includeCast', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#9CA3AF]">Include Release Date</span>
          <Switch
            checked={tmdbSettings.includeDate}
            onCheckedChange={(checked) => updateSetting('includeDate', checked)}
          />
        </div>
      </div>

      {/* Image Preferences */}
      <div className="space-y-3">
        <div>
          <Label className="text-[#9CA3AF]">Preferred Image Type</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <button
              onClick={() => {
                haptics.light();
                updateSetting('preferredImage', 'poster');
              }}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                tmdbSettings.preferredImage === 'poster'
                  ? 'bg-[#ec1e24] text-white'
                  : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'
              }`}
            >
              Poster (Vertical)
            </button>
            <button
              onClick={() => {
                haptics.light();
                updateSetting('preferredImage', 'backdrop');
              }}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                tmdbSettings.preferredImage === 'backdrop'
                  ? 'bg-[#ec1e24] text-white'
                  : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'
              }`}
            >
              Backdrop (Horizontal)
            </button>
            <button
              onClick={() => {
                haptics.light();
                updateSetting('preferredImage', 'random');
              }}
              className={`px-4 py-2 rounded-lg transition-all text-sm ${
                tmdbSettings.preferredImage === 'random'
                  ? 'bg-[#ec1e24] text-white'
                  : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'
              }`}
            >
              Random
            </button>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
            Random will automatically choose between poster and backdrop for each post
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#9CA3AF]">Rehost Image to storage</span>
          <Switch
            checked={tmdbSettings.rehostImages}
            onCheckedChange={(checked) => updateSetting('rehostImages', checked)}
          />
        </div>
      </div>

      {/* Deduplication & Caching */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="dedupe-window" className="text-[#9CA3AF]">Deduplication Window (days)</Label>
          <Input
            id="dedupe-window"
            type="number"
            min="1"
            max="90"
            value={tmdbSettings.dedupeWindow}
            onFocus={() => haptics.light()}
            onChange={(e) => {
              haptics.light();
              updateSetting('dedupeWindow', e.target.value);
            }}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
            Prevent same title from posting within this window
          </p>
        </div>

        <div>
          <Label htmlFor="discovery-cache" className="text-[#9CA3AF]">Discovery Cache TTL (hours)</Label>
          <Input
            id="discovery-cache"
            type="number"
            min="1"
            max="48"
            value={tmdbSettings.discoveryCacheTTL}
            onFocus={() => haptics.light()}
            onChange={(e) => {
              haptics.light();
              updateSetting('discoveryCacheTTL', e.target.value);
            }}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
        </div>

        <div>
          <Label htmlFor="credits-cache" className="text-[#9CA3AF]">Credits Cache TTL (days)</Label>
          <Input
            id="credits-cache"
            type="number"
            min="1"
            max="90"
            value={tmdbSettings.creditsCacheTTL}
            onFocus={() => haptics.light()}
            onChange={(e) => {
              haptics.light();
              updateSetting('creditsCacheTTL', e.target.value);
            }}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
        </div>

        <div>
          <Label htmlFor="caption-cache" className="text-[#9CA3AF]">Caption Cache TTL (days)</Label>
          <Input
            id="caption-cache"
            type="number"
            min="1"
            max="90"
            value={tmdbSettings.captionCacheTTL}
            onFocus={() => haptics.light()}
            onChange={(e) => {
              haptics.light();
              updateSetting('captionCacheTTL', e.target.value);
            }}
            className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
          />
        </div>
      </div>

      {/* Auto-Post & Platform Configuration */}
      <div className="space-y-4">
        {/* Today's Releases */}
        {tmdbSettings.enableToday && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9CA3AF]">Today's Releases Auto-Post</span>
              <Switch
                checked={tmdbSettings.todayAutoPost}
                onCheckedChange={(checked) => updateSetting('todayAutoPost', checked)}
              />
            </div>
            <div>
              <Label className="text-xs mb-2 block text-[#6B7280] dark:text-[#9CA3AF]">PLATFORMS</Label>
              <div className="flex items-center gap-3 flex-wrap">
                {Object.entries(tmdbSettings.todayPlatforms).map(([platform, enabled]) => {
                  const Icon = platformIcons[platform];
                  return Icon ? (
                    <button
                      key={platform}
                      onClick={() => {
                        haptics.light();
                        updateSetting('todayPlatforms', {
                          ...tmdbSettings.todayPlatforms,
                          [platform]: !enabled
                        });
                      }}
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
                        enabled 
                          ? 'bg-[#ec1e24] text-white' 
                          : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'
                      }`}
                      title={platformLabels[platform]}
                    >
                      <Icon className={platform === 'x' ? 'w-4 h-4' : platform === 'facebook' ? 'w-6 h-6' : 'w-5 h-5'} />
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* Weekly Releases */}
        {tmdbSettings.enableWeekly && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9CA3AF]">Weekly Releases Auto-Post</span>
              <Switch
                checked={tmdbSettings.weeklyAutoPost}
                onCheckedChange={(checked) => updateSetting('weeklyAutoPost', checked)}
              />
            </div>
            <div>
              <Label className="text-xs mb-2 block text-[#6B7280] dark:text-[#9CA3AF]">PLATFORMS</Label>
              <div className="flex items-center gap-3 flex-wrap">
                {Object.entries(tmdbSettings.weeklyPlatforms).map(([platform, enabled]) => {
                  const Icon = platformIcons[platform];
                  return Icon ? (
                    <button
                      key={platform}
                      onClick={() => {
                        haptics.light();
                        updateSetting('weeklyPlatforms', {
                          ...tmdbSettings.weeklyPlatforms,
                          [platform]: !enabled
                        });
                      }}
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
                        enabled 
                          ? 'bg-[#ec1e24] text-white' 
                          : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'
                      }`}
                      title={platformLabels[platform]}
                    >
                      <Icon className={platform === 'x' ? 'w-4 h-4' : platform === 'facebook' ? 'w-6 h-6' : 'w-5 h-5'} />
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* Monthly Previews */}
        {tmdbSettings.enableMonthly && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9CA3AF]">Monthly Previews Auto-Post</span>
              <Switch
                checked={tmdbSettings.monthlyAutoPost}
                onCheckedChange={(checked) => updateSetting('monthlyAutoPost', checked)}
              />
            </div>
            <div>
              <Label className="text-xs mb-2 block text-[#6B7280] dark:text-[#9CA3AF]">PLATFORMS</Label>
              <div className="flex items-center gap-3 flex-wrap">
                {Object.entries(tmdbSettings.monthlyPlatforms).map(([platform, enabled]) => {
                  const Icon = platformIcons[platform];
                  return Icon ? (
                    <button
                      key={platform}
                      onClick={() => {
                        haptics.light();
                        updateSetting('monthlyPlatforms', {
                          ...tmdbSettings.monthlyPlatforms,
                          [platform]: !enabled
                        });
                      }}
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
                        enabled 
                          ? 'bg-[#ec1e24] text-white' 
                          : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'
                      }`}
                      title={platformLabels[platform]}
                    >
                      <Icon className={platform === 'x' ? 'w-4 h-4' : platform === 'facebook' ? 'w-6 h-6' : 'w-5 h-5'} />
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* Anniversaries */}
        {tmdbSettings.enableAnniversaries && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9CA3AF]">Anniversaries Auto-Post</span>
              <Switch
                checked={tmdbSettings.anniversaryAutoPost}
                onCheckedChange={(checked) => updateSetting('anniversaryAutoPost', checked)}
              />
            </div>
            <div>
              <Label className="text-xs mb-2 block text-[#6B7280] dark:text-[#9CA3AF]">PLATFORMS</Label>
              <div className="flex items-center gap-3 flex-wrap">
                {Object.entries(tmdbSettings.anniversaryPlatforms).map(([platform, enabled]) => {
                  const Icon = platformIcons[platform];
                  return Icon ? (
                    <button
                      key={platform}
                      onClick={() => {
                        haptics.light();
                        updateSetting('anniversaryPlatforms', {
                          ...tmdbSettings.anniversaryPlatforms,
                          [platform]: !enabled
                        });
                      }}
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
                        enabled 
                          ? 'bg-[#ec1e24] text-white' 
                          : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'
                      }`}
                      title={platformLabels[platform]}
                    >
                      <Icon className={platform === 'x' ? 'w-4 h-4' : platform === 'facebook' ? 'w-6 h-6' : 'w-5 h-5'} />
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}