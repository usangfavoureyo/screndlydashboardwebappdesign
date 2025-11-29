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
  // Caption generation settings
  tmdbCaptionModel: 'gpt-4o',
  tmdbCaptionTemperature: 0.7,
  tmdbCaptionTone: 'Engaging',
  tmdbCaptionMaxLength: 280,
  tmdbCaptionPrompt: `You are a social media caption writer for Screen Render, a movie and TV trailer platform. Create engaging, platform-optimized captions for movie/TV show anniversary posts.

INPUT: Movie/TV show title, release date, anniversary year, cast, and synopsis
OUTPUT: Engaging social media caption with emojis, hashtags, and hook

Guidelines:
- Hook in first line celebrating the anniversary (7-10 words max)
- Include relevant emoji and hashtags (#MovieAnniversary, #ClassicFilm, etc.)
- Add 2-3 strategically placed emojis (🎬 🎥 🍿)
- Keep total under {maxLength} characters for platform compatibility
- Match nostalgic and celebratory tone
- No generic "Happy Anniversary" openers
- Highlight iconic moments or cultural impact
- Make it shareable and engaging`,
};

export function TMDbSettings({ onSave }: TMDbSettingsProps) {
  const [tmdbSettings, setTMDbSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

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
      {/* OpenAI Model Selection */}
      <div>
        <Label htmlFor="openai-model" className="text-[#9CA3AF]">OpenAI Model</Label>
        <Select
          value={tmdbSettings.openaiModel}
          onValueChange={(value) => updateSetting('openaiModel', value)}
        >
          <SelectTrigger id="openai-model" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
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
                    : 'bg-gray-200 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
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
              onChange={(e) => updateSetting('maxPerAnniversary', e.target.value)}
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
            onChange={(e) => updateSetting('captionMaxLength', e.target.value)}
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
                  : 'bg-gray-100 dark:bg-[#0A0A0A] text-gray-600 dark:text-[#9CA3AF]'
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
                  : 'bg-gray-100 dark:bg-[#0A0A0A] text-gray-600 dark:text-[#9CA3AF]'
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
                  : 'bg-gray-100 dark:bg-[#0A0A0A] text-gray-600 dark:text-[#9CA3AF]'
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
          <span className="text-[#9CA3AF]">Rehost Images to S3</span>
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
            onChange={(e) => updateSetting('dedupeWindow', e.target.value)}
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
            onChange={(e) => updateSetting('discoveryCacheTTL', e.target.value)}
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
            onChange={(e) => updateSetting('creditsCacheTTL', e.target.value)}
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
            onChange={(e) => updateSetting('captionCacheTTL', e.target.value)}
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
                          : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-400 dark:text-[#6B7280]'
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
                          : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-400 dark:text-[#6B7280]'
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
                          : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-400 dark:text-[#6B7280]'
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
                          : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-400 dark:text-[#6B7280]'
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