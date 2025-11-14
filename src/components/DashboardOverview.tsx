import { StatCard } from './StatCard';
import { Video, Radio, Globe, AlertCircle, HardDrive, MessageSquare } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from './ui/button';

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
  { platform: 'Instagram', posts: 45 },
  { platform: 'Facebook', posts: 38 },
  { platform: 'TikTok', posts: 52 },
  { platform: 'Threads', posts: 41 },
  { platform: 'X', posts: 49 },
  { platform: 'YouTube', posts: 35 },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Dashboard</h1>
        <p className="text-[#9CA3AF]">Welcome back! Here's what's happening with your trailer automation.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Videos"
          value="1,284"
          icon={Video}
          iconColor="bg-[#F45247]"
          change="+12%"
          changeType="positive"
        />
        <StatCard
          title="Active Channels"
          value="23"
          icon={Radio}
          iconColor="bg-[#10B981]"
          change="+3"
          changeType="positive"
        />
        <StatCard
          title="Platform Posts"
          value="260"
          icon={Globe}
          iconColor="bg-[#F59E0B]"
          change="+18%"
          changeType="positive"
        />
        <StatCard
          title="Errors"
          value="4"
          icon={AlertCircle}
          iconColor="bg-[#EF4444]"
          change="-2"
          changeType="negative"
        />
        <StatCard
          title="Storage Used"
          value="2.4 GB"
          icon={HardDrive}
          iconColor="bg-[#8B5CF6]"
          change="Cleaned"
          changeType="positive"
        />
        <StatCard
          title="Comment Replies"
          value="142"
          icon={MessageSquare}
          iconColor="bg-[#06B6D4]"
          change="+24"
          changeType="positive"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Processing Trends */}
        <div className="bg-[#1F2937] rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-white mb-4">Video Processing Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                }}
              />
              <Line
                type="monotone"
                dataKey="videos"
                stroke="#F45247"
                strokeWidth={2}
                dot={{ fill: '#F45247', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Distribution */}
        <div className="bg-[#1F2937] rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-white mb-4">Platform Post Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="platform" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                }}
              />
              <Bar dataKey="posts" fill="#F45247" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1F2937] rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">Recent Activity</h3>
          <Button variant="ghost" className="text-[#F45247] hover:text-[#E04238]">
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
            <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#374151] transition-colors duration-200">
              <div className="flex-1">
                <p className="text-white">{activity.title}</p>
                <p className="text-[#9CA3AF]">{activity.platform}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full ${
                    activity.status === 'success'
                      ? 'bg-[#065F46] text-[#D1FAE5]'
                      : 'bg-[#991B1B] text-[#FEE2E2]'
                  }`}
                >
                  {activity.status}
                </span>
                <span className="text-[#9CA3AF] min-w-[80px] text-right">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}