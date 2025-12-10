import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Settings {
  // API Keys
  youtubeKey: string;
  openaiKey: string;
  serperKey: string;
  tmdbKey: string;
  googleVideoIntelligenceKey: string;
  shotstackKey: string;
  s3Key: string;
  backblazeKeyId: string;
  backblazeApplicationKey: string;
  backblazeBucketName: string;
  backblazeVideosKeyId: string;
  backblazeVideosApplicationKey: string;
  backblazeVideosBucketName: string;
  redisUrl: string;
  databaseUrl: string;
  videoGoogleSearchApiKey: string;
  videoGoogleSearchCx: string;
  
  // Video
  fetchInterval: string;
  regionFilter: string;
  advancedFilters: string;
  
  // Comment Reply
  commentRepliesActive: boolean;
  totalCommentsProcessed: number;
  repliesPosted: number;
  commentErrors: number;
  commentBlacklistUsernames: string;
  commentBlacklistKeywords: string;
  commentReplyFrequency: string;
  commentThrottle: string;
  commentReplyModel?: string;
  commentReplyTemperature?: number;
  commentReplyTone?: string;
  commentReplyMaxLength?: number;
  commentReplyPrompt?: string;
  commentUseGoogleSearch?: boolean;
  commentUseSerper?: boolean;
  commentGoogleSearchApiKey?: string;
  commentGoogleSearchCx?: string;
  
  // Per-platform comment settings
  xCommentBlacklist: {
    active: boolean;
    usernames: string;
    keywords: string;
    noEmojiOnly: boolean;
    noLinks: boolean;
    pauseOldPosts: boolean;
    pauseAfterHours: string;
  };
  threadsCommentBlacklist: {
    active: boolean;
    usernames: string;
    keywords: string;
    noEmojiOnly: boolean;
    noLinks: boolean;
    pauseOldPosts: boolean;
    pauseAfterHours: string;
  };
  facebookCommentBlacklist: {
    active: boolean;
    usernames: string;
    keywords: string;
    noEmojiOnly: boolean;
    noLinks: boolean;
    pauseOldPosts: boolean;
    pauseAfterHours: string;
  };
  instagramCommentBlacklist: {
    active: boolean;
    usernames: string;
    keywords: string;
    noEmojiOnly: boolean;
    noLinks: boolean;
    pauseOldPosts: boolean;
    pauseAfterHours: string;
  };
  youtubeCommentBlacklist: {
    active: boolean;
    usernames: string;
    keywords: string;
    noEmojiOnly: boolean;
    noLinks: boolean;
    pauseOldPosts: boolean;
    pauseAfterHours: string;
  };
  
  // RSS
  rssEnabled: boolean;
  globalEnabled?: boolean;
  postingInterval?: string;
  rssImageCount: string;
  rssPlatforms: string[];
  rssFetchInterval: string;
  rssDeduplication: boolean;
  rssLogLevel: string;
  rssCaptionModel?: string;
  rssCaptionTemperature?: number;
  rssCaptionTone?: string;
  rssCaptionMaxLength?: number;
  rssCaptionPrompt?: string;
  
  // TMDb
  tmdbCaptionModel?: string;
  tmdbCaptionTemperature?: number;
  tmdbTodayPrompt?: string;
  tmdbWeeklyPrompt?: string;
  tmdbMonthlyPrompt?: string;
  tmdbAnniversaryPrompt?: string;
  
  // Video Studio
  captionOpenaiModel?: string;
  captionTemperature?: number;
  captionGoogleSearchApiKey?: string;
  captionGoogleSearchCx?: string;
  
  // Video Studio - Web Search for AI Assist
  videoStudioWebSearchEnabled?: boolean;
  videoStudioWebSearchProvider?: 'serper' | 'google';
  videoStudioWebSearchMaxResults?: number;
  
  // Cleanup
  cleanupEnabled: boolean;
  cleanupInterval: string;
  storageRetention: string;
  videoCleanupInterval: string;
  videoStorageRetention: string;
  imageCleanupInterval: string;
  imageStorageRetention: string;
  videoStudioCleanupInterval: string;
  videoStudioStorageRetention: string;
  
  // Appearance
  darkMode: boolean;
  hapticsEnabled: boolean;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  desktopNotifications?: boolean;
  
  // Timezone
  timezone?: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: (key: string, value: any) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function getDefaultSettings(): Settings {
  const hapticsEnabled = localStorage.getItem('hapticsEnabled');
  return {
    // API Keys
    youtubeKey: '••••••••••••••••',
    openaiKey: '••••••••••••••••',
    serperKey: '••••••••••••••••',
    tmdbKey: '••••••••••••••••',
    googleVideoIntelligenceKey: '••••••••••••••••',
    shotstackKey: '••••••••••••••••',
    s3Key: '••••••••••••••••',
    backblazeKeyId: '',
    backblazeApplicationKey: '',
    backblazeBucketName: '',
    backblazeVideosKeyId: '',
    backblazeVideosApplicationKey: '',
    backblazeVideosBucketName: '',
    redisUrl: 'redis://localhost:6379',
    databaseUrl: 'postgresql://localhost/screndly',
    videoGoogleSearchApiKey: '',
    videoGoogleSearchCx: '',
    
    // Video
    fetchInterval: '10',
    regionFilter: 'US,UK',
    advancedFilters: 'trailer, official, teaser',
    
    // Comment Reply
    commentRepliesActive: true,
    totalCommentsProcessed: 1247,
    repliesPosted: 1189,
    commentErrors: 4,
    commentBlacklistUsernames: '',
    commentBlacklistKeywords: '',
    commentReplyFrequency: 'instant',
    commentThrottle: 'low',
    commentReplyModel: 'gpt-4o',
    commentReplyTemperature: 0.7,
    commentReplyTone: 'Engaging',
    commentReplyMaxLength: 280,
    commentReplyPrompt: `You are a social media comment writer for Screen Render, a movie and TV trailer news platform. Create engaging, platform-optimized comments for video content.

INPUT: Video title, description, and content
OUTPUT: Engaging social media comment with emojis, hashtags, and hook

Guidelines:
- Hook in first line (7-10 words max)
- Include 3 relevant emoji and hashtags
- Add 2-3 strategically placed emojis
- Keep total under {maxLength} characters for platform compatibility
- Match the tone of the video content
- No generic "Check this out" openers
- Focus on the key news or reveal from the video
- Make it shareable and clickable`,
    commentUseGoogleSearch: false,
    commentUseSerper: false,
    commentGoogleSearchApiKey: '',
    commentGoogleSearchCx: '',
    
    // Per-platform comment settings
    xCommentBlacklist: {
      active: true,
      usernames: '',
      keywords: '',
      noEmojiOnly: false,
      noLinks: false,
      pauseOldPosts: true,
      pauseAfterHours: '24',
    },
    threadsCommentBlacklist: {
      active: false,
      usernames: '',
      keywords: '',
      noEmojiOnly: false,
      noLinks: false,
      pauseOldPosts: true,
      pauseAfterHours: '24',
    },
    facebookCommentBlacklist: {
      active: false,
      usernames: '',
      keywords: '',
      noEmojiOnly: false,
      noLinks: false,
      pauseOldPosts: true,
      pauseAfterHours: '24',
    },
    instagramCommentBlacklist: {
      active: true,
      usernames: '',
      keywords: '',
      noEmojiOnly: false,
      noLinks: false,
      pauseOldPosts: true,
      pauseAfterHours: '24',
    },
    youtubeCommentBlacklist: {
      active: false,
      usernames: '',
      keywords: '',
      noEmojiOnly: false,
      noLinks: false,
      pauseOldPosts: true,
      pauseAfterHours: '24',
    },
    
    // RSS
    rssEnabled: false,
    globalEnabled: false,
    postingInterval: '10',
    rssImageCount: 'random',
    rssPlatforms: ['x', 'threads'],
    rssFetchInterval: '5',
    rssDeduplication: true,
    rssLogLevel: 'standard',
    rssCaptionModel: 'gpt-4o',
    rssCaptionTemperature: 0.7,
    rssCaptionTone: 'Engaging',
    rssCaptionMaxLength: 280,
    rssCaptionPrompt: `You are a social media caption writer for Screen Render, a movie and TV trailer news platform. Create engaging, platform-optimized captions for RSS article content.

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
- Make it shareable and clickable`,
    
    // TMDb
    tmdbCaptionModel: 'gpt-4o',
    tmdbCaptionTemperature: 0.7,
    
    // Cleanup
    cleanupEnabled: true,
    cleanupInterval: 'daily',
    storageRetention: '48',
    videoCleanupInterval: 'daily',
    videoStorageRetention: '48',
    imageCleanupInterval: 'daily',
    imageStorageRetention: '48',
    videoStudioCleanupInterval: 'daily',
    videoStudioStorageRetention: '48',
    
    // Appearance
    darkMode: true,
    hapticsEnabled: hapticsEnabled === null ? true : hapticsEnabled === 'true',

    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    desktopNotifications: false,
    
    // Timezone
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(getDefaultSettings());
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('screndlySettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all new fields exist
        setSettings({
          ...getDefaultSettings(),
          ...parsed,
          // Ensure platform blacklists exist
          xCommentBlacklist: parsed.xCommentBlacklist || getDefaultSettings().xCommentBlacklist,
          threadsCommentBlacklist: parsed.threadsCommentBlacklist || getDefaultSettings().threadsCommentBlacklist,
          facebookCommentBlacklist: parsed.facebookCommentBlacklist || getDefaultSettings().facebookCommentBlacklist,
          instagramCommentBlacklist: parsed.instagramCommentBlacklist || getDefaultSettings().instagramCommentBlacklist,
          youtubeCommentBlacklist: parsed.youtubeCommentBlacklist || getDefaultSettings().youtubeCommentBlacklist,
        });
      } catch (e) {
        console.error('Failed to parse settings from localStorage:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Auto-save to localStorage with debounce
  useEffect(() => {
    if (isLoading) return; // Don't save during initial load

    const timer = setTimeout(() => {
      localStorage.setItem('screndlySettings', JSON.stringify(settings));
    }, 1000); // Save 1 second after last change

    return () => clearTimeout(timer);
  }, [settings, isLoading]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    localStorage.setItem('screndlySettings', JSON.stringify(defaults));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}