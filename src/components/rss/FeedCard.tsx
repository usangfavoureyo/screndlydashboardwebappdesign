import { useState } from 'react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Eye, Zap, Pencil, Trash2, Globe } from 'lucide-react';
import { InstagramIcon } from '../icons/InstagramIcon';
import { FacebookIcon } from '../icons/FacebookIcon';
import { ThreadsIcon } from '../icons/ThreadsIcon';
import { XIcon } from '../icons/XIcon';
import { haptics } from '../../utils/haptics';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export interface Feed {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  interval: number;
  imageCount: '1' | '2' | '3' | 'random';
  platformImageCounts?: { x?: number; threads?: number; facebook?: number };
  dedupeDays: number;
  filters: {
    scope: 'title' | 'body' | 'title_or_body' | 'title_and_body';
    required: Array<{
      text: string;
      matchType: 'contains' | 'exact';
      caseSensitive: boolean;
      active: boolean;
    }>;
    blocked: Array<{
      text: string;
      matchType: 'contains' | 'exact';
      caseSensitive: boolean;
      active: boolean;
    }>;
  };
  serperPriority: boolean;
  rehostImages: boolean;
  lastProcessedAt?: string;
  nextRunAt?: string;
  platformsEnabled?: { x: boolean; threads: boolean; facebook: boolean };
  autoPost: boolean;
  status: 'active' | 'paused' | 'error';
  favicon?: string;
}

interface FeedCardProps {
  feed: Feed;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
  onTest: (id: string) => Promise<void>;
  onTogglePlatform: (feedId: string, platform: string, enabled: boolean) => void;
  onToggleEnabled: (feedId: string, enabled: boolean) => void;
  onRunNow: (feedId: string) => void;
}

export function FeedCard({ 
  feed, 
  onEdit, 
  onDelete, 
  onPreview, 
  onTest, 
  onTogglePlatform,
  onToggleEnabled,
  onRunNow
}: FeedCardProps) {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const handleTest = async () => {
    haptics.medium();
    setIsTestRunning(true);
    try {
      await onTest(feed.id);
    } finally {
      setIsTestRunning(false);
    }
  };

  const getStatusColor = () => {
    switch (feed.status) {
      case 'active':
        return 'bg-[#D1FAE5] dark:bg-[#065F46] text-[#065F46] dark:text-[#D1FAE5]';
      case 'paused':
        return 'bg-gray-200 dark:bg-[#374151] text-gray-600 dark:text-[#9CA3AF]';
      case 'error':
        return 'bg-[#FEE2E2] dark:bg-[#991B1B] text-[#991B1B] dark:text-[#FEE2E2]';
    }
  };

  const platformIcons: Record<string, React.ComponentType<any>> = {
    x: XIcon,
    threads: ThreadsIcon,
    facebook: FacebookIcon,
    instagram: InstagramIcon,
  };

  const domain = new URL(feed.url).hostname.replace('www.', '');

  return (
    <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {feed.favicon && !faviconError ? (
            <img
              src={feed.favicon}
              alt=""
              className="w-5 h-5 rounded flex-shrink-0 mt-0.5"
              onError={() => setFaviconError(true)}
            />
          ) : (
            <div className="w-5 h-5 rounded flex-shrink-0 mt-0.5 bg-gray-200 dark:bg-[#374151] flex items-center justify-center">
              <Globe className="w-3 h-3 text-gray-500 dark:text-[#6B7280]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 dark:text-white truncate mb-1">{feed.name}</h3>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm truncate">{domain}</p>
          </div>
        </div>
        
        <Switch
          checked={feed.enabled}
          onCheckedChange={(checked) => {
            haptics.light();
            onToggleEnabled(feed.id, checked);
          }}
          className="flex-shrink-0"
        />
      </div>

      {/* Metadata */}
      <div className="space-y-1.5 mb-4 text-sm">
        <div className="flex items-center justify-between text-[#6B7280] dark:text-[#9CA3AF]">
          <span>Next run:</span>
          <span>{feed.nextRunAt || 'Not scheduled'}</span>
        </div>
        <div className="flex items-center justify-between text-[#6B7280] dark:text-[#9CA3AF]">
          <span>Last item:</span>
          <span>{feed.lastProcessedAt || 'Never'}</span>
        </div>
      </div>

      {/* Platform Toggles */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-[#1F1F1F]">
        <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs mb-2">Platforms</p>
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(feed.platformsEnabled || {}).map(([platform, enabled]) => {
            const Icon = platformIcons[platform];
            return Icon ? (
              <button
                key={platform}
                onClick={() => {
                  haptics.light();
                  onTogglePlatform(feed.id, platform, !enabled);
                }}
                className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
                  enabled 
                    ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                    : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                }`}
                title={platform}
              >
                <Icon className={platform === 'x' ? 'w-4 h-4' : platform === 'instagram' || platform === 'facebook' ? 'w-6 h-6' : 'w-5 h-5'} />
              </button>
            ) : null;
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            haptics.light();
            onPreview(feed.id);
          }}
          className="!bg-white dark:!bg-[#000000] !text-gray-900 dark:!text-white text-xs border-gray-300 dark:border-[#333333]"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleTest}
          disabled={isTestRunning}
          className="!bg-white dark:!bg-[#000000] !text-gray-900 dark:!text-white text-xs border-gray-300 dark:border-[#333333]"
        >
          <Zap className="w-3.5 h-3.5 mr-1.5" />
          {isTestRunning ? 'Testing...' : 'Test'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            haptics.light();
            onEdit(feed.id);
          }}
          className="!bg-white dark:!bg-[#000000] !text-gray-900 dark:!text-white text-xs border-gray-300 dark:border-[#333333]"
        >
          <Pencil className="w-3.5 h-3.5 mr-1.5" />
          Edit
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          haptics.medium();
          onDelete(feed.id);
        }}
        className="w-full mt-2 text-[#EF4444] hover:text-[#EF4444]/80 text-xs"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
        Delete Feed
      </Button>
    </div>
  );
}