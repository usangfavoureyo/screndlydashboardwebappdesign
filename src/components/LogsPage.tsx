import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, RefreshCw, Video, Rss, Clapperboard, Film } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { getPlatformConnection, PlatformType } from '../utils/platformConnections';
import { SwipeableLogRow } from './SwipeableLogRow';
import { useUndo } from './UndoContext';

interface LogEntry {
  id: string;
  videoTitle: string;
  platform: string;
  status: 'success' | 'failed';
  timestamp: string;
  error?: string;
  errorDetails?: string;
  type: 'video' | 'rss' | 'tmdb' | 'videostudio' | 'scenes';
}

const mockLogs: LogEntry[] = [
  { id: '1', videoTitle: 'The Batman - Official Trailer 2', platform: 'Instagram', status: 'success', timestamp: '2025-11-13 14:32', type: 'video' },
  { id: '2', videoTitle: 'Gladiator II - Trailer Review', platform: 'YouTube', status: 'success', timestamp: '2025-11-13 14:25', type: 'videostudio' },
  { id: '3', videoTitle: 'Breaking: New Sci-Fi Movie Announced', platform: 'X', status: 'success', timestamp: '2025-11-13 14:20', type: 'rss' },
  { id: '4', videoTitle: 'Gladiator II - Today Feed', platform: 'X', status: 'success', timestamp: '2025-11-13 14:10', type: 'tmdb' },
  { id: '5', videoTitle: 'Dune: Part Two - Final Trailer', platform: 'TikTok', status: 'success', timestamp: '2025-11-13 14:15', type: 'video' },
  { id: '6', videoTitle: 'The Matrix 25th Anniversary', platform: 'Threads', status: 'success', timestamp: '2025-11-13 13:50', type: 'tmdb' },
  { id: '7', videoTitle: 'Hollywood Reporter: Awards Season Update', platform: 'Threads', status: 'success', timestamp: '2025-11-13 13:45', type: 'rss' },
  { id: '8', videoTitle: 'Wicked - Monthly Releases', platform: 'Instagram', status: 'failed', timestamp: '2025-11-13 13:30', error: 'Video generation failed', errorDetails: 'LLM API returned 500 error - token limit exceeded', type: 'videostudio' },
  { id: '9', videoTitle: 'Oppenheimer - Official Trailer', platform: 'YouTube', status: 'success', timestamp: '2025-11-13 13:20', type: 'video' },
  { id: '10', videoTitle: 'Interstellar 10th Anniversary', platform: 'Facebook', status: 'success', timestamp: '2025-11-13 13:00', type: 'tmdb' },
  { id: '11', videoTitle: 'Barbie - Teaser Trailer', platform: 'Facebook', status: 'failed', timestamp: '2025-11-13 12:45', error: 'API rate limit exceeded', errorDetails: 'Failed at posting stage: Facebook API returned 429 error', type: 'video' },
  { id: '12', videoTitle: 'Variety: Top 10 Box Office Films', platform: 'X', status: 'failed', timestamp: '2025-11-13 12:30', error: 'Duplicate content detected', errorDetails: 'This RSS entry was already posted within the last 24 hours', type: 'rss' },
  { id: '13', videoTitle: 'Terrifier 3 - Weekly Feed', platform: 'X', status: 'failed', timestamp: '2025-11-13 12:15', error: 'Image failed to load', errorDetails: 'TMDb poster image returned 404', type: 'tmdb' },
  { id: '14', videoTitle: 'Avatar 3 - Teaser Analysis', platform: 'TikTok', status: 'success', timestamp: '2025-11-13 12:00', type: 'videostudio' },
  { id: '15', videoTitle: 'Killers of the Flower Moon - Trailer', platform: 'X', status: 'success', timestamp: '2025-11-13 11:30', type: 'video' },
  { id: '16', videoTitle: 'Deadline: Streaming Wars Continue', platform: 'Threads', status: 'success', timestamp: '2025-11-13 11:15', type: 'rss' },
  { id: '17', videoTitle: 'Arcane Season 2 - Monthly Feed', platform: 'Facebook', status: 'success', timestamp: '2025-11-13 11:00', type: 'tmdb' },
  { id: '18', videoTitle: 'Wonka - Official Trailer', platform: 'Threads', status: 'success', timestamp: '2025-11-13 10:15', type: 'video' },
  { id: '19', videoTitle: 'Napoleon - Final Trailer', platform: 'Instagram', status: 'failed', timestamp: '2025-11-13 09:20', error: 'Invalid access token', errorDetails: 'Failed at authentication: Token expired on 2025-11-12', type: 'video' },
  { id: '20', videoTitle: 'IndieWire: Festival Circuit News', platform: 'Facebook', status: 'success', timestamp: '2025-11-13 09:00', type: 'rss' },
  { id: '21', videoTitle: 'The Marvels - Trailer 2', platform: 'TikTok', status: 'success', timestamp: '2025-11-13 08:45', type: 'video' },
];

