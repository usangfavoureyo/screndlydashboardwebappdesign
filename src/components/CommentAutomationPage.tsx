import { MessageSquare } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { XIcon } from './icons/XIcon';
import { ThreadsIcon } from './icons/ThreadsIcon';
import { FacebookIcon } from './icons/FacebookIcon';

interface CommentAutomationPageProps {
  onBack: () => void;
}

const platformData = [
  {
    platform: 'X',
    color: '#000000',
    repliesToday: 48,
    successRate: '92%',
    recentReplies: [
      { comment: 'Can\'t wait to see this!', reply: 'We\'re excited too! 🎬', time: '2 min ago' },
      { comment: 'When is the release date?', reply: 'Coming soon! Stay tuned for updates.', time: '15 min ago' },
      { comment: 'This looks incredible!', reply: 'Thanks for your support! 🙌', time: '1 hour ago' },
      { comment: 'Is this coming to IMAX?', reply: 'Yes! IMAX release confirmed. Check local theaters.', time: '2 hours ago' },
      { comment: 'The trailer gave me goosebumps', reply: 'We\'re thrilled you loved it! 🎥', time: '3 hours ago' },
    ]
  },
  {
    platform: 'Facebook',
    color: '#1877F2',
    repliesToday: 56,
    successRate: '88%',
    recentReplies: [
      { comment: 'Release date?', reply: 'Coming to theaters Nov 22!', time: '5 min ago' },
      { comment: 'Who is directing this?', reply: 'Directed by Christopher Nolan!', time: '20 min ago' },
      { comment: 'Will this be on streaming?', reply: 'Theatrical release first, streaming later!', time: '45 min ago' },
      { comment: 'The cast looks amazing!', reply: 'We have an incredible ensemble! 🌟', time: '1 hour ago' },
      { comment: 'Is there a post-credits scene?', reply: 'No spoilers! You\'ll have to watch to find out. 😉', time: '2 hours ago' },
    ]
  },
  {
    platform: 'Threads',
    color: '#000000',
    repliesToday: 38,
    successRate: '85%',
    recentReplies: [
      { comment: 'Looks amazing!', reply: 'Thanks for your support! ❤️', time: '10 min ago' },
      { comment: 'Is this a sequel?', reply: 'It\'s a standalone story in the same universe!', time: '30 min ago' },
      { comment: 'The visuals are stunning!', reply: 'Wait till you see it on the big screen! 🎬', time: '1 hour ago' },
      { comment: 'Will there be a soundtrack release?', reply: 'Yes! Soundtrack drops next week. 🎵', time: '2 hours ago' },
      { comment: 'Any early screenings?', reply: 'Check our website for premiere event details!', time: '4 hours ago' },
    ]
  }
];

export function CommentAutomationPage({ onBack }: CommentAutomationPageProps) {
  // Helper function to get platform icon
  const getPlatformIcon = (platformName: string) => {
    switch (platformName) {
      case 'X':
        return <XIcon className="w-4 h-4" />;
      case 'Threads':
        return <ThreadsIcon className="w-5 h-5" />;
      case 'Facebook':
        return <FacebookIcon className="w-[26px] h-[26px]" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333]">
        <div className="flex items-start gap-4 p-4">
          <button
            onClick={() => {
              haptics.light();
              onBack();
            }}
            className="text-gray-900 dark:text-white hover:text-[#ec1e24] p-2 -ml-2 mt-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12H2M9 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-2xl text-gray-900 dark:text-white">Comment Activity</h1>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">AI-powered comment replies</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Overall Summary */}
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2">
              <MessageSquare className="w-5 h-5 text-[#ec1e24]" />
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white">Overall Performance</h2>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Today's activity</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
              <p className="text-2xl text-gray-900 dark:text-white mb-1">142</p>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Total Replies Today</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
              <p className="text-2xl text-gray-900 dark:text-white mb-1">87%</p>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Success Rate</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
              <p className="text-2xl text-gray-900 dark:text-white mb-1">3</p>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Active Platforms</p>
            </div>
          </div>
        </div>

        {/* Platform Breakdown */}
        {platformData.map((data, index) => (
          <div key={index} className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  {getPlatformIcon(data.platform)}
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white">{data.platform}</h3>
                  <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Comment replies</p>
                </div>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
                <p className="text-2xl text-gray-900 dark:text-white mb-1">{data.repliesToday}</p>
                <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Replies Today</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
                <p className="text-2xl text-gray-900 dark:text-white mb-1">{data.successRate}</p>
                <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Success Rate</p>
              </div>
            </div>

            {/* Recent Replies */}
            <div className="space-y-3">
              <h4 className="text-sm text-gray-900 dark:text-white">Recent Replies</h4>
              {data.recentReplies.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => haptics.light()}
                  className="w-full text-left p-4 bg-gray-50 dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-[#333333] hover:border-[#ec1e24] dark:hover:border-[#ec1e24] transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gray-600 dark:text-[#9CA3AF] italic flex-1">\"{item.comment}\"</p>
                    <span className="text-xs text-gray-500 dark:text-[#6B7280] ml-2">{item.time}</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">↳ {item.reply}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}