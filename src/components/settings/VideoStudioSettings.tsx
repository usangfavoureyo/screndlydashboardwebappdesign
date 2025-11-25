import { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { toast } from 'sonner@2.0.3';

interface VideoStudioSettingsProps {
  onSave?: () => void;
  onBack: () => void;
}

// Default prompt system settings
const defaultSettings = {
  // Video Generation Model Selection
  openaiModel: 'gpt-4.1',
  
  // Video Generation Operational Settings
  temperature: 0,
  topP: 0.95,
  maxTokens: 4096,
  
  // Video Generation System Prompt
  systemPrompt: `You are an editor-prompt generator. Input: validated job JSON (segments, timestamps, audio_rules, caption_template, aspect). Output: (1) a Visla natural-language prompt that contains exact timestamps, audio ducking rules, caption template reference, and aspect directives; (2) a JSON validation summary with keys: segments_count, missing_fields, warnings. Strictly produce the Visla prompt in the field "visla_prompt_text" and do not add extra commentary. Follow the structured output schema exactly.`,
  
  // Response Settings
  useStructuredOutput: true,
  validateTimestamps: true,
  autoRetryOnMismatch: true,
  previewBeforeRender: true,
  
  // Caption Generation Settings
  captionOpenaiModel: 'gpt-4o',
  captionTemperature: 0.7,
  captionMaxTokens: 500,
  captionSystemPrompt: `You are a social media caption writer for Screen Render, a movie and TV trailer platform. Your task is to generate engaging, platform-optimized captions for video content based on the voiceover transcript.

INPUT: Voiceover transcript from a trailer video
OUTPUT: Engaging social media caption with emojis, hashtags, and hook

Guidelines:
- Hook in first line (7-10 words max)
- Include 3-5 relevant movie/TV hashtags
- Add 2-3 strategically placed emojis
- Keep total caption under 280 characters for X/Twitter compatibility
- Make it compelling and clickable
- Match the tone of the video content
- No generic "Check this out" openings
- Focus on the key hook or reveal from the transcript`,
  
  captionIncludeEmojis: true,
  captionIncludeHashtags: true,
  captionMaxLength: 280,
  captionTone: 'engaging', // engaging, professional, casual, hype
};

export function VideoStudioSettings({ onSave, onBack }: VideoStudioSettingsProps) {
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
        'gpt-4.1': 'GPT-4.1 (Primary - Best Accuracy)',
        'gpt-4.1-mini': 'GPT-4.1-mini (Cost/Throughput)',
        'gpt-4o-mini': 'GPT-4o Mini (Cost-Efficient)',
        'gpt-4o': 'GPT-4o',
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
          onClick={onBack}
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
            <Label htmlFor="openai-model" className="text-[#9CA3AF]">OpenAI Model</Label>
            <Select
              value={settings.openaiModel}
              onValueChange={(value) => updateSetting('openaiModel', value)}
            >
              <SelectTrigger id="openai-model" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4.1">GPT-4.1 (Recommended)</SelectItem>
                <SelectItem value="gpt-4.1-mini">GPT-4.1-mini (Cost/Throughput)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Cost-Efficient)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              GPT-4.1 provides best accuracy for JSON→Visla translation. Use GPT-4.1-mini or GPT-4o-mini for high-volume batch processing.
            </p>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

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

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

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
              Strict instruction-following role that enforces format/keywords for JSON→Visla translation
            </p>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

        {/* Validation & Safety */}
        <div className="space-y-4">
          <h3 className="text-gray-900 dark:text-white mb-3">Validation & Safety</h3>
          <div className="space-y-3 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            <p>
              <strong className="text-gray-900 dark:text-white">Structured Output</strong><br />
              Forces exact fields (segments, audio_rules, visla_prompt_text) to prevent hallucination
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Timestamp Validation</strong><br />
              Server-side check that timestamps exactly match input JSON
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Auto-Retry</strong><br />
              Retry once on mismatch, then fallback to manual inspection
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Preview Verification</strong><br />
              15s Visla preview job before full render to verify prompt
            </p>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

        {/* Caption Generation Settings */}
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white">Caption Generation (Social Media)</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
              AI-powered caption generation from voiceover transcripts for social media publishing
            </p>
          </div>

          {/* Caption Model Selection */}
          <div>
            <Label htmlFor="caption-model" className="text-[#9CA3AF]">Caption AI Model</Label>
            <Select
              value={settings.captionOpenaiModel}
              onValueChange={(value) => updateSetting('captionOpenaiModel', value)}
            >
              <SelectTrigger id="caption-model" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Cost-Efficient)</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Budget)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              GPT-4o balances creativity and cost for engaging social media captions
            </p>
          </div>

          {/* Caption Temperature */}
          <div>
            <Label htmlFor="caption-temperature" className="text-[#9CA3AF]">Caption Creativity (Temperature)</Label>
            <div className="flex gap-3 items-center mt-1">
              <Input
                id="caption-temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={settings.captionTemperature}
                onChange={(e) => updateSetting('captionTemperature', parseFloat(e.target.value))}
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white"
              />
              <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF] whitespace-nowrap min-w-[100px]">
                {settings.captionTemperature < 0.5 ? 'Conservative' : settings.captionTemperature < 1 ? 'Balanced' : 'Very Creative'}
              </span>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              Recommended: 0.7 — Balanced creativity for engaging yet relevant captions
            </p>
          </div>

          {/* Caption Tone */}
          <div>
            <Label htmlFor="caption-tone" className="text-[#9CA3AF]">Caption Tone</Label>
            <Select
              value={settings.captionTone}
              onValueChange={(value) => updateSetting('captionTone', value)}
            >
              <SelectTrigger id="caption-tone" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engaging">Engaging (Recommended)</SelectItem>
                <SelectItem value="hype">Hype & Excitement</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual & Friendly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              Sets the overall tone and style for generated captions
            </p>
          </div>

          {/* Caption Max Length */}
          <div>
            <Label htmlFor="caption-max-length" className="text-[#9CA3AF]">Max Caption Length (Characters)</Label>
            <Input
              id="caption-max-length"
              type="number"
              min="100"
              max="2000"
              step="20"
              value={settings.captionMaxLength}
              onChange={(e) => updateSetting('captionMaxLength', parseInt(e.target.value))}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
            />
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              280 for X/Twitter compatibility, 2200 for Instagram, 63,206 for Facebook
            </p>
          </div>

          {/* Caption System Prompt */}
          <div>
            <Label htmlFor="caption-system-prompt" className="text-[#9CA3AF]">Caption Generation Prompt</Label>
            <Textarea
              id="caption-system-prompt"
              value={settings.captionSystemPrompt}
              onChange={(e) => updateSetting('captionSystemPrompt', e.target.value)}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 min-h-[180px] font-mono text-xs"
              placeholder="Enter caption generation prompt..."
            />
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
              Instructions for generating captions from voiceover transcripts
            </p>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

        {/* Model Comparison Guide */}
        <div className="bg-gray-50 dark:bg-[#000000] border border-gray-200 dark:border-[#444444] rounded-lg p-4">
          <h3 className="text-gray-900 dark:text-white mb-3">Model Selection Guide</h3>
          <div className="space-y-3 text-xs">
            <div>
              <p className="text-gray-900 dark:text-white mb-1">
                <strong>Use GPT-4.1 when:</strong>
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
                <strong>Use GPT-4.1-mini or GPT-4o-mini when:</strong>
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