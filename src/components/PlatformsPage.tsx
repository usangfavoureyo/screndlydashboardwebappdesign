import { useState } from 'react';
import { PlatformCard } from './PlatformCard';

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

export function PlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: '📷', 
      connected: true, 
      autoPost: true,
      autoThumbnail: true,
      autoCaption: true,
      autoHashtag: true,
      commentAutomation: true,
      status: 'valid', 
      lastPost: '2 hours ago'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: '👤', 
      connected: true, 
      autoPost: true,
      autoThumbnail: true,
      autoCaption: false,
      autoHashtag: true,
      commentAutomation: false,
      status: 'valid', 
      lastPost: '3 hours ago'
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: '🎵', 
      connected: true, 
      autoPost: true,
      autoThumbnail: true,
      autoCaption: true,
      autoHashtag: true,
      commentAutomation: true,
      status: 'expiring', 
      lastPost: '1 hour ago'
    },
    { 
      id: 'threads', 
      name: 'Threads', 
      icon: '🧵', 
      connected: true, 
      autoPost: false,
      autoThumbnail: true,
      autoCaption: true,
      autoHashtag: false,
      commentAutomation: false,
      status: 'valid', 
      lastPost: '5 hours ago'
    },
    { 
      id: 'x', 
      name: 'X (Twitter)', 
      icon: '𝕏', 
      connected: true, 
      autoPost: true,
      autoThumbnail: true,
      autoCaption: true,
      autoHashtag: true,
      commentAutomation: true,
      status: 'valid', 
      lastPost: '30 min ago'
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      icon: '▶️', 
      connected: false, 
      autoPost: false,
      autoThumbnail: false,
      autoCaption: false,
      autoHashtag: false,
      commentAutomation: false,
      status: 'disconnected'
    },
  ]);

  const updatePlatform = (id: string, updates: Partial<Platform>) => {
    setPlatforms(platforms.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const connectPlatform = (id: string) => {
    setPlatforms(platforms.map(p => p.id === id ? { ...p, connected: true, status: 'valid' } : p));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-white mb-2">Platforms</h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF]">Connect and manage your social media platforms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            onUpdate={updatePlatform}
            onConnect={connectPlatform}
          />
        ))}
      </div>
    </div>
  );
}