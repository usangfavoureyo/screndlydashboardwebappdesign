import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, RefreshCw, Clapperboard, Calendar, Send, Trash2, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { DatePicker } from './ui/date-picker';
import { TimePicker } from './ui/time-picker';
import { haptics } from '../utils/haptics';
import { toast } from 'sonner';
import { useTMDbPosts } from '../contexts/TMDbPostsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';

interface TMDbActivityItem {
  id: string;
  title: string;
  mediaType: 'movie' | 'tv';
  source: 'tmdb_today' | 'tmdb_weekly' | 'tmdb_monthly' | 'tmdb_anniversary';
  status: 'queued' | 'published' | 'failed' | 'scheduled';
  timestamp: string;
  platforms?: string[];
  error?: string;
  imageUrl?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

interface TMDbActivityPageProps {
  onNavigate: (page: string) => void;
  previousPage?: string | null;
}

export function TMDbActivityPage({ onNavigate, previousPage }: TMDbActivityPageProps) {
  const { posts, reschedulePost, updatePostStatus, deletePost } = useTMDbPosts();
  const [filter, setFilter] = useState<'all' | 'failures' | 'published' | 'pending' | 'scheduled'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isChangeDateOpen, setIsChangeDateOpen] = useState(false);
  const [isChangeTimeOpen, setIsChangeTimeOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');

  const filteredItems = posts.filter((item) => {
    if (filter === 'failures') return item.status === 'failed';
    if (filter === 'published') return item.status === 'published';
    if (filter === 'pending') return item.status === 'queued';
    if (filter === 'scheduled') return item.status === 'scheduled';
    return true;
  });

  const getStatusConfig = (status: TMDbActivityItem['status']) => {
    switch (status) {
      case 'queued':
        return { icon: Clock, color: 'text-gray-700 dark:text-[#9CA3AF]', bg: 'bg-gray-200 dark:bg-[#1f1f1f]', label: 'Queued' };
      case 'published':
        return { icon: CheckCircle, color: 'text-gray-700 dark:text-[#9CA3AF]', bg: 'bg-gray-200 dark:bg-[#1f1f1f]', label: 'Published' };
      case 'failed':
        return { icon: XCircle, color: 'text-[#EF4444]', bg: 'bg-[#FEE2E2] dark:bg-[#991B1B]', label: 'Failed' };
      case 'scheduled':
        return { icon: Calendar, color: 'text-gray-700 dark:text-[#9CA3AF]', bg: 'bg-gray-200 dark:bg-[#1f1f1f]', label: 'Scheduled' };
    }
  };

  const getSourceLabel = (source: TMDbActivityItem['source']) => {
    switch (source) {
      case 'tmdb_today':
        return 'Today';
      case 'tmdb_weekly':
        return 'Weekly';
      case 'tmdb_monthly':
        return 'Monthly';
      case 'tmdb_anniversary':
        return 'Anniversary';
    }
  };

  const handleRetry = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    haptics.medium();
    toast.success('Retry Initiated', {
      description: `Retrying TMDb feed: \"${title}\"`,
    });
    // Add logic to retry the TMDb feed processing here
  };

  const handlePostImmediately = (id: string, title: string) => {
    haptics.medium();
    toast.success('Posting Immediately', {
      description: `\"${title}\" will be posted now`,
    });
    // Add logic to post immediately
  };

  const handleDelete = (id: string, title: string) => {
    haptics.medium();
    deletePost(id);
    toast.success('Deleted', {
      description: `\"${title}\" has been removed`,
    });
  };

  const handleChangeScheduleDate = (id: string, title: string) => {
    haptics.light();
    setSelectedItemId(id);
    setIsChangeDateOpen(true);
  };

  const handleChangeScheduleTime = (id: string, title: string) => {
    haptics.light();
    setSelectedItemId(id);
    setIsChangeTimeOpen(true);
  };

