import { Calendar, Clock, RefreshCw, Film, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { haptics } from '../../utils/haptics';
import { toast } from 'sonner@2.0.3';

export function TMDbScheduler() {
  // Calculate next Monday 00:00
  const getNextMonday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // If Sunday, 1 day; else days to next Monday
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  };

  // Calculate time until next refresh
  const getTimeUntilRefresh = () => {
    const now = new Date();
    const nextMonday = getNextMonday();
    const diffMs = nextMonday.getTime() - now.getTime();
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const lastRefresh = new Date();
  lastRefresh.setDate(lastRefresh.getDate() - ((lastRefresh.getDay() + 6) % 7)); // Last Monday
  lastRefresh.setHours(0, 0, 0, 0);

  const nextRefresh = getNextMonday();
  const timeUntilRefresh = getTimeUntilRefresh();

  const handleManualRefresh = () => {
    haptics.light();
    toast.loading('Refreshing TMDb feeds...', { id: 'tmdb-refresh' });
    
    // Simulate refresh
    setTimeout(() => {
      toast.success('TMDb feeds refreshed successfully!', {
        id: 'tmdb-refresh',
        description: 'New feeds have been generated and scheduled',
      });
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-200 dark:border-[#333333] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 dark:text-white">Feed Refresh Schedule</h3>
          <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
            Every Monday at 00:00 UTC
          </p>
        </div>
        <Button
          onClick={handleManualRefresh}
          size="sm"
          className="bg-[#ec1e24] hover:bg-[#d11b20] text-white px-1 py-1.5 h-auto text-sm"
        >
          <RefreshCw className="w-4 h-4 mr-0.5" />
          Refresh Now
        </Button>
      </div>

      {/* Refresh Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500 dark:text-[#9CA3AF]" />
            <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Last Refresh</span>
          </div>
          <p className="text-xl text-gray-900 dark:text-white">
            {lastRefresh.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-[#ec1e24]" />
            <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Next Refresh</span>
          </div>
          <p className="text-xl text-gray-900 dark:text-white">
            {nextRefresh.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-xs text-[#ec1e24] mt-1">in {timeUntilRefresh}</p>
        </div>
      </div>

      {/* Distribution Logic */}
      <div className="space-y-4">
        <h4 className="text-sm text-gray-900 dark:text-white">Distribution Strategy</h4>
        
        {/* Today Feeds */}
        <div className="bg-blue-500/5 dark:bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500 rounded-lg mt-0.5">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-gray-900 dark:text-white">Today Feeds</h5>
                <span className="text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg">
                  Daily Release Day
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF] mb-2">
                Movies/TV shows releasing this week (Monday-Sunday)
              </p>
              <div className="text-xs text-gray-500 dark:text-[#6B7280] space-y-1">
                <div>• Posts scheduled on actual release day</div>
                <div>• 3 hours minimum gap between posts</div>
                <div>• Auto-posted to X, Threads, Facebook</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Feeds */}
        <div className="bg-green-500/5 dark:bg-green-500/10 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500 rounded-lg mt-0.5">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-gray-900 dark:text-white">Weekly Feeds</h5>
                <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                  2-3 Posts/Day
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF] mb-2">
                Upcoming releases for the next 7 days
              </p>
              <div className="text-xs text-gray-500 dark:text-[#6B7280] space-y-1">
                <div>• Distributed throughout the week</div>
                <div>• 1 hour minimum gap between any posts</div>
                <div>• No duplicate content within 30 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Feeds */}
        <div className="bg-purple-500/5 dark:bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500 rounded-lg mt-0.5">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-gray-900 dark:text-white">Monthly Feeds</h5>
                <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded-lg">
                  1-3 Posts/Day
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF] mb-2">
                Releases 1 month away (refreshed weekly)
              </p>
              <div className="text-xs text-gray-500 dark:text-[#6B7280] space-y-1">
                <div>• Updated every Monday with new 1-month forecast</div>
                <div>• Distributed evenly across the week</div>
                <div>• 1 hour minimum gap between any posts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Anniversary Feeds */}
        <div className="bg-orange-500/5 dark:bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-500 rounded-lg mt-0.5">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-gray-900 dark:text-white">Anniversary Feeds</h5>
                <span className="text-xs text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg">
                  2-3 Posts/Day
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF] mb-2">
                Milestone anniversaries (5, 10, 15, 20, 25+ years)
              </p>
              <div className="text-xs text-gray-500 dark:text-[#6B7280] space-y-1">
                <div>• Celebrates classic films and shows</div>
                <div>• Distributed throughout the week</div>
                <div>• 1 hour minimum gap between any posts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#333333]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl text-gray-900 dark:text-white mb-1">7</p>
            <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">Days Coverage</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-gray-900 dark:text-white mb-1">24</p>
            <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">Feeds Scheduled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-gray-900 dark:text-white mb-1">3</p>
            <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">Platforms</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-gray-900 dark:text-white mb-1">1h</p>
            <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">Min Gap</p>
          </div>
        </div>
      </div>
    </div>
  );
}