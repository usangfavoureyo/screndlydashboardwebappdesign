import { useState, useRef } from 'react';
import { Trash2, Check, CheckCheck, AlertCircle, Settings as SettingsIcon, Clapperboard, Film } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  source?: 'tmdb' | 'rss' | 'upload' | 'videostudio' | 'system';
  actions?: any[];
}

interface SwipeableNotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onActionClick?: (notificationId: string, actionType: string, e: React.MouseEvent) => void;
}

export function SwipeableNotificationCard({ 
  notification, 
  onMarkAsRead, 
  onDelete,
  onActionClick 
}: SwipeableNotificationCardProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    e.stopPropagation();
    e.preventDefault(); // Prevent scrolling while swiping
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    // Limit swipe distance
    const maxSwipe = 120;
    const clampedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    
    setSwipeX(clampedDiff);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    const threshold = 60;
    
    // Swipe left (delete)
    if (swipeX < -threshold) {
      haptics.medium();
      onDelete(notification.id);
    }
    // Swipe right (mark as read)
    else if (swipeX > threshold) {
      haptics.medium();
      if (!notification.read) {
        onMarkAsRead(notification.id);
      }
    }
    
    // Reset position
    setSwipeX(0);
  };

  const handleClick = () => {
    if (Math.abs(swipeX) < 5) {
      onMarkAsRead(notification.id);
    }
  };

  const getIcon = (notification: Notification) => {
    // Check if it's a TMDb notification
    if (notification.source === 'tmdb') {
      return <Clapperboard className="w-5 h-5 text-[#ec1e24]" />;
    }
    
    // Check if it's a Video Studio notification
    if (notification.source === 'videostudio') {
      return <Film className="w-5 h-5 text-[#ec1e24]" />;
    }
    
    // Otherwise use the type-based icons with brand red color
    switch (notification.type) {
      case 'success':
        return <CheckCheck className="w-5 h-5 text-[#ec1e24]" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#ec1e24]" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[#ec1e24]" />;
      default:
        return <SettingsIcon className="w-5 h-5 text-[#ec1e24]" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Background action buttons */}
      <div className="absolute inset-0 flex">
        {/* Mark as Read - Right side (shown when swiping right) */}
        <div 
          className="flex items-center justify-start px-6 bg-[#f3f4f6] dark:bg-[#1a1a1a] text-gray-700 dark:text-white transition-opacity"
          style={{ 
            opacity: swipeX > 0 ? 1 : 0,
            width: '120px'
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <Check className="w-5 h-5" />
            <span className="text-xs whitespace-nowrap">Mark as Read</span>
          </div>
        </div>
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Delete - Left side (shown when swiping left) */}
        <div 
          className="flex items-center justify-end px-6 bg-[#ec1e24] text-white transition-opacity"
          style={{ 
            opacity: swipeX < 0 ? 1 : 0,
            width: '120px'
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <Trash2 className="w-5 h-5" />
            <span className="text-xs whitespace-nowrap">Delete</span>
          </div>
        </div>
      </div>

      {/* Notification Card */}
      <div
        className={`relative w-full text-left p-4 rounded-lg shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] transition-shadow select-none ${
          notification.read
            ? 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333]'
            : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] !border-l-4 !border-l-[#ec1e24]'
        }`}
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(notification)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className={`text-sm ${notification.read ? 'text-gray-600 dark:text-[#9CA3AF]' : 'text-gray-900 dark:text-white'}`}>
                {notification.title}
              </h4>
              {!notification.read && (
                <div className="w-2 h-2 bg-[#ec1e24] rounded-full flex-shrink-0 mt-1"></div>
              )}
            </div>
            <p className="text-xs text-[#9CA3AF] mb-2">
              {notification.message}
            </p>
            <p className="text-xs text-[#6B7280]">
              {notification.timestamp}
            </p>
            {notification.actions && (
              <div className="flex gap-2 mt-2">
                {notification.actions.map(action => (
                  <button
                    key={action.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onActionClick) {
                        onActionClick(notification.id, action.type, e);
                      }
                    }}
                    className={`text-xs ${action.type === 'dismiss' ? 'text-[#ec1e24]' : 'text-[#ec1e24]'} hover:text-[#ec1e24]/80`}
                  >
                    {action.icon ? <action.icon className="w-4 h-4" /> : action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}