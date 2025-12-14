import { useState } from 'react';
import { ImageIcon, Info } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { haptics } from '../../utils/haptics';
import { toast } from 'sonner@2.0.3';

interface ThumbnailSettingsProps {
  onBack: () => void;
}

type LogoPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'center-left' 
  | 'center' 
  | 'center-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

type Platform = 'youtube' | 'x';

interface ThumbnailConfig {
  platform: Platform;
  logoPosition: LogoPosition;
  autoScale: boolean;
  maxLogoSize: number; // percentage - unified scale
  autoContrastBackdrop: boolean; // Try to select best backdrop for logo contrast
  autoContrastOverlay: boolean; // Apply brightness adjustment behind logo if needed
}

const LOGO_POSITIONS: Record<LogoPosition, string> = {
  'top-left': 'Top Left',
  'top-center': 'Top Center',
  'top-right': 'Top Right',
  'center-left': 'Center Left',
  'center': 'Center',
  'center-right': 'Center Right',
  'bottom-left': 'Bottom Left',
  'bottom-center': 'Bottom Center',
  'bottom-right': 'Bottom Right'
};

export function ThumbnailSettings({ onBack }: ThumbnailSettingsProps) {
  // Load saved configs from localStorage
  const loadConfig = (platform: Platform): ThumbnailConfig => {
    try {
      const saved = localStorage.getItem(`screndly_thumbnailConfig_${platform}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load thumbnail config:', e);
    }
    
    // Default config
    return {
      platform,
      logoPosition: 'bottom-right',
      autoScale: true,
      maxLogoSize: 40,
      autoContrastBackdrop: true,
      autoContrastOverlay: true
    };
  };

  const [activePlatform, setActivePlatform] = useState<Platform>('youtube');
  const [youtubeConfig, setYoutubeConfig] = useState<ThumbnailConfig>(loadConfig('youtube'));
  const [xConfig, setXConfig] = useState<ThumbnailConfig>(loadConfig('x'));

  const currentConfig = activePlatform === 'youtube' ? youtubeConfig : xConfig;
  
  const updateConfig = (updates: Partial<ThumbnailConfig>) => {
    const newConfig = { ...currentConfig, ...updates };
    
    if (activePlatform === 'youtube') {
      setYoutubeConfig(newConfig);
      localStorage.setItem('screndly_thumbnailConfig_youtube', JSON.stringify(newConfig));
    } else {
      setXConfig(newConfig);
      localStorage.setItem('screndly_thumbnailConfig_x', JSON.stringify(newConfig));
    }

    haptics.light();
    toast.success('Settings Saved', {
      description: `${activePlatform === 'youtube' ? 'YouTube' : 'X'} thumbnail settings updated`
    });
  };

  // Get positioning styles for preview
  const getLogoPositionStyles = (position: LogoPosition): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: 'absolute',
      width: `${currentConfig.maxLogoSize}%`,
      aspectRatio: '16/9'
    };

    const margin = 16; // 16px margin from edges

    switch (position) {
      case 'top-left':
        return { ...styles, top: margin, left: margin };
      case 'top-center':
        return { ...styles, top: margin, left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { ...styles, top: margin, right: margin };
      case 'center-left':
        return { ...styles, top: '50%', left: margin, transform: 'translateY(-50%)' };
      case 'center':
        return { ...styles, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'center-right':
        return { ...styles, top: '50%', right: margin, transform: 'translateY(-50%)' };
      case 'bottom-left':
        return { ...styles, bottom: margin, left: margin };
      case 'bottom-center':
        return { ...styles, bottom: margin, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { ...styles, bottom: margin, right: margin };
      default:
        return styles;
    }
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 w-full lg:w-[600px] bg-white dark:bg-[#000000] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333] p-4 flex items-center gap-3 z-10">
        <button 
          className="text-gray-900 dark:text-white p-1" 
          onClick={() => {
            haptics.light();
            onBack();
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12H2M9 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h2 className="text-gray-900 dark:text-white text-xl">Thumbnail Overlay</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-white dark:bg-black border border-border rounded-lg p-4 flex gap-3">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ec1e24' }} />
          <div>
            <p className="text-sm text-muted-foreground">
              YouTube and X use the same thumbnail (backdrop + logo). Settings are saved separately per platform.
            </p>
          </div>
        </div>

        {/* Platform Selector */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                haptics.light();
                setActivePlatform('youtube');
              }}
              className={`px-4 py-3 rounded-lg transition-all ${
                activePlatform === 'youtube'
                  ? 'bg-[#ec1e24] text-white'
                  : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'
              }`}
            >
              YouTube
            </button>
            <button
              onClick={() => {
                haptics.light();
                setActivePlatform('x');
              }}
              className={`px-4 py-3 rounded-lg transition-all ${
                activePlatform === 'x'
                  ? 'bg-[#ec1e24] text-white'
                  : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'
              }`}
            >
              X (Twitter)
            </button>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

        {/* Logo Position */}
        <div>
          <Label className="text-gray-900 dark:text-white mb-2 block">Logo Position</Label>
          <p className="text-xs text-gray-600 dark:text-[#9CA3AF] mb-3">
            Where the movie/TV logo will be placed on the backdrop
          </p>
          <Select 
            value={currentConfig.logoPosition} 
            onValueChange={(value) => {
              updateConfig({ logoPosition: value as LogoPosition });
            }}
          >
            <SelectTrigger 
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white"
              onFocus={() => haptics.light()}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333]">
              {Object.entries(LOGO_POSITIONS).map(([key, label]) => (
                <SelectItem 
                  key={key} 
                  value={key}
                  className="text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-[#1A1A1A]"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

        {/* Auto Contrast Settings */}
        <div className="space-y-4">
          <div>
            <Label className="text-gray-900 dark:text-white mb-2 block">Smart Contrast</Label>
            <p className="text-xs text-gray-600 dark:text-[#9CA3AF] mb-4">
              Automatically ensure logo visibility on any backdrop
            </p>
          </div>

          {/* Auto-Select Best Backdrop */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label className="text-gray-900 dark:text-white">Smart Backdrop Selection</Label>
              <p className="text-xs text-gray-600 dark:text-[#9CA3AF] mt-1">
                When TMDb provides multiple backdrops, automatically select the one with the best contrast for your logo
              </p>
            </div>
            <Switch
              checked={currentConfig.autoContrastBackdrop}
              onCheckedChange={(checked) => {
                haptics.medium();
                updateConfig({ autoContrastBackdrop: checked });
              }}
            />
          </div>

          {/* Auto-Adjust Backdrop Brightness */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label className="text-gray-900 dark:text-white">Smart Overlay Adjustment</Label>
              <p className="text-xs text-gray-600 dark:text-[#9CA3AF] mt-1">
                If the backdrop doesn't have good contrast, apply a subtle dark/light overlay behind the logo area
              </p>
            </div>
            <Switch
              checked={currentConfig.autoContrastOverlay}
              onCheckedChange={(checked) => {
                haptics.medium();
                updateConfig({ autoContrastOverlay: checked });
              }}
            />
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

        {/* Auto-Scale Logo */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Label className="text-gray-900 dark:text-white">Auto-Scale Logo</Label>
              <p className="text-xs text-gray-600 dark:text-[#9CA3AF] mt-1">
                Automatically normalize all logos to the same size. Small logos will be scaled up, large logos will be scaled down to match the target size.
              </p>
            </div>
            <Switch
              checked={currentConfig.autoScale}
              onCheckedChange={(checked) => {
                haptics.medium();
                updateConfig({ autoScale: checked });
              }}
            />
          </div>

          {/* Target Size Slider */}
          {currentConfig.autoScale && (
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm text-gray-600 dark:text-[#9CA3AF]">
                    Target Logo Size
                  </Label>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {currentConfig.maxLogoSize}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={currentConfig.maxLogoSize}
                  onChange={(e) => {
                    haptics.light();
                    updateConfig({ maxLogoSize: parseInt(e.target.value) });
                  }}
                  onFocus={() => haptics.light()}
                  className="w-full h-2 bg-gray-200 dark:bg-[#333333] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ec1e24] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#ec1e24] [&::-moz-range-thumb]:border-0"
                />
                <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
                  All logos will be normalized to this size while maintaining their aspect ratio
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

        {/* Preview */}
        <div>
          <Label className="text-gray-900 dark:text-white mb-3 block">Live Preview</Label>
          <p className="text-xs text-gray-600 dark:text-[#9CA3AF] mb-3">
            Example showing how the logo will be positioned on the backdrop
          </p>
          <div className="bg-white dark:bg-[#000000] rounded-lg p-4 border border-gray-200 dark:border-[#333333]">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {/* Backdrop - bright image to show dark logo clearly */}
              <img 
                src="https://images.unsplash.com/photo-1616364032837-4a95a7b2596c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBza3klMjBzdW5zZXQlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzY1NjU0MDIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Example backdrop" 
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />

              {/* Logo Position Indicator */}
              <div 
                style={getLogoPositionStyles(currentConfig.logoPosition)}
                className="bg-[#1a1a1a]/95 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-white/80 shadow-2xl"
              >
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-[#333333]">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-[#9CA3AF]">
                <div>
                  <span className="text-gray-500 dark:text-[#6B7280]">Position:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{LOGO_POSITIONS[currentConfig.logoPosition]}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-[#6B7280]">Auto-scale:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{currentConfig.autoScale ? 'On' : 'Off'}</span>
                </div>
                {currentConfig.autoScale && (
                  <div>
                    <span className="text-gray-500 dark:text-[#6B7280]">Target Size:</span>{' '}
                    <span className="text-gray-900 dark:text-white">{currentConfig.maxLogoSize}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />

        {/* Reset to Defaults */}
        <Button
          variant="outline"
          onClick={() => {
            haptics.medium();
            const defaultConfig: ThumbnailConfig = {
              platform: activePlatform,
              logoPosition: 'bottom-right',
              autoScale: true,
              maxLogoSize: 40,
              autoContrastBackdrop: true,
              autoContrastOverlay: true
            };
            
            if (activePlatform === 'youtube') {
              setYoutubeConfig(defaultConfig);
              localStorage.setItem('screndly_thumbnailConfig_youtube', JSON.stringify(defaultConfig));
            } else {
              setXConfig(defaultConfig);
              localStorage.setItem('screndly_thumbnailConfig_x', JSON.stringify(defaultConfig));
            }
            
            toast.success('Reset Complete', {
              description: `${activePlatform === 'youtube' ? 'YouTube' : 'X'} thumbnail settings reset to defaults`
            });
          }}
          className="w-full border-gray-300 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#1A1A1A] bg-white dark:bg-[#000000]"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}