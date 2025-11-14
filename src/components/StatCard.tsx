import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  change?: string;
  changeType?: 'positive' | 'negative';
}

export function StatCard({ title, value, icon: Icon, iconColor, change, changeType }: StatCardProps) {
  return (
    <div className="bg-[#1F2937] rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[#9CA3AF] mb-2">{title}</p>
          <h2 className="text-white mb-2">{value}</h2>
          {change && (
            <span
              className={`${
                changeType === 'positive' ? 'text-[#10B981]' : 'text-[#9CA3AF]'
              }`}
            >
              {change}
            </span>
          )}
        </div>
        <div className={`${iconColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}