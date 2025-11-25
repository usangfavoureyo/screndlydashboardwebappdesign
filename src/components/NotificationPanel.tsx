import { X, CheckCheck, AlertCircle, Upload, Trash2, Settings as SettingsIcon, Clapperboard, Film } from 'lucide-react';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  source?: 'tmdb' | 'rss' | 'upload' | 'videostudio' | 'system';
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export function NotificationPanel({ 
  isOpen, 
  onClose, 
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll
}: NotificationPanelProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

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
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 lg:pl-64"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full lg:w-[450px] bg-white dark:bg-[#000000] z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-black dark:text-white text-xl">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-[#ec1e24] text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button 
              className="text-black dark:text-white p-1" 
              onClick={() => {
                try {
                  haptics.light();
                } catch (e) {
                  // Silently fail if haptics not available
                }
                onClose();
              }}
            >
              <X className="w-[26px] h-[26px] stroke-1" />
            </button>
          </div>
          
          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    try {
                      haptics.medium();
                    } catch (e) {
                      // Silently fail if haptics not available
                    }
                    onMarkAllAsRead();
                  }}
                  className="text-xs text-[#ec1e24] hover:text-[#ec1e24]/80"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => {
                  try {
                    haptics.medium();
                  } catch (e) {
                    // Silently fail if haptics not available
                  }
                  onClearAll();
                }}
                className="text-xs text-[#9CA3AF] hover:text-black dark:hover:text-white ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCheck className="w-8 h-8 text-[#6B7280]" />
              </div>
              <p className="text-[#9CA3AF]">No notifications</p>
              <p className="text-[#6B7280] text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => onMarkAsRead(notification.id)}
                className={`w-full text-left p-4 rounded-lg shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all ${
                  notification.read
                    ? 'bg-white dark:bg-[#000000] hover:bg-gray-50 dark:hover:bg-[#000000] border border-gray-200 dark:border-[#333333]'
                    : 'bg-white dark:bg-[#000000] hover:bg-gray-50 dark:hover:bg-[#000000] border border-gray-200 dark:border-[#333333] !border-l-4 !border-l-[#ec1e24]'
                }`}
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
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}