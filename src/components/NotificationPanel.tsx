import { X, CheckCheck, AlertCircle, Upload, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCheck className="w-5 h-5 text-[#10B981]" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#EF4444]" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[#F59E0B]" />;
      default:
        return <SettingsIcon className="w-5 h-5 text-[#3B82F6]" />;
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
      <div className="fixed top-0 right-0 bottom-0 w-full lg:w-[450px] bg-[#1F2937] z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1F2937] border-b border-[#374151] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-white text-xl">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-[#F45247] text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5 text-white" />
            </Button>
          </div>
          
          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-[#F45247] hover:text-[#F45247]/80"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={onClearAll}
                className="text-xs text-[#9CA3AF] hover:text-white ml-auto"
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
              <div className="w-16 h-16 bg-[#374151] rounded-full flex items-center justify-center mx-auto mb-4">
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
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  notification.read
                    ? 'bg-[#374151]/50 hover:bg-[#374151]'
                    : 'bg-[#374151] hover:bg-[#4B5563] border-l-4 border-[#F45247]'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`text-sm ${notification.read ? 'text-[#9CA3AF]' : 'text-white'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#F45247] rounded-full flex-shrink-0 mt-1"></div>
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
