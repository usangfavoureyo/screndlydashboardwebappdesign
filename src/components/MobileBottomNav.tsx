import { LayoutDashboard, Youtube, Share2, FileText, Rss, Clapperboard, Film } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { useScrollDirection } from '../utils/useScrollDirection';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function MobileBottomNav({ currentPage, onNavigate }: MobileBottomNavProps) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'channels', icon: Youtube },
    { id: 'platforms', icon: Share2 },
    { id: 'rss', icon: Rss },
    { id: 'tmdb', icon: Clapperboard },
    { id: 'video-studio', icon: Film },
  ];

  const handleNavigation = (pageId: string) => {
    haptics.light();
    
    // If clicking the already active page, scroll to top
    if (currentPage === pageId) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      onNavigate(pageId);
    }
  };

  const scrollDirection = useScrollDirection();

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#000000] border-t border-gray-200 dark:border-[#333333] z-50 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 transition-transform duration-300 ${
      scrollDirection === 'down' ? 'translate-y-full' : 'translate-y-0'
    }`}>
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex items-center justify-center p-2 transition-all duration-300 hover:scale-110 active:scale-95 ${
                isActive ? 'transform -translate-y-1' : ''
              }`}
              aria-label={item.id}
            >
              <Icon
                className={`w-7 h-7 stroke-1 transition-all duration-300 ${
                  isActive
                    ? 'text-[#ec1e24]'
                    : 'text-black dark:text-white'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}