import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import screndlyLoginLogoDark from 'figma:asset/4befd8c03a67f3889be83b77f34eb6ea0d3f36d2.png';
import screndlyLoginLogoLight from 'figma:asset/651cd3122e66a0a82c96100f90fea6f2cdcb8b1c.png';

interface LoginPageProps {
  onLogin: () => void;
  onNavigate?: (page: string) => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains('dark');
      setIsDark(darkMode);
      
      // Directly set the background color on the input element
      if (emailInputRef.current) {
        emailInputRef.current.style.setProperty('background-color', darkMode ? '#000000' : '#ffffff', 'important');
        emailInputRef.current.style.setProperty('color', darkMode ? '#ffffff' : '#000000', 'important');
      }
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex-1 flex items-center justify-center">
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm p-8 w-full">
          {/* Logo Area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center">
              <img src={screndlyLoginLogoLight} alt="Screndly Logo" className="h-32 w-auto dark:hidden" />
              <img src={screndlyLoginLogoDark} alt="Screndly Logo" className="h-32 w-auto hidden dark:block" />
            </div>
          </div>

          {/* Email/Password Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 dark:text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@screndly.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border-gray-300 dark:border-[#333333] placeholder:text-gray-400 dark:placeholder:text-white/30 focus:placeholder:opacity-0"
                ref={emailInputRef}
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-gray-900 dark:text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-lg !bg-white dark:!bg-[#000000] border-gray-300 dark:border-[#333333] !text-gray-900 dark:!text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:placeholder:opacity-0 autofill:!bg-white dark:autofill:!bg-[#000000] autofill:!text-gray-900 dark:autofill:!text-white pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                  style={{
                    // @ts-ignore - Force override autofill styling for dark mode
                    WebkitBoxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 0 0 1000px var(--color-input-background) inset',
                    WebkitTextFillColor: 'inherit',
                  }}
                  ref={passwordInputRef}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-gray-600 dark:text-[#9CA3AF] cursor-pointer">
                Keep me signed in
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full rounded-lg"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-[#ec1e24] hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Static Pages Links */}
          <div className="mt-8 text-center text-[0.625rem] text-[#9CA3AF]">
            <p>
              Screndly's{' '}
              <button 
                onClick={() => onNavigate?.('terms')} 
                className="text-gray-900 dark:text-white hover:underline"
              >
                Terms of Service
              </button>
              {' '}and{' '}
              <button 
                onClick={() => onNavigate?.('privacy')} 
                className="text-gray-900 dark:text-white hover:underline"
              >
                Privacy Policy
              </button>
              , and{' '}
              <button 
                onClick={() => onNavigate?.('disclaimer')} 
                className="text-gray-900 dark:text-white hover:underline"
              >
                Disclaimer
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Screen Render Attribution */}
      <div className="py-6 text-center">
        <p className="text-[#9CA3AF] tracking-widest uppercase text-xs">
          Screen Render
        </p>
      </div>
    </div>
  );
}