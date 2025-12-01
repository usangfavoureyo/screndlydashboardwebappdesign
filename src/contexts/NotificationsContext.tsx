import { createContext, useContext, useState, ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import { desktopNotifications } from '../utils/desktopNotifications';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  source: 'upload' | 'rss' | 'tmdb' | 'videostudio' | 'system';
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    source: 'upload' | 'rss' | 'tmdb' | 'videostudio' | 'system'
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Upload Complete',
      message: 'Dune: Part Three - Official Trailer uploaded successfully to YouTube',
      timestamp: '2 minutes ago',
      read: false,
      source: 'upload',
    },
    {
      id: '2',
      type: 'success',
      title: 'Video Generated',
      message: 'Gladiator II - Trailer Review video created successfully',
      timestamp: '8 minutes ago',
      read: false,
      source: 'videostudio',
    },
    {
      id: '3',
      type: 'success',
      title: 'RSS Article Posted',
      message: 'Variety: Breaking box office records - Auto-posted to X and Threads',
      timestamp: '10 minutes ago',
      read: false,
      source: 'rss',
    },
    {
      id: '4',
      type: 'info',
      title: 'TMDb Feed Generated',
      message: '3 new releases scheduled for today - Gladiator II, Wicked, Red One',
      timestamp: '25 minutes ago',
      read: false,
      source: 'tmdb',
    },
    {
      id: '5',
      type: 'success',
      title: 'TMDb Anniversary Posted',
      message: 'The Matrix 25th Anniversary - Auto-posted to all platforms',
      timestamp: '45 minutes ago',
      read: true,
      source: 'tmdb',
    },
  ]);

  const addNotification = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    source: 'upload' | 'rss' | 'tmdb' | 'videostudio' | 'system'
  ) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      source,
    };
    
    setNotifications(prev => [newNotification, ...prev]);

    // Send desktop notification if enabled
    if (settings.desktopNotifications) {
      desktopNotifications.sendTyped(type, title, message);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        deleteNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
