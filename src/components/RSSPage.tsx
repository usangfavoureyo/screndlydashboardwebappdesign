import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FeedCard, Feed } from './rss/FeedCard';
import { FeedEditor } from './rss/FeedEditor';
import { FeedPreview } from './rss/FeedPreview';
import { haptics } from '../utils/haptics';
import { toast } from 'sonner';

interface RSSPageProps {
  onNavigate?: (page: string) => void;
}

export function RSSPage({ onNavigate }: RSSPageProps) {
  const [globalEnabled, setGlobalEnabled] = useState(false);
  const [postingInterval, setPostingInterval] = useState('10');
  const [deduplication, setDeduplication] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [feeds, setFeeds] = useState<Feed[]>([
    {
      id: 'feed-1',
      name: 'Variety - Film News',
      url: 'https://variety.com/feed/',
      enabled: true,
      interval: 10,
      imageCount: '2',
      dedupeDays: 30,
      filters: {
        scope: 'title_or_body',
        required: [
          { text: 'trailer', matchType: 'contains', caseSensitive: false, active: true },
          { text: 'teaser', matchType: 'contains', caseSensitive: false, active: true },
        ],
        blocked: [
          { text: 'leak', matchType: 'contains', caseSensitive: false, active: true },
        ],
      },
      serperPriority: true,
      rehostImages: false,
      lastProcessedAt: '2 min ago',
      nextRunAt: '8 min',
      platformsEnabled: { x: true, threads: true, facebook: false },
      autoPost: true,
      status: 'active',
      favicon: 'https://variety.com/favicon.ico',
    },
    {
      id: 'feed-2',
      name: 'The Hollywood Reporter',
      url: 'https://www.hollywoodreporter.com/feed/',
      enabled: true,
      interval: 15,
      imageCount: '3',
      dedupeDays: 30,
      filters: {
        scope: 'title',
        required: [
          { text: 'announces', matchType: 'contains', caseSensitive: false, active: true },
        ],
        blocked: [],
      },
      serperPriority: true,
      rehostImages: true,
      lastProcessedAt: '5 min ago',
      nextRunAt: '10 min',
      platformsEnabled: { x: true, threads: false, facebook: true },
      autoPost: true,
      status: 'active',
    },
    {
      id: 'feed-3',
      name: 'Deadline - Movies',
      url: 'https://deadline.com/category/movies/feed/',
      enabled: false,
      interval: 10,
      imageCount: 'random',
      dedupeDays: 30,
      filters: {
        scope: 'title_or_body',
        required: [],
        blocked: [
          { text: 'spoiler', matchType: 'contains', caseSensitive: false, active: true },
        ],
      },
      serperPriority: false,
      rehostImages: false,
      lastProcessedAt: '1 hour ago',
      platformsEnabled: { x: false, threads: true, facebook: false },
      autoPost: false,
      status: 'paused',
    },
    {
      id: 'feed-4',
      name: 'IndieWire',
      url: 'https://www.indiewire.com/feed/',
      enabled: true,
      interval: 30,
      imageCount: '1',
      dedupeDays: 30,
      filters: {
        scope: 'title_or_body',
        required: [
          { text: 'festival', matchType: 'contains', caseSensitive: false, active: true },
          { text: 'premiere', matchType: 'contains', caseSensitive: false, active: true },
        ],
        blocked: [],
      },
      serperPriority: true,
      rehostImages: false,
      lastProcessedAt: 'Never',
      nextRunAt: '30 min',
      platformsEnabled: { x: true, threads: true, facebook: false },
      autoPost: true,
      status: 'error',
    },
  ]);

  const [queueItems] = useState([
    {
      id: 'queue-1',
      feedName: 'Variety',
      title: 'Dune: Part Three - Official Announcement',
      status: 'published' as const,
      timestamp: '2 min ago',
      platforms: ['X', 'Threads'],
    },
    {
      id: 'queue-2',
      feedName: 'The Hollywood Reporter',
      title: 'Marvel Announces New Phase 6 Projects',
      status: 'captioned' as const,
      timestamp: '5 min ago',
    },
    {
      id: 'queue-3',
      feedName: 'Deadline',
      title: 'Christopher Nolan Next Film Details',
      status: 'enriched' as const,
      timestamp: '10 min ago',
    },
    {
      id: 'queue-4',
      feedName: 'IndieWire',
      title: 'Sundance 2025 Lineup Revealed',
      status: 'failed' as const,
      timestamp: '15 min ago',
      error: 'Failed to fetch images from Serper API',
    },
    {
      id: 'queue-5',
      feedName: 'Variety',
      title: 'Avatar 3 Gets New Release Date',
      status: 'queued' as const,
      timestamp: '20 min ago',
    },
    {
      id: 'queue-6',
      feedName: 'The Hollywood Reporter',
      title: 'Netflix Drops First Look at The Witcher Season 4',
      status: 'published' as const,
      timestamp: '25 min ago',
      platforms: ['X', 'Facebook'],
    },
  ]);

  const filteredFeeds = feeds.filter((feed) =>
    feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feed.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFeed = () => {
    haptics.medium();
    setSelectedFeed(null);
    setIsEditorOpen(true);
  };

  const handleEditFeed = (id: string) => {
    const feed = feeds.find((f) => f.id === id);
    if (feed) {
      setSelectedFeed(feed);
      setIsEditorOpen(true);
    }
  };

  const handleDeleteFeed = (id: string) => {
    haptics.medium();
    setFeeds(feeds.filter((f) => f.id !== id));
    toast.success('Feed deleted successfully');
  };

  const handleSaveFeed = async (feed: Feed) => {
    if (feed.id && feeds.find((f) => f.id === feed.id)) {
      // Update existing feed
      setFeeds(feeds.map((f) => (f.id === feed.id ? feed : f)));
      toast.success('Feed updated successfully');
    } else {
      // Add new feed
      setFeeds([...feeds, feed]);
      toast.success('Feed added successfully');
    }
  };

  const handlePreview = (id: string) => {
    // Mock preview data
    setPreviewData({
      title: 'Dune: Part Three Confirmed by Warner Bros.',
      link: 'https://variety.com/2024/film/news/dune-part-three-confirmed-1234567890/',
      pubDate: '2 hours ago',
      snippet: 'Warner Bros. has officially confirmed that Dune: Part Three is in development, with Denis Villeneuve returning to direct...',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
          reason: 'Poster match',
        },
        {
          url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
          reason: 'Scene imagery',
        },
      ],
      caption: 'BREAKING: Warner Bros. confirms Dune: Part Three is officially happening! 🎬\n\nDenis Villeneuve returns to complete the epic trilogy. Production details coming soon.\n\n#Dune #DunePartThree #Movies',
      captionCharCount: 147,
    });
    setIsPreviewOpen(true);
  };

  const handleTest = async (id: string) => {
    // Simulate test
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        toast.success('Feed test passed! Found 3 matching items with valid images.');
        resolve();
      }, 1500);
    });
  };

  const handleTogglePlatform = (feedId: string, platform: string, enabled: boolean) => {
    setFeeds(
      feeds.map((f) =>
        f.id === feedId
          ? {
              ...f,
              platformsEnabled: {
                ...f.platformsEnabled,
                [platform]: enabled,
              },
            }
          : f
      )
    );
  };

  const handleToggleEnabled = (feedId: string, enabled: boolean) => {
    setFeeds(
      feeds.map((f) =>
        f.id === feedId
          ? {
              ...f,
              enabled,
              status: enabled ? 'active' : 'paused',
            }
          : f
      )
    );
    toast.info(enabled ? 'Feed activated' : 'Feed paused');
  };

  const handleRunNow = (feedId: string) => {
    const feed = feeds.find((f) => f.id === feedId);
    if (feed) {
      toast.success(`Running ${feed.name} now...`);
    }
  };

  const handleQueueItemClick = (id: string) => {
    // Navigate to logs page with filter
    if (onNavigate) {
      onNavigate('logs');
    }
  };

  const handleNavigateToLogs = () => {
    if (onNavigate) {
      onNavigate('logs');
    }
  };

  const activeFeeds = feeds.filter((f) => f.status === 'active').length;
  const totalItems = queueItems.length;
  const publishedToday = queueItems.filter((i) => i.status === 'published').length;
  const failedItems = queueItems.filter((i) => i.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 dark:text-white mb-2">RSS Feeds</h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF]">
          Automated feed ingestion and posting
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Total Feeds</p>
          <p className="text-gray-900 dark:text-white text-2xl">{feeds.length}</p>
        </div>
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Active</p>
          <p className="text-gray-900 dark:text-white text-2xl">{activeFeeds}</p>
        </div>
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Published Today</p>
          <p className="text-gray-900 dark:text-white text-2xl">{publishedToday}</p>
        </div>
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Errors</p>
          <p className="text-gray-900 dark:text-white text-2xl">{failedItems}</p>
        </div>
      </div>

      {/* Global Controls */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <Button
            onClick={handleAddFeed}
            className="bg-[#ec1e24] hover:bg-[#ec1e24]/90 text-white lg:order-last"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Feed
          </Button>

          <div className="flex items-center gap-4 flex-wrap flex-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-white text-sm whitespace-nowrap">Global RSS Posting</span>
              <Switch
                checked={globalEnabled}
                onCheckedChange={(checked) => {
                  haptics.light();
                  setGlobalEnabled(checked);
                  toast.info(checked ? 'RSS posting enabled globally' : 'RSS posting disabled globally');
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-white text-sm whitespace-nowrap">Posting Interval</span>
              <Select value={postingInterval} onValueChange={setPostingInterval}>
                <SelectTrigger className="w-32 bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 min</SelectItem>
                  <SelectItem value="10">10 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-white text-sm whitespace-nowrap">Deduplication</span>
              <Switch
                checked={deduplication}
                onCheckedChange={(checked) => {
                  haptics.light();
                  setDeduplication(checked);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feeds Section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Feeds List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 dark:text-white">
                Feeds ({feeds.length})
              </h3>
              <Button
                variant="outline"
                onClick={() => {
                  haptics.light();
                  if (onNavigate) {
                    onNavigate('rss-activity');
                  }
                }}
                className="!bg-white dark:!bg-[#000000] !text-gray-900 dark:!text-white border-gray-300 dark:border-[#333333]"
              >
                View Activity
              </Button>
            </div>
            {feeds.length === 0 ? (
              <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm p-12 text-center">
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                  No feeds configured yet
                </p>
                <Button
                  onClick={handleAddFeed}
                  className="mt-4 bg-[#ec1e24] hover:bg-[#ec1e24]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Feed
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feeds.map((feed) => (
                  <FeedCard
                    key={feed.id}
                    feed={feed}
                    onEdit={handleEditFeed}
                    onDelete={handleDeleteFeed}
                    onPreview={handlePreview}
                    onTest={handleTest}
                    onTogglePlatform={handleTogglePlatform}
                    onToggleEnabled={handleToggleEnabled}
                    onRunNow={handleRunNow}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feed Editor */}
      <FeedEditor
        feed={selectedFeed}
        onSave={handleSaveFeed}
        onDelete={handleDeleteFeed}
        onClose={() => setIsEditorOpen(false)}
        isOpen={isEditorOpen}
      />

      {/* Feed Preview */}
      <FeedPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        preview={previewData}
        onRunPipeline={() => {
          toast.success('Pipeline test started. Check the queue for results.');
          setIsPreviewOpen(false);
        }}
      />
    </div>
  );
}