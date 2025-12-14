import { useState } from 'react';
import { Clapperboard, RefreshCw } from 'lucide-react';
import { TMDbStatsPanel } from './tmdb/TMDbStatsPanel';
import { TMDbFeedCard } from './tmdb/TMDbFeedCard';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';
import { toast } from 'sonner@2.0.3';
import { useTMDbPosts } from '../contexts/TMDbPostsContext';
import { useUndo } from './UndoContext';

interface TMDbFeedsPageProps {
  onNavigate: (page: string) => void;
  previousPage?: string | null;
}

export function TMDbFeedsPage({ onNavigate, previousPage }: TMDbFeedsPageProps) {
  const { posts, updatePost, deletePost, restorePost } = useTMDbPosts();
  const { showUndo } = useUndo();
  const [filterType, setFilterType] = useState<'all' | 'today' | 'weekly' | 'monthly' | 'anniversary'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mockup feeds to demonstrate poster vs backdrop
  const mockupFeeds = [
    {
      id: 'mockup-poster-1',
      tmdbId: 603692,
      mediaType: 'movie' as const,
      title: 'John Wick: Chapter 4',
      year: 2023,
      releaseDate: '2023-03-24',
      caption: '🎬 John Wick: Chapter 4 (2023) - The legendary assassin returns for one final mission! Witness the epic conclusion.',
      imageUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
      imageType: 'poster' as const,
      scheduledTime: new Date(Date.now() + 86400000).toISOString(),
      source: 'tmdb_weekly' as const,
      cast: ['Keanu Reeves', 'Donnie Yen', 'Bill Skarsgård'],
      popularity: 2847.32,
      cacheHit: true,
      status: 'queued' as const,
    },
    {
      id: 'mockup-backdrop-1',
      tmdbId: 603692,
      mediaType: 'movie' as const,
      title: 'John Wick: Chapter 4',
      year: 2023,
      releaseDate: '2023-03-24',
      caption: '🎬 John Wick: Chapter 4 (2023) - The legendary assassin returns for one final mission! Witness the epic conclusion.',
      imageUrl: 'https://image.tmdb.org/t/p/w1280/fypydCipcWDKDTTCoPucBsdGYXW.jpg',
      imageType: 'backdrop' as const,
      scheduledTime: new Date(Date.now() + 86400000).toISOString(),
      source: 'tmdb_weekly' as const,
      cast: ['Keanu Reeves', 'Donnie Yen', 'Bill Skarsgård'],
      popularity: 2847.32,
      cacheHit: true,
      status: 'queued' as const,
    },
    {
      id: 'mockup-poster-2',
      tmdbId: 693134,
      mediaType: 'movie' as const,
      title: 'Dune: Part Two',
      year: 2024,
      releaseDate: '2024-02-27',
      caption: '🏜️ Dune: Part Two (2024) - Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family.',
      imageUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      imageType: 'poster' as const,
      scheduledTime: new Date(Date.now() + 172800000).toISOString(),
      source: 'tmdb_today' as const,
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
      popularity: 3421.18,
      cacheHit: true,
      status: 'queued' as const,
    },
    {
      id: 'mockup-backdrop-2',
      tmdbId: 693134,
      mediaType: 'movie' as const,
      title: 'Dune: Part Two',
      year: 2024,
      releaseDate: '2024-02-27',
      caption: '🏜️ Dune: Part Two (2024) - Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family.',
      imageUrl: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
      imageType: 'backdrop' as const,
      scheduledTime: new Date(Date.now() + 172800000).toISOString(),
      source: 'tmdb_today' as const,
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
      popularity: 3421.18,
      cacheHit: true,
      status: 'queued' as const,
    },
  ];

  // Filter posts to show only queued and scheduled ones (not published/failed)
  const feeds = posts.filter(post => post.status === 'queued' || post.status === 'scheduled');

  // Combine mockup feeds with actual feeds, removing duplicates by ID
  const allFeeds = [...mockupFeeds, ...feeds];
  
  // Remove duplicate IDs (keep first occurrence)
  const uniqueFeeds = allFeeds.filter((feed, index, self) => 
    index === self.findIndex((f) => f.id === feed.id)
  );

  const filteredFeeds = uniqueFeeds.filter(feed => {
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
    haptics.medium();
    
    // Find the post and its index to delete
    const postIndex = posts.findIndex(post => post.id === feedId);
    const deletedPost = posts.find(post => post.id === feedId);
    if (!deletedPost || postIndex === -1) return;
    
    // Store the original index
    const originalIndex = postIndex;
    
    // Temporarily remove from state
    deletePost(feedId);
    
    // Show undo toast
    showUndo({
      id: feedId,
      itemName: deletedPost.title,
      onUndo: () => {
        // Restore the post at its original position
        restorePost(deletedPost, originalIndex);
      },
      onConfirm: () => {
        // Show final confirmation
        toast.success('Feed deleted successfully');
      }
    });
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
      <div className="bg-white dark:bg-[#000000] rounded-2xl border border-gray-200 dark:border-[#333333] shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-4">
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