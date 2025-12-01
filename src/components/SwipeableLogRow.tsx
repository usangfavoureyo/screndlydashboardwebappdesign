import { useState, useRef } from 'react';
import { Trash2, Video, Rss, Clapperboard, Film, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';
import { getPlatformConnection, PlatformType } from '../utils/platformConnections';

interface LogEntry {
  id: string;
  videoTitle: string;
  platform: string;
  status: 'success' | 'failed';
  timestamp: string;
  error?: string;
  errorDetails?: string;
  type: 'video' | 'rss' | 'tmdb' | 'videostudio';
}

interface SwipeableLogRowProps {
  log: LogEntry;
  onDelete: (id: string) => void;
  onRetry: (logId: string, videoTitle: string) => void;
  platformUrls: Record<string, string>;
}

export function SwipeableLogRow({
  log,
  onDelete,
  onRetry,
  platformUrls
}: SwipeableLogRowProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'none' | 'horizontal' | 'vertical'>('none');
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);

  // Get platform URL - returns user's connected account if available, otherwise Screen Render's URL
  const getPlatformUrl = (platformName: string): string => {
    const connection = getPlatformConnection(platformName as PlatformType);
    return connection.profileUrl || platformUrls[platformName];
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setSwipeDirection('none');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX;
    currentY.current = e.touches[0].clientY;
    
    const deltaX = Math.abs(currentX.current - startX.current);
    const deltaY = Math.abs(currentY.current - startY.current);
    
    // Determine swipe direction on first significant movement
    if (swipeDirection === 'none' && (deltaX > 10 || deltaY > 10)) {
      // If horizontal movement is greater than vertical, it's a horizontal swipe
      if (deltaX > deltaY * 1.5) {
        setSwipeDirection('horizontal');
        setIsSwiping(true);
      } else {
        // Otherwise, it's vertical scrolling
        setSwipeDirection('vertical');
      }
    }
    
    // Only handle horizontal swipe (left only for delete)
    if (swipeDirection === 'horizontal') {
      e.stopPropagation();
      e.preventDefault(); // Prevent scrolling while swiping horizontally
      
      const diff = currentX.current - startX.current;
      
      // Only allow left swipe (negative values)
      if (diff <= 0) {
        // Limit swipe distance - increased to show delete label better
        const maxSwipe = 150;
        const clampedDiff = Math.max(-maxSwipe, diff);
        
        setSwipeX(clampedDiff);
      }
    }
  };

  const handleTouchEnd = () => {
    // Only process swipe action if it was a horizontal swipe
    if (swipeDirection === 'horizontal') {
      const threshold = 110; // Increased from 90 to make it less aggressive
      
      // Swipe left (delete)
      if (swipeX < -threshold) {
        haptics.medium();
        onDelete(log.id);
      }
    }
    
    // Reset state
    setIsSwiping(false);
    setSwipeDirection('none');
    setSwipeX(0);
  };

  return (
    <tr 
      className="relative border-b border-gray-200 dark:border-[#374151] last:border-0 transition-colors duration-200 group"
      style={{
        position: 'relative'
      }}
    >
      {/* Background delete layer - positioned absolutely behind the content */}
      <td 
        colSpan={7}
        className="absolute inset-0 bg-[#ec1e24] p-0 pointer-events-none"
        style={{
          opacity: swipeX < 0 ? 1 : 0,
          transition: 'opacity 0.2s',
          zIndex: 0
        }}
      >
        <div className="flex justify-end items-center h-full pr-6">
          <div className="flex flex-col items-center gap-1 text-white">
            <Trash2 className="w-5 h-5" />
            <span className="text-xs whitespace-nowrap">Delete</span>
          </div>
        </div>
      </td>

      {/* Content wrapper - all table cells in one container */}
      <td 
        colSpan={7} 
        className="p-0 bg-white dark:bg-[#000000]"
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
          position: 'relative',
          zIndex: 1
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <table className="w-full">
          <tbody>
            <tr>
              {/* Desktop delete button - only visible on hover */}
              <td className="relative p-4 text-gray-900 dark:text-white">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    haptics.medium();
                    onDelete(log.id);
                  }}
                  className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-[#1A1A1A] hover:bg-[#ec1e24] hover:dark:bg-[#ec1e24] text-gray-600 dark:text-gray-400 hover:text-white z-10"
                  title="Delete log entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {log.videoTitle}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {log.type === 'video' && (
                    <>
                      <Video className="w-4 h-4 text-[#ec1e24]" />
                      <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Video</span>
                    </>
                  )}
                  {log.type === 'rss' && (
                    <>
                      <Rss className="w-4 h-4 text-[#ec1e24]" />
                      <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">RSS</span>
                    </>
                  )}
                  {log.type === 'tmdb' && (
                    <>
                      <Clapperboard className="w-4 h-4 text-[#ec1e24]" />
                      <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">TMDb</span>
                    </>
                  )}
                  {log.type === 'videostudio' && (
                    <>
                      <Film className="w-4 h-4 text-[#ec1e24]" />
                      <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Video Studio</span>
                    </>
                  )}
                </div>
              </td>
              <td className="p-4">
                <a
                  href={getPlatformUrl(log.platform)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    haptics.light();
                    window.open(getPlatformUrl(log.platform), '_blank', 'noopener,noreferrer');
                  }}
                  className="inline-block px-3 py-1 bg-gray-200 dark:bg-[#1f1f1f] text-gray-700 dark:text-[#9CA3AF] rounded-full hover:bg-gray-300 dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                >
                  {log.platform}
                </a>
              </td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full ${
                    log.status === 'success'
                      ? 'bg-[#D1FAE5] dark:bg-[#065F46] text-[#065F46] dark:text-[#D1FAE5]'
                      : 'bg-[#FEE2E2] dark:bg-[#991B1B] text-[#991B1B] dark:text-[#FEE2E2]'
                  }`}
                >
                  {log.status}
                </span>
              </td>
              <td className="p-4 text-[#6B7280] dark:text-[#9CA3AF]">{log.timestamp}</td>
              <td className="p-4">
                {log.error ? (
                  <div>
                    <p className="text-[#EF4444]">{log.error}</p>
                    {log.errorDetails && (
                      <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs mt-1">{log.errorDetails}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-[#6B7280] dark:text-[#9CA3AF]">-</span>
                )}
              </td>
              <td className="p-4">
                {log.status === 'failed' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRetry(log.id, log.videoTitle)}
                    className="gap-2 bg-white dark:bg-black"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </Button>
                ) : (
                  <span className="text-[#6B7280] dark:text-[#9CA3AF]">-</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}