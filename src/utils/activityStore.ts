// Centralized activity store for tracking all user actions across the app
// Used by Video Studio Activity, Recent Activity, and Logs pages

export interface VideoStudioActivity {
  id: string;
  type: 'review' | 'monthly' | 'scenes';
  title: string;
  status: 'completed' | 'processing' | 'failed';
  timestamp: string;
  timestampMs: number;
  aspectRatio?: string;
  duration: string;
  downloads: number;
  published: boolean;
  platforms: string[];
  progress?: number;
  error?: string;
  // Scene-specific fields
  sceneStart?: string;
  sceneEnd?: string;
  sceneSource?: 'local' | 'backblaze';
  sceneSourceName?: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  platform: string;
  status: 'success' | 'failed';
  time: string;
  type: 'video' | 'videostudio' | 'rss' | 'tmdb' | 'scenes';
  timestamp: number;
}

export interface LogEntry {
  id: string;
  videoTitle: string;
  platform: string;
  status: 'success' | 'failed';
  timestamp: string;
  error?: string;
  errorDetails?: string;
  type: 'video' | 'rss' | 'tmdb' | 'videostudio' | 'scenes';
}

// Add a new video studio activity
export function addVideoStudioActivity(activity: Omit<VideoStudioActivity, 'id' | 'timestampMs'>) {
  const id = `vsa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestampMs = Date.now();
  
  const newActivity: VideoStudioActivity = {
    ...activity,
    id,
    timestampMs,
  };
  
  // Get existing activities
  const stored = localStorage.getItem('videoStudioActivities');
  const activities: VideoStudioActivity[] = stored ? JSON.parse(stored) : [];
  
  // Add new activity at the beginning
  activities.unshift(newActivity);
  
  // Keep only last 100 activities
  if (activities.length > 100) {
    activities.splice(100);
  }
  
  // Save back to localStorage
  localStorage.setItem('videoStudioActivities', JSON.stringify(activities));
  
  return newActivity;
}

// Add a new recent activity
export function addRecentActivity(activity: Omit<RecentActivity, 'id' | 'timestamp' | 'time'>) {
  const id = `ra_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = Date.now();
  const time = 'Just now';
  
  const newActivity: RecentActivity = {
    ...activity,
    id,
    timestamp,
    time,
  };
  
  // Get existing activities
  const stored = localStorage.getItem('recentActivities');
  const activities: RecentActivity[] = stored ? JSON.parse(stored) : [];
  
  // Add new activity at the beginning
  activities.unshift(newActivity);
  
  // Keep only last 100 activities
  if (activities.length > 100) {
    activities.splice(100);
  }
  
  // Save back to localStorage
  localStorage.setItem('recentActivities', JSON.stringify(activities));
  
  return newActivity;
}

// Add a new log entry
export function addLogEntry(entry: Omit<LogEntry, 'id' | 'timestamp'>) {
  const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
  
  const newEntry: LogEntry = {
    ...entry,
    id,
    timestamp,
  };
  
  // Get existing logs
  const stored = localStorage.getItem('systemLogs');
  const logs: LogEntry[] = stored ? JSON.parse(stored) : [];
  
  // Add new log at the beginning
  logs.unshift(newEntry);
  
  // Keep only last 200 logs
  if (logs.length > 200) {
    logs.splice(200);
  }
  
  // Save back to localStorage
  localStorage.setItem('systemLogs', JSON.stringify(logs));
  
  return newEntry;
}

// Update an existing video studio activity (for progress updates)
export function updateVideoStudioActivity(id: string, updates: Partial<VideoStudioActivity>) {
  const stored = localStorage.getItem('videoStudioActivities');
  if (!stored) return null;
  
  const activities: VideoStudioActivity[] = JSON.parse(stored);
  const index = activities.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  activities[index] = {
    ...activities[index],
    ...updates,
  };
  
  localStorage.setItem('videoStudioActivities', JSON.stringify(activities));
  
  return activities[index];
}

// Get all video studio activities
export function getVideoStudioActivities(): VideoStudioActivity[] {
  const stored = localStorage.getItem('videoStudioActivities');
  return stored ? JSON.parse(stored) : [];
}

// Get all recent activities
export function getRecentActivities(): RecentActivity[] {
  const stored = localStorage.getItem('recentActivities');
  return stored ? JSON.parse(stored) : [];
}

// Get all log entries
export function getLogEntries(): LogEntry[] {
  const stored = localStorage.getItem('systemLogs');
  return stored ? JSON.parse(stored) : [];
}
