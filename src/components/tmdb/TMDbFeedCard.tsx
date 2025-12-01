import { useState } from 'react';
import { Calendar, Users, Star, Image as ImageIcon, Edit3, RefreshCw, Trash2, MoreVertical, Check, TrendingUp, X, Clock, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { DatePicker } from '../ui/date-picker';
import { TimePicker } from '../ui/time-picker';
import { haptics } from '../../utils/haptics';
import { toast } from 'sonner@2.0.3';
import { logFeedUpdate, logFeedDeletion } from '../../utils/tmdbLogger';
import { useTMDbPosts } from '../../contexts/TMDbPostsContext';
import { XIcon } from '../icons/XIcon';
import { ThreadsIcon } from '../icons/ThreadsIcon';
import { FacebookIcon } from '../icons/FacebookIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { VisuallyHidden } from '../ui/visually-hidden';

interface TMDbFeedCardProps {
  feed: {
    id: string;
    tmdbId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    year: number;
    releaseDate: string;
    caption: string;
    imageUrl: string;
    imageType: 'poster' | 'backdrop';
    scheduledTime: string;
    source: 'tmdb_weekly' | 'tmdb_monthly' | 'tmdb_anniversary' | 'tmdb_today';
    cast: string[];
    popularity: number;
    cacheHit: boolean;
  };
  onUpdate?: (feedId: string, updates: Partial<TMDbFeedCardProps['feed']>) => void;
  onDelete?: (feedId: string) => void;
}

export function TMDbFeedCard({ feed, onUpdate, onDelete }: TMDbFeedCardProps) {
  const { schedulePost } = useTMDbPosts();
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isEditCaptionOpen, setIsEditCaptionOpen] = useState(false);
  const [isChangeImageOpen, setIsChangeImageOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPlatformSelectOpen, setIsPlatformSelectOpen] = useState(false);
  const [isPostNowMode, setIsPostNowMode] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const [editedCaption, setEditedCaption] = useState(feed.caption);
  const [selectedImageType, setSelectedImageType] = useState<'poster' | 'backdrop'>(feed.imageType);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'tmdb_weekly':
        return 'Weekly';
      case 'tmdb_monthly':
        return 'Monthly';
      case 'tmdb_anniversary':
        return 'Anniversary';
      case 'tmdb_today':
        return "Today";
      default:
        return source;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'tmdb_weekly':
        return 'bg-[#ec1e24] text-white';
      case 'tmdb_monthly':
        return 'bg-[#ec1e24] text-white';
      case 'tmdb_anniversary':
        return 'bg-[#ec1e24] text-white';
      case 'tmdb_today':
        return 'bg-[#ec1e24] text-white';
      default:
        return 'bg-[#ec1e24] text-white';
    }
  };

  const handleApprove = () => {
    haptics.light();
    // Open platform selection dialog instead of just toggling approved status
    setIsPlatformSelectOpen(true);
  };

  const handlePostNow = () => {
    haptics.light();
    setIsPlatformSelectOpen(true);
    setIsPostNowMode(true);
  };

  const handleSchedule = () => {
    haptics.light();
    // Open schedule dialog
    const date = new Date(feed.scheduledTime);
    setScheduledDate(date);
    const timeStr = date.toTimeString().slice(0, 5);
    setScheduledTime(timeStr);
    setIsRescheduleOpen(true);
  };

  const handleSchedulePost = () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    // Schedule the post using the context
    schedulePost({
      ...feed,
      status: 'scheduled',
      platforms: selectedPlatforms,
    });

    haptics.success();
    toast.success('Post scheduled successfully');

    // Log the scheduling
    logFeedUpdate(
      feed.id,
      feed.title,
      'scheduled',
      'System',
      {
        tmdbId: feed.tmdbId,
        mediaType: feed.mediaType,
        year: feed.year,
        platforms: selectedPlatforms,
      }
    );

    // Remove from TMDb Feeds page
    setTimeout(() => {
      onDelete?.(feed.id);
    }, 300);
  };

  const togglePlatform = (platform: string) => {
    haptics.light();
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleEditCaption = () => {
    haptics.light();
    setEditedCaption(feed.caption);
    setIsEditCaptionOpen(true);
  };

  const handleSaveCaption = () => {
    if (editedCaption.trim().length === 0) {
      toast.error('Caption cannot be empty');
      return;
    }
    if (editedCaption.length > 200) {
      toast.error('Caption too long (max 200 characters)');
      return;
    }
    
    haptics.success();
    onUpdate?.(feed.id, { caption: editedCaption });
    setIsEditCaptionOpen(false);
    toast.success('Caption updated successfully');
    
    // Log the update
    logFeedUpdate(
      feed.id,
      feed.title,
      'caption_edited',
      'System',
      {
        tmdbId: feed.tmdbId,
        mediaType: feed.mediaType,
        year: feed.year,
      }
    );
  };

  const handleRegenerateCaption = async () => {
    haptics.light();
    setIsRegenerating(true);
    
    // Simulate AI caption generation
    setTimeout(() => {
      const regeneratedCaptions = [
        `🎬 ${feed.title} (${feed.year}) - An unforgettable cinematic experience! #NowWatching`,
        `✨ Don't miss ${feed.title}! Coming to theaters ${new Date(feed.releaseDate).toLocaleDateString()}`,
        `🍿 ${feed.title} is here! Featuring ${feed.cast[0]} and more incredible talent.`,
        `🎥 Experience ${feed.title} like never before. ${feed.mediaType === 'movie' ? 'In theaters now!' : 'Streaming now!'}`,
      ];
      
      const newCaption = regeneratedCaptions[Math.floor(Math.random() * regeneratedCaptions.length)];
      setEditedCaption(newCaption);
      onUpdate?.(feed.id, { caption: newCaption });
      setIsRegenerating(false);
      haptics.success();
      toast.success('Caption regenerated with AI');
      
      // Log the update
      logFeedUpdate(
        feed.id,
        feed.title,
        'caption_edited',
        'System',
        {
          tmdbId: feed.tmdbId,
          mediaType: feed.mediaType,
          year: feed.year,
        }
      );
    }, 1500);
  };

  const handleChangeImage = () => {
    haptics.light();
    setSelectedImageType(feed.imageType);
    setIsChangeImageOpen(true);
  };

  const handleSaveImageType = () => {
    haptics.success();
    onUpdate?.(feed.id, { imageType: selectedImageType });
    setIsChangeImageOpen(false);
    toast.success(`Image changed to ${selectedImageType}`);
    
    // Log the update
    logFeedUpdate(
      feed.id,
      feed.title,
      'image_changed',
      'System',
      {
        tmdbId: feed.tmdbId,
        mediaType: feed.mediaType,
        year: feed.year,
        imageType: selectedImageType,
      }
    );
  };

  const handleReschedule = () => {
    haptics.light();
    const date = new Date(feed.scheduledTime);
    setScheduledDate(date);
    const timeStr = date.toTimeString().slice(0, 5);
    setScheduledTime(timeStr);
    setIsRescheduleOpen(true);
  };

  const handleSaveSchedule = () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast.error('Please select both date and time');
      return;
    }

    const newScheduledTime = new Date(`${scheduledDate.toISOString().split('T')[0]}T${scheduledTime}`).toISOString();
    haptics.success();
    
    // Schedule the post in the context
    schedulePost({
      ...feed,
      scheduledTime: newScheduledTime,
      status: 'scheduled',
      platforms: selectedPlatforms,
    });
    
    setIsRescheduleOpen(false);
    toast.success('Post scheduled successfully');
    
    // Log the update
    logFeedUpdate(
      feed.id,
      feed.title,
      'scheduled',
      'System',
      {
        tmdbId: feed.tmdbId,
        mediaType: feed.mediaType,
        year: feed.year,
        scheduledTime: newScheduledTime,
        platforms: selectedPlatforms,
      }
    );

    // Remove from TMDb Feeds page
    setTimeout(() => {
      onDelete?.(feed.id);
    }, 300);
  };

  const handleDelete = () => {
    haptics.light();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    haptics.success();
    onDelete?.(feed.id);
    setIsDeleteDialogOpen(false);
    toast.success('Feed deleted successfully');
    
    // Log the deletion
    logFeedDeletion(
      feed.id,
      feed.title,
      'System',
      {
        tmdbId: feed.tmdbId,
        mediaType: feed.mediaType,
        year: feed.year,
      }
    );
  };

  const handleImageClick = () => {
    haptics.light();
    setIsImageExpanded(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-[#333333] overflow-hidden transition-all">
        <div className="flex flex-col sm:flex-row">
          {/* Image Section */}
          <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
            <DialogTrigger asChild>
              <div 
                className="sm:w-48 h-48 sm:h-auto relative flex-shrink-0 bg-gray-100 dark:bg-[#1A1A1A] cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleImageClick}
              >
                <img
                  src={feed.imageUrl}
                  alt={feed.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded-lg text-xs">
                  {feed.imageType === 'poster' ? 'Poster' : 'Backdrop'}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none">
              <VisuallyHidden>
                <DialogTitle>{feed.title} ({feed.year})</DialogTitle>
                <DialogDescription>
                  Full size {feed.imageType} image for {feed.title}
                </DialogDescription>
              </VisuallyHidden>
              <div className="relative">
                <button
                  onClick={() => setIsImageExpanded(false)}
                  className="absolute top-4 right-4 z-50 bg-black/80 text-white p-2 rounded-full hover:bg-black transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <img
                  src={feed.imageUrl}
                  alt={feed.title}
                  className="w-full h-auto max-h-[90vh] object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-gray-900 dark:text-white">
                    {feed.title} ({feed.year})
                  </h3>
                  <span className="px-2 py-1 bg-black dark:bg-white text-white dark:text-black rounded text-xs">
                    {feed.mediaType.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-lg text-xs ${getSourceColor(feed.source)}`}>
                    {getSourceLabel(feed.source)}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleEditCaption}>
                    <Edit3 className="w-4 h-4 mr-2 text-[#ec1e24]" />
                    Edit Caption
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRegenerateCaption}>
                    <RefreshCw className="w-4 h-4 mr-2 text-[#ec1e24]" />
                    Regenerate Caption
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleChangeImage}>
                    <ImageIcon className="w-4 h-4 mr-2 text-[#ec1e24]" />
                    Change Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                    <Trash2 className="w-4 h-4 mr-2 text-[#ec1e24]" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Caption */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-[#333333] rounded-xl p-4 mb-4">
              <div className="flex items-start gap-2">
                <Edit3 className="w-4 h-4 text-gray-400 dark:text-[#9CA3AF] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white mb-1">
                    {feed.caption}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-[#6B7280]">
                    {feed.caption.length}/200 characters
                  </span>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#9CA3AF]">
                <Users className="w-4 h-4 text-[#ec1e24]" />
                <span className="truncate">{feed.cast.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#9CA3AF]">
                <Calendar className="w-4 h-4 text-[#ec1e24]" />
                <span>{formatDate(feed.scheduledTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#9CA3AF]">
                <Star className="w-4 h-4 text-[#ec1e24]" />
                <span>TMDb ID: {feed.tmdbId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#9CA3AF]">
                <TrendingUp className="w-4 h-4 text-[#ec1e24]" />
                <span>Popularity: {feed.popularity.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-[#333333]">
              <Button
                onClick={handlePostNow}
                variant="outline"
                className="flex-1 bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333]"
              >
                <Send className="w-4 h-4 mr-2 text-[#ec1e24]" />
                Publish
              </Button>
              <Button
                onClick={handleSchedule}
                className="flex-1"
              >
                <Calendar className="w-4 h-4 mr-2 text-white" />
                Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Caption Dialog */}
      <Dialog open={isEditCaptionOpen} onOpenChange={setIsEditCaptionOpen}>
        <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-[#333333]">
          <DialogHeader>
            <DialogTitle>Edit Caption</DialogTitle>
            <DialogDescription>
              Customize the caption for this post
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                placeholder="Enter your caption..."
                className="mt-2 min-h-[100px] bg-white dark:bg-black border-gray-200 dark:border-[#333333]"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
                {editedCaption.length}/200 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCaptionOpen(false)} className="bg-white dark:bg-black border-gray-200 dark:border-[#333333]">
              Cancel
            </Button>
            <Button onClick={handleSaveCaption}>
              Save Caption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Image Dialog */}
      <Dialog open={isChangeImageOpen} onOpenChange={setIsChangeImageOpen}>
        <DialogContent className="bg-white dark:bg-black">
          <DialogHeader>
            <DialogTitle>Change Image Type</DialogTitle>
            <DialogDescription>
              Choose between poster (vertical) or backdrop (horizontal) image
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  haptics.light();
                  setSelectedImageType('poster');
                }}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  selectedImageType === 'poster'
                    ? 'border-[#ec1e24] bg-white dark:bg-black'
                    : 'border-gray-200 dark:border-[#333333]'
                }`}
              >
                <ImageIcon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">Poster</p>
                <p className="text-xs text-gray-500 dark:text-[#9CA3AF]">Vertical</p>
              </button>
              <button
                onClick={() => {
                  haptics.light();
                  setSelectedImageType('backdrop');
                }}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  selectedImageType === 'backdrop'
                    ? 'border-[#ec1e24] bg-white dark:bg-black'
                    : 'border-gray-200 dark:border-[#333333]'
                }`}
              >
                <ImageIcon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">Backdrop</p>
                <p className="text-xs text-gray-500 dark:text-[#9CA3AF]">Horizontal</p>
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeImageOpen(false)} className="bg-white dark:bg-black">
              Cancel
            </Button>
            <Button onClick={handleSaveImageType}>
              Change Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen} modal={false}>
        <DialogContent className="bg-white dark:bg-black" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
            <DialogDescription>
              Set the scheduled time and select platforms for this post
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Platform Selection */}
            <div>
              <Label>Platforms</Label>
              <div className="mt-2 flex justify-center">
                <div className="grid grid-cols-3 gap-3 max-w-fit">
                  <button
                    onClick={() => togglePlatform('x')}
                    className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                      selectedPlatforms.includes('x') 
                        ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                        : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                    }`}
                    title="X"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => togglePlatform('threads')}
                    className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                      selectedPlatforms.includes('threads') 
                        ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                        : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                    }`}
                    title="Threads"
                  >
                    <ThreadsIcon className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => togglePlatform('facebook')}
                    className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                      selectedPlatforms.includes('facebook') 
                        ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                        : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                    }`}
                    title="Facebook"
                  >
                    <FacebookIcon className="w-5.5 h-5.5" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="scheduled-date">Date</Label>
              <div className="mt-2">
                <DatePicker
                  date={scheduledDate}
                  onDateChange={setScheduledDate}
                  placeholder="Select a date"
                  className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333]"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="scheduled-time">Time</Label>
              <div className="mt-2">
                <TimePicker
                  value={scheduledTime}
                  onChange={setScheduledTime}
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
            <Button variant="outline" onClick={() => setIsRescheduleOpen(false)} className="bg-white dark:bg-black border-gray-200 dark:border-[#333333]">
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule}>
              Schedule Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feed</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feed? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Regenerating Toast */}
      {isRegenerating && (
        <div className="fixed bottom-4 right-4 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Regenerating caption with AI...</span>
        </div>
      )}

      {/* Platform Selection Dialog */}
      <Dialog open={isPlatformSelectOpen} onOpenChange={setIsPlatformSelectOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Select Platforms</DialogTitle>
            <DialogDescription className="text-[#6B7280] dark:text-[#9CA3AF]">
              Choose the platforms to {isPostNowMode ? 'post on' : 'schedule this post on'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            <div className="grid grid-cols-3 gap-3 max-w-fit">
              <button
                onClick={() => togglePlatform('x')}
                className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                  selectedPlatforms.includes('x') 
                    ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                    : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                }`}
                title="X"
              >
                <XIcon className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => togglePlatform('threads')}
                className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                  selectedPlatforms.includes('threads') 
                    ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                    : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                }`}
                title="Threads"
              >
                <ThreadsIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => togglePlatform('facebook')}
                className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                  selectedPlatforms.includes('facebook') 
                    ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                    : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                }`}
                title="Facebook"
              >
                <FacebookIcon className="w-5.5 h-5.5" />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsPlatformSelectOpen(false);
                setIsPostNowMode(false);
              }} 
              className="flex-1 border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSchedulePost}
              className="flex-1 bg-[#ec1e24] hover:bg-[#d01a20] text-white shadow-none hover:shadow-none active:shadow-none focus:shadow-none hover:scale-100 active:scale-100"
            >
              {isPostNowMode ? 'Publish' : 'Schedule Post'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}