import { useState, useEffect } from 'react';
import { PlatformCard } from './PlatformCard';
import { PlatformConnectionModal } from './PlatformConnectionModal';
import { 
  getPlatformConnections, 
  PlatformType,
  getConnectionStatus,
  formatLastConnection,
  disconnectPlatform
} from '../utils/platformConnections';
import { haptics } from '../utils/haptics';
import { toast } from 'sonner@2.0.3';

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
  const [connectionModalOpen, setConnectionModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | null>(null);
  
  // Map platform IDs to PlatformType
  const getPlatformType = (id: string): PlatformType | null => {
    const mapping: Record<string, PlatformType> = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      tiktok: 'TikTok',
      threads: 'Threads',
      x: 'X',
      youtube: 'YouTube',
    };
    return mapping[id] || null;
  };

  // Initialize platforms with connection status from storage
  const initializePlatforms = (): Platform[] => {
    const initialPlatforms = [
      { 
        id: 'instagram', 
        name: 'Instagram', 
        icon: '📷',
        connected: false, 
        autoPost: true,
        autoThumbnail: true,
        autoCaption: true,
        autoHashtag: true,
        commentAutomation: true,
        status: 'disconnected' as const, 
        lastPost: undefined
      },
      { 
        id: 'facebook', 
        name: 'Facebook', 
        icon: '👤', 
        connected: false, 
        autoPost: true,
        autoThumbnail: true,
        autoCaption: false,
        autoHashtag: true,
        commentAutomation: false,
        status: 'disconnected' as const, 
        lastPost: undefined
      },
      { 
        id: 'tiktok', 
        name: 'TikTok', 
        icon: '🎵', 
        connected: false, 
        autoPost: true,
        autoThumbnail: true,
        autoCaption: true,
        autoHashtag: true,
        commentAutomation: true,
        status: 'disconnected' as const, 
        lastPost: undefined
      },
      { 
        id: 'threads', 
        name: 'Threads', 
        icon: '🧵', 
        connected: false, 
        autoPost: false,
        autoThumbnail: true,
        autoCaption: true,
        autoHashtag: false,
        commentAutomation: false,
        status: 'disconnected' as const, 
        lastPost: undefined
      },
      { 
        id: 'x', 
        name: 'X (Twitter)', 
        icon: '𝕏', 
        connected: false, 
        autoPost: true,
        autoThumbnail: true,
        autoCaption: true,
        autoHashtag: true,
        commentAutomation: true,
        status: 'disconnected' as const, 
        lastPost: undefined
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
        status: 'disconnected' as const,
        lastPost: undefined
      },
    ];

    // Load connection status immediately
    try {
      const connections = getPlatformConnections();
      
      return initialPlatforms.map(platform => {
        const platformType = getPlatformType(platform.id);
        
        if (!platformType) return platform;
        
        const connection = connections[platformType];
        const status = getConnectionStatus(platformType);
        
        return {
          ...platform,
          connected: connection?.connected || false,
          status: status.health === 'healthy' ? 'valid' as const :
                  status.health === 'warning' ? 'expiring' as const :
                  status.health === 'error' ? 'invalid' as const : 'disconnected' as const,
          lastPost: connection?.connected ? formatLastConnection(connection) : undefined,
        };
      });
    } catch (error) {
      console.error('Error initializing connection status:', error);
      return initialPlatforms;
    }
  };
  
  const [platforms, setPlatforms] = useState<Platform[]>(initializePlatforms());

  // Load connection status from storage
  const loadConnectionStatus = () => {
    try {
      const connections = getPlatformConnections();
      
      setPlatforms(prev => prev.map(platform => {
        const platformType = getPlatformType(platform.id);
        
        if (!platformType) return platform;
        
        const connection = connections[platformType];
        const status = getConnectionStatus(platformType);
        
        return {
          ...platform,
          connected: connection?.connected || false,
          status: status.health === 'healthy' ? 'valid' :
                  status.health === 'warning' ? 'expiring' :
                  status.health === 'error' ? 'invalid' : 'disconnected',
          lastPost: connection?.connected ? formatLastConnection(connection) : undefined,
        };
      }));
    } catch (error) {
      console.error('Error loading connection status:', error);
    }
  };

  const updatePlatform = (id: string, updates: Partial<Platform>) => {
    setPlatforms(platforms.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleOpenConnectionModal = (platformId: string) => {
    const platformType = getPlatformType(platformId);
    
    if (platformType) {
      setSelectedPlatform(platformType);
      setConnectionModalOpen(true);
      haptics.light();
    }
  };

  const handleDisconnect = (platformId: string) => {
    const platformType = getPlatformType(platformId);
    
    if (platformType) {
      disconnectPlatform(platformType);
      haptics.light();
      toast.success(`Disconnected from ${platformType}`);
      loadConnectionStatus();
    }
  };

  const handleConnectionSuccess = () => {
    loadConnectionStatus();
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
            onConnect={handleOpenConnectionModal}
            onDisconnect={handleDisconnect}
          />
        ))}
      </div>

      {selectedPlatform && (
        <PlatformConnectionModal
          platform={selectedPlatform}
          isOpen={connectionModalOpen}
          onClose={() => setConnectionModalOpen(false)}
          onSuccess={handleConnectionSuccess}
        />
      )}
    </div>
  );
}