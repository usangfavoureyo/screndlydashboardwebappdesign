import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { youtubePoller } from '../../utils/youtube-poller';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface VideoSettingsProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
  onBack: () => void;
}

export function VideoSettings({ settings, updateSetting, onBack }: VideoSettingsProps) {
  const [pollInterval, setPollInterval] = useState(2);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    // Get current polling state
    setIsPolling(youtubePoller.getIsPolling());
    setPollInterval(youtubePoller.getCurrentInterval());
  }, []);

  const handleIntervalChange = (value: string) => {
    const minutes = parseInt(value) || 2;
    updateSetting('fetchInterval', value);
    setPollInterval(minutes);
    
    // Update the poller
    if (isPolling) {
      youtubePoller.stopPolling();
      youtubePoller.startPolling(minutes);
      toast.success(`Polling interval updated to ${minutes} minute(s)`);
    }
  };

  const handleKeywordsChange = (value: string) => {
    updateSetting('advancedFilters', value);
    
    // Update the poller's custom keywords
    youtubePoller.setCustomKeywords(value);
    toast.success('Trailer keywords updated');
  };

  const handlePostIntervalChange = (value: string) => {
    const minutes = parseInt(value) || 10;
    updateSetting('postInterval', value);
    toast.success(`Post interval updated to ${minutes} minute(s)`);
  };

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
        <h2 className="text-gray-900 dark:text-white text-xl">Video</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* OpenAI Model Selection */}
        <div>
          <Label htmlFor="video-openai-model" className="text-[#9CA3AF]">OpenAI Model</Label>
          <Select
            value={settings.videoOpenaiModel || 'gpt-4o-mini'}
            onValueChange={(value) => {
              updateSetting('videoOpenaiModel', value);
              toast.success(`AI Model changed to ${value}`);
            }}
          >
            <SelectTrigger id="video-openai-model" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
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

        {/* Polling Interval */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">Polling Interval</h3>
          <div>
            <Label className="text-[#9CA3AF]">Polling Interval (minutes)</Label>
            <Input
              type="number"
              min="1"
              max="60"
              value={settings.fetchInterval || pollInterval}
              onChange={(e) => handleIntervalChange(e.target.value)}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
            />
          </div>
        </div>

        {/* Post Interval */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">Post Interval</h3>
          <div>
            <Label className="text-[#9CA3AF]">Post Interval (minutes)</Label>
            <Input
              type="number"
              min="1"
              max="1440"
              value={settings.postInterval || 10}
              onChange={(e) => handlePostIntervalChange(e.target.value)}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
            />
          </div>
        </div>

        {/* Trailer Detection Settings */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">Trailer Detection</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-[#9CA3AF]">Trailer Keywords (comma-separated)</Label>
              <Input
                value={settings.advancedFilters || 'trailer, teaser, official, first look, sneak peek'}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                placeholder="trailer, official, teaser"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
              />
            </div>
            
            <div>
              <Label className="text-[#9CA3AF]">Region Filter (optional)</Label>
              <Input
                value={settings.regionFilter || ''}
                onChange={(e) => updateSetting('regionFilter', e.target.value)}
                placeholder="US,UK,CA"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}