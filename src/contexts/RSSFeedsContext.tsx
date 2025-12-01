import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface RSSFeed {
  id: string;
  source: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedDate: string;
  scheduledTime?: string;
  status: 'pending' | 'scheduled' | 'published' | 'failed';
  platforms?: string[];
  caption?: string;
  errorMessage?: string;
}

interface RSSFeedsContextType {
  feeds: RSSFeed[];
  addFeed: (feed: RSSFeed) => void;
  updateFeed: (feedId: string, updates: Partial<RSSFeed>) => void;
  deleteFeed: (feedId: string) => void;
  scheduleFeed: (feedId: string, scheduledTime: string) => void;
  updateFeedStatus: (feedId: string, status: RSSFeed['status'], errorMessage?: string) => void;
  getFeedsByStatus: (status: RSSFeed['status']) => RSSFeed[];
  getFeedsBySource: (source: string) => RSSFeed[];
}

const RSSFeedsContext = createContext<RSSFeedsContextType | undefined>(undefined);

export function RSSFeedsProvider({ children }: { children: ReactNode }) {
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load feeds from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('screndlyRSSFeeds');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFeeds(parsed);
      } catch (e) {
        console.error('Failed to parse RSS feeds from localStorage:', e);
        // Use default mock data if parsing fails
        setFeeds(getDefaultFeeds());
      }
    } else {
      // Use default mock data on first load
      setFeeds(getDefaultFeeds());
    }
    setIsLoading(false);
  }, []);

  // Auto-save to localStorage whenever feeds change
  useEffect(() => {
    if (isLoading) return; // Don't save during initial load
    localStorage.setItem('screndlyRSSFeeds', JSON.stringify(feeds));
  }, [feeds, isLoading]);

  const addFeed = (feed: RSSFeed) => {
    setFeeds(prev => {
      // Check if feed already exists
      const existingIndex = prev.findIndex(f => f.id === feed.id);
      if (existingIndex !== -1) {
        // Update existing feed
        const updated = [...prev];
        updated[existingIndex] = feed;
        return updated;
      }
      // Add new feed
      return [...prev, feed];
    });
  };

  const updateFeed = (feedId: string, updates: Partial<RSSFeed>) => {
    setFeeds(prev =>
      prev.map(feed =>
        feed.id === feedId ? { ...feed, ...updates } : feed
      )
    );
  };

  const deleteFeed = (feedId: string) => {
    setFeeds(prev => prev.filter(feed => feed.id !== feedId));
  };

  const scheduleFeed = (feedId: string, scheduledTime: string) => {
    setFeeds(prev =>
      prev.map(feed =>
        feed.id === feedId
          ? { ...feed, scheduledTime, status: 'scheduled' as const }
          : feed
      )
    );
  };

  const updateFeedStatus = (
    feedId: string,
    status: RSSFeed['status'],
    errorMessage?: string
  ) => {
    setFeeds(prev =>
      prev.map(feed =>
        feed.id === feedId
          ? {
              ...feed,
              status,
              errorMessage: status === 'failed' ? errorMessage : undefined,
            }
          : feed
      )
    );
  };

  const getFeedsByStatus = (status: RSSFeed['status']) => {
    return feeds.filter(feed => feed.status === status);
  };

  const getFeedsBySource = (source: string) => {
    return feeds.filter(feed => feed.source === source);
  };

  return (
    <RSSFeedsContext.Provider
      value={{
        feeds,
        addFeed,
        updateFeed,
        deleteFeed,
        scheduleFeed,
        updateFeedStatus,
        getFeedsByStatus,
        getFeedsBySource,
      }}
    >
      {children}
    </RSSFeedsContext.Provider>
  );
}

export function useRSSFeeds() {
  const context = useContext(RSSFeedsContext);
  if (context === undefined) {
    throw new Error('useRSSFeeds must be used within a RSSFeedsProvider');
  }
  return context;
}

// Default mock data
function getDefaultFeeds(): RSSFeed[] {
  return [
    {
      id: '1',
      source: 'Variety',
      title: 'Box Office: Gladiator II Conquers Weekend with $87M Debut',
      description: 'Ridley Scott\'s epic sequel dominates theaters in its opening weekend, exceeding projections.',
      url: 'https://variety.com/gladiator-ii-box-office',
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
      publishedDate: '2024-11-18T10:30:00Z',
      scheduledTime: '2024-11-18T14:00:00Z',
      status: 'scheduled',
      platforms: ['X', 'Threads', 'Facebook'],
      caption: '🎬 BOX OFFICE CHAMPION! Gladiator II slays the competition with a massive $87M opening weekend 💪⚔️ #GladiatorII #BoxOffice #MovieNews',
    },
    {
      id: '2',
      source: 'The Hollywood Reporter',
      title: 'Wicked Sets New Record for Broadway Adaptation Openings',
      description: 'The musical fantasy film breaks records with its theatrical debut, signaling strong audience demand.',
      url: 'https://thr.com/wicked-record-breaking',
      imageUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800',
      publishedDate: '2024-11-18T09:15:00Z',
      status: 'pending',
      platforms: ['X', 'Threads'],
      caption: '✨ DEFYING EXPECTATIONS! Wicked breaks Broadway adaptation records at the box office 🎭💚 #Wicked #Broadway #MovieMagic',
    },
    {
      id: '3',
      source: 'Deadline',
      title: 'Netflix Announces Stranger Things Season 5 Release Date',
      description: 'The streaming giant finally reveals when fans can expect the final season of the hit series.',
      url: 'https://deadline.com/stranger-things-s5-date',
      imageUrl: 'https://images.unsplash.com/photo-1574267432644-f999f7bcef14?w=800',
      publishedDate: '2024-11-18T08:00:00Z',
      scheduledTime: '2024-11-18T12:00:00Z',
      status: 'published',
      platforms: ['X', 'Threads', 'Instagram'],
      caption: '🎉 IT\'S OFFICIAL! Stranger Things Season 5 gets a release date! The Upside Down awaits... 🚲👾 #StrangerThings #Netflix #FinalSeason',
    },
    {
      id: '4',
      source: 'IndieWire',
      title: 'Dune: Part Three Officially Greenlit by Legendary Pictures',
      description: 'Following the success of Part Two, the third installment in Denis Villeneuve\'s epic saga gets the green light.',
      url: 'https://indiewire.com/dune-part-three-greenlit',
      imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800',
      publishedDate: '2024-11-17T16:45:00Z',
      status: 'failed',
      platforms: ['X'],
      caption: '🏜️ THE SPICE MUST FLOW! Dune: Part Three is officially happening! Denis Villeneuve returns 🎬 #Dune #DunePartThree #SciFi',
      errorMessage: 'Twitter API rate limit exceeded',
    },
  ];
}
