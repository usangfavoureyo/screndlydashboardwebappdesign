import { LayoutDashboard, Youtube, Share2, FileText, Image } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function MobileBottomNav({ currentPage, onNavigate }: MobileBottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'channels', label: 'Channels', icon: Youtube },
    { id: 'platforms', label: 'Platforms', icon: Share2 },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'thumbnail', label: 'Designer', icon: Image },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1F2937] border-t border-[#374151] z-50">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center justify-center p-2 transition-colors duration-200"
              aria-label={item.label}
            >
              <Icon
                className={`w-7 h-7 stroke-1 ${
                  isActive
                    ? 'text-[#F45247]'
                    : 'text-white'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}