interface LogsPageProps {
  onNewNotification?: (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  onNavigate?: (page: string) => void;
}

export function LogsPage({ onNewNotification, onNavigate }: LogsPageProps) {
  const { showUndo } = useUndo();
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const platformUrls: Record<string, string> = {
    Instagram: 'https://www.instagram.com/screenrender',
    Threads: 'https://www.threads.com/@screenrender',
    Facebook: 'https://www.facebook.com/share/1A9AkTvUBA/',
    TikTok: 'https://www.tiktok.com/@screenrender?_r=1&_t=ZS-91QmcxgxZy5',
    YouTube: 'https://youtube.com/@screenrender?si=4iacQp4_QN8s5WaS',
    X: 'https://x.com/screenrender?t=KPASOaPQopdLqqmd-9JSuQ&s=09',
  };

  // Get platform URL - returns user's connected account if available, otherwise Screen Render's URL
  const getPlatformUrl = (platformName: string): string => {
    const connection = getPlatformConnection(platformName as PlatformType);
    return connection.profileUrl || platformUrls[platformName];
  };

  const handleRetry = (logId: string, videoTitle: string) => {
    haptics.medium();
    
    if (onNewNotification) {
      onNewNotification(
        'Retry Initiated',
        `Retrying upload for "${videoTitle}"`,
        'info'
      );
    }
  };

  const handleDelete = (logId: string) => {
    const deletedLog = logs.find(log => log.id === logId);
    if (!deletedLog) return;
    
    // Temporarily remove log from state
    setLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
    
    // Show undo toast
    showUndo({
      id: logId,
      itemName: deletedLog.videoTitle,
      onUndo: () => {
        // Restore the log
        setLogs(prevLogs => {
          // Find the correct position to insert based on timestamp
          const insertIndex = prevLogs.findIndex(log => 
            new Date(log.timestamp) < new Date(deletedLog.timestamp)
          );
          if (insertIndex === -1) {
            return [...prevLogs, deletedLog];
          }
          return [
            ...prevLogs.slice(0, insertIndex),
            deletedLog,
            ...prevLogs.slice(insertIndex)
          ];
        });
      },
      onConfirm: () => {
        // Show notification after undo timeout expires
        if (onNewNotification) {
          onNewNotification(
            'Log Deleted',
            `Removed "${deletedLog.videoTitle}" from logs`,
            'success'
          );
        }
      }
    });
  };

  const filteredLogs = logs.filter(log => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;
    if (platformFilter !== 'all' && log.platform !== platformFilter) return false;
    if (typeFilter !== 'all' && log.type !== typeFilter) return false;
    
    // Time filter
    if (timeFilter !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      
      switch (timeFilter) {
        case 'last-hour':
          if (logDate < new Date(now.getTime() - 60 * 60 * 1000)) return false;
          break;
        case 'last-24h':
          if (logDate < new Date(now.getTime() - 24 * 60 * 60 * 1000)) return false;
          break;
        case 'last-7d':
          if (logDate < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) return false;
          break;
        case 'last-30d':
          if (logDate < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)) return false;
          break;
      }
    }
    
    return true;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const displayedLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        {onNavigate && (
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
        )}
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Logs Activity</h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">View recent automation jobs and their status.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Select 
              value={typeFilter} 
              onValueChange={(value) => {
                haptics.light();
                setTypeFilter(value);
              }}
              onOpenChange={(open) => {
                if (!open) haptics.light(); // Haptic on collapse
              }}
            >
              <SelectTrigger className="rounded-lg border-gray-200 dark:border-[#333333]">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="rss">RSS</SelectItem>
                <SelectItem value="tmdb">TMDb Feeds</SelectItem>
                <SelectItem value="videostudio">Video Studio</SelectItem>
                <SelectItem value="scenes">Scenes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                haptics.light();
                setStatusFilter(value);
              }}
              onOpenChange={(open) => {
                if (!open) haptics.light(); // Haptic on collapse
              }}
            >
              <SelectTrigger className="rounded-lg border-gray-200 dark:border-[#333333]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select 
              value={platformFilter} 
              onValueChange={(value) => {
                haptics.light();
                setPlatformFilter(value);
              }}
              onOpenChange={(open) => {
                if (!open) haptics.light(); // Haptic on collapse
              }}
            >
              <SelectTrigger className="rounded-lg border-gray-200 dark:border-[#333333]">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="X">X</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Threads">Threads</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select 
              value={timeFilter} 
              onValueChange={(value) => {
                haptics.light();
                setTimeFilter(value);
              }}
              onOpenChange={(open) => {
                if (!open) haptics.light(); // Haptic on collapse
              }}
            >
              <SelectTrigger className="rounded-lg border-gray-200 dark:border-[#333333]">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last-hour">Last Hour</SelectItem>
                <SelectItem value="last-24h">Last 24 Hours</SelectItem>
                <SelectItem value="last-7d">Last 7 Days</SelectItem>
                <SelectItem value="last-30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] touch-pan-x touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-[#374151] sticky top-0 bg-white dark:bg-[#000000] z-10">
              <tr>
                <th className="text-left p-4 text-[#6B7280] dark:text-[#9CA3AF]">Content</th>
                <th className="text-left p-4 text-[#6B7280] dark:text-[#9CA3AF]">Source</th>
                <th className="text-left p-4 text-[#6B7280] dark:text-[#9CA3AF]">Platform</th>
                <th className="text-left p-4 text-[#6B7280] dark:text-[#9CA3AF]">Status</th>
                <th className="text-left p-4 text-[#6B7280] dark:text-[#9CA3AF]">Timestamp</th>
                <th className="text-left p-4 text-[#6B7280] dark:text-[#9CA3AF]">Error</th>
                <th className="text-left p-4 text-[#6B7280] dark:text-[#9CA3AF]">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs.map((log) => (
                <SwipeableLogRow 
                  key={log.id} 
                  log={log} 
                  onDelete={handleDelete}
                  onRetry={handleRetry}
                  platformUrls={platformUrls}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-[#374151]">
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">
            Showing {startIndex + 1} to {Math.min(startIndex + logsPerPage, filteredLogs.length)} of {filteredLogs.length} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                haptics.light();
                setCurrentPage(prev => Math.max(1, prev - 1));
              }}
              disabled={currentPage === 1}
              className="rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                haptics.light();
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
              }}
              disabled={currentPage === totalPages}
              className="rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}