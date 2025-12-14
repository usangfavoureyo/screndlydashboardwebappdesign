import { ArrowLeft, Scissors } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { haptics } from '../utils/haptics';
import { SwipeableActivityItem } from './SwipeableActivityItem';
import { useUndo } from './UndoContext';
import { getRecentActivities } from '../utils/activityStore';
import { useSettings } from '../contexts/SettingsContext';

interface Activity {
  id: string;
  title: string;
  platform: string;
  status: 'success' | 'failed';
  time: string;
  type: 'video' | 'videostudio' | 'rss' | 'tmdb' | 'scenes';
  timestamp: number;
}

interface RecentActivityPageProps {
  onNavigate: (page: string) => void;
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

export function RecentActivityPage({ onNavigate }: RecentActivityPageProps) {
  const { showUndo } = useUndo();
  const { settings } = useSettings();
  
  // Initialize activities with timestamps (stored in localStorage)
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const stored = getRecentActivities();
      if (stored && stored.length > 0) {
        return stored;
      }
    } catch (e) {
      console.error('Failed to load activities from localStorage:', e);
    }
    
    // Initial demo data with timestamps
    const now = Date.now();
    return [
      { id: '1', title: 'The Batman - Official Trailer 2', platform: 'Instagram', status: 'success' as const, time: '2 min ago', type: 'video' as const, timestamp: now - 2 * 60000 },
      { id: '2', title: 'Gladiator II - Trailer Review', platform: 'YouTube', status: 'success' as const, time: '3 min ago', type: 'videostudio' as const, timestamp: now - 3 * 60000 },
      { id: '3', title: 'Breaking: New Sci-Fi Movie Announced', platform: 'X', status: 'success' as const, time: '5 min ago', type: 'rss' as const, timestamp: now - 5 * 60000 },
      { id: '4', title: 'Dune: Part Two - Final Trailer', platform: 'TikTok', status: 'success' as const, time: '15 min ago', type: 'video' as const, timestamp: now - 15 * 60000 },
      { id: '5', title: 'Hollywood Reporter: Awards Season Update', platform: 'Threads', status: 'success' as const, time: '30 min ago', type: 'rss' as const, timestamp: now - 30 * 60000 },
      { id: '6', title: 'Oppenheimer - Official Trailer', platform: 'YouTube', status: 'success' as const, time: '1 hour ago', type: 'video' as const, timestamp: now - 60 * 60000 },
      { id: '7', title: 'Wicked - Monthly Releases', platform: 'Instagram', status: 'failed' as const, time: '1 hour ago', type: 'videostudio' as const, timestamp: now - 60 * 60000 },
      { id: '8', title: 'Barbie - Teaser Trailer', platform: 'Facebook', status: 'failed' as const, time: '2 hours ago', type: 'video' as const, timestamp: now - 120 * 60000 },
      { id: '9', title: 'Variety: Top 10 Box Office Films', platform: 'X', status: 'failed' as const, time: '2 hours ago', type: 'rss' as const, timestamp: now - 120 * 60000 },
      { id: '10', title: 'Avatar 3 - Teaser Analysis', platform: 'TikTok', status: 'success' as const, time: '3 hours ago', type: 'videostudio' as const, timestamp: now - 180 * 60000 },
      { id: '11', title: 'Killers of the Flower Moon - Trailer', platform: 'X', status: 'success' as const, time: '3 hours ago', type: 'video' as const, timestamp: now - 180 * 60000 },
      { id: '12', title: 'Deadline: Streaming Wars Continue', platform: 'Threads', status: 'success' as const, time: '4 hours ago', type: 'rss' as const, timestamp: now - 240 * 60000 },
      { id: '13', title: 'Wonka - Official Trailer', platform: 'Threads', status: 'success' as const, time: '4 hours ago', type: 'video' as const, timestamp: now - 240 * 60000 },
      { id: '14', title: 'Napoleon - Final Trailer', platform: 'Instagram', status: 'failed' as const, time: '5 hours ago', type: 'video' as const, timestamp: now - 300 * 60000 },
      { id: '15', title: 'IndieWire: Festival Circuit News', platform: 'Facebook', status: 'success' as const, time: '5 hours ago', type: 'rss' as const, timestamp: now - 300 * 60000 },
      { id: '16', title: 'The Marvels - Trailer 2', platform: 'TikTok', status: 'success' as const, time: '6 hours ago', type: 'video' as const, timestamp: now - 360 * 60000 },
      { id: '17', title: 'Aquaman 2 - Official Trailer', platform: 'Facebook', status: 'success' as const, time: '7 hours ago', type: 'video' as const, timestamp: now - 420 * 60000 },
      { id: '18', title: 'Spider-Man: Beyond - Teaser', platform: 'YouTube', status: 'success' as const, time: '8 hours ago', type: 'video' as const, timestamp: now - 480 * 60000 },
    ];
  });

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('recentActivities', JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to save activities to localStorage:', e);
    }
  }, [activities]);

  // Auto-delete activities older than retention period
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const retentionHours = parseInt(settings.recentActivityRetention || '24', 10);
      const retentionMs = retentionHours * 60 * 60 * 1000;
      
      setActivities(prev => {
        const filtered = prev.filter(activity => {
          const age = now - activity.timestamp;
          return age < retentionMs;
        });
        
        // Only update if something changed
        if (filtered.length !== prev.length) {
          return filtered;
        }
        return prev;
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [settings.recentActivityRetention]);

  // Update time display every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => 
        prev.map(activity => ({
          ...activity,
          time: getTimeAgo(activity.timestamp)
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id: string) => {
    haptics.medium();
    
    // Find the activity to delete
    const deletedActivity = activities.find(activity => activity.id === id);
    if (!deletedActivity) return;
    
    // Temporarily remove from state
    setActivities(prev => prev.filter(activity => activity.id !== id));
    
    // Show undo toast
    showUndo({
      id,
      itemName: deletedActivity.title,
      onUndo: () => {
        // Restore the activity
        setActivities(prev => {
          // Find the correct position to insert based on timestamp
          const insertIndex = prev.findIndex(activity => 
            activity.timestamp < deletedActivity.timestamp
          );
          if (insertIndex === -1) {
            return [...prev, deletedActivity];
          }
          return [
            ...prev.slice(0, insertIndex),
            deletedActivity,
            ...prev.slice(insertIndex)
          ];
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <button
          onClick={() => {
            haptics.light();
            onNavigate('dashboard');
          }}
          className="text-gray-900 dark:text-white hover:text-[#ec1e24] p-2 -ml-2 mt-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12H2M9 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900 dark:text-white mb-2">Recent Activity</h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">Complete history of all automation activities.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm p-6">
        <div className="space-y-3">
          {activities.map((activity) => (
            <SwipeableActivityItem
              key={activity.id}
              activity={activity}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}