import { Film, LayoutDashboard, Youtube, Share2, FileText, LogOut, Image, Bell, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onToggleSettings: () => void;
  onToggleNotifications: () => void;
  onLogout: () => void;
  unreadNotifications: number;
}

export function Navigation({ currentPage, onNavigate, onToggleSettings, onToggleNotifications, onLogout, unreadNotifications }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'channels', label: 'Channels', icon: Youtube },
    { id: 'platforms', label: 'Platforms', icon: Share2 },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'thumbnail', label: 'Thumbnail Designer', icon: Image },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-gray-200 dark:border-[#374151]">
        <button
          onClick={() => {
            onNavigate('dashboard');
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 w-full"
        >
          <div className="w-10 h-10 bg-[#F45247] rounded-xl flex items-center justify-center">
            <Film className="w-6 h-6 text-white" />
          </div>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#F45247] text-white'
                  : 'text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-[#374151]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-[#374151]">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-[#374151] rounded-xl"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop/Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#1F2937] border-b border-gray-200 dark:border-[#374151] z-40 flex items-center justify-between px-4 lg:pl-64">
        <button
          onClick={() => {
            onNavigate('dashboard');
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 lg:hidden"
        >
          <div className="w-8 h-8 bg-[#F45247] rounded-lg flex items-center justify-center">
            <Film className="w-5 h-5 text-white" />
          </div>
        </button>
        
        {/* Desktop spacer */}
        <div className="hidden lg:block flex-1"></div>
        
        <div className="flex items-center gap-2">
          <button className="text-gray-900 dark:text-white p-1 relative" onClick={onToggleNotifications}>
            <Bell className="w-[26px] h-[26px] stroke-1" />
            {unreadNotifications > 0 && (
              <div className="absolute -top-1 -right-1 bg-[#F45247] text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {unreadNotifications}
              </div>
            )}
          </button>
          <button 
            className="text-gray-900 dark:text-white p-1"
            onClick={onToggleSettings}
          >
            <Settings className="w-[26px] h-[26px] stroke-1" />
          </button>
        </div>
      </div>

      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#1F2937] border-r border-gray-200 dark:border-[#374151] flex-col z-50">
        <NavContent />
      </aside>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}