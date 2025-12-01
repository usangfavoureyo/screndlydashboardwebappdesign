import { Settings2, Zap, Shield, AlertCircle, Mic, Database, TrendingUp } from 'lucide-react';
import { haptics } from '../utils/haptics';

type AnalysisBackend = 'google-vi' | 'ffmpeg-fallback';
type QualityMode = 'fast' | 'quality';

interface AnalysisSettingsPanelProps {
  backend: AnalysisBackend;
  onBackendChange: (backend: AnalysisBackend) => void;
  qualityMode: QualityMode;
  onQualityModeChange: (mode: QualityMode) => void;
  enableSTT: boolean;
  onEnableSTTChange: (enabled: boolean) => void;
  estimatedCost: number;
  monthlyBudget: number;
  monthlySpend: number;
}

export function AnalysisSettingsPanel({
  backend,
  onBackendChange,
  qualityMode,
  onQualityModeChange,
  enableSTT,
  onEnableSTTChange,
  estimatedCost,
  monthlyBudget,
  monthlySpend
}: AnalysisSettingsPanelProps) {
  const budgetPercentage = (monthlySpend / monthlyBudget) * 100;
  const budgetColor = budgetPercentage > 90 ? 'text-[#ec1e24]' : budgetPercentage > 70 ? 'text-amber-500' : 'text-green-500';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-[#ec1e24]" />
        <h3 className="text-gray-900 dark:text-white">Analysis Settings</h3>
      </div>

      {/* Backend Selection */}
      <div className="space-y-2">
        <label className="text-sm text-[#ec1e24]">Analysis Backend</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              haptics.light();
              onBackendChange('google-vi');
            }}
            className={`p-3 rounded-lg border-2 transition-all ${
              backend === 'google-vi'
                ? 'border-[#ec1e24] bg-[#ec1e24]/5'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`w-4 h-4 ${backend === 'google-vi' ? 'text-[#ec1e24]' : 'text-gray-500'}`} />
              <span className="text-sm text-gray-900 dark:text-white">Google VI</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">High accuracy</p>
            <p className="text-xs text-[#ec1e24] mt-1">~$0.22/video</p>
          </button>

          <button
            onClick={() => {
              haptics.light();
              onBackendChange('ffmpeg-fallback');
            }}
            className={`p-3 rounded-lg border-2 transition-all ${
              backend === 'ffmpeg-fallback'
                ? 'border-[#ec1e24] bg-[#ec1e24]/5'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Shield className={`w-4 h-4 ${backend === 'ffmpeg-fallback' ? 'text-[#ec1e24]' : 'text-gray-500'}`} />
              <span className="text-sm text-gray-900 dark:text-white">FFmpeg</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Fallback mode</p>
            <p className="text-xs text-green-600 mt-1">Free (local)</p>
          </button>
        </div>
        {backend === 'ffmpeg-fallback' && (
          <div className="flex items-start gap-2 p-3 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg">
            <AlertCircle className="w-4 h-4 text-[#ec1e24] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-500 dark:text-gray-500">
              <strong>Fallback Mode:</strong> Uses histogram-based shot detection. Lower accuracy (~60-65%) but zero API cost. Good for testing or budget constraints.
            </div>
          </div>
        )}
      </div>

      {/* Quality Mode */}
      <div className="space-y-2">
        <label className="text-sm text-[#ec1e24]">Processing Mode</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              haptics.light();
              onQualityModeChange('fast');
            }}
            className={`p-3 rounded-lg border-2 transition-all ${
              qualityMode === 'fast'
                ? 'border-[#ec1e24] bg-[#ec1e24]/5'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className={`w-4 h-4 ${qualityMode === 'fast' ? 'text-[#ec1e24]' : 'text-gray-500'}`} />
              <span className="text-sm text-gray-900 dark:text-white">Fast</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">~30-45s per video</p>
          </button>

          <button
            onClick={() => {
              haptics.light();
              onQualityModeChange('quality');
            }}
            className={`p-3 rounded-lg border-2 transition-all ${
              qualityMode === 'quality'
                ? 'border-[#ec1e24] bg-[#ec1e24]/5'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`w-4 h-4 ${qualityMode === 'quality' ? 'text-[#ec1e24]' : 'text-gray-500'}`} />
              <span className="text-sm text-gray-900 dark:text-white">Quality</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">~60-90s per video</p>
          </button>
        </div>
      </div>

      {/* Selective STT */}
      <div className="p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Mic className="w-5 h-5 text-[#ec1e24] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white mb-1">
                <strong>Selective Speech-to-Text (Whisper)</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Transcribe dialogue scenes for +8-12% accuracy. Runs locally (CPU/GPU auto-detect), zero API cost, privacy-first.
              </p>
              {enableSTT && (
                <p className="text-xs text-[#ec1e24] mt-2">
                  Free • Adds ~15-20s processing time
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              haptics.light();
              onEnableSTTChange(!enableSTT);
            }}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
              enableSTT ? 'bg-[#ec1e24]' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                enableSTT ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Cost & Budget Tracking */}
      <div className="p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost (This Video)</span>
          <span className="text-gray-900 dark:text-white">${estimatedCost.toFixed(2)}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Monthly Spend</span>
            <span className="text-[#ec1e24]">
              ${monthlySpend.toFixed(2)} / ${monthlyBudget.toFixed(2)} ({budgetPercentage.toFixed(0)}%)
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ec1e24] transition-all"
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </div>

        {budgetPercentage > 90 && (
          <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded">
            <AlertCircle className="w-3 h-3 text-[#ec1e24] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#ec1e24]">
              ⚠️ {budgetPercentage.toFixed(0)}% of monthly threshold reached. Consider switching to FFmpeg fallback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
