import { ArrowLeft, Key, Zap, Globe, Clapperboard, TrendingUp, Film } from 'lucide-react';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';

interface APIUsageProps {
  onBack: () => void;
}

export function APIUsage({ onBack }: APIUsageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#000000]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333]">
        <div className="flex items-start gap-4 p-4">
          <button
            onClick={() => {
              haptics.light();
              onBack();
            }}
            className="text-gray-900 dark:text-white hover:text-[#ec1e24] p-2 -ml-2 mt-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12H2M9 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-2xl text-gray-900 dark:text-white">API Usage Activity</h1>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Monitor your API consumption</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* OpenAI */}
          <button
            onClick={() => haptics.light()}
            className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-4 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] hover:border-[#ec1e24] dark:hover:border-[#ec1e24] transition-all duration-200 cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg">
                <Zap className="w-5 h-5 text-[#ec1e24]" />
              </div>
              <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">OpenAI</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white mb-1">1,247</div>
            <div className="text-xs text-gray-500 dark:text-[#6B7280]">Today's calls</div>
          </button>

          {/* Serper */}
          <button
            onClick={() => haptics.light()}
            className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-4 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] hover:border-[#ec1e24] dark:hover:border-[#ec1e24] transition-all duration-200 cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg">
                <Globe className="w-5 h-5 text-[#ec1e24]" />
              </div>
              <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Serper</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white mb-1">892</div>
            <div className="text-xs text-gray-500 dark:text-[#6B7280]">Today's calls</div>
          </button>

          {/* TMDb */}
          <button
            onClick={() => haptics.light()}
            className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-4 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] hover:border-[#ec1e24] dark:hover:border-[#ec1e24] transition-all duration-200 cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg">
                <Clapperboard className="w-5 h-5 text-[#ec1e24]" />
              </div>
              <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">TMDb</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white mb-1">3,451</div>
            <div className="text-xs text-gray-500 dark:text-[#6B7280]">Today's calls</div>
          </button>

          {/* Vizla */}
          <button
            onClick={() => haptics.light()}
            className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-4 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] hover:border-[#ec1e24] dark:hover:border-[#ec1e24] transition-all duration-200 cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg">
                <Film className="w-5 h-5 text-[#ec1e24]" />
              </div>
              <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Vizla</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white mb-1">127</div>
            <div className="text-xs text-gray-500 dark:text-[#6B7280]">Today's calls</div>
          </button>

          {/* Total */}
          <button
            onClick={() => haptics.light()}
            className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-4 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] hover:border-[#ec1e24] dark:hover:border-[#ec1e24] transition-all duration-200 cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#ec1e24]" />
              </div>
              <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">Total</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white mb-1">5,717</div>
            <div className="text-xs text-gray-500 dark:text-[#6B7280]">Today's calls</div>
          </button>
        </div>

        {/* Usage Breakdown Table */}
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200">
          <h3 className="text-gray-900 dark:text-white mb-4">Usage Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#333333]">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-[#9CA3AF]">API Service</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-[#9CA3AF]">Daily</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-[#9CA3AF]">Weekly</th>
                  <th className="text-right py-3 px-4 text-gray-600 dark:text-[#9CA3AF]">Monthly</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-[#333333]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg">
                        <Zap className="w-4 h-4 text-[#ec1e24]" />
                      </div>
                      <span className="text-gray-900 dark:text-white">OpenAI API</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">1,247</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">7,593</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">27,602</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-[#333333]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg">
                        <Globe className="w-4 h-4 text-[#ec1e24]" />
                      </div>
                      <span className="text-gray-900 dark:text-white">Serper API</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">892</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">5,002</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">19,103</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-[#333333]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg">
                        <Clapperboard className="w-4 h-4 text-[#ec1e24]" />
                      </div>
                      <span className="text-gray-900 dark:text-white">TMDb API</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">3,451</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">21,149</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">82,036</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-[#333333]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg">
                        <Film className="w-4 h-4 text-[#ec1e24]" />
                      </div>
                      <span className="text-gray-900 dark:text-white">Vizla API</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">127</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">891</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">3,258</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-[#0A0A0A]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-[#ec1e24]" />
                      </div>
                      <span className="text-gray-900 dark:text-white">Total</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">5,717</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">34,635</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">131,999</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}