import { Sparkles, Clock, Film, RotateCcw } from 'lucide-react';
import { TrailerAnalysis, VideoMoment } from '../lib/api/googleVideoIntelligence';
import { Button } from './ui/button';

interface TrailerHooksPreviewProps {
  analysis: TrailerAnalysis;
  onShowAllMoments?: () => void;
  customOpeningHook?: VideoMoment | null;
  customMidVideoHook?: VideoMoment | null;
  customEndingHook?: VideoMoment | null;
  onResetHook?: (hookType: 'opening' | 'midVideo' | 'ending') => void;
}

export function TrailerHooksPreview({ 
  analysis, 
  onShowAllMoments,
  customOpeningHook,
  customMidVideoHook,
  customEndingHook,
  onResetHook
}: TrailerHooksPreviewProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string} = {
      'action_peak': 'bg-red-500',
      'dramatic_dialogue': 'bg-purple-500',
      'character_moment': 'bg-blue-500',
      'title_card': 'bg-yellow-500',
      'establishing_shot': 'bg-green-500',
      'suspense_moment': 'bg-orange-500',
      'general': 'bg-gray-500'
    };
    return colors[type] || 'bg-gray-500';
  };
  
  // Use custom hooks if available, otherwise use AI suggestions
  const openingHook = customOpeningHook || analysis.suggestedHooks.opening;
  const midVideoHook = customMidVideoHook || analysis.suggestedHooks.midVideo;
  const endingHook = customEndingHook || analysis.suggestedHooks.ending;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-blue-900 mb-3">
            AI-Selected Hook Scenes
          </h4>
          
          {/* Opening Hook */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Opening Hook</span>
                {customOpeningHook && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">
                    Custom ✓
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-mono text-blue-600">
                  {formatTime(openingHook.startTime)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`${getTypeColor(openingHook.type)} text-white text-xs px-2 py-0.5 rounded`}>
                {formatType(openingHook.type)}
              </span>
              <span className="text-xs text-gray-600">
                {openingHook.labels.slice(0, 3).join(', ')}
              </span>
            </div>
            
            <div className="relative h-20 bg-gray-900 rounded overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-xs opacity-50">
                  {formatTime(openingHook.startTime)} - {formatTime(openingHook.endTime)}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
            </div>
            
            {customOpeningHook && onResetHook && (
              <Button
                onClick={() => onResetHook('opening')}
                variant="ghost"
                size="sm"
                className="mt-2 h-7 text-xs text-gray-600 hover:text-red-600"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset to AI Default
              </Button>
            )}
          </div>
          
          {/* Mid-Video Hook */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Mid-Video Hook</span>
                {customMidVideoHook && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">
                    Custom ✓
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-mono text-blue-600">
                  {formatTime(midVideoHook.startTime)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`${getTypeColor(midVideoHook.type)} text-white text-xs px-2 py-0.5 rounded`}>
                {formatType(midVideoHook.type)}
              </span>
              <span className="text-xs text-gray-600">
                {midVideoHook.labels.slice(0, 3).join(', ')}
              </span>
            </div>
            
            <div className="relative h-20 bg-gray-900 rounded overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-xs opacity-50">
                  {formatTime(midVideoHook.startTime)} - {formatTime(midVideoHook.endTime)}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-red-900/20"></div>
            </div>
            
            {customMidVideoHook && onResetHook && (
              <Button
                onClick={() => onResetHook('midVideo')}
                variant="ghost"
                size="sm"
                className="mt-2 h-7 text-xs text-gray-600 hover:text-red-600"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset to AI Default
              </Button>
            )}
          </div>
          
          {/* Ending Hook */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Ending Hook</span>
                {customEndingHook && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">
                    Custom ✓
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-mono text-blue-600">
                  {formatTime(endingHook.startTime)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`${getTypeColor(endingHook.type)} text-white text-xs px-2 py-0.5 rounded`}>
                {formatType(endingHook.type)}
              </span>
              <span className="text-xs text-gray-600">
                {endingHook.labels.slice(0, 3).join(', ')}
              </span>
            </div>
            
            <div className="relative h-20 bg-gray-900 rounded overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-xs opacity-50">
                  {formatTime(endingHook.startTime)} - {formatTime(endingHook.endTime)}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
            </div>
            
            {customEndingHook && onResetHook && (
              <Button
                onClick={() => onResetHook('ending')}
                variant="ghost"
                size="sm"
                className="mt-2 h-7 text-xs text-gray-600 hover:text-red-600"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset to AI Default
              </Button>
            )}
          </div>
          
          {onShowAllMoments && (
            <button
              onClick={onShowAllMoments}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Browse all {analysis.moments.length} detected scenes →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
