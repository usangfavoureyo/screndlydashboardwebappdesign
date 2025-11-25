import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect } from 'react';

interface RecentActivityPageProps {
  onNavigate: (page: string) => void;
}

export function RecentActivityPage({ onNavigate }: RecentActivityPageProps) {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activities = [
    { id: '1', title: 'The Batman - Official Trailer 2', platform: 'Instagram', status: 'success', time: '2 min ago', type: 'video' },
    { id: '2', title: 'Gladiator II - Trailer Review', platform: 'YouTube', status: 'success', time: '3 min ago', type: 'videostudio' },
    { id: '3', title: 'Breaking: New Sci-Fi Movie Announced', platform: 'X', status: 'success', time: '5 min ago', type: 'rss' },
    { id: '4', title: 'Dune: Part Two - Final Trailer', platform: 'TikTok', status: 'success', time: '15 min ago', type: 'video' },
    { id: '5', title: 'Hollywood Reporter: Awards Season Update', platform: 'Threads', status: 'success', time: '30 min ago', type: 'rss' },
    { id: '6', title: 'Oppenheimer - Official Trailer', platform: 'YouTube', status: 'success', time: '1 hour ago', type: 'video' },
    { id: '7', title: 'Wicked - Monthly Releases', platform: 'Instagram', status: 'failed', time: '1 hour ago', type: 'videostudio' },
    { id: '8', title: 'Barbie - Teaser Trailer', platform: 'Facebook', status: 'failed', time: '2 hours ago', type: 'video' },
    { id: '9', title: 'Variety: Top 10 Box Office Films', platform: 'X', status: 'failed', time: '2 hours ago', type: 'rss' },
    { id: '10', title: 'Avatar 3 - Teaser Analysis', platform: 'TikTok', status: 'success', time: '3 hours ago', type: 'videostudio' },
    { id: '11', title: 'Killers of the Flower Moon - Trailer', platform: 'X', status: 'success', time: '3 hours ago', type: 'video' },
    { id: '12', title: 'Deadline: Streaming Wars Continue', platform: 'Threads', status: 'success', time: '4 hours ago', type: 'rss' },
    { id: '13', title: 'Wonka - Official Trailer', platform: 'Threads', status: 'success', time: '4 hours ago', type: 'video' },
    { id: '14', title: 'Napoleon - Final Trailer', platform: 'Instagram', status: 'failed', time: '5 hours ago', type: 'video' },
    { id: '15', title: 'IndieWire: Festival Circuit News', platform: 'Facebook', status: 'success', time: '5 hours ago', type: 'rss' },
    { id: '16', title: 'The Marvels - Trailer 2', platform: 'TikTok', status: 'success', time: '6 hours ago', type: 'video' },
    { id: '17', title: 'Aquaman 2 - Official Trailer', platform: 'Facebook', status: 'success', time: '7 hours ago', type: 'video' },
    { id: '18', title: 'Spider-Man: Beyond - Teaser', platform: 'YouTube', status: 'success', time: '8 hours ago', type: 'video' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <button
          onClick={() => onNavigate('dashboard')}
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
            <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl transition-colors duration-200">
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">{activity.title}</p>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">{activity.platform}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full ${
                    activity.status === 'success'
                      ? 'bg-gray-200 dark:bg-[#1f1f1f] text-gray-700 dark:text-[#9CA3AF]'
                      : 'bg-[#FEE2E2] dark:bg-[#991B1B] text-[#991B1B] dark:text-[#FEE2E2]'
                  }`}
                >
                  {activity.status}
                </span>
                <span className="text-[#6B7280] dark:text-[#9CA3AF] min-w-[80px] text-right">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}