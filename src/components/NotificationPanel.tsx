import { X, CheckCheck, AlertCircle, Upload, Trash2, Settings as SettingsIcon, Clapperboard, Film, Filter, Check, Clock, Calendar, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';
import { useState } from 'react';

export interface NotificationAction {
  id: string;
  label: string;
  type: 'approve' | 'schedule' | 'view' | 'dismiss';
  icon?: any;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  source?: 'tmdb' | 'rss' | 'upload' | 'videostudio' | 'system';
  actions?: NotificationAction[];
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNotificationAction?: (notificationId: string, actionType: string) => void;
}

export function NotificationPanel({ 
  isOpen, 
  onClose, 
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNotificationAction
}: NotificationPanelProps) {
  const [filterSource, setFilterSource] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  if (!isOpen) return null;

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filterSource && notification.source !== filterSource) return false;
    if (filterType && notification.type !== filterType) return false;
    return true;
  });

  const unreadCount = filteredNotifications.filter(n => !n.read).length;
  
  // Get unique sources for filter
  const sources = Array.from(new Set(notifications.map(n => n.source).filter(Boolean)));
  
  const handleActionClick = (notificationId: string, actionType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    haptics.medium();
    
    if (onNotificationAction) {
      onNotificationAction(notificationId, actionType);
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
            <div className="flex items-center justify-between gap-2">
              {/* Filter button on the left */}
              <button
                onClick={() => {
                  haptics.light();
                  setShowFilters(!showFilters);
                }}
                className={`text-xs flex items-center gap-1 ${filterSource || filterType ? 'text-[#ec1e24]' : 'text-[#9CA3AF]'} hover:text-[#ec1e24]`}
              >
                <Filter className="w-3 h-3" />
                Filter
              </button>
              
              {/* Three-dot menu on the right */}
              <div className="relative">
                <button
                  onClick={() => {
                    haptics.light();
                    setShowMenu(!showMenu);
                  }}
                  className="text-[#9CA3AF] hover:text-black dark:hover:text-white p-1"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {/* Dropdown menu */}
                {showMenu && (
                  <>
                    {/* Overlay to close menu */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMenu(false)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#000000] rounded-lg shadow-lg dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-gray-200 dark:border-[#333333] py-1 z-20">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            haptics.medium();
                            onMarkAllAsRead();
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#1A1A1A] flex items-center gap-2"
                        >
                          <CheckCheck className="w-4 h-4" />
                          Mark all as read
                        </button>
                      )}
                      <button
                        onClick={() => {
                          haptics.medium();
                          onClearAll();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#ec1e24] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear all
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Filter Options */}
          {showFilters && notifications.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-[#333333]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#6B7280]">Source:</span>
                <button
                  onClick={() => {
                    haptics.light();
                    setFilterSource(null);
                  }}
                  className={`text-xs px-2 py-1 rounded ${!filterSource ? 'bg-[#ec1e24] text-white' : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'}`}
                >
                  All
                </button>
                {sources.map(source => (
                  <button
                    key={source}
                    onClick={() => {
                      haptics.light();
                      setFilterSource(source || null);
                    }}
                    className={`text-xs px-2 py-1 rounded capitalize ${filterSource === source ? 'bg-[#ec1e24] text-white' : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'}`}
                  >
                    {source}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#6B7280]">Type:</span>
                <button
                  onClick={() => {
                    haptics.light();
                    setFilterType(null);
                  }}
                  className={`text-xs px-2 py-1 rounded ${!filterType ? 'bg-[#ec1e24] text-white' : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'}`}
                >
                  All
                </button>
                {['success', 'error', 'warning', 'info'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      haptics.light();
                      setFilterType(type);
                    }}
                    className={`text-xs px-2 py-1 rounded capitalize ${filterType === type ? 'bg-[#ec1e24] text-white' : 'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCheck className="w-8 h-8 text-[#6B7280]" />
              </div>
              <p className="text-[#9CA3AF]">No notifications</p>
              <p className="text-[#6B7280] text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
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
                    {notification.actions && (
                      <div className="flex gap-2 mt-2">
                        {notification.actions.map(action => (
                          <button
                            key={action.id}
                            onClick={(e) => handleActionClick(notification.id, action.type, e)}
                            className={`text-xs ${action.type === 'dismiss' ? 'text-[#ec1e24]' : 'text-[#ec1e24]'} hover:text-[#ec1e24]/80`}
                          >
                            {action.icon ? <action.icon className="w-4 h-4" /> : action.label}
                          </button>
                        ))}
                      </div>
                    )}
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