import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';
import { toast } from 'sonner';

interface QueueItem {
  id: string;
  feedName: string;
  title: string;
  status: 'queued' | 'published' | 'failed';
  timestamp: string;
  platforms?: string[];
  error?: string;
}

interface RSSActivityPageProps {
  onNavigate: (page: string) => void;
  previousPage?: string | null;
}

export function RSSActivityPage({ onNavigate, previousPage }: RSSActivityPageProps) {
  const [filter, setFilter] = useState<'all' | 'failures' | 'published' | 'pending'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [queueItems] = useState<QueueItem[]>([
    {
      id: 'queue-1',
      feedName: 'Variety',
      title: 'Dune: Part Three - Official Announcement',
      status: 'published',
      timestamp: '2 min ago',
      platforms: ['X', 'Threads'],
    },
    {
      id: 'queue-2',
      feedName: 'The Hollywood Reporter',
      title: 'Marvel Announces New Phase 6 Projects',
      status: 'published',
      timestamp: '5 min ago',
    },
    {
      id: 'queue-3',
      feedName: 'Deadline',
      title: 'Christopher Nolan Next Film Details',
      status: 'published',
      timestamp: '10 min ago',
    },
    {
      id: 'queue-4',
      feedName: 'IndieWire',
      title: 'Sundance 2025 Lineup Revealed',
      status: 'failed',
      timestamp: '15 min ago',
      error: 'Failed to fetch images from Serper API',
    },
    {
      id: 'queue-5',
      feedName: 'Variety',
      title: 'Avatar 3 Gets New Release Date',
      status: 'queued',
      timestamp: '20 min ago',
    },
    {
      id: 'queue-6',
      feedName: 'The Hollywood Reporter',
      title: 'Netflix Drops First Look at The Witcher Season 4',
      status: 'published',
      timestamp: '25 min ago',
      platforms: ['X', 'Facebook'],
    },
    {
      id: 'queue-7',
      feedName: 'Deadline',
      title: 'Sony Pictures Announces Spider-Man 4',
      status: 'published',
      timestamp: '35 min ago',
      platforms: ['X', 'Threads', 'Instagram'],
    },
    {
      id: 'queue-8',
      feedName: 'Variety',
      title: 'Barbie 2 Confirmed by Warner Bros',
      status: 'failed',
      timestamp: '42 min ago',
      error: 'Rate limit exceeded on OpenAI API',
    },
    {
      id: 'queue-9',
      feedName: 'The Hollywood Reporter',
      title: 'James Cameron to Direct Avatar 4 and 5',
      status: 'published',
      timestamp: '1 hour ago',
      platforms: ['X'],
    },
    {
      id: 'queue-10',
      feedName: 'IndieWire',
      title: 'Cannes Film Festival 2025 Lineup Announced',
      status: 'published',
      timestamp: '1 hour ago',
    },
  ]);

  const filteredItems = queueItems.filter((item) => {
    if (filter === 'failures') return item.status === 'failed';
    if (filter === 'published') return item.status === 'published';
    if (filter === 'pending') return item.status === 'queued';
    return true;
  });

  const getStatusConfig = (status: QueueItem['status']) => {
    switch (status) {
      case 'queued':
        return { icon: Clock, color: 'text-gray-500 dark:text-[#9CA3AF]', bg: 'bg-gray-100 dark:bg-[#374151]', label: 'Queued' };
      case 'published':
        return { icon: CheckCircle, color: 'text-[#10B981]', bg: 'bg-[#D1FAE5] dark:bg-[#065F46]', label: 'Published' };
      case 'failed':
        return { icon: XCircle, color: 'text-[#EF4444]', bg: 'bg-[#FEE2E2] dark:bg-[#991B1B]', label: 'Failed' };
    }
  };

  const handleRetry = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation(); // Prevent triggering the parent button click
    haptics.medium();
    toast.success('Retry Initiated', {
      description: `Retrying RSS feed: "${title}"`,
    });
    // Add logic to retry the RSS feed processing here
  };

  const handleRefresh = () => {
    haptics.light();
    setIsRefreshing(true);
    toast.success('Refreshed RSS Activity');
    
    // Simulate refresh animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          <button
            onClick={() => {
              haptics.light();
              onNavigate(previousPage || 'rss');
            }}
            className="text-gray-900 dark:text-white hover:text-[#ec1e24] p-2 -ml-2 mt-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12H2M9 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900 dark:text-white mb-2">RSS Activity</h1>
            <p className="text-[#6B7280] dark:text-[#9CA3AF]">
              Track all RSS feed processing activity and status
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="!bg-white dark:!bg-[#000000] !text-gray-900 dark:!text-white border-gray-300 dark:border-[#333333] mt-1"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-1000 ${isRefreshing ? 'rotate-[360deg]' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Total Processed</p>
          <p className="text-gray-900 dark:text-white text-2xl">{queueItems.length}</p>
        </div>
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Published</p>
          <p className="text-gray-900 dark:text-white text-2xl">
            {queueItems.filter(item => item.status === 'published').length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Pending</p>
          <p className="text-gray-900 dark:text-white text-2xl">
            {queueItems.filter(item => item.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Failed</p>
          <p className="text-gray-900 dark:text-white text-2xl">
            {queueItems.filter(item => item.status === 'failed').length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200">
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'published', label: 'Published' },
            { value: 'pending', label: 'Pending' },
            { value: 'failures', label: 'Failures' },
          ].map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => {
                haptics.light();
                setFilter(filterOption.value as any);
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === filterOption.value
                  ? 'bg-[#ec1e24] text-white'
                  : 'bg-gray-100 dark:bg-[#000000] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#1F1F1F]'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-[#6B7280] dark:text-[#9CA3AF]">
              No items to display
            </div>
          ) : (
            filteredItems.map((item) => {
              const statusConfig = getStatusConfig(item.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={item.id}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-[#333333] bg-gray-50 dark:bg-[#000000] shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white mb-1">{item.title}</p>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">
                        <span>{item.feedName}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                      {item.platforms && item.platforms.length > 0 && (
                        <div className="flex items-center gap-1.5 mb-2">
                          {item.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-[#1F1F1F] text-gray-700 dark:text-[#9CA3AF]"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.error && (
                        <p className="text-sm text-[#EF4444] mt-1">{item.error}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${statusConfig.bg} ${statusConfig.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </span>
                      {item.status === 'failed' && (
                        <Button
                          onClick={(e) => handleRetry(e, item.id, item.title)}
                          size="sm"
                          variant="outline"
                          className="gap-2 bg-white dark:bg-black"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}