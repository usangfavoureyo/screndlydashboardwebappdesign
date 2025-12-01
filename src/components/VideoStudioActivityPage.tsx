import { Film, Calendar, CheckCircle, XCircle, Clock, Download, RefreshCw, Share2, Send } from 'lucide-react';
import { Button } from './ui/button';
import { haptics } from '../utils/haptics';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { InstagramIcon } from './icons/InstagramIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { ThreadsIcon } from './icons/ThreadsIcon';
import { XIcon } from './icons/XIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface VideoStudioActivityPageProps {
  onNavigate: (page: string) => void;
  previousPage?: string | null;
}

export function VideoStudioActivityPage({ onNavigate, previousPage }: VideoStudioActivityPageProps) {
  const { settings } = useSettings();
  const activities = [
    {
      id: '1',
      type: 'review' as const,
      title: 'Dune: Part Three - Official Trailer',
      status: 'completed' as const,
      timestamp: '2 hours ago',
      aspectRatio: '16:9',
      duration: '2:15',
      downloads: 3,
      published: true,
      platforms: ['X', 'Threads', 'Facebook']
    },
    {
      id: '2',
      type: 'monthly' as const,
      title: 'December 2024 Movie Releases Compilation',
      status: 'processing' as const,
      timestamp: '1 hour ago',
      aspectRatio: '9:16',
      duration: '4:30',
      progress: 67,
      downloads: 0,
      published: false,
      platforms: []
    },
    {
      id: '3',
      type: 'review' as const,
      title: 'Wicked - Official Trailer 2',
      status: 'completed' as const,
      timestamp: '5 hours ago',
      aspectRatio: '1:1',
      duration: '1:45',
      downloads: 8,
      published: false,
      platforms: []
    },
    {
      id: '4',
      type: 'review' as const,
      title: 'Gladiator II - Final Trailer',
      status: 'failed' as const,
      timestamp: '1 day ago',
      aspectRatio: '16:9',
      duration: '2:30',
      error: 'Visla API timeout - insufficient credits',
      downloads: 0,
      published: false,
      platforms: []
    },
    {
      id: '5',
      type: 'monthly' as const,
      title: 'November 2024 TV Show Releases',
      status: 'completed' as const,
      timestamp: '2 days ago',
      aspectRatio: '16:9',
      duration: '5:00',
      downloads: 12,
      published: true,
      platforms: ['X', 'Threads', 'Facebook']
    }
  ];

  // Calculate stats
  const completedCount = activities.filter(a => a.status === 'completed').length;
  const processingCount = activities.filter(a => a.status === 'processing').length;
  const failedCount = activities.filter(a => a.status === 'failed').length;
  const totalDownloads = activities.reduce((sum, a) => sum + a.downloads, 0);

  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    x: true,
    threads: true,
    facebook: false,
    tiktok: false,
    youtube: false,
    instagram: false,
  });
  const [selectedActivity, setSelectedActivity] = useState<typeof activities[0] | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [captionEditMode, setCaptionEditMode] = useState(false);

  // Generate caption from video content
  const generateCaption = async (activity: typeof activities[0]) => {
    setIsGeneratingCaption(true);
    setCaptionEditMode(false);
    haptics.light();
    
    try {
      // Use caption settings from context
      const captionSettings = {
        captionOpenaiModel: settings.captionOpenaiModel || 'gpt-4o',
        captionTemperature: settings.captionTemperature || 0.7,
        captionMaxTokens: 500,
        captionSystemPrompt: 'You are a social media caption writer...',
        captionMaxLength: 280,
        captionTone: 'engaging'
      };
      
      // Simulate voiceover transcript based on video type and title
      const mockTranscript = activity.type === 'review' 
        ? `${activity.title} - Experience the cinematic masterpiece everyone's talking about. Coming to theaters soon.`
        : `${activity.title} - Your monthly dose of the best new releases in cinema. Don't miss these incredible films.`;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock caption based on tone
      let caption = '';
      switch (captionSettings.captionTone) {
        case 'hype':
          caption = activity.type === 'review'
            ? `🔥 ${activity.title.toUpperCase()} 🎬\n\nThis is THE movie event you can't miss!\n\n#Movies #MustWatch #Cinema #FilmTwitter #Premiere`
            : `🎬 ${activity.title.toUpperCase()} 🚀\n\nYour cinema guide is HERE! Check out what's hitting screens!\n\n#NewReleases #Movies #Cinema #FilmLovers #MustWatch`;
          break;
        case 'professional':
          caption = activity.type === 'review'
            ? `${activity.title}\n\nA compelling addition to this year's theatrical releases. Now in theaters.\n\n#Cinema #NewRelease #Film #Movies`
            : `${activity.title}\n\nComprehensive overview of this month's most anticipated theatrical releases.\n\n#NewMovies #FilmReleases #Cinema`;
          break;
        case 'casual':
          caption = activity.type === 'review'
            ? `Yo ${activity.title} looks absolutely FIRE 🔥🍿\n\nGotta see this one!\n\n#Movies #MustWatch #FilmTwitter #Cinema`
            : `This month's movie lineup is STACKED 🎬✨\n\nSo many good ones!\n\n#Movies #NewReleases #FilmTwitter #Cinema`;
          break;
        default: // engaging
          caption = activity.type === 'review'
            ? `${activity.title} ✨\n\nThe cinematic experience you've been waiting for. Don't miss it.\n\n#Movies #ComingSoon #MustWatch #Cinema #Film`
            : `${activity.title} 🎬\n\nYour complete guide to this month's must-see releases.\n\n#NewReleases #Movies #MustWatch #Cinema #FilmLovers`;
      }
      
      // Trim to max length if needed
      if (caption.length > captionSettings.captionMaxLength) {
        caption = caption.substring(0, captionSettings.captionMaxLength - 3) + '...';
      }
      
      setGeneratedCaption(caption);
    } catch (error) {
      console.error('Error generating caption:', error);
      setGeneratedCaption('Failed to generate caption. Please try again.');
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => {
            haptics.light();
            onNavigate(previousPage || 'video-studio');
          }}
          className="text-gray-900 dark:text-white hover:text-[#ec1e24] p-2 -ml-2 mt-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12H2M9 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Video Studio Activity</h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">Track video generation, downloads, and publishing status</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#ec1e24]" />
            <div>
              <p className="text-2xl text-gray-900 dark:text-white">{completedCount}</p>
              <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#ec1e24]" />
            <div>
              <p className="text-2xl text-gray-900 dark:text-white">{processingCount}</p>
              <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">Processing</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-[#ec1e24]" />
            <div>
              <p className="text-2xl text-gray-900 dark:text-white">{failedCount}</p>
              <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">Failed</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 text-[#ec1e24]" />
            <div>
              <p className="text-2xl text-gray-900 dark:text-white">{totalDownloads}</p>
              <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">Total Downloads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200">
        <h3 className="text-gray-900 dark:text-white mb-4">Recent Activity</h3>

        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 bg-white dark:bg-[#000000] rounded-xl border border-gray-200 dark:border-[#333333]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-gray-900 dark:text-white">
                      {activity.title}
                    </h4>
                    <span className={`px-3 py-1 text-xs rounded-full flex-shrink-0 ${
                      activity.status === 'completed'
                        ? 'bg-gray-200 dark:bg-[#1f1f1f] text-gray-700 dark:text-[#9CA3AF]'
                        : activity.status === 'processing'
                        ? 'bg-gray-200 dark:bg-[#1f1f1f] text-gray-700 dark:text-[#9CA3AF]'
                        : 'bg-[#FEE2E2] dark:bg-[#991B1B] text-[#991B1B] dark:text-[#FEE2E2]'
                    }`}>
                      {activity.status === 'completed' && 'Completed'}
                      {activity.status === 'processing' && 'Processing'}
                      {activity.status === 'failed' && 'Failed'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-[#9CA3AF] mb-2">
                    <span>{activity.timestamp}</span>
                    <span>•</span>
                    <span>{activity.aspectRatio}</span>
                    <span>•</span>
                    <span>{activity.duration}</span>
                  </div>

                  {/* Error Message */}
                  {activity.status === 'failed' && activity.error && (
                    <p className="text-sm text-[#EF4444] mt-1">{activity.error}</p>
                  )}

                  {/* Processing Progress */}
                  {activity.status === 'processing' && activity.progress !== undefined && (
                    <div className="space-y-1 mb-2">
                      <div className="w-full bg-gray-200 dark:bg-[#0A0A0A] rounded-full h-2">
                        <div
                          className="bg-[#ec1e24] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${activity.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-[#9CA3AF]">
                        {activity.progress}% complete
                      </p>
                    </div>
                  )}

                  {/* Publishing Status */}
                  {activity.status === 'completed' && activity.published && activity.platforms.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="flex items-center gap-1.5">
                        {activity.platforms.map((platform) => (
                          <span 
                            key={platform}
                            className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-[#1F1F1F] text-gray-700 dark:text-[#9CA3AF]"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {activity.status === 'completed' && (
                    <>
                      <button
                        onClick={() => haptics.light()}
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl hover:border-[#ec1e24] transition-all duration-200"
                      >
                        <Download className="w-5 h-5 text-[#ec1e24]" />
                      </button>
                      <button
                        onClick={() => {
                          haptics.light();
                          setIsPublishDialogOpen(true);
                          setSelectedActivity(activity);
                          generateCaption(activity);
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl hover:border-[#ec1e24] transition-all duration-200"
                      >
                        <Share2 className="w-5 h-5 text-[#ec1e24]" />
                      </button>
                    </>
                  )}

                  {activity.status === 'failed' && (
                    <Button
                      onClick={() => haptics.light()}
                      size="sm"
                      variant="outline"
                      className="border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
                    >
                      <RefreshCw className="w-4 h-4 mr-2 text-[#ec1e24]" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publish Dialog */}
      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Publish Video</DialogTitle>
            <DialogDescription className="text-[#6B7280] dark:text-[#9CA3AF]">
              Select platforms and customize your caption
            </DialogDescription>
          </DialogHeader>
          
          {/* Caption Generation Section */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-900 dark:text-white">Social Media Caption</Label>
              <button
                onClick={() => selectedActivity && generateCaption(selectedActivity)}
                disabled={isGeneratingCaption}
                className="text-sm text-[#ec1e24] hover:text-[#d01a20] disabled:opacity-50 flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingCaption ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            </div>
            
            <div className="relative">
              <textarea
                value={generatedCaption}
                onChange={(e) => {
                  setGeneratedCaption(e.target.value);
                  setCaptionEditMode(true);
                }}
                placeholder={isGeneratingCaption ? "Generating caption..." : "Caption will appear here"}
                disabled={isGeneratingCaption}
                className="w-full min-h-[120px] px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#333333] rounded-lg text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-[#6B7280] focus:outline-none focus:border-[#ec1e24] transition-colors resize-none disabled:opacity-50"
              />
              <div className="absolute bottom-2 right-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                {generatedCaption.length} chars
              </div>
            </div>
            
            {captionEditMode && (
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Caption edited manually
              </p>
            )}
          </div>
          
          <Separator className="bg-gray-200 dark:bg-[#1F1F1F]" />
          
          {/* Platform Selection */}
          <div className="space-y-3">
            <Label className="text-gray-900 dark:text-white">Select Platforms</Label>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-3 max-w-fit">
                <button
                  onClick={() => {
                    haptics.light();
                    setSelectedPlatforms({ ...selectedPlatforms, x: !selectedPlatforms.x });
                  }}
                  className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                    selectedPlatforms.x 
                      ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                      : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                  }`}
                  title="X"
                >
                  <XIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => {
                    haptics.light();
                    setSelectedPlatforms({ ...selectedPlatforms, threads: !selectedPlatforms.threads });
                  }}
                  className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                    selectedPlatforms.threads 
                      ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                      : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                  }`}
                  title="Threads"
                >
                  <ThreadsIcon className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => {
                    haptics.light();
                    setSelectedPlatforms({ ...selectedPlatforms, facebook: !selectedPlatforms.facebook });
                  }}
                  className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                    selectedPlatforms.facebook 
                      ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                      : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                  }`}
                  title="Facebook"
                >
                  <FacebookIcon className="w-5.5 h-5.5" />
                </button>
                
                <button
                  onClick={() => {
                    haptics.light();
                    setSelectedPlatforms({ ...selectedPlatforms, tiktok: !selectedPlatforms.tiktok });
                  }}
                  className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                    selectedPlatforms.tiktok 
                      ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                      : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                  }`}
                  title="TikTok"
                >
                  <TikTokIcon className="w-6.5 h-6.5" />
                </button>
                
                <button
                  onClick={() => {
                    haptics.light();
                    setSelectedPlatforms({ ...selectedPlatforms, youtube: !selectedPlatforms.youtube });
                  }}
                  className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                    selectedPlatforms.youtube 
                      ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                      : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                  }`}
                  title="YouTube"
                >
                  <YouTubeIcon className="w-6 h-6" />
                </button>
                
                <button
                  onClick={() => {
                    haptics.light();
                    setSelectedPlatforms({ ...selectedPlatforms, instagram: !selectedPlatforms.instagram });
                  }}
                  className={`flex items-center justify-center w-14 h-14 rounded-lg transition-all ${
                    selectedPlatforms.instagram 
                      ? 'bg-[#ec1e24]/10 border-2 border-[#ec1e24]' 
                      : 'bg-gray-100 dark:bg-[#111111] border-2 border-transparent opacity-40'
                  }`}
                  title="Instagram"
                >
                  <InstagramIcon className="w-5.5 h-5.5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => {
                haptics.light();
                setIsPublishDialogOpen(false);
              }}
              variant="outline"
              className="flex-1 border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                haptics.medium();
                // Handle publish logic here
                setIsPublishDialogOpen(false);
              }}
              className="flex-1 bg-[#ec1e24] hover:bg-[#d01a20] text-white shadow-none hover:shadow-none active:shadow-none focus:shadow-none hover:scale-100 active:scale-100"
            >
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}