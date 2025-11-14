import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LogEntry {
  id: string;
  videoTitle: string;
  platform: string;
  status: 'success' | 'failed';
  timestamp: string;
  error?: string;
  errorDetails?: string;
}

const mockLogs: LogEntry[] = [
  { id: '1', videoTitle: 'The Batman - Official Trailer 2', platform: 'Instagram', status: 'success', timestamp: '2025-11-13 14:32' },
  { id: '2', videoTitle: 'Dune: Part Two - Final Trailer', platform: 'TikTok', status: 'success', timestamp: '2025-11-13 14:15' },
  { id: '3', videoTitle: 'Oppenheimer - Official Trailer', platform: 'YouTube', status: 'success', timestamp: '2025-11-13 13:20' },
  { id: '4', videoTitle: 'Barbie - Teaser Trailer', platform: 'Facebook', status: 'failed', timestamp: '2025-11-13 12:45', error: 'API rate limit exceeded', errorDetails: 'Failed at posting stage: Facebook API returned 429 error' },
  { id: '5', videoTitle: 'Killers of the Flower Moon - Trailer', platform: 'X', status: 'success', timestamp: '2025-11-13 11:30' },
  { id: '6', videoTitle: 'Wonka - Official Trailer', platform: 'Threads', status: 'success', timestamp: '2025-11-13 10:15' },
  { id: '7', videoTitle: 'Napoleon - Final Trailer', platform: 'Instagram', status: 'failed', timestamp: '2025-11-13 09:20', error: 'Invalid access token', errorDetails: 'Failed at authentication: Token expired on 2025-11-12' },
  { id: '8', videoTitle: 'The Marvels - Trailer 2', platform: 'TikTok', status: 'success', timestamp: '2025-11-13 08:45' },
];

export function LogsPage() {
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const filteredLogs = mockLogs.filter(log => {
    if (platformFilter !== 'all' && log.platform !== platformFilter) return false;
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const displayedLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Logs</h1>
        <p className="text-[#9CA3AF]">View recent automation jobs and their status.</p>
      </div>

      {/* Filters */}
      <div className="bg-[#1F2937] rounded-2xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="Threads">Threads</SelectItem>
                <SelectItem value="X">X</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#1F2937] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#374151]">
              <tr>
                <th className="text-left p-4 text-[#9CA3AF]">Video Title</th>
                <th className="text-left p-4 text-[#9CA3AF]">Platform</th>
                <th className="text-left p-4 text-[#9CA3AF]">Status</th>
                <th className="text-left p-4 text-[#9CA3AF]">Timestamp</th>
                <th className="text-left p-4 text-[#9CA3AF]">Error</th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs.map((log) => (
                <tr key={log.id} className="border-b border-[#374151] last:border-0 hover:bg-[#374151] transition-colors duration-200">
                  <td className="p-4 text-white">{log.videoTitle}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-[#374151] text-[#9CA3AF] rounded-full">
                      {log.platform}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        log.status === 'success'
                          ? 'bg-[#065F46] text-[#D1FAE5]'
                          : 'bg-[#991B1B] text-[#FEE2E2]'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#9CA3AF]">{log.timestamp}</td>
                  <td className="p-4">
                    {log.error ? (
                      <div>
                        <p className="text-[#EF4444]">{log.error}</p>
                        {log.errorDetails && (
                          <p className="text-[#9CA3AF] text-xs mt-1">{log.errorDetails}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#9CA3AF]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-[#374151]">
          <p className="text-[#9CA3AF]">
            Showing {startIndex + 1} to {Math.min(startIndex + logsPerPage, filteredLogs.length)} of {filteredLogs.length} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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