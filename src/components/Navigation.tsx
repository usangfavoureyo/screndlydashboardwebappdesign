import { Film, LayoutDashboard, Youtube, Share2, FileText, LogOut, Image, Bell, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Navigation({ currentPage, onNavigate, onLogout }: NavigationProps) {
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
      <div className="p-6 border-b border-[#374151]">
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
          <div className="text-left">
            <h2 className="text-white">Screndly</h2>
            <p className="text-[#9CA3AF]">Automation</p>
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
                  : 'text-[#9CA3AF] hover:bg-[#374151]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#374151]">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-[#9CA3AF] hover:bg-[#374151] rounded-xl"
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
      <div className="fixed top-0 left-0 right-0 h-16 bg-[#1F2937] border-b border-[#374151] z-40 flex items-center justify-between px-4 lg:pl-64">
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
          <span className="text-white">Screndly</span>
        </button>
        
        {/* Desktop spacer */}
        <div className="hidden lg:block flex-1"></div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white">
            <Bell className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white"
            onClick={() => onNavigate('settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-[#1F2937] border-r border-[#374151] flex-col z-50">
        <NavContent />
      </aside>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}