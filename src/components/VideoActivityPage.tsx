import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Edit, ExternalLink, Trash2, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';
import { toast } from 'sonner@2.0.3';
import { useUndo } from './UndoContext';
import { SwipeableActivityCard } from './SwipeableActivityCard';
import { EditMetadataModal } from './EditMetadataModal';

interface VideoPost {
  id: string;
  title: string;
  platform: 'YouTube' | 'Instagram' | 'Facebook' | 'TikTok' | 'X' | 'Threads';
  status: 'published' | 'failed';
  timestamp: number;
  postUrl?: string;
  videoId?: string;
  description?: string;
  thumbnailUrl?: string;
  error?: string;
  tmdbMatch?: {
    id: number;
    title: string;
    year: number;
    confidence: number;
    backdropUrl: string;
    logoUrl?: string;
    posterUrl: string;
  };
}

interface VideoActivityPageProps {
  onNavigate: (page: string) => void;
  previousPage?: string | null;
}

// Calculate time ago from timestamp
function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export function VideoActivityPage({ onNavigate, previousPage }: VideoActivityPageProps) {
  const { showUndo } = useUndo();
  const [filter, setFilter] = useState<'YouTube' | 'Instagram' | 'Facebook' | 'TikTok' | 'X' | 'Threads'>('YouTube');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingPost, setEditingPost] = useState<VideoPost | null>(null);
  const [viewingPost, setViewingPost] = useState<VideoPost | null>(null);
  
  // Get retention period from settings (default 24 hours)
  const getSettings = () => {
    try {
      const savedSettings = localStorage.getItem('screndly_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return { videoActivityRetention: 24 };
  };

  const settings = getSettings();
  const retentionHours = settings.videoActivityRetention || 24;
  const retentionMs = retentionHours * 60 * 60 * 1000; // Convert to milliseconds

  // Helper function to check if an item should be kept based on retention
  const shouldKeepItem = (item: VideoPost): boolean => {
    // For published and failed items, check retention period
    if (item.status === 'published' || item.status === 'failed') {
      try {
        const now = Date.now();
        const ageMs = now - item.timestamp;
        return ageMs <= retentionMs;
      } catch (error) {
        // If parsing fails, keep the item
        return true;
      }
    }

    return true;
  };
  
  // Initialize video posts with timestamps (stored in localStorage)
  const [videoPosts, setVideoPosts] = useState<VideoPost[]>(() => {
    try {
      const stored = localStorage.getItem('videoPosts');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load video posts from localStorage:', e);
    }
    
    // Initial demo data with timestamps
    const now = Date.now();
    return [
      { 
        id: '1', 
        title: 'Gladiator II - Trailer Review', 
        platform: 'YouTube', 
        status: 'published',
        timestamp: now - 5 * 60000,
        postUrl: 'https://youtube.com/watch?v=abc123',
        videoId: 'abc123',
        description: 'Check out our review of the new Gladiator II trailer! #Gladiator2 #Movies',
        thumbnailUrl: 'https://i.ytimg.com/vi/abc123/maxresdefault.jpg',
        tmdbMatch: {
          id: 558449,
          title: 'Gladiator II',
          year: 2024,
          confidence: 95,
          backdropUrl: 'https://image.tmdb.org/t/p/original/backdrop.jpg',
          logoUrl: 'https://image.tmdb.org/t/p/original/logo.png',
          posterUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
        }
      },
      { 
        id: '2', 
        title: 'Dune: Part Two - Official Trailer', 
        platform: 'X', 
        status: 'published',
        timestamp: now - 12 * 60000,
        postUrl: 'https://x.com/screenrender/status/123456',
        description: '🌌 The epic continues. Dune: Part Two trailer is here! #DunePartTwo #SciFi',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/dune2-poster.jpg',
      },
      { 
        id: '3', 
        title: 'Barbie - Behind the Scenes', 
        platform: 'Instagram', 
        status: 'published',
        timestamp: now - 24 * 60000,
        postUrl: 'https://www.instagram.com/p/abc123',
        description: '💖 Go behind the scenes of the Barbie movie! Coming to theaters. #Barbie #BarbieMovie',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/barbie-poster.jpg',
      },
      { 
        id: '4', 
        title: 'Oppenheimer - IMAX Experience', 
        platform: 'YouTube', 
        status: 'published',
        timestamp: now - 38 * 60000,
        postUrl: 'https://youtube.com/watch?v=def456',
        videoId: 'def456',
        description: 'The story of J. Robert Oppenheimer. In theaters now. #Oppenheimer',
        thumbnailUrl: 'https://i.ytimg.com/vi/def456/maxresdefault.jpg',
        tmdbMatch: {
          id: 872585,
          title: 'Oppenheimer',
          year: 2023,
          confidence: 98,
          backdropUrl: 'https://image.tmdb.org/t/p/original/backdrop2.jpg',
          logoUrl: 'https://image.tmdb.org/t/p/original/logo2.png',
          posterUrl: 'https://image.tmdb.org/t/p/w500/poster2.jpg',
        }
      },
      { 
        id: '5', 
        title: 'The Batman - Deleted Scene', 
        platform: 'TikTok', 
        status: 'published',
        timestamp: now - 60 * 60000,
        postUrl: 'https://www.tiktok.com/@screenrender/video/123456',
        description: '🦇 EXCLUSIVE deleted scene from The Batman! Matt Reeves confirmed this was cut for pacing. #TheBatman #DC',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/batman-poster.jpg',
      },
      { 
        id: '6', 
        title: 'Spider-Man - Upload Failed', 
        platform: 'Facebook', 
        status: 'failed',
        timestamp: now - 90 * 60000,
        error: 'API rate limit exceeded',
        description: 'New Spider-Man footage just dropped! 🕷️ #SpiderMan #Marvel',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/spiderman-poster.jpg',
      },
      { 
        id: '7', 
        title: 'Guardians Vol 3 - Teaser', 
        platform: 'Threads', 
        status: 'published',
        timestamp: now - 120 * 60000,
        postUrl: 'https://www.threads.net/@screenrender/post/abc123',
        description: '🚀 The final chapter. Guardians of the Galaxy Vol. 3 teaser is here! #GuardiansOfTheGalaxy #Marvel',
        thumbnailUrl: 'https://image.tmdb.org/t/p/w500/guardians3-poster.jpg',
      },
    ];
  });

  // Save video posts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('videoPosts', JSON.stringify(videoPosts));
    } catch (e) {
      console.error('Failed to save video posts to localStorage:', e);
    }
  }, [videoPosts]);

  // Auto-delete posts older than retention period (configurable in settings)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const autoDeleteEnabled = localStorage.getItem('autoDeletePosts') !== 'false';
      const deleteThreshold = retentionMs;
      
      if (autoDeleteEnabled) {
        setVideoPosts(prev => {
          const filtered = prev.filter(post => {
            const age = now - post.timestamp;
            return age < deleteThreshold;
          });
          
          // Only update if something changed
          if (filtered.length !== prev.length) {
            const deletedCount = prev.length - filtered.length;
            toast.info(`Auto-deleted ${deletedCount} post${deletedCount > 1 ? 's' : ''} older than ${retentionHours} hours`);
            return filtered;
          }
          return prev;
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const filteredPosts = videoPosts.filter(post => {
    return post.platform === filter;
  });

  const publishedCount = videoPosts.filter(p => p.status === 'published').length;
  const failedCount = videoPosts.filter(p => p.status === 'failed').length;

  const handleRefresh = () => {
    haptics.medium();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Activity refreshed');
    }, 1000);
  };

  const handleDelete = (id: string) => {
    const deletedPost = videoPosts.find(post => post.id === id);
    if (!deletedPost) return;
    
    haptics.medium();
    
    // Temporarily remove from state
    setVideoPosts(prev => prev.filter(post => post.id !== id));
    
    // Show undo toast
    showUndo({
      id,
      itemName: deletedPost.title,
      onUndo: () => {
        // Restore the post
        setVideoPosts(prev => {
          const insertIndex = prev.findIndex(post => 
            post.timestamp < deletedPost.timestamp
          );
          if (insertIndex === -1) {
            return [...prev, deletedPost];
          }
          return [
            ...prev.slice(0, insertIndex),
            deletedPost,
            ...prev.slice(insertIndex)
          ];
        });
      },
      onConfirm: () => {
        toast.success('Deleted', {
          description: `"${deletedPost.title}" has been removed`,
        });
      }
    });
  };

  const handleRetry = (post: VideoPost) => {
    haptics.medium();
    toast.success('Retry Initiated', {
      description: `Retrying upload for \"${post.title}\"`,
    });
    // Add retry logic here
  };

  const canEditMetadata = (platform: string) => {
    // YouTube and Facebook support full metadata editing
    return platform === 'YouTube' || platform === 'Facebook';
  };

  const handleSaveMetadata = (postId: string, updates: { title: string; description: string; thumbnailUrl?: string }) => {
    setVideoPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          title: updates.title,
          description: updates.description,
          thumbnailUrl: updates.thumbnailUrl || post.thumbnailUrl
        };
      }
      return post;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          <button
            onClick={() => {
              haptics.light();
              onNavigate(previousPage || 'dashboard');
            }}
            className="text-gray-900 dark:text-white hover:text-[#ec1e24] p-2 -ml-2 mt-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12H2M9 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-gray-900 dark:text-white mb-2">Video Activity</h1>
            <p className="text-gray-600 dark:text-[#9CA3AF]">
              Track all social media video posts
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
      <div className="space-y-4">
        {/* Total Posts - Full Width */}
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5">
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Total Posts</p>
          <p className="text-gray-900 dark:text-white text-2xl">{videoPosts.length}</p>
        </div>

        {/* 2x Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5">
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Published</p>
            <p className="text-gray-900 dark:text-white text-2xl">{publishedCount}</p>
          </div>
          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-5">
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-1">Failures</p>
            <p className="text-gray-900 dark:text-white text-2xl">{failedCount}</p>
          </div>
        </div>
      </div>

      {/* Platform Filters */}
      <div className="bg-white dark:bg-[#000000] rounded-2xl border border-gray-200 dark:border-[#333333] shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              haptics.light();
              setFilter('YouTube');
            }}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filter === 'YouTube'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => {
              haptics.light();
              setFilter('Instagram');
            }}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filter === 'Instagram'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Instagram
          </button>
          <button
            onClick={() => {
              haptics.light();
              setFilter('Facebook');
            }}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filter === 'Facebook'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Facebook
          </button>
          <button
            onClick={() => {
              haptics.light();
              setFilter('TikTok');
            }}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filter === 'TikTok'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            TikTok
          </button>
          <button
            onClick={() => {
              haptics.light();
              setFilter('X');
            }}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filter === 'X'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            X
          </button>
          <button
            onClick={() => {
              haptics.light();
              setFilter('Threads');
            }}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              filter === 'Threads'
                ? 'bg-[#ec1e24] text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-[#9CA3AF]'
            }`}
          >
            Threads
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-8 text-center">
            <p className="text-gray-600 dark:text-[#9CA3AF]">
              No posts found for {filter}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <SwipeableActivityCard
              key={post.id}
              id={post.id}
              className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-4 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all"
              onDelete={() => handleDelete(post.id)}
            >
              <div className="flex items-start gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 dark:text-white mb-1">
                    {post.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {/* Platform Badge */}
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-[#1A1A1A] text-gray-700 dark:text-[#9CA3AF] rounded-md text-xs">
                      {post.platform}
                    </span>

                    {/* Status Badge */}
                    {post.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-[#1A1A1A] text-gray-700 dark:text-[#9CA3AF] rounded-md text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FEE2E2] dark:bg-[#991B1B] text-[#EF4444] rounded-md text-xs">
                        <XCircle className="w-3 h-3" />
                        Failed
                      </span>
                    )}

                    {/* Time */}
                    <span className="text-xs text-gray-500 dark:text-[#6B7280]">
                      {getTimeAgo(post.timestamp)}
                    </span>
                  </div>

                  {/* TMDb Match Info */}
                  {post.tmdbMatch && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-600 dark:text-[#9CA3AF]">
                        TMDb: {post.tmdbMatch.title} ({post.tmdbMatch.year})
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        post.tmdbMatch.confidence >= 90
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : post.tmdbMatch.confidence >= 70
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {post.tmdbMatch.confidence}% match
                      </span>
                    </div>
                  )}

                  {/* Error Message */}
                  {post.error && (
                    <p className="text-xs text-[#EF4444] mb-2">
                      {post.error}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.postUrl && (
                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => haptics.light()}
                        className="text-xs text-[#ec1e24] hover:underline flex items-center gap-1"
                      >
                        View Post
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <button
                      onClick={() => {
                        haptics.light();
                        setViewingPost(post);
                      }}
                      className="text-xs text-gray-600 dark:text-[#9CA3AF] hover:text-[#ec1e24] flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      View Details
                    </button>

                    {post.status === 'published' && canEditMetadata(post.platform) && (
                      <button
                        onClick={() => {
                          haptics.light();
                          setEditingPost(post);
                        }}
                        className="text-xs text-gray-600 dark:text-[#9CA3AF] hover:text-[#ec1e24] flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit Metadata
                      </button>
                    )}

                    {post.status === 'failed' && (
                      <button
                        onClick={() => handleRetry(post)}
                        className="text-xs text-gray-600 dark:text-[#9CA3AF] hover:text-[#ec1e24] flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SwipeableActivityCard>
          ))
        )}
      </div>

      {/* Edit Metadata Modal */}
      {editingPost && (
        <EditMetadataModal
          post={editingPost}
          onSave={handleSaveMetadata}
          onClose={() => setEditingPost(null)}
        />
      )}

      {/* View Details Modal */}
      {viewingPost && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            haptics.light();
            setViewingPost(null);
          }}
        >
          <div
            className="bg-white dark:bg-[#000000] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-[#333333]">
              <h2 className="text-gray-900 dark:text-white text-xl">Post Details</h2>
              <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-0.5">
                {viewingPost.platform} • {
                  viewingPost.platform === 'YouTube' 
                    ? 'Title, Description & Thumbnail' 
                    : viewingPost.platform === 'X' 
                      ? 'Caption & Thumbnail' 
                      : 'Caption & Poster'
                }
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title (YouTube only) */}
              {viewingPost.platform === 'YouTube' && (
                <div>
                  <label className="block text-sm mb-2 text-gray-900 dark:text-white">
                    Title
                  </label>
                  <div className="bg-white dark:bg-black border border-gray-200 dark:border-[#333333] rounded-lg p-4">
                    <p className="text-gray-900 dark:text-white">
                      {viewingPost.title}
                    </p>
                  </div>
                </div>
              )}

              {/* Caption/Description */}
              <div>
                <label className="block text-sm mb-2 text-gray-900 dark:text-white">
                  {viewingPost.platform === 'YouTube' ? 'Description' : 'Caption'}
                </label>
                {viewingPost.description ? (
                  <div className="bg-white dark:bg-black border border-gray-200 dark:border-[#333333] rounded-lg p-4">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {viewingPost.description}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333333] rounded-lg p-4">
                    <p className="text-gray-500 dark:text-[#6B7280] italic">
                      No {viewingPost.platform === 'YouTube' ? 'description' : 'caption'} available
                    </p>
                  </div>
                )}
              </div>

              {/* Poster/Thumbnail */}
              <div>
                <label className="block text-sm mb-2 text-gray-900 dark:text-white">
                  {viewingPost.platform === 'X' || viewingPost.platform === 'YouTube' ? 'Thumbnail' : 'Poster'}
                </label>
                {viewingPost.thumbnailUrl ? (
                  <div className="bg-white dark:bg-black border border-gray-200 dark:border-[#333333] rounded-lg p-2 overflow-hidden">
                    <img
                      src={viewingPost.thumbnailUrl}
                      alt={viewingPost.title}
                      className="w-full h-auto rounded-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div
                      className="hidden w-full aspect-video items-center justify-center bg-white dark:bg-black rounded-md"
                      style={{ display: 'none' }}
                    >
                      <p className="text-gray-500 dark:text-[#6B7280] text-sm">
                        Failed to load image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333333] rounded-lg p-8 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-[#6B7280] italic">
                      No {viewingPost.platform === 'X' ? 'thumbnail' : 'poster'} available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-[#333333] flex justify-end">
              <Button
                onClick={() => {
                  haptics.light();
                  setViewingPost(null);
                }}
                variant="outline"
                className="!bg-white dark:!bg-[#000000] !text-gray-900 dark:!text-white border-gray-300 dark:border-[#333333]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}