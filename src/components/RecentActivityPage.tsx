export function RecentActivityPage() {
  const activities = [
    { id: '1', title: 'The Batman - Official Trailer 2', platform: 'Instagram', status: 'success', time: '2 min ago' },
    { id: '2', title: 'Dune: Part Two - Final Trailer', platform: 'TikTok', status: 'success', time: '15 min ago' },
    { id: '3', title: 'Oppenheimer - Official Trailer', platform: 'YouTube', status: 'success', time: '1 hour ago' },
    { id: '4', title: 'Barbie - Teaser Trailer', platform: 'Facebook', status: 'failed', time: '2 hours ago' },
    { id: '5', title: 'Killers of the Flower Moon - Trailer', platform: 'X', status: 'success', time: '3 hours ago' },
    { id: '6', title: 'Wonka - Official Trailer', platform: 'Threads', status: 'success', time: '4 hours ago' },
    { id: '7', title: 'Napoleon - Final Trailer', platform: 'Instagram', status: 'failed', time: '5 hours ago' },
    { id: '8', title: 'The Marvels - Trailer 2', platform: 'TikTok', status: 'success', time: '6 hours ago' },
    { id: '9', title: 'Aquaman 2 - Official Trailer', platform: 'Facebook', status: 'success', time: '7 hours ago' },
    { id: '10', title: 'Spider-Man: Beyond - Teaser', platform: 'YouTube', status: 'success', time: '8 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Recent Activity</h1>
        <p className="text-[#9CA3AF]">Complete history of all automation activities.</p>
      </div>

      <div className="bg-[#1F2937] rounded-2xl shadow-sm p-6">
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#374151] transition-colors duration-200">
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