  const handleRefresh = () => {
    haptics.light();
    setIsRefreshing(true);
    toast.success('Refreshed TMDb Activity');
    
    // Simulate refresh animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleSaveSchedule = () => {
    if (!selectedItemId) return;

    if (selectedDate && !selectedTime) {
      // Only date changed
      const newScheduledTime = new Date(`${selectedDate.toISOString().split('T')[0]}T12:00:00`).toISOString();
      reschedulePost(selectedItemId, newScheduledTime);
      toast.success('Schedule Updated');
    } else if (selectedTime && selectedDate) {
      // Both date and time changed
      const newScheduledTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00`).toISOString();
      reschedulePost(selectedItemId, newScheduledTime);
      toast.success('Schedule Updated');
    } else if (selectedTime) {
      // Only time changed - use the existing date
      const selectedPost = posts.find(p => p.id === selectedItemId);
      if (selectedPost) {
        const existingDate = new Date(selectedPost.scheduledTime);
        const newScheduledTime = new Date(`${existingDate.toISOString().split('T')[0]}T${selectedTime}:00`).toISOString();
        reschedulePost(selectedItemId, newScheduledTime);
        toast.success('Schedule Updated');
      }
    }
    
    setIsChangeDateOpen(false);
    setIsChangeTimeOpen(false);
    setSelectedDate(undefined);
    setSelectedTime('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          <button
            onClick={() => {
              haptics.light();
              onNavigate(previousPage || 'tmdb');
            }}
            className="text-gray-900 dark:text-white hover:text-[#ec1e24] p-2 -ml-2 mt-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12H2M9 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900 dark:text-white mb-2">TMDb Feeds Activity</h1>
            <p className="text-gray-600 dark:text-[#9CA3AF]">
              Track all TMDb feed processing status
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
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Total Posts</p>
          <p className="text-gray-900 dark:text-white text-2xl">{posts.length}</p>
        </div>
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Published</p>
          <p className="text-gray-900 dark:text-white text-2xl">
            {posts.filter(item => item.status === 'published').length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Pending</p>
          <p className="text-gray-900 dark:text-white text-2xl">
            {posts.filter(item => item.status === 'queued').length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Failures</p>
          <p className="text-gray-900 dark:text-white text-2xl">
            {posts.filter(item => item.status === 'failed').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#000000] rounded-2xl border border-gray-200 dark:border-[#333333] p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              haptics.light();
              setFilter('all');
            }}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => {
              haptics.light();
              setFilter('scheduled');
            }}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filter === 'scheduled'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => {
              haptics.light();
              setFilter('published');
            }}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filter === 'published'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => {
              haptics.light();
              setFilter('pending');
            }}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filter === 'pending'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => {
              haptics.light();
              setFilter('failures');
            }}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filter === 'failures'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Failures
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const statusConfig = getStatusConfig(item.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all duration-200"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  {item.imageUrl && (
                    <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-[#1A1A1A]">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0 flex flex-col">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 dark:text-white mb-2 line-clamp-2">{item.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-black dark:bg-white text-white dark:text-black">
                            {item.mediaType === 'movie' ? 'Movie' : 'TV'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-[#ec1e24] text-white">
                            {getSourceLabel(item.source)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-[#9CA3AF]">{item.timestamp}</span>
                      </div>
                      
                      {/* Status Badge and Retry Button */}
                      <div className="flex flex-col items-end gap-2">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg} flex-shrink-0`}>
                          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                          <span className={`text-sm ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        {item.status === 'failed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => handleRetry(e, item.id, item.title)}
                            className="gap-2 bg-white dark:bg-black"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Platforms */}
                    {item.platforms && item.platforms.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500 dark:text-[#9CA3AF]">{item.status === 'scheduled' ? 'Post to:' : 'Posted to:'}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.platforms.map((platform) => (
                            <span 
                              key={platform}
                              className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-[#1F1F1F] text-gray-700 dark:text-[#9CA3AF]"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {item.error && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-[#991B1B]/20 border border-red-200 dark:border-[#991B1B] rounded-lg mb-3">
                        <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-[#EF4444] flex-1">{item.error}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scheduled Date & Actions - Full Width Bar */}
                {item.status === 'scheduled' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#333333] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-[#9CA3AF]" />
                      <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">
                        Scheduled: <span className="text-gray-900 dark:text-white">
                          {new Date(item.scheduledTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {' at '}
                          {new Date(item.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#111111]"
                          onClick={() => haptics.light()}
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600 dark:text-[#9CA3AF]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333]">
                        <DropdownMenuItem
                          onClick={() => {
                            haptics.light();
                            handleChangeScheduleDate(item.id, item.title);
                          }}
                          className="cursor-pointer text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#111111]"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Change Date
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            haptics.light();
                            handleChangeScheduleTime(item.id, item.title);
                          }}
                          className="cursor-pointer text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#111111]"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Change Time
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            haptics.medium();
                            handlePostImmediately(item.id, item.title);
                          }}
                          className="cursor-pointer text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#111111]"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Post Now
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            haptics.medium();
                            handleDelete(item.id, item.title);
                          }}
                          className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm p-12 text-center">
            <Clapperboard className="w-12 h-12 text-gray-400 dark:text-[#9CA3AF] mx-auto mb-4" />
            <h3 className="text-gray-900 dark:text-white mb-2">No TMDb activity</h3>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
              {filter === 'all' 
                ? 'TMDb feed activity will appear here once posts are processed.'
                : `No ${filter} TMDb feeds found.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Change Date Dialog */}
      <Dialog open={isChangeDateOpen} onOpenChange={setIsChangeDateOpen} modal={false}>
        <DialogContent className="bg-white dark:bg-black" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Change Schedule Date</DialogTitle>
            <DialogDescription>
              Select a new date for the scheduled post
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="scheduled-date">Date</Label>
              <div className="mt-2">
                <DatePicker
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                  placeholder="Select a date"
                  className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333]"
                />
              </div>
            </div>
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-[#333333] rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#ec1e24] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-black dark:text-white">
                  Posts are automatically spaced to prevent overlap. The system will adjust if needed.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeDateOpen(false)} className="bg-white dark:bg-black border-gray-200 dark:border-[#333333]">
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule}>
              Save Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Time Dialog */}
      <Dialog open={isChangeTimeOpen} onOpenChange={setIsChangeTimeOpen} modal={false}>
        <DialogContent className="bg-white dark:bg-black" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Change Schedule Time</DialogTitle>
            <DialogDescription>
              Select a new time for the scheduled post
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="scheduled-time">Time</Label>
              <div className="mt-2">
                <TimePicker
                  value={selectedTime}
                  onChange={setSelectedTime}
                  className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333]"
                />
              </div>
            </div>
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-[#333333] rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#ec1e24] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-black dark:text-white">
                  Posts are automatically spaced to prevent overlap. The system will adjust if needed.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeTimeOpen(false)} className="bg-white dark:bg-black border-gray-200 dark:border-[#333333]">
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule}>
              Save Time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}