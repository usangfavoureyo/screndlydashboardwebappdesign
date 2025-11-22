import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface TermsPageProps {
  onNavigate: (page: string) => void;
  isAuthenticated?: boolean;
}

export function TermsPage({ onNavigate, isAuthenticated = true }: TermsPageProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleBack = () => {
    if (!isAuthenticated) {
      onNavigate('login');
    } else if (isDesktop) {
      onNavigate('dashboard');
    } else {
      onNavigate('settings');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="flex items-start gap-4 mb-8">
          <button
            onClick={handleBack}
            className="text-gray-900 dark:text-white hover:text-[#ec1e24] p-2 -ml-2 mt-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12H2M9 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-gray-900 dark:text-white">Terms of Service</h1>
        </div>
        
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] p-6 rounded-2xl space-y-4 text-gray-700 dark:text-[#D1D5DB]">
          <p>
            Screndly provides automated content generation, editing, and publishing tools. Use of the platform is permitted only for lawful activities. Users are responsible for all assets uploaded, generated, or published through their account. Screndly is not liable for losses caused by automation, scheduling, or third-party platform changes.
          </p>
          
          <p>
            Accounts may be suspended for abuse, unauthorized scraping, harmful automation, copyright infringement, or attempts to bypass API limits. Media produced using Screndly remains the property of the user unless otherwise stated by the source content provider.
          </p>
          
          <p>
            Screndly may update features without notice and may modify pricing with reasonable notice. The service is provided on an "as-is" and "as-available" basis without guarantees of uptime or compatibility with external platforms. By signing up, users agree to these terms.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-[#374151] py-8 px-6 mt-12">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-600 dark:text-[#9CA3AF]">
            <button onClick={() => onNavigate('privacy')} className="hover:text-[#ec1e24]">Privacy</button>
            <span>•</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-[#ec1e24]">Terms</button>
            <span>•</span>
            <button onClick={() => onNavigate('disclaimer')} className="hover:text-[#ec1e24]">Disclaimer</button>
            <span>•</span>
            <button onClick={() => onNavigate('cookie')} className="hover:text-[#ec1e24]">Cookie</button>
            <span>•</span>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#ec1e24]">Contact</button>
            <span>•</span>
            <button onClick={() => onNavigate('about')} className="hover:text-[#ec1e24]">About</button>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-[#9CA3AF]">
            ©️ 2026, Screndly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}