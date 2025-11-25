import { Calendar, Clock, Film, TrendingUp, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { haptics } from '../../utils/haptics';
import { toast } from 'sonner@2.0.3';
import { useState, useEffect } from 'react';

export function TMDbScheduler() {
  const [refreshDay, setRefreshDay] = useState('1'); // 1 = Monday
  const [refreshTime, setRefreshTime] = useState('06:00');

  // Load saved settings
  useEffect(() => {
    const savedDay = localStorage.getItem('tmdb_refresh_day');
    const savedTime = localStorage.getItem('tmdb_refresh_time');
    if (savedDay) setRefreshDay(savedDay);
    if (savedTime) setRefreshTime(savedTime);
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem('tmdb_refresh_day', refreshDay);
    localStorage.setItem('tmdb_refresh_time', refreshTime);
  }, [refreshDay, refreshTime]);

  const dayNames: Record<string, string> = {
    '0': 'Sunday',
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday',
    '6': 'Saturday',
  };

  // Calculate next refresh based on selected day and time
  const getNextRefresh = () => {
    const now = new Date();
    const [hours, minutes] = refreshTime.split(':').map(Number);
    const targetDay = parseInt(refreshDay);
    const currentDay = now.getDay();
    
    let daysUntil = targetDay - currentDay;
    if (daysUntil < 0) daysUntil += 7;
    if (daysUntil === 0) {
      const targetTime = new Date(now);
      targetTime.setHours(hours, minutes, 0, 0);
      if (targetTime <= now) daysUntil = 7;
    }
    
    const nextRefresh = new Date(now);
    nextRefresh.setDate(now.getDate() + daysUntil);
    nextRefresh.setHours(hours, minutes, 0, 0);
    return nextRefresh;
  };

  // Calculate last refresh
  const getLastRefresh = () => {
    const now = new Date();
    const [hours, minutes] = refreshTime.split(':').map(Number);
    const targetDay = parseInt(refreshDay);
    const currentDay = now.getDay();
    
    let daysSince = currentDay - targetDay;
    if (daysSince < 0) daysSince += 7;
    if (daysSince === 0) {
      const targetTime = new Date(now);
      targetTime.setHours(hours, minutes, 0, 0);
      if (targetTime > now) daysSince = 7;
    }
    
    const lastRefresh = new Date(now);
    lastRefresh.setDate(now.getDate() - daysSince);
    lastRefresh.setHours(hours, minutes, 0, 0);
    return lastRefresh;
  };

  // Calculate time until next refresh
  const getTimeUntilRefresh = () => {
    const now = new Date();
    const nextRefresh = getNextRefresh();
    const diffMs = nextRefresh.getTime() - now.getTime();
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `in ${days}d ${hours}h`;
    } else if (hours > 0) {
      return `in ${hours}h`;
    } else {
      return 'soon';
    }
  };

  const lastRefresh = getLastRefresh();
  const nextRefresh = getNextRefresh();
  const timeUntilRefresh = getTimeUntilRefresh();

  return (
    <div className="bg-white dark:bg-[#000000] rounded-2xl border border-gray-200 dark:border-[#333333] p-6">
      <div className="mb-6">
        <h3 className="text-gray-900 dark:text-white mb-1">Feed Refresh Schedule</h3>
        <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
          Every {dayNames[refreshDay]} at {refreshTime} UTC
        </p>
      </div>

      {/* Schedule Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="refresh-day" className="text-[#9CA3AF] text-sm mb-2 block">Refresh Day</Label>
          <Select
            value={refreshDay}
            onValueChange={(value) => {
              haptics.light();
              setRefreshDay(value);
              toast.success(`Refresh day changed to ${dayNames[value]}`);
            }}
          >
            <SelectTrigger id="refresh-day" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sunday</SelectItem>
              <SelectItem value="1">Monday</SelectItem>
              <SelectItem value="2">Tuesday</SelectItem>
              <SelectItem value="3">Wednesday</SelectItem>
              <SelectItem value="4">Thursday</SelectItem>
              <SelectItem value="5">Friday</SelectItem>
              <SelectItem value="6">Saturday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="refresh-time" className="text-[#9CA3AF] text-sm mb-2 block">Refresh Time (UTC)</Label>
          <Select
            value={refreshTime}
            onValueChange={(value) => {
              haptics.light();
              setRefreshTime(value);
              toast.success(`Refresh time changed to ${value} UTC`);
            }}
          >
            <SelectTrigger id="refresh-time" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, '0');
                return (
                  <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                    {hour}:00
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Refresh Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500 dark:text-[#9CA3AF]" />
            <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Last Refresh</span>
          </div>
          <p className="text-gray-900 dark:text-white">
            {lastRefresh.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-[#9CA3AF]" />
            <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Next Refresh</span>
          </div>
          <p className="text-gray-900 dark:text-white">
            {nextRefresh.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">{timeUntilRefresh}</p>
        </div>
      </div>

      {/* Distribution Logic */}
      <div className="space-y-4">
        <h4 className="text-sm text-gray-900 dark:text-white">Distribution Strategy</h4>
        
        {/* Today Feeds */}
        <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-500 dark:text-[#9CA3AF] mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-gray-900 dark:text-white">Today Feeds</h5>
                <span className="text-xs text-gray-600 dark:text-[#9CA3AF] bg-gray-200 dark:bg-[#1A1A1A] px-2 py-1 rounded-lg">
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
        <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-gray-500 dark:text-[#9CA3AF] mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-gray-900 dark:text-white">Weekly Feeds</h5>
                <span className="text-xs text-gray-600 dark:text-[#9CA3AF] bg-gray-200 dark:bg-[#1A1A1A] px-2 py-1 rounded-lg">
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
        <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
          <div className="flex items-start gap-3">
            <Film className="w-5 h-5 text-gray-500 dark:text-[#9CA3AF] mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-gray-900 dark:text-white">Monthly Feeds</h5>
                <span className="text-xs text-gray-600 dark:text-[#9CA3AF] bg-gray-200 dark:bg-[#1A1A1A] px-2 py-1 rounded-lg">
                  1-3 Posts/Day
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF] mb-2">
                Releases 1 month away (refreshed weekly)
              </p>
              <div className="text-xs text-gray-500 dark:text-[#6B7280] space-y-1">
                <div>• Updated every {dayNames[refreshDay]} with new 1-month forecast</div>
                <div>• Distributed evenly across the week</div>
                <div>• 1 hour minimum gap between any posts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Anniversary Feeds */}
        <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-gray-500 dark:text-[#9CA3AF] mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-gray-900 dark:text-white">Anniversary Feeds</h5>
                <span className="text-xs text-gray-600 dark:text-[#9CA3AF] bg-gray-200 dark:bg-[#1A1A1A] px-2 py-1 rounded-lg">
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