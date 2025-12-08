import { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { haptics } from '../../utils/haptics';
import { toast } from 'sonner@2.0.3';
import { useSettings } from '../../contexts/SettingsContext';

interface VideoStudioSettingsProps {
  onSave?: () => void;
  onBack: () => void;
}

// Default prompt system settings
const defaultSettings = {
  // Video Generation Model Selection
  openaiModel: 'gpt-4o',
  
  // Video Generation Operational Settings
  temperature: 0,
  topP: 0.95,
  maxTokens: 4096,
  
  // Video Generation System Prompt
  systemPrompt: `You are an editor-prompt generator. Input: validated job JSON (segments, timestamps, audio_rules, caption_template, aspect). Output: (1) a Shotstack natural-language prompt that contains exact timestamps, audio ducking rules, caption template reference, and aspect directives; (2) a JSON validation summary with keys: segments_count, missing_fields, warnings. Strictly produce the Shotstack prompt in the field "shotstack_prompt_text" and do not add extra commentary. Follow the structured output schema exactly.`,
  
  // Response Settings
  useStructuredOutput: true,
  validateTimestamps: true,
  autoRetryOnMismatch: true,
  previewBeforeRender: true,
  
  // Caption Generation Settings
  captionOpenaiModel: 'gpt-4o',
  captionTemperature: 0.7,
  captionMaxTokens: 500,
  
  // Section-Specific Caption Prompts
  captionReviewPrompt: `You are a social media caption writer for Screen Render, a movie and TV trailer platform. Generate captions specifically for review-driven content about movies or TV shows.

INPUT: Voiceover transcript from a review video
OUTPUT: Review-focused caption (120-250 characters)

Guidelines:
- Use the title, cast (if mentioned), and review details from the voiceover
- Keep it short: 120-250 characters
- NO emojis
- Include a call to action to follow Screen Render for more (vary the phrasing)
- Use line breaks for readability when necessary
- Focus on the review perspective and insights
- Make it compelling and authentic`,

  captionReleasesPrompt: `You are a social media caption writer for Screen Render, a movie and TV trailer platform. Generate captions specifically for upcoming or newly released titles for the month.

INPUT: Voiceover transcript about monthly releases
OUTPUT: Release-focused caption (120-250 characters)

Guidelines:
- Based on the voiceover, capture the excitement of new releases
- Keep it short: 120-250 characters
- NO emojis
- Sometimes include a call to action to watch the video (vary the phrasing)
- Use line breaks for readability when necessary
- Match the tone of the release slate (blockbusters, Oscar season, holiday films, etc.)
- Examples of style:
  * "We are ending this year with a bang, so join us as we run, sing and dance our way through the final films of 2025!"
  * "November officially kicks off the holiday movie rush — that time when family blockbusters share screens with Oscar hopefuls, and prestige dramas expand from festival chatter to mainstream buzz. Checkout the video to know what movies are coming out."
  * "If you've been wondering what movies are coming out in November 2025, you're in for a packed month. This slate brings fantasy spectacles, animated sequels, and big-budget dramas, balanced by intimate arthouse and international fare."`,

  captionScenesPrompt: `You are a social media caption writer for Screen Render, a movie and TV trailer platform. Generate captions specifically for scene-based clips cut from movies or shows.

INPUT: Voiceover transcript from a specific scene
OUTPUT: Scene-focused caption (120-250 characters)

Guidelines:
- Use the title, cast (if applicable), and scene details pertaining to that scene
- Keep it short: 120-250 characters
- NO emojis
- Include a call to action to follow Screen Render for more (vary the phrasing)
- Use line breaks for readability when necessary
- Focus on what makes this particular scene compelling
- Capture the emotion, drama, or significance of the moment`,
  
  captionIncludeEmojis: true,
  captionIncludeHashtags: true,
  captionMaxLength: 280,
  captionTone: 'engaging', // engaging, professional, casual, hype
};

export function VideoStudioSettings({ onSave, onBack }: VideoStudioSettingsProps) {
  const { settings: globalSettings, updateSetting: updateGlobalSetting } = useSettings();
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('screndly_video_studio_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading Video Studio settings:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('screndly_video_studio_settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Show toast notifications for important settings
    if (key === 'openaiModel') {
      const modelNames: Record<string, string> = {
        'gpt-4o': 'GPT-4o (Recommended)',
        'gpt-4o-mini': 'GPT-4o Mini (Cost-Efficient)',
        'gpt-3.5-turbo': 'GPT-3.5 Turbo',
        'gpt-4-turbo': 'GPT-4 Turbo',
        'gpt-4': 'GPT-4'
      };
      toast.success(`Video AI Model changed to ${modelNames[value] || value}`);
    }
    
    if (key === 'captionOpenaiModel') {
      const modelNames: Record<string, string> = {
        'gpt-4o': 'GPT-4o (Recommended)',
        'gpt-4o-mini': 'GPT-4o Mini (Cost-Efficient)',
        'gpt-4-turbo': 'GPT-4 Turbo',
        'gpt-4': 'GPT-4',
        'gpt-3.5-turbo': 'GPT-3.5 Turbo'
      };
      toast.success(`Caption AI Model changed to ${modelNames[value] || value}`);
    }
    
    if (key === 'temperature') {
      toast.success(`Video Temperature set to ${value} (${value === 0 ? 'Deterministic' : 'Creative'})`);
    }
    
    if (key === 'captionTone') {
      const toneNames: Record<string, string> = {
        'engaging': 'Engaging',
        'hype': 'Hype & Excitement',
        'professional': 'Professional',
        'casual': 'Casual & Friendly'
      };
      toast.success(`Caption Tone: ${toneNames[value] || value}`);
    }
    
    if (onSave) {
      setTimeout(onSave, 100);
    }
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    toast.success('Reset to recommended settings');
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 w-full lg:w-[600px] bg-white dark:bg-[#000000] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333] p-4 flex items-center gap-3 z-10">
        <button 
          className="text-gray-900 dark:text-white p-1" 
          onClick={() => {
            haptics.light();
            onBack();
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12H2M9 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="text-gray-900 dark:text-white text-xl">Video Studio</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* AI Model Selection */}
        <div className="space-y-4">
          <h3 className="text-gray-900 dark:text-white">AI Model Selection</h3>

          <div>
            <Label htmlFor="openai-model" className="text-[#9CA3AF]">Generate LLM Prompt AI Model</Label>
            <Select
              value={settings.openaiModel}
              onValueChange={(value) => updateSetting('openaiModel', value)}
            >
              <SelectTrigger id="openai-model" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Cost-Efficient)</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              GPT-4o provides best accuracy for JSON→Shotstack translation. Use GPT-4o-mini for high-volume batch processing.
            </p>
          </div>
        </div>

        {/* Operational Settings */}
        <div className="space-y-4">
          <h3 className="text-gray-900 dark:text-white">Operational Settings</h3>

          {/* Temperature */}
          <div>
            <Label htmlFor="temperature" className="text-[#9CA3AF]">Temperature</Label>
            <div className="flex gap-3 items-center mt-1">
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white"
              />
              <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF] whitespace-nowrap min-w-[100px]">
                {settings.temperature === 0 ? 'Deterministic' : settings.temperature < 0.5 ? 'Low Creative' : settings.temperature < 1 ? 'Moderate' : 'High Creative'}
              </span>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              Recommended: 0 — Deterministic output, avoids creative rephrasing
            </p>
          </div>

          {/* Top P */}
          <div>
            <Label htmlFor="top-p" className="text-[#9CA3AF]">Top P (Nucleus Sampling)</Label>
            <Input
              id="top-p"
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={settings.topP}
              onChange={(e) => updateSetting('topP', parseFloat(e.target.value))}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
            />
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              Recommended: 0.95 — Controls diversity of token selection
            </p>
          </div>

          {/* Max Tokens */}
          <div>
            <Label htmlFor="max-tokens" className="text-[#9CA3AF]">Max Tokens</Label>
            <Input
              id="max-tokens"
              type="number"
              min="512"
              max="8192"
              step="256"
              value={settings.maxTokens}
              onChange={(e) => updateSetting('maxTokens', parseInt(e.target.value))}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
            />
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              Allocate 1.5-2× your JSON length. Typical: 2048-4096 tokens
            </p>
          </div>
        </div>

        {/* System Prompt */}
        <div className="space-y-4">
          <h3 className="text-gray-900 dark:text-white">System Prompt</h3>

          <div>
            <Label htmlFor="system-prompt" className="text-[#9CA3AF]">Instruction Prompt</Label>
            <Textarea
              id="system-prompt"
              value={settings.systemPrompt}
              onChange={(e) => updateSetting('systemPrompt', e.target.value)}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[200px] font-mono text-xs"
              placeholder="Enter system prompt for the AI model..."
            />
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              Strict instruction-following role that enforces format/keywords for JSON→Shotstack translation
            </p>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

        {/* Bandwidth Optimization */}
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white">Bandwidth Optimization</h3>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1">
              Reduce data usage with smart video processing features
            </p>
          </div>

          {/* Enable HTTP Range Requests */}
          <div className="flex items-start justify-between gap-4 p-4 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333]">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <label className="text-gray-900 dark:text-white">HTTP Range Requests</label>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                Download only needed video segments when cutting scenes. Requires keyframe indexing.
              </p>
              <p className="text-xs text-[#ec1e24] mt-2">
                Saves bandwidth: ~70-90% for short clips from long videos
              </p>
            </div>
            <Switch
              checked={globalSettings.videoStudioRangeRequestsEnabled || false}
              onCheckedChange={(checked) => {
                haptics.medium();
                updateGlobalSetting('videoStudioRangeRequestsEnabled', checked);
                toast.success(checked ? 'Range Requests enabled' : 'Range Requests disabled');
              }}
            />
          </div>

          {/* Enable Resumable Uploads */}
          <div className="flex items-start justify-between gap-4 p-4 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333]">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <label className="text-gray-900 dark:text-white">Resumable Uploads</label>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                Auto-resume uploads if network fails or app closes. Works for Review, Releases, and Scenes sections.
              </p>
            </div>
            <Switch
              checked={globalSettings.videoStudioResumableUploadsEnabled || true}
              onCheckedChange={(checked) => {
                haptics.medium();
                updateGlobalSetting('videoStudioResumableUploadsEnabled', checked);
                toast.success(checked ? 'Resumable uploads enabled' : 'Resumable uploads disabled');
              }}
            />
          </div>

          {/* Auto-generate Keyframe Index */}
          {globalSettings.videoStudioRangeRequestsEnabled && (
            <div className="flex items-start justify-between gap-4 p-4 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333]">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-gray-900 dark:text-white">Auto-generate Keyframe Index</label>
                </div>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  Automatically analyze videos during upload to create keyframe index for range requests
                </p>
              </div>
              <Switch
                checked={globalSettings.videoStudioAutoKeyframeIndex || true}
                onCheckedChange={(checked) => {
                  haptics.medium();
                  updateGlobalSetting('videoStudioAutoKeyframeIndex', checked);
                  toast.success(checked ? 'Auto keyframe indexing enabled' : 'Auto keyframe indexing disabled');
                }}
              />
            </div>
          )}

          {/* Upload Chunk Size */}
          {globalSettings.videoStudioResumableUploadsEnabled && (
            <div>
              <Label htmlFor="upload-chunk-size" className="text-[#9CA3AF]">
                Upload Chunk Size: {globalSettings.videoStudioUploadChunkSize || 10}MB
              </Label>
              <Slider
                id="upload-chunk-size"
                min={5}
                max={100}
                step={5}
                value={[globalSettings.videoStudioUploadChunkSize || 10]}
                onValueChange={(value) => {
                  haptics.light();
                  updateGlobalSetting('videoStudioUploadChunkSize', value[0]);
                }}
                className="mt-2"
              />
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
                Size of each upload chunk (5-100MB). Smaller chunks = more resilient, larger chunks = faster uploads.
              </p>
            </div>
          )}
        </div>

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

        {/* Model Comparison Guide */}
        <div className="bg-gray-50 dark:bg-[#000000] border border-gray-200 dark:border-[#444444] rounded-lg p-4">
          <h3 className="text-gray-900 dark:text-white mb-3">Model Selection Guide</h3>
          <div className="space-y-3 text-xs">
            <div>
              <p className="text-gray-900 dark:text-white mb-1">
                <strong>Use GPT-4o when:</strong>
              </p>
              <ul className="text-[#6B7280] dark:text-[#9CA3AF] space-y-1 ml-4">
                <li>• Accuracy matters most (production jobs)</li>
                <li>• Complex JSON with multiple segments & timestamps</li>
                <li>• Strict audio ducking rules need enforcement</li>
                <li>• Large context (transcripts + templates)</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-900 dark:text-white mb-1">
                <strong>Use GPT-4o-mini when:</strong>
              </p>
              <ul className="text-[#6B7280] dark:text-[#9CA3AF] space-y-1 ml-4">
                <li>• High-volume batch processing</li>
                <li>• Cost optimization is priority</li>
                <li>• Simple, straightforward JSON→prompt conversions</li>
                <li>• Development/testing environments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-4">
          <button
            onClick={resetToDefaults}
            className="w-full px-4 py-2 bg-white dark:bg-[#000000] border border-gray-300 dark:border-[#333333] rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#1A1A1A] active:bg-white dark:active:bg-[#000000] transition-colors"
          >
            Reset to Recommended Settings
          </button>
        </div>
      </div>
    </div>
  );
}