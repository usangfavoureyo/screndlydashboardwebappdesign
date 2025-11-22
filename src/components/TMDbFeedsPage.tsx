import { useState } from 'react';
import { Clapperboard, RefreshCw } from 'lucide-react';
import { TMDbStatsPanel } from './tmdb/TMDbStatsPanel';
import { TMDbFeedCard } from './tmdb/TMDbFeedCard';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';
import { toast } from 'sonner';

interface TMDbFeedsPageProps {
  onNavigate: (page: string) => void;
  previousPage?: string | null;
}

export function TMDbFeedsPage({ onNavigate, previousPage }: TMDbFeedsPageProps) {
  const [filterType, setFilterType] = useState<'all' | 'today' | 'weekly' | 'monthly' | 'anniversary'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - will be replaced with API calls
  const [feeds, setFeeds] = useState([
    {
      id: '0',
      tmdbId: 558449,
      mediaType: 'movie' as const,
      title: 'Gladiator II',
      year: 2024,
      releaseDate: '2024-11-17',
      caption: '#GladiatorII arrives in theaters TODAY! 🎬⚔️',
      imageUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
      imageType: 'poster' as const,
      scheduledTime: '2024-11-17T08:00:00Z',
      source: 'tmdb_today' as const,
      cast: ['Paul Mescal', 'Denzel Washington', 'Pedro Pascal'],
      popularity: 456.89,
      cacheHit: false,
    },
    {
      id: '1',
      tmdbId: 1034541,
      mediaType: 'movie' as const,
      title: 'Terrifier 3',
      year: 2024,
      releaseDate: '2024-10-11',
      caption: '#Terrifier3 slashes into theaters October 11.',
      imageUrl: 'https://image.tmdb.org/t/p/w500/7NDHoebflLwL1CcgLJ9wZbbDrmV.jpg',
      imageType: 'poster' as const,
      scheduledTime: '2024-11-20T15:30:00Z',
      source: 'tmdb_weekly' as const,
      cast: ['David Howard Thornton', 'Lauren LaVera'],
      popularity: 234.56,
      cacheHit: false,
    },
    {
      id: '2',
      tmdbId: 603,
      mediaType: 'movie' as const,
      title: 'The Matrix',
      year: 1999,
      releaseDate: '1999-03-31',
      caption: '#TheMatrix changed cinema 25 years ago today.',
      imageUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      imageType: 'poster' as const,
      scheduledTime: '2024-11-18T09:00:00Z',
      source: 'tmdb_anniversary' as const,
      cast: ['Keanu Reeves', 'Laurence Fishburne'],
      popularity: 123.45,
      cacheHit: true,
    },
    {
      id: '3',
      tmdbId: 157336,
      mediaType: 'movie' as const,
      title: 'Interstellar',
      year: 2014,
      releaseDate: '2014-11-07',
      caption: 'Christopher Nolan\'s #Interstellar celebrated its 10th anniversary.',
      imageUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      imageType: 'backdrop' as const,
      scheduledTime: '2024-11-17T14:00:00Z',
      source: 'tmdb_anniversary' as const,
      cast: ['Matthew McConaughey', 'Anne Hathaway'],
      popularity: 189.23,
      cacheHit: true,
    },
    {
      id: '4',
      tmdbId: 94605,
      mediaType: 'tv' as const,
      title: 'Arcane',
      year: 2021,
      releaseDate: '2021-11-06',
      caption: '#Arcane returns for Season 2 next month.',
      imageUrl: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
      imageType: 'poster' as const,
      scheduledTime: '2024-11-19T11:00:00Z',
      source: 'tmdb_monthly' as const,
      cast: ['Hailee Steinfeld', 'Ella Purnell'],
      popularity: 312.78,
      cacheHit: false,
    },
  ]);

  const filteredFeeds = feeds.filter(feed => {
    if (filterType === 'all') return true;
    return feed.source === `tmdb_${filterType}`;
  });

  const handleFilterChange = (filter: 'all' | 'today' | 'weekly' | 'monthly' | 'anniversary') => {
    haptics.light();
    setFilterType(filter);
  };

  const handleUpdateFeed = (feedId: string, updates: any) => {
    setFeeds(prevFeeds =>
      prevFeeds.map(feed =>
        feed.id === feedId ? { ...feed, ...updates } : feed
      )
    );
  };

  const handleDeleteFeed = (feedId: string) => {
    setFeeds(prevFeeds => prevFeeds.filter(feed => feed.id !== feedId));
  };

  const handleRefresh = () => {
    haptics.light();
    setIsRefreshing(true);
    toast.success('Refreshed TMDb Feeds');
    
    // Simulate refresh animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 dark:text-white mb-2">TMDb Feeds</h1>
        <p className="text-gray-600 dark:text-[#9CA3AF]">
          Automated movie & TV show discovery and scheduling
        </p>
      </div>

      {/* Stats Panel */}
      <TMDbStatsPanel feeds={feeds} onFilterChange={handleFilterChange} />

      {/* View Controls */}
      <div className="bg-white dark:bg-[#000000] rounded-2xl border border-gray-200 dark:border-[#333333] p-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            All Feeds
          </button>
          <button
            onClick={() => handleFilterChange('today')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filterType === 'today'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handleFilterChange('weekly')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filterType === 'weekly'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => handleFilterChange('monthly')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filterType === 'monthly'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handleFilterChange('anniversary')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filterType === 'anniversary'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Anniversaries
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 dark:text-white">
            Scheduled Posts ({filteredFeeds.length})
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                haptics.light();
                onNavigate('tmdb-activity');
              }}
              className="!bg-white dark:!bg-[#000000] !text-gray-900 dark:!text-white border-gray-300 dark:border-[#333333]"
            >
              View Activity
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="!bg-white dark:!bg-[#000000] !text-gray-900 dark:!text-white border-gray-300 dark:border-[#333333]"
            >
              <RefreshCw className={`w-4 h-4 transition-transform duration-1000 ${isRefreshing ? 'rotate-[360deg]' : ''}`} />
            </Button>
          </div>
        </div>
        {filteredFeeds.length > 0 ? (
          filteredFeeds.map((feed) => (
            <TMDbFeedCard 
              key={feed.id} 
              feed={feed}
              onUpdate={handleUpdateFeed}
              onDelete={handleDeleteFeed}
            />
          ))
        ) : (
          <div className="bg-[#000000] rounded-2xl border border-gray-200 dark:border-[#333333] p-12 text-center">
            <Clapperboard className="w-12 h-12 text-gray-400 dark:text-[#9CA3AF] mx-auto mb-4" />
            <h3 className="text-gray-900 dark:text-white mb-2">No {filterType !== 'all' ? filterType : ''} feeds scheduled</h3>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
              {filterType !== 'all' 
                ? `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} feeds will appear here automatically when generated.`
                : 'Feeds will appear here automatically based on your TMDb settings.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}