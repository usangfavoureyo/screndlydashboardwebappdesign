/**
 * Smart Image Selection Test Component
 * 
 * Demonstrates the AI-powered image selection system with real examples
 */

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { selectSmartImages } from '../lib/ai/image-selection';
import { useSettings } from '../contexts/SettingsContext';
import { toast } from 'sonner';

export function SmartImageTest() {
  const { settings } = useSettings();
  const [articleTitle, setArticleTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Example articles for testing
  const examples = [
    'Tom Cruise is in talks for Edge of Tomorrow 2',
    'New still from the #GameOfThrones spinoff \'A Knight of the Seven Kingdoms\' ⚔️',
    'Ruben Fleischer says they\'re looking at making \'Zombieland 3\' for 2029 🧟‍♂️',
    'Matt Damon says filming \'The Odyssey\' was the best experience of his career ⚔️'
  ];

  const handleTest = async () => {
    if (!articleTitle.trim()) {
      toast.error('Please enter an article title');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const smartResult = await selectSmartImages(
        {
          title: articleTitle,
          description: ''
        },
        {
          imageCount: 2,
          serperApiKey: settings.serperKey,
          openaiApiKey: settings.openaiKey,
          enableFallback: false
        }
      );

      setResult(smartResult);
      
      if (smartResult.confidenceLevel === 'high') {
        toast.success(`Perfect match! ${smartResult.confidence}% confidence`);
      } else if (smartResult.confidenceLevel === 'medium') {
        toast.info(`Good match. ${smartResult.confidence}% confidence`);
      } else {
        toast.warning(`Low confidence: ${smartResult.confidence}%`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to search images');
      console.error('Smart image search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div>
        <h2 className="text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ec1e24]" />
          Smart Image Selection Test
        </h2>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm">
          Test the AI-powered subject matter detection and image selection system
        </p>
      </div>

      {/* Example buttons */}
      <div className="bg-gray-50 dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-4">
        <p className="text-sm text-gray-900 dark:text-white mb-3">Quick Examples:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setArticleTitle(example)}
              className="text-xs !bg-white dark:!bg-[#000000] !text-gray-900 dark:!text-white border-gray-300 dark:border-[#333333]"
            >
              Example {index + 1}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <Label className="text-gray-600 dark:text-[#9CA3AF]">Article Title</Label>
        <Input
          value={articleTitle}
          onChange={(e) => setArticleTitle(e.target.value)}
          placeholder="Enter entertainment news article title..."
          className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white"
        />
      </div>

      {/* Test button */}
      <Button
        onClick={handleTest}
        disabled={isLoading}
        className="w-full bg-[#ec1e24] hover:bg-[#ec1e24]/90 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing with AI...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Test Smart Image Selection
          </>
        )}
      </Button>

      {/* API Key Warning */}
      {(!settings.serperKey || settings.serperKey === '••••••••••••••••' ||
        !settings.openaiKey || settings.openaiKey === '••••••••••••••••') && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>API Keys Required:</strong> Please configure your Serper and OpenAI API keys in Settings → API Keys to test the smart image selection system.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-6 space-y-6">
          {/* AI Analysis */}
          <div>
            <h3 className="text-gray-900 dark:text-white mb-4">🧠 AI Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-[#000000] rounded-lg p-4 border border-gray-200 dark:border-[#333333]">
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-1">Primary Subject</p>
                <p className="text-sm text-gray-900 dark:text-white">{result.analysis.primarySubject.name}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                  {result.analysis.primarySubject.type} · {result.analysis.primarySubject.status}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#000000] rounded-lg p-4 border border-gray-200 dark:border-[#333333]">
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-1">Context Type</p>
                <p className="text-sm text-gray-900 dark:text-white capitalize">{result.analysis.contextType}</p>
              </div>
              <div className="bg-gray-50 dark:bg-[#000000] rounded-lg p-4 border border-gray-200 dark:border-[#333333]">
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-1">Confidence</p>
                <p className="text-sm text-gray-900 dark:text-white">{result.confidence}%</p>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1 capitalize">
                  {result.confidenceLevel} confidence
                </p>
              </div>
            </div>
          </div>

          {/* Search Queries */}
          <div>
            <h3 className="text-gray-900 dark:text-white mb-3">🔍 Search Queries Generated</h3>
            <div className="space-y-2">
              {result.queries.map((query: string, index: number) => (
                <div
                  key={index}
                  className={`text-sm px-3 py-2 rounded ${
                    index === 0
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-200 border border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-[#000000] text-gray-600 dark:text-[#9CA3AF] border border-gray-200 dark:border-[#333333]'
                  }`}
                >
                  {index === 0 && <span className="text-xs mr-2">✓ Used:</span>}
                  {index > 0 && <span className="text-xs mr-2">Fallback {index}:</span>}
                  {query}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Images */}
          <div>
            <h3 className="text-gray-900 dark:text-white mb-4">🖼️ Selected Images ({result.images.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.images.map((image: any, index: number) => (
                <div key={index} className="space-y-3">
                  <div className="relative group">
                    <ImageWithFallback
                      src={image.url}
                      alt={`Result ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm">
                        <p className="mb-1">{image.reason}</p>
                        <p className="text-xs opacity-75">Score: {image.totalScore}/230</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#000000] rounded-lg p-3 border border-gray-200 dark:border-[#333333] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Reason:</span>
                      <span className="text-xs text-gray-900 dark:text-white">{image.reason}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Source:</span>
                      <span className="text-xs text-gray-900 dark:text-white">{image.source}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Relevance:</span>
                      <span className="text-xs text-gray-900 dark:text-white">{image.relevanceScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Total Score:</span>
                      <span className="text-xs text-gray-900 dark:text-white">{image.totalScore}/230</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Size:</span>
                      <span className="text-xs text-gray-900 dark:text-white">
                        {image.width} × {image.height}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
