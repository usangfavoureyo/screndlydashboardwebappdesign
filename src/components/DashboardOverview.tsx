import { StatCard } from './StatCard';
import { Video, Radio, Globe, AlertCircle, HardDrive, MessageSquare, Rss, Clapperboard, Calendar, TrendingUp, Zap, CheckCircle, Key, Film } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const chartData = [
  { date: 'Mon', videos: 12 },
  { date: 'Tue', videos: 19 },
  { date: 'Wed', videos: 8 },
  { date: 'Thu', videos: 15 },
  { date: 'Fri', videos: 22 },
  { date: 'Sat', videos: 17 },
  { date: 'Sun', videos: 11 },
];

const platformData = [
  { platform: 'X', posts: 49 },
  { platform: 'Threads', posts: 41 },
  { platform: 'Facebook', posts: 38 },
  { platform: 'Instagram', posts: 34 },
  { platform: 'YouTube', posts: 28 },
  { platform: 'TikTok', posts: 22 },
];

interface DashboardOverviewProps {
  onNavigate: (page: string, source?: string) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF]">Welcome back! Here's what's happening with your automation.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Systems Log Card */}
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200 sm:col-span-2 lg:col-span-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <HardDrive className="w-6 h-6 text-[#ec1e24]" />
              <div>
                <h3 className="text-gray-900 dark:text-white">Logs</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Log monitoring</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
              onClick={() => {
                haptics.light();
                onNavigate('logs');
              }}
            >
              View all
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cache Hit Rate */}
            <div 
              className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#ec1e24]" />
                <span className="text-xs text-gray-500 dark:text-[#6B7280]">Efficient</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-white mb-0.5">87%</div>
              <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">Cache Hit Rate</div>
            </div>

            {/* System Errors */}
            <div 
              className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[#ec1e24]" />
                <span className="text-xs text-gray-500 dark:text-[#6B7280]">-3 resolved</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-white mb-0.5">2</div>
              <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">System Errors</div>
            </div>

            {/* Daily Failures */}
            <div 
              className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-[#ec1e24]" />
                <span className="text-xs text-gray-500 dark:text-[#6B7280]">Today</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-white mb-0.5">3</div>
              <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">Daily Failures</div>
            </div>

            {/* Daily Success */}
            <div 
              className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-[#ec1e24]" />
                <span className="text-xs text-gray-500 dark:text-[#6B7280]">Today</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-white mb-0.5">44</div>
              <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">Daily Success</div>
            </div>
          </div>
        </div>

        {/* Videos Card */}
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200 sm:col-span-2 lg:col-span-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6 text-[#ec1e24]" />
              <div>
                <h3 className="text-gray-900 dark:text-white">Videos</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Active video monitoring</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
              onClick={() => {
                haptics.light();
                onNavigate('video-details', 'dashboard');
              }}
            >
              View all
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Active Channels */}
            <div 
              className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-[#ec1e24]" />
                <span className="text-xs text-gray-500 dark:text-[#6B7280]">+3 new</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-white mb-0.5">23</div>
              <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">Active Channels</div>
            </div>

            {/* Daily Videos Posted */}
            <div 
              className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-4 h-4 text-[#ec1e24]" />
                <span className="text-xs text-gray-500 dark:text-[#6B7280]">Today</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-white mb-0.5">47</div>
              <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">Daily Videos Posted</div>
            </div>
          </div>

          {/* Video Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Video Processing Trends */}
            <div>
              <h4 className="text-gray-900 dark:text-white mb-4">Video Processing Trends</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF" 
                    tick={{ fill: '#9CA3AF' }}
                    interval={0}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
                      border: isDarkMode ? '1px solid #333333' : '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      color: isDarkMode ? '#FFFFFF' : '#000000',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="videos"
                    stroke="#ec1e24"
                    strokeWidth={2}
                    dot={{ fill: '#ec1e24', r: 4 }}
                    name="Videos Processed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Video Distribution Platform */}
            <div>
              <h4 className="text-gray-900 dark:text-white mb-4">Video Distribution Platform</h4>
              <div className="space-y-4">
                {platformData.map((item) => {
                  const maxPosts = Math.max(...platformData.map(p => p.posts));
                  const percentage = (item.posts / maxPosts) * 100;
                  
                  return (
                    <div key={item.platform}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-900 dark:text-white">{item.platform}</span>
                        <span className="text-[#6B7280] dark:text-[#9CA3AF]">{item.posts} videos</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-[#0A0A0A] rounded-full h-2.5">
                        <div 
                          className="bg-[#ec1e24] h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automation Overview */}
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Rss className="w-6 h-6 text-[#ec1e24]" />
              <div>
                <h3 className="text-gray-900 dark:text-white">RSS Feeds</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Active feed monitoring</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
              onClick={() => {
                haptics.light();
                onNavigate('rss-activity', 'dashboard');
              }}
            >
              View all
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* RSS Feeds Active */}
            <div 
              className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Rss className="w-4 h-4 text-[#ec1e24]" />
                <span className="text-xs text-gray-500 dark:text-[#6B7280]">Active</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-white mb-0.5">4</div>
              <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">RSS Feeds Active</div>
            </div>

            {/* Daily RSS Feeds Posted */}
            <div 
              className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[#ec1e24]" />
                <span className="text-xs text-gray-500 dark:text-[#6B7280]">Today</span>
              </div>
              <div className="text-2xl text-gray-900 dark:text-white mb-0.5">18</div>
              <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">Daily RSS Feeds Posted</div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Variety - Latest Movie News', posts: 127, status: 'Active', color: 'green' },
              { title: 'The Hollywood Reporter', posts: 89, status: 'Active', color: 'green' },
              { title: 'IMDb News', posts: 156, status: 'Active', color: 'green' },
              { title: 'Collider', posts: 93, status: 'Paused', color: 'orange' },
            ].map((feed, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333]">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></div>
                  <div>
                    <p className="text-gray-900 dark:text-white">{feed.title}</p>
                    <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">{feed.posts} posts generated</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-[#333333]">
                  {feed.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Automation Widget */}
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-[#ec1e24]" />
              <div>
                <h3 className="text-gray-900 dark:text-white">Comment Automation</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">AI-powered responses</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
              onClick={() => {
                haptics.light();
                onNavigate('comment-automation', 'dashboard');
              }}
            >
              View all
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
              <p className="text-2xl text-gray-900 dark:text-white mb-1">142</p>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Replies Today</p>
            </div>
            <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
              <p className="text-2xl text-gray-900 dark:text-white mb-1">87%</p>
              <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Success Rate</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm text-gray-900 dark:text-white">Recent Replies</h4>
            {[
              { comment: 'Can\'t wait to see this!', reply: 'We\'re excited too! 🎬', platform: 'X' },
              { comment: 'Release date?', reply: 'Coming to theaters Nov 22!', platform: 'Facebook' },
              { comment: 'Looks amazing!', reply: 'Thanks for your support! ❤️', platform: 'Threads' },
            ].map((item, index) => (
              <div key={index} className="p-3 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333]">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-[#9CA3AF] italic">"{item.comment}"</p>
                  <span className="text-xs text-gray-900 dark:text-white">{item.platform}</span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white">↳ {item.reply}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TMDb Feeds Widget */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clapperboard className="w-6 h-6 text-[#ec1e24]" />
            <div>
              <h3 className="text-gray-900 dark:text-white">TMDb Feeds</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Upcoming scheduled posts</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
            onClick={() => {
              haptics.light();
              onNavigate('tmdb-activity', 'dashboard');
            }}
          >
            View all
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
            <p className="text-2xl text-gray-900 dark:text-white mb-1">24</p>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">TMDb Feeds Ready</p>
          </div>
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
            <p className="text-2xl text-gray-900 dark:text-white mb-1">7 Days</p>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Coverage</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm text-gray-900 dark:text-white">Next 7 Days</h4>
          {[
            { date: 'Nov 18', title: 'The Matrix', type: '25th Anniversary', time: '9:00 AM' },
            { date: 'Nov 19', title: 'Arcane S2', type: 'Monthly', time: '11:00 AM' },
            { date: 'Nov 20', title: 'Terrifier 3', type: 'Weekly', time: '3:30 PM' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333]">
              <div className="flex items-center gap-3">
                <div className="text-center min-w-[50px]">
                  <div className="text-xs text-gray-500 dark:text-[#6B7280]">{item.date}</div>
                  <div className="text-sm text-[#ec1e24]">{item.time}</div>
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">{item.type}</p>
                </div>
              </div>
              <Clapperboard className="w-5 h-5 text-[#ec1e24]" />
            </div>
          ))}
        </div>
      </div>

      {/* Video Studio Widget */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-[#ec1e24]" />
            <div>
              <h3 className="text-gray-900 dark:text-white">Video Studio</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Video generation activity</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
            onClick={() => {
              haptics.light();
              onNavigate('video-studio-activity', 'dashboard');
            }}
          >
            View all
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
            <p className="text-2xl text-gray-900 dark:text-white mb-1">12</p>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Videos Generated</p>
          </div>
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
            <p className="text-2xl text-gray-900 dark:text-white mb-1">8</p>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Videos Published</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm text-gray-900 dark:text-white">Recent Activity</h4>
          {[
            { title: 'Gladiator II - Review', type: 'Video Review', status: 'Published', time: '2h ago' },
            { title: 'November 2024 Releases', type: 'Monthly Releases', status: 'Generating', time: '5h ago' },
            { title: 'Wicked - Review', type: 'Video Review', status: 'Published', time: '1d ago' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333]">
              <div>
                <p className="text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">{item.type}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-900 dark:text-white mb-0.5">{item.status}</p>
                <p className="text-xs text-gray-500 dark:text-[#6B7280]">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Manager */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <HardDrive className="w-6 h-6 text-[#ec1e24]" />
            <div>
              <h3 className="text-gray-900 dark:text-white">Upload Manager</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Video upload pipeline</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
            onClick={() => {
              haptics.light();
              onNavigate('upload-manager', 'dashboard');
            }}
          >
            View all
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
            <p className="text-2xl text-gray-900 dark:text-white mb-1">8</p>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Active Uploads</p>
          </div>
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
            <p className="text-2xl text-gray-900 dark:text-white mb-1">47</p>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">Completed Today</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm text-gray-900 dark:text-white">Pipeline Status</h4>
          {[
            { title: 'Dune_Part_Three_Trailer.mp4', stage: 'Encoding', progress: 78 },
            { title: 'Gladiator_II_Final_Trailer.mp4', stage: 'Generating Metadata', progress: 45 },
            { title: 'Avatar_3_Teaser.mp4', stage: 'Uploading', progress: 92 },
          ].map((item, index) => (
            <div key={index} className="p-3 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">{item.stage}</p>
                </div>
                <span className="text-xs text-gray-900 dark:text-white">{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-[#0A0A0A] rounded-full h-1.5">
                <div 
                  className="bg-[#ec1e24] h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Usage */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-[#ec1e24]" />
            <div>
              <h3 className="text-gray-900 dark:text-white">API Usage</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Track API usage</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
            onClick={() => {
              haptics.light();
              onNavigate('api-usage', 'dashboard');
            }}
          >
            View all
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* OpenAI API Usage */}
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#ec1e24]" />
              <span className="text-xs text-gray-500 dark:text-[#6B7280]">Today</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white mb-0.5">1,247</div>
            <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">OpenAI API Usage</div>
          </div>

          {/* Serper API Usage */}
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-[#ec1e24]" />
              <span className="text-xs text-gray-500 dark:text-[#6B7280]">Today</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white mb-0.5">892</div>
            <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">Serper API Usage</div>
          </div>

          {/* TMDb API Usage */}
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
            <div className="flex items-center gap-2 mb-2">
              <Clapperboard className="w-4 h-4 text-[#ec1e24]" />
              <span className="text-xs text-gray-500 dark:text-[#6B7280]">Today</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white mb-0.5">3,451</div>
            <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">TMDb API Usage</div>
          </div>

          {/* Vizla API Usage */}
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333]">
            <div className="flex items-center gap-2 mb-2">
              <Film className="w-4 h-4 text-[#ec1e24]" />
              <span className="text-xs text-gray-500 dark:text-[#6B7280]">Today</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white mb-0.5">127</div>
            <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">Vizla API Usage</div>
          </div>

          {/* Total API Calls */}
          <div className="bg-white dark:bg-[#000000] rounded-xl p-4 border border-gray-200 dark:border-[#333333] col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#ec1e24]" />
              <span className="text-xs text-gray-500 dark:text-[#6B7280]">Today</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white mb-0.5">5,717</div>
            <div className="text-xs text-gray-600 dark:text-[#9CA3AF]">Total API Calls</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 dark:text-white">Recent Activity</h3>
          <Button 
            variant="outline" 
            className="text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
            onClick={() => {
              haptics.light();
              onNavigate('activity');
            }}
          >
            View all
          </Button>
        </div>
        <div className="space-y-3">
          {[
            { title: 'The Batman - Official Trailer 2', platform: 'Instagram', status: 'success', time: '2 min ago' },
            { title: 'Dune: Part Two - Final Trailer', platform: 'TikTok', status: 'success', time: '15 min ago' },
            { title: 'Oppenheimer - Official Trailer', platform: 'YouTube', status: 'success', time: '1 hour ago' },
            { title: 'Barbie - Teaser Trailer', platform: 'Facebook', status: 'failed', time: '2 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl transition-colors duration-200">
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