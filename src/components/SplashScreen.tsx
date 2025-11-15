import { useEffect } from 'react';
import { Film } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-[#F45247] rounded-3xl">
          <Film className="w-14 h-14 text-white" />
        </div>
      </div>
    </div>
  );
}