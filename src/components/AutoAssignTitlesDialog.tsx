import { CheckCircle } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface DetectedTitle {
  title: string;
  releaseDate?: string;
  timestamp: string;
  confidence: number;
  context: string;
}

interface AutoAssignTitlesDialogProps {
  detectedTitles: DetectedTitle[];
  videoCount: number;
  onAutoAssign: () => void;
  onDismiss: () => void;
}

export function AutoAssignTitlesDialog({
  detectedTitles,
  videoCount,
  onAutoAssign,
  onDismiss
}: AutoAssignTitlesDialogProps) {
  const canAutoAssign = videoCount === detectedTitles.length;

  return (
    <div className="px-5 py-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-300 dark:border-purple-800 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-purple-900 dark:text-purple-300 mb-2">
            🎤 Voiceover Analysis Complete
          </h3>
          <p className="text-sm text-purple-700 dark:text-purple-400 mb-3">
            We detected <strong>{detectedTitles.length} {detectedTitles.length === 1 ? 'movie' : 'movies'}</strong> in your voiceover. 
            {canAutoAssign 
              ? " We can automatically assign them to your uploaded videos!"
              : ` You have ${videoCount} videos uploaded.`}
          </p>
          <div className="space-y-2 mb-4">
            {detectedTitles.map((title, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-purple-600 dark:text-purple-400">#{index + 1}</span>
                <span className="text-purple-900 dark:text-purple-200">{title.title}</span>
                <span className="text-xs text-purple-500 dark:text-purple-500">
                  @ {title.timestamp}
                </span>
                {title.releaseDate && (
                  <span className="text-xs text-purple-600 dark:text-purple-400">
                    • {title.releaseDate}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                haptics.light();
                onAutoAssign();
              }}
              disabled={!canAutoAssign}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
            >
              ✨ Auto-Assign Titles
            </button>
            <button
              onClick={() => {
                haptics.light();
                onDismiss();
              }}
              className="px-4 py-2 bg-white dark:bg-[#000000] border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-200"
            >
              I'll Do It Manually
            </button>
          </div>
          {!canAutoAssign && (
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
              ⚠️ Video count mismatch: Upload {detectedTitles.length} videos to enable auto-assignment
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
