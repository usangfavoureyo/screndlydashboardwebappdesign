import { Video, ArrowLeft, TrendingUp, Radio } from 'lucide-react';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';
import { XIcon } from './icons/XIcon';
import { ThreadsIcon } from './icons/ThreadsIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { TikTokIcon } from './icons/TikTokIcon';

interface VideoDetailsPageProps {
  onNavigate: (page: string) => void;
  previousPage?: string | null;
}

// Platform video data
const platformVideos = [
  { platform: 'X', posts: 12, color: '#1DA1F2', change: '+3' },
  { platform: 'Threads', posts: 9, color: '#000000', change: '+2' },
  { platform: 'Facebook', posts: 8, color: '#1877F2', change: '+1' },
  { platform: 'Instagram', posts: 7, color: '#E4405F', change: '+2' },
  { platform: 'YouTube', posts: 6, color: '#FF0000', change: '+1' },
  { platform: 'TikTok', posts: 5, color: '#000000', change: '+1' },
];

export function VideoDetailsPage({ onNavigate, previousPage }: VideoDetailsPageProps) {
  const totalVideos = platformVideos.reduce((sum, p) => sum + p.posts, 0);

  // Helper function to get platform icon
  const getPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case 'X':
        return <XIcon className="w-4 h-4" />;
      case 'Threads':
        return <ThreadsIcon className="w-5 h-5" />;
      case 'Facebook':
        return <FacebookIcon className="w-[26px] h-[26px]" />;
      case 'Instagram':
        return <InstagramIcon className="w-6 h-6" />;
      case 'YouTube':
        return <YouTubeIcon className="w-[26px] h-[26px]" />;
      case 'TikTok':
        return <TikTokIcon className="w-[34px] h-[34px]" />;
      default:
        return <Video className="w-5 h-5" style={{ color: '#ec1e24' }} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            haptics.light();
            onNavigate(previousPage || 'dashboard');
          }}
          className="text-gray-900 dark:text-white hover:text-[#ec1e24] p-2 -ml-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12H2M9 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Video Activity</h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">Videos posted across all platforms today</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="flex items-center gap-3 mb-2">
            <Video className="w-5 h-5 text-[#ec1e24]" />
            <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Total Videos</span>
          </div>
          <p className="text-3xl text-gray-900 dark:text-white mb-1">{totalVideos}</p>
          <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">+10 from yesterday</p>
        </div>

        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="flex items-center gap-3 mb-2">
            <Radio className="w-5 h-5 text-[#ec1e24]" />
            <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Active Channels</span>
          </div>
          <p className="text-3xl text-gray-900 dark:text-white mb-1">23</p>
          <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">+3 new channels</p>
        </div>

        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-[#ec1e24]" />
            <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Avg. Engagement</span>
          </div>
          <p className="text-3xl text-gray-900 dark:text-white mb-1">4.2K</p>
          <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">+12% increase</p>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div>
        <h2 className="text-gray-900 dark:text-white mb-4">Videos by Platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {platformVideos.map((platform) => (
            <div
              key={platform.platform}
              className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-all cursor-pointer"
              onClick={() => haptics.light()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center">
                    {getPlatformIcon(platform.platform)}
                  </div>
                  <h3 className="text-gray-900 dark:text-white">{platform.platform}</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-4xl text-gray-900 dark:text-white mb-1">{platform.posts}</p>
                  <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Videos posted today</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Posts Timeline */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
        <h2 className="text-gray-900 dark:text-white mb-4">Recent Posts Timeline</h2>
        <div className="space-y-3">
          {[
            { title: 'Dune: Part Two - Official Trailer', platform: 'X', time: '5 min ago' },
            { title: 'Barbie - Behind the Scenes', platform: 'Instagram', time: '12 min ago' },
            { title: 'Oppenheimer - IMAX Experience', platform: 'YouTube', time: '24 min ago' },
            { title: 'The Batman - Deleted Scene', platform: 'TikTok', time: '38 min ago' },
            { title: 'Spider-Man - No Way Home BTS', platform: 'Facebook', time: '1 hour ago' },
            { title: 'Guardians Vol 3 - Teaser', platform: 'Threads', time: '1 hour ago' },
          ].map((post, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333] hover:border-[#ec1e24] dark:hover:border-[#ec1e24] transition-all cursor-pointer"
              onClick={() => haptics.light()}
            >
              <div className="w-2 h-2 rounded-full bg-black dark:bg-white"></div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white mb-1">{post.title}</p>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-[#9CA3AF]">
                  <span>{post.platform}</span>
                  <span>•</span>
                  <span>{post.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}