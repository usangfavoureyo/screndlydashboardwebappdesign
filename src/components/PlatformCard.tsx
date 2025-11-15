import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { CheckCircle, AlertCircle, XCircle, Send } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  autoPost: boolean;
  autoThumbnail: boolean;
  autoCaption: boolean;
  autoHashtag: boolean;
  commentAutomation: boolean;
  status: 'valid' | 'expiring' | 'invalid' | 'disconnected';
  lastPost?: string;
}

interface PlatformCardProps {
  platform: Platform;
  onUpdate: (id: string, updates: Partial<Platform>) => void;
  onConnect: (id: string) => void;
}

export function PlatformCard({ platform, onUpdate, onConnect }: PlatformCardProps) {
  const getStatusConfig = () => {
    switch (platform.status) {
      case 'valid':
        return {
          icon: CheckCircle,
          color: 'text-[#10B981]',
          bgColor: 'bg-[#D1FAE5]',
          label: 'Connected',
        };
      case 'expiring':
        return {
          icon: AlertCircle,
          color: 'text-[#F59E0B]',
          bgColor: 'bg-[#FEF3C7]',
          label: 'Token Expiring',
        };
      case 'invalid':
        return {
          icon: XCircle,
          color: 'text-[#EF4444]',
          bgColor: 'bg-[#FEE2E2]',
          label: 'Invalid',
        };
      default:
        return {
          icon: XCircle,
          color: 'text-[#9CA3AF]',
          bgColor: 'bg-[#374151]',
          label: 'Not Connected',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-[#1F2937] rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{platform.icon}</div>
          <div>
            <h3 className="text-gray-900 dark:text-white">{platform.name}</h3>
            <div className={`flex items-center gap-1 mt-1 ${statusConfig.color}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="text-sm">{statusConfig.label}</span>
            </div>
          </div>
        </div>
      </div>

      {platform.connected ? (
        <div className="space-y-3">
          {platform.lastPost && (
            <div className="text-[#9CA3AF] text-sm pb-2 border-b border-[#374151]">
              Last post: {platform.lastPost}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-[#9CA3AF] text-sm">Auto-post</span>
            <Switch
              checked={platform.autoPost}
              onCheckedChange={(checked) => onUpdate(platform.id, { autoPost: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#9CA3AF] text-sm">Auto-thumbnail</span>
            <Switch
              checked={platform.autoThumbnail}
              onCheckedChange={(checked) => onUpdate(platform.id, { autoThumbnail: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#9CA3AF] text-sm">Auto-caption</span>
            <Switch
              checked={platform.autoCaption}
              onCheckedChange={(checked) => onUpdate(platform.id, { autoCaption: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#9CA3AF] text-sm">Auto-hashtag</span>
            <Switch
              checked={platform.autoHashtag}
              onCheckedChange={(checked) => onUpdate(platform.id, { autoHashtag: checked })}
            />
          </div>

          <div className="pt-2 border-t border-[#374151]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#9CA3AF] text-sm">Comment automation</span>
              <Switch
                checked={platform.commentAutomation}
                onCheckedChange={(checked) => onUpdate(platform.id, { commentAutomation: checked })}
              />
            </div>
            <p className="text-[#6B7280] text-xs mt-1">
              AI-powered responses to user comments
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-lg gap-2 mt-4"
            disabled={!platform.autoPost}
          >
            <Send className="w-4 h-4" />
            Test Publish
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => onConnect(platform.id)}
          className="w-full rounded-lg"
        >
          Connect {platform.name}
        </Button>
      )}
    </div>
  );
}