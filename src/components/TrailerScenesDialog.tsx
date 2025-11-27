import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { TrailerAnalysis, VideoMoment } from '../lib/api/googleVideoIntelligence';
import { Clock, Tag, Zap } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface TrailerScenesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: TrailerAnalysis;
  onSelectScene?: (moment: VideoMoment, hookType: 'opening' | 'midVideo' | 'ending') => void;
}

export function TrailerScenesDialog({ open, onOpenChange, analysis, onSelectScene }: TrailerScenesDialogProps) {
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
    const colors: { [key: string]: string } = {
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

  const getIntensityLabel = (score: number): string => {
    if (score >= 0.8) return 'Very High';
    if (score >= 0.6) return 'High';
    if (score >= 0.4) return 'Medium';
    return 'Low';
  };

  const getIntensityColor = (score: number): string => {
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.6) return 'text-orange-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">All Detected Scenes</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Browse {analysis.moments.length} scenes detected by AI. Click any scene to use it as a hook.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] sm:h-[65vh] pr-2 sm:pr-4">
          <div className="space-y-3">
            {analysis.moments.map((moment, index) => {
              const isOpeningHook = moment.index === analysis.suggestedHooks.opening.index;
              const isMidHook = moment.index === analysis.suggestedHooks.midVideo.index;
              const isEndingHook = moment.index === analysis.suggestedHooks.ending.index;
              const isSelectedHook = isOpeningHook || isMidHook || isEndingHook;
              
              return (
                <div
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg border transition-all ${
                    isSelectedHook 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-600' 
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  {/* Mobile Layout: Stack vertically */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    {/* Scene Number & Thumbnail */}
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <div className="w-full sm:w-32 h-24 sm:h-20 bg-gray-900 rounded overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white text-xs opacity-50">
                            Scene {index + 1}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50"></div>
                        {isSelectedHook && (
                          <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                            {isOpeningHook && 'Opening'}
                            {isMidHook && 'Mid'}
                            {isEndingHook && 'Ending'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Scene Details */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Time and Intensity - Stack on mobile */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span className="font-mono text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                            {formatTime(moment.startTime)} - {formatTime(moment.endTime)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({moment.duration.toFixed(1)}s)
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span className={`text-xs sm:text-sm font-medium ${getIntensityColor(moment.intensityScore)}`}>
                            {getIntensityLabel(moment.intensityScore)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Type and Dialogue Badge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`${getTypeColor(moment.type)} text-white text-xs px-2 py-1 rounded whitespace-nowrap`}>
                          {formatType(moment.type)}
                        </span>
                        {moment.hasDialogue && (
                          <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs px-2 py-1 rounded whitespace-nowrap">
                            Has Dialogue
                          </span>
                        )}
                      </div>
                      
                      {/* Labels */}
                      <div className="flex items-start gap-2">
                        <Tag className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {moment.labels.map((label, i) => (
                            <span key={i} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action Buttons - Stack on mobile, horizontal on desktop */}
                      {onSelectScene && !isSelectedHook && (
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          <button
                            onClick={() => onSelectScene(moment, 'opening')}
                            className="text-xs bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900 active:bg-gray-100 dark:active:bg-gray-800 transition-colors whitespace-nowrap text-center"
                          >
                            Use as Opening Hook
                          </button>
                          <button
                            onClick={() => onSelectScene(moment, 'midVideo')}
                            className="text-xs bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900 active:bg-gray-100 dark:active:bg-gray-800 transition-colors whitespace-nowrap text-center"
                          >
                            Use as Mid Hook
                          </button>
                          <button
                            onClick={() => onSelectScene(moment, 'ending')}
                            className="text-xs bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-900 active:bg-gray-100 dark:active:bg-gray-800 transition-colors whitespace-nowrap text-center"
                          >
                            Use as End Hook
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}