import { useState } from 'react';
import { Clapperboard, RefreshCw } from 'lucide-react';
import { TMDbStatsPanel } from './tmdb/TMDbStatsPanel';
import { TMDbFeedCard } from './tmdb/TMDbFeedCard';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';
import { toast } from 'sonner';
import { useTMDbPosts } from '../contexts/TMDbPostsContext';

interface TMDbFeedsPageProps {
  onNavigate: (page: string) => void;
  previousPage?: string | null;
}

export function TMDbFeedsPage({ onNavigate, previousPage }: TMDbFeedsPageProps) {
  const { posts, updatePost, deletePost } = useTMDbPosts();
  const [filterType, setFilterType] = useState<'all' | 'today' | 'weekly' | 'monthly' | 'anniversary'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter posts to show only queued and scheduled ones (not published/failed)
  const feeds = posts.filter(post => post.status === 'queued' || post.status === 'scheduled');

  const filteredFeeds = feeds.filter(feed => {
    if (filterType === 'all') return true;
    return feed.source === `tmdb_${filterType}`;
  });

  const handleFilterChange = (filter: 'all' | 'today' | 'weekly' | 'monthly' | 'anniversary') => {
    haptics.light();
    setFilterType(filter);
  };

  const handleUpdateFeed = (feedId: string, updates: any) => {
    updatePost(feedId, updates);
  };

  const handleDeleteFeed = (feedId: string) => {
    deletePost(feedId);
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
                : 'bg-white dark:bg-black text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            All Feeds
          </button>
          <button
            onClick={() => handleFilterChange('today')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filterType === 'today'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handleFilterChange('weekly')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filterType === 'weekly'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => handleFilterChange('monthly')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filterType === 'monthly'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handleFilterChange('anniversary')}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filterType === 'anniversary'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-[#9CA3AF]'
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
          <div className="bg-white dark:bg-[#000000] rounded-2xl border border-gray-200 dark:border-[#333333] p-12 text-center">
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