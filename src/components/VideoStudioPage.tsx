import { useState, useEffect } from 'react';
import { Upload, Play, Pause, Download, Send, RefreshCw, ChevronDown, ChevronUp, Film, Calendar, AlertCircle, CheckCircle, Clock, Volume2, VolumeX, Settings2, Copy, Activity, X, MoreVertical, Edit2, Maximize } from 'lucide-react';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { haptics } from '../utils/haptics';
import { InstagramIcon } from './icons/InstagramIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { ThreadsIcon } from './icons/ThreadsIcon';
import { XIcon } from './icons/XIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import ColorPickerPopup from './ColorPickerPopup';
import { VisuallyHidden } from './ui/visually-hidden';

interface VideoStudioPageProps {
  onNavigate: (page: string) => void;
  onCaptionEditorChange?: (isOpen: boolean) => void;
}

type AspectRatio = '16:9' | '9:16' | '1:1';
type MusicGenre = 'Hip-Hop' | 'Trap' | 'Rap' | 'Pop' | 'Electronic' | 'R&B';
type DuckingMode = 'Partial' | 'Full Mute' | 'Adaptive';

export function VideoStudioPage({ onNavigate, onCaptionEditorChange }: VideoStudioPageProps) {
  const [activeModule, setActiveModule] = useState<'review' | 'monthly'>('review');
  const [isPromptPanelOpen, setIsPromptPanelOpen] = useState(false);
  const [isPromptGenerated, setIsPromptGenerated] = useState(false);
  const [isAudioPanelOpen, setIsAudioPanelOpen] = useState(false);
  const [isCaptionEditorOpen, setIsCaptionEditorOpen] = useState(false);
  const [showDiffMode, setShowDiffMode] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    x: true,
    threads: true,
    facebook: false,
    tiktok: false,
    youtube: false,
    instagram: false,
  });
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [captionEditMode, setCaptionEditMode] = useState(false);
  
  // Review Module State
  const [reviewYoutubeUrls, setReviewYoutubeUrls] = useState<string[]>(['']);
  const [reviewVideoFiles, setReviewVideoFiles] = useState<File[]>([]);
  const [reviewVoiceover, setReviewVoiceover] = useState<File | null>(null);
  const [reviewMusic, setReviewMusic] = useState<File | null>(null);
  const [reviewMusicGenre, setReviewMusicGenre] = useState<MusicGenre>('Hip-Hop');
  const [reviewAspectRatio, setReviewAspectRatio] = useState<AspectRatio>('16:9');
  const [reviewVideoLength, setReviewVideoLength] = useState('auto');
  const [reviewIsGenerating, setReviewIsGenerating] = useState(false);
  const [reviewProgress, setReviewProgress] = useState(0);
  const [reviewIsPlaying, setReviewIsPlaying] = useState(false);
  const [reviewIsMuted, setReviewIsMuted] = useState(false);
  const [reviewThumbnail, setReviewThumbnail] = useState<File | null>(null);
  const [reviewVideoTime, setReviewVideoTime] = useState(0);
  const [reviewVideoDuration, setReviewVideoDuration] = useState(135); // 2:15 in seconds
  const [reviewIsFullscreen, setReviewIsFullscreen] = useState(false);
  
  // Monthly Module State
  const [monthlyFilter, setMonthlyFilter] = useState<'Movies' | 'TV Shows'>('Movies');
  const [monthlyYoutubeUrls, setMonthlyYoutubeUrls] = useState<string[]>(['']);
  const [monthlyVideoFiles, setMonthlyVideoFiles] = useState<File[]>([]);
  const [monthlyVoiceover, setMonthlyVoiceover] = useState<File | null>(null);
  const [monthlyMusic, setMonthlyMusic] = useState<File | null>(null);
  const [monthlyMusicGenre, setMonthlyMusicGenre] = useState<MusicGenre>('Hip-Hop');
  const [monthlyAspectRatio, setMonthlyAspectRatio] = useState<AspectRatio>('16:9');
  const [monthlyVideoLength, setMonthlyVideoLength] = useState('auto');
  const [monthlyIsGenerating, setMonthlyIsGenerating] = useState(false);
  const [monthlyProgress, setMonthlyProgress] = useState(0);
  const [monthlyIsPlaying, setMonthlyIsPlaying] = useState(false);
  const [monthlyIsMuted, setMonthlyIsMuted] = useState(false);
  const [monthlyThumbnail, setMonthlyThumbnail] = useState<File | null>(null);
  const [monthlyVideoTime, setMonthlyVideoTime] = useState(0);
  const [monthlyVideoDuration, setMonthlyVideoDuration] = useState(285); // 4:45 in seconds
  const [monthlyIsFullscreen, setMonthlyIsFullscreen] = useState(false);
  
  // Audio Dynamics State
  const [enableAutoDucking, setEnableAutoDucking] = useState(true);
  const [duckingMode, setDuckingMode] = useState<DuckingMode>('Adaptive');
  const [duckLevel, setDuckLevel] = useState(-12);
  const [attackMs, setAttackMs] = useState(50);
  const [releaseMs, setReleaseMs] = useState(200);
  
  // LLM Prompt State
  const [promptStatus, setPromptStatus] = useState<'empty' | 'ready' | 'outdated' | 'warning'>('empty');
  const [jsonData, setJsonData] = useState<any>(null);
  const [naturalPrompt, setNaturalPrompt] = useState('');

  // Caption Template State
  const [captionTemplate, setCaptionTemplate] = useState('Netflix Style');
  const [captionFontFamily, setCaptionFontFamily] = useState('Inter');
  const [captionFontSize, setCaptionFontSize] = useState(24);
  const [captionFontWeight, setCaptionFontWeight] = useState('Bold');
  const [captionTextColor, setCaptionTextColor] = useState('#FFFF00');
  const [captionBgColor, setCaptionBgColor] = useState('#000000');
  const [captionBgOpacity, setCaptionBgOpacity] = useState(80);
  const [captionPosition, setCaptionPosition] = useState('Bottom-Center');
  const [captionAlignment, setCaptionAlignment] = useState('Center');
  const [captionStrokeColor, setCaptionStrokeColor] = useState('#000000');
  const [captionStrokeWidth, setCaptionStrokeWidth] = useState(0);
  const [captionShadow, setCaptionShadow] = useState(true);
  const [captionAnimation, setCaptionAnimation] = useState('Fade In');
  const [captionWordsPerLine, setCaptionWordsPerLine] = useState(3);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<any[]>([]);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamingTemplate, setRenamingTemplate] = useState<string | null>(null);
  const [showRenameMenu, setShowRenameMenu] = useState<string | null>(null);

  // Color picker states
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showStrokeColorPicker, setShowStrokeColorPicker] = useState(false);

  const musicGenres: MusicGenre[] = ['Hip-Hop', 'Trap', 'Rap', 'Pop', 'Electronic', 'R&B'];
  const aspectRatios: AspectRatio[] = ['16:9', '9:16', '1:1'];
  const duckingModes: DuckingMode[] = ['Partial', 'Full Mute', 'Adaptive'];
  
  const captionTemplates = ['Netflix Style', 'YouTube Style', 'TikTok/Instagram', 'Minimal', 'Cinematic', 'Custom'];
  const fontFamilies = ['Inter', 'Roboto', 'Montserrat', 'Poppins', 'Open Sans', 'Lato'];
  const fontWeights = ['Regular', 'Medium', 'Bold', 'Black'];
  const positions = ['Top', 'Center', 'Bottom-Center', 'Bottom'];
  const alignments = ['Left', 'Center', 'Right'];
  const animations = ['None', 'Fade In', 'Slide Up', 'Word Highlight'];
  const presetColors = ['#FFFFFF', '#000000', '#ec1e24', '#FFFF00', '#00FF00', '#0066FF', '#FF00FF', '#FFA500'];

  // Load saved templates from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('screndly_saved_caption_templates');
    if (saved) {
      try {
        setSavedTemplates(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved templates:', e);
      }
    }
  }, []);

  // Close rename menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showRenameMenu) {
        setShowRenameMenu(null);
      }
    };
    
    if (showRenameMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showRenameMenu]);

  // Video playback simulation for Review module
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (reviewIsPlaying && reviewVideoTime < reviewVideoDuration) {
      interval = setInterval(() => {
        setReviewVideoTime(prev => {
          const newTime = prev + 1;
          if (newTime >= reviewVideoDuration) {
            setReviewIsPlaying(false);
            return reviewVideoDuration;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [reviewIsPlaying, reviewVideoTime, reviewVideoDuration]);

  // Video playback simulation for Monthly module
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (monthlyIsPlaying && monthlyVideoTime < monthlyVideoDuration) {
      interval = setInterval(() => {
        setMonthlyVideoTime(prev => {
          const newTime = prev + 1;
          if (newTime >= monthlyVideoDuration) {
            setMonthlyIsPlaying(false);
            return monthlyVideoDuration;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [monthlyIsPlaying, monthlyVideoTime, monthlyVideoDuration]);

  // Helper function to format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle video download
  const handleDownloadVideo = (module: 'review' | 'monthly') => {
    haptics.light();
    // Create a mock video file for demonstration
    const filename = module === 'review' ? 'video-preview.mp4' : 'video-compilation.mp4';
    
    // In a real implementation, this would download the actual video
    const mockData = 'Mock video data';
    const blob = new Blob([mockData], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>, module: 'review' | 'monthly') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    
    if (module === 'review') {
      const newTime = Math.floor(percentage * reviewVideoDuration);
      setReviewVideoTime(newTime);
    } else {
      const newTime = Math.floor(percentage * monthlyVideoDuration);
      setMonthlyVideoTime(newTime);
    }
    haptics.light();
  };

  // Handle fullscreen toggle
  const handleFullscreen = (module: 'review' | 'monthly') => {
    haptics.light();
    if (module === 'review') {
      setReviewIsFullscreen(!reviewIsFullscreen);
    } else {
      setMonthlyIsFullscreen(!monthlyIsFullscreen);
    }
  };

  // Generate caption from voiceover transcript
  const generateCaption = async (module: 'review' | 'monthly') => {
    setIsGeneratingCaption(true);
    haptics.light();
    
    try {
      // Load caption generation settings from localStorage
      const savedSettings = localStorage.getItem('screndly_video_studio_settings');
      let captionSettings = {
        captionOpenaiModel: 'gpt-4o',
        captionTemperature: 0.7,
        captionMaxTokens: 500,
        captionSystemPrompt: 'You are a social media caption writer...',
        captionMaxLength: 280,
        captionTone: 'engaging'
      };
      
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          captionSettings = { ...captionSettings, ...parsed };
        } catch (e) {
          console.error('Error parsing settings:', e);
        }
      }
      
      // Simulate voiceover transcript (in real implementation, extract from file)
      const mockTranscript = module === 'review' 
        ? "Get ready for the most anticipated thriller of the year. When a detective uncovers a conspiracy that goes all the way to the top, no one is safe. Coming to theaters this summer."
        : "From groundbreaking sci-fi epics to heartwarming dramas, here are this month's must-watch releases. Don't miss these incredible stories hitting screens near you.";
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock caption based on tone
      let caption = '';
      switch (captionSettings.captionTone) {
        case 'hype':
          caption = module === 'review'
            ? "🔥 THE THRILLER OF THE YEAR IS HERE 🎬\n\nCorruption. Conspiracy. No one is safe.\n\n#Thriller #MoviePremiere #ComingSoon #ActionMovie #MustWatch"
            : "🎬 MONTH'S BIGGEST RELEASES INCOMING 🚀\n\nSci-fi epics + heartwarming dramas = PURE CINEMA\n\n#NewReleases #Movies #MustWatch #Cinema #FilmLovers";
          break;
        case 'professional':
          caption = module === 'review'
            ? "New thriller explores systemic corruption through the eyes of a determined detective. In theaters this summer.\n\n#Thriller #Cinema #NewRelease #Film #Detective"
            : "This month's theatrical releases feature diverse storytelling across multiple genres. From science fiction to drama.\n\n#NewMovies #FilmReleases #Cinema #Movies";
          break;
        case 'casual':
          caption = module === 'review'
            ? "Yo this thriller looks INSANE 😱 Detective vs corruption storyline, coming this summer 🍿\n\n#Thriller #Movies #MustWatch #FilmTwitter #Cinema"
            : "This month's lineup is stacked! 🎬 Got sci-fi, dramas, and everything in between 👌\n\n#Movies #NewReleases #MustWatch #FilmTwitter #Cinema";
          break;
        default: // engaging
          caption = module === 'review'
            ? "The conspiracy runs deeper than anyone imagined 🎭\n\nA detective's search for truth becomes a fight for survival. Don't miss the thriller everyone will be talking about.\n\n#Thriller #ComingSoon #MustWatch #MoviePremiere #Cinema"
            : "Your monthly dose of cinematic excellence is here 🎬✨\n\nFrom mind-bending sci-fi to stories that touch the heart—this month delivers.\n\n#NewReleases #Movies #MustWatch #FilmLovers #Cinema";
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

  const applyTemplatePreset = (template: string) => {
    haptics.light();
    setCaptionTemplate(template);
    
    switch(template) {
      case 'Netflix Style':
        setCaptionTextColor('#FFFF00');
        setCaptionBgColor('#000000');
        setCaptionBgOpacity(80);
        setCaptionFontFamily('Inter');
        setCaptionFontSize(24);
        setCaptionFontWeight('Bold');
        setCaptionPosition('Bottom-Center');
        setCaptionAlignment('Center');
        setCaptionStrokeWidth(0);
        setCaptionShadow(true);
        setCaptionAnimation('Fade In');
        setCaptionWordsPerLine(3);
        break;
      case 'YouTube Style':
        setCaptionTextColor('#FFFFFF');
        setCaptionBgColor('#000000');
        setCaptionBgOpacity(75);
        setCaptionFontFamily('Roboto');
        setCaptionFontSize(20);
        setCaptionFontWeight('Regular');
        setCaptionPosition('Bottom');
        setCaptionAlignment('Center');
        setCaptionStrokeWidth(0);
        setCaptionShadow(false);
        setCaptionAnimation('None');
        setCaptionWordsPerLine(4);
        break;
      case 'TikTok/Instagram':
        setCaptionTextColor('#FFFFFF');
        setCaptionBgColor('#000000');
        setCaptionBgOpacity(0);
        setCaptionFontFamily('Montserrat');
        setCaptionFontSize(32);
        setCaptionFontWeight('Black');
        setCaptionPosition('Center');
        setCaptionAlignment('Center');
        setCaptionStrokeColor('#000000');
        setCaptionStrokeWidth(3);
        setCaptionShadow(true);
        setCaptionAnimation('Word Highlight');
        setCaptionWordsPerLine(2);
        break;
      case 'Minimal':
        setCaptionTextColor('#FFFFFF');
        setCaptionBgColor('#000000');
        setCaptionBgOpacity(0);
        setCaptionFontFamily('Inter');
        setCaptionFontSize(18);
        setCaptionFontWeight('Regular');
        setCaptionPosition('Bottom');
        setCaptionAlignment('Center');
        setCaptionStrokeWidth(0);
        setCaptionShadow(false);
        setCaptionAnimation('None');
        setCaptionWordsPerLine(3);
        break;
      case 'Cinematic':
        setCaptionTextColor('#ec1e24');
        setCaptionBgColor('#000000');
        setCaptionBgOpacity(60);
        setCaptionFontFamily('Poppins');
        setCaptionFontSize(28);
        setCaptionFontWeight('Medium');
        setCaptionPosition('Bottom-Center');
        setCaptionAlignment('Center');
        setCaptionStrokeWidth(0);
        setCaptionShadow(true);
        setCaptionAnimation('Slide Up');
        setCaptionWordsPerLine(3);
        break;
      default:
        // Custom - keep current settings
        break;
    }
    
    // Mark prompt as outdated since caption settings changed
    if (isPromptGenerated) {
      setPromptStatus('outdated');
    }
  };

  const handleSaveCaptionTemplate = () => {
    haptics.medium();
    // Open naming dialog
    setTemplateName('');
    setIsRenaming(false);
    setShowNameDialog(true);
  };

  const saveTemplateWithName = () => {
    if (!templateName.trim()) return;
    
    // Check for duplicate names
    if (savedTemplates.some(t => t.name === templateName.trim())) {
      alert('A template with this name already exists. Please choose a different name.');
      return;
    }
    
    haptics.medium();
    const timestamp = new Date().toLocaleString();
    
    const templateData = {
      name: templateName.trim(),
      fontFamily: captionFontFamily,
      fontSize: captionFontSize,
      fontWeight: captionFontWeight,
      textColor: captionTextColor,
      bgColor: captionBgColor,
      bgOpacity: captionBgOpacity,
      position: captionPosition,
      alignment: captionAlignment,
      strokeColor: captionStrokeColor,
      strokeWidth: captionStrokeWidth,
      shadow: captionShadow,
      animation: captionAnimation,
      wordsPerLine: captionWordsPerLine,
      savedAt: timestamp,
    };
    
    // Save to localStorage
    const updatedTemplates = [...savedTemplates, templateData];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('screndly_saved_caption_templates', JSON.stringify(updatedTemplates));
    
    setShowNameDialog(false);
    setTemplateName('');
    setShowSaveSuccess(true);
    
    // Hide success message after 2 seconds
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 2000);
  };

  const loadSavedTemplate = (template: any) => {
    haptics.light();
    setCaptionTemplate(template.name);
    setCaptionFontFamily(template.fontFamily);
    setCaptionFontSize(template.fontSize);
    setCaptionFontWeight(template.fontWeight);
    setCaptionTextColor(template.textColor);
    setCaptionBgColor(template.bgColor);
    setCaptionBgOpacity(template.bgOpacity);
    setCaptionPosition(template.position);
    setCaptionAlignment(template.alignment);
    setCaptionStrokeColor(template.strokeColor);
    setCaptionStrokeWidth(template.strokeWidth);
    setCaptionShadow(template.shadow);
    setCaptionAnimation(template.animation);
    setCaptionWordsPerLine(template.wordsPerLine);
    
    // Mark prompt as outdated since caption settings changed
    if (isPromptGenerated) {
      setPromptStatus('outdated');
    }
  };

  const deleteSavedTemplate = (templateName: string) => {
    haptics.medium();
    const updatedTemplates = savedTemplates.filter(t => t.name !== templateName);
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('screndly_saved_caption_templates', JSON.stringify(updatedTemplates));
  };

  const handleRenameTemplate = (oldName: string) => {
    const template = savedTemplates.find(t => t.name === oldName);
    if (template) {
      setTemplateName(oldName);
      setRenamingTemplate(oldName);
      setIsRenaming(true);
      setShowNameDialog(true);
      setShowRenameMenu(null);
    }
  };

  const renameTemplate = () => {
    if (!templateName.trim() || !renamingTemplate) return;
    
    // Check for duplicate names (excluding the current template being renamed)
    if (savedTemplates.some(t => t.name === templateName.trim() && t.name !== renamingTemplate)) {
      alert('A template with this name already exists. Please choose a different name.');
      return;
    }
    
    haptics.medium();
    const updatedTemplates = savedTemplates.map(t => 
      t.name === renamingTemplate 
        ? { ...t, name: templateName.trim() }
        : t
    );
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('screndly_saved_caption_templates', JSON.stringify(updatedTemplates));
    
    setShowNameDialog(false);
    setTemplateName('');
    setRenamingTemplate(null);
    setIsRenaming(false);
  };

  const handleGenerateReviewVideo = () => {
    haptics.medium();
    setReviewIsGenerating(true);
    setReviewProgress(0);
    
    const interval = setInterval(() => {
      setReviewProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setReviewIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleGenerateMonthlyVideo = () => {
    haptics.medium();
    setMonthlyIsGenerating(true);
    setMonthlyProgress(0);
    
    const interval = setInterval(() => {
      setMonthlyProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setMonthlyIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRegenerateJSON = () => {
    haptics.light();
    setIsPromptGenerated(true);
    setIsPromptPanelOpen(true);
    setPromptStatus('ready');
    
    // Build caption configuration object
    const captionConfig = {
      template: captionTemplate,
      font_family: captionFontFamily,
      font_size: captionFontSize,
      font_weight: captionFontWeight,
      text_color: captionTextColor,
      bg_color: captionBgColor,
      bg_opacity: captionBgOpacity,
      position: captionPosition,
      alignment: captionAlignment,
      stroke_color: captionStrokeColor,
      stroke_width: captionStrokeWidth,
      shadow: captionShadow,
      animation: captionAnimation,
      words_per_line: captionWordsPerLine
    };
    
    setJsonData({
      voice_over_segments: [
        { start: 0, end: 3.5, text: "This holiday season..." },
        { start: 8.2, end: 12.1, text: "Experience the magic..." }
      ],
      trailer_dialog_segments: [
        { start: 4.0, end: 7.8, text: "Character dialogue detected" }
      ],
      audio_dynamics: {
        auto_ducking: enableAutoDucking,
        mode: duckingMode,
        duck_level_db: duckLevel,
        attack_ms: attackMs,
        release_ms: releaseMs
      },
      music_genre: activeModule === 'review' ? reviewMusicGenre : monthlyMusicGenre,
      caption_style: captionConfig,
      aspect_ratio: activeModule === 'review' ? reviewAspectRatio : monthlyAspectRatio,
      video_length: activeModule === 'review' ? reviewVideoLength : monthlyVideoLength
    });
    
    setNaturalPrompt(`Create a cinematic ${activeModule === 'review' ? reviewAspectRatio : monthlyAspectRatio} video compilation with dynamic audio mixing. Apply ${duckingMode.toLowerCase()} ducking at ${duckLevel}dB when voiceover is active. Use ${captionTemplate} caption style with ${captionFontFamily} font (${captionFontSize}px, ${captionFontWeight}) positioned at ${captionPosition} with ${captionAnimation} animation. Music genre: ${activeModule === 'review' ? reviewMusicGenre : monthlyMusicGenre}. Total duration: ${activeModule === 'review' ? reviewVideoLength : monthlyVideoLength}.`);
  };

  const copyPromptToClipboard = () => {
    haptics.light();
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(naturalPrompt).catch((err) => {
        console.error('Clipboard API failed:', err);
        // Fallback to older method
        fallbackCopyToClipboard(naturalPrompt);
      });
    } else {
      // Use fallback for unsupported browsers
      fallbackCopyToClipboard(naturalPrompt);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Video Studio</h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">Create and manage video content</p>
        </div>
        <Button
          onClick={() => {
            haptics.light();
            onNavigate('video-studio-activity');
          }}
          variant="outline"
          className="text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
        >
          View Activity
        </Button>
      </div>

      {/* Module Selector */}
      <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-2">
        <div className="flex gap-2">
          <button
            onClick={() => {
              haptics.light();
              setActiveModule('review');
            }}
            className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              activeModule === 'review'
                ? 'bg-[#ec1e24] text-white'
                : 'text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-[#1A1A1A]'
            }`}
          >
            <Film className="w-5 h-5" />
            Video Review
          </button>
          <button
            onClick={() => {
              haptics.light();
              setActiveModule('monthly');
            }}
            className={`flex-1 px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
              activeModule === 'monthly'
                ? 'bg-[#ec1e24] text-white'
                : 'text-gray-600 dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-[#1A1A1A]'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Monthly Releases
          </button>
        </div>
      </div>

      {/* Video Review Module */}
      {activeModule === 'review' && (
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-6 h-6 text-[#ec1e24]" />
            <div>
              <h3 className="text-gray-900 dark:text-white">Video Review Module</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Create custom video reviews</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* YouTube URLs */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 flex items-center justify-between">
                <span>YouTube URLs</span>
                <span className="text-sm text-gray-500 dark:text-[#6B7280]">
                  {reviewYoutubeUrls.length} / 10
                </span>
              </label>
              
              {/* URL List */}
              <div className="space-y-2">
                {reviewYoutubeUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...reviewYoutubeUrls];
                        newUrls[index] = e.target.value;
                        setReviewYoutubeUrls(newUrls);
                      }}
                      placeholder="https://youtube.com/watch?v=..."
                      className="flex-1 px-4 py-3 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ec1e24]"
                    />
                    {reviewYoutubeUrls.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          haptics.light();
                          setReviewYoutubeUrls(reviewYoutubeUrls.filter((_, i) => i !== index));
                        }}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-[#111111] rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
                      >
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Add URL Button */}
              {reviewYoutubeUrls.length < 10 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    haptics.light();
                    setReviewYoutubeUrls([...reviewYoutubeUrls, '']);
                  }}
                  className="mt-2 w-full px-4 py-2 bg-white dark:bg-[#000000] border border-dashed border-gray-300 dark:border-[#333333] rounded-xl text-gray-600 dark:text-gray-400 hover:border-[#ec1e24] hover:text-[#ec1e24] transition-all duration-200"
                >
                  + Add Another URL
                </button>
              )}
              
              {/* Max Warning */}
              {reviewYoutubeUrls.length >= 10 && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                  <span className="text-sm text-amber-700 dark:text-amber-400">
                    Maximum 10 URLs reached
                  </span>
                </div>
              )}
            </div>

            {/* File Uploaders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-900 dark:text-white mb-2 flex items-center justify-between">
                  <span>Video Files</span>
                  <span className="text-sm text-gray-500 dark:text-[#6B7280]">
                    {reviewVideoFiles.length} / 10
                  </span>
                </label>
                
                {/* Uploaded Videos List */}
                {reviewVideoFiles.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {reviewVideoFiles.map((file, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl"
                      >
                        <Film className="w-4 h-4 text-[#ec1e24] flex-shrink-0" />
                        <span className="text-sm text-gray-900 dark:text-white flex-1 truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-[#6B7280] flex-shrink-0">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            haptics.light();
                            setReviewVideoFiles(reviewVideoFiles.filter((_, i) => i !== index));
                          }}
                          className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-[#111111] rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-900 transition-all duration-200"
                        >
                          <X className="w-4 h-4 text-gray-500 dark:text-[#6B7280] hover:text-red-600 dark:hover:text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload Button */}
                {reviewVideoFiles.length < 10 && (
                  <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl cursor-pointer hover:border-[#ec1e24] transition-all duration-200">
                    <Upload className="w-6 h-6 text-[#ec1e24]" />
                    <span className="text-sm text-gray-600 dark:text-[#9CA3AF] text-center">
                      {reviewVideoFiles.length === 0 ? 'Upload Videos' : 'Upload More Videos'}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const remainingSlots = 10 - reviewVideoFiles.length;
                        const filesToAdd = files.slice(0, remainingSlots);
                        if (filesToAdd.length > 0) {
                          setReviewVideoFiles([...reviewVideoFiles, ...filesToAdd]);
                          haptics.light();
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                )}
                
                {reviewVideoFiles.length >= 10 && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-[#333333] rounded-xl">
                    <AlertCircle className="w-4 h-4 text-gray-500 dark:text-[#6B7280]" />
                    <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">
                      Maximum 10 videos reached
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">
                  Voice-over
                </label>
                <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl cursor-pointer hover:border-[#ec1e24] transition-all duration-200">
                  <Upload className="w-6 h-6 text-[#ec1e24]" />
                  <span className="text-sm text-gray-600 dark:text-[#9CA3AF] text-center">
                    {reviewVoiceover ? reviewVoiceover.name : 'Upload Audio'}
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setReviewVoiceover(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">
                  Music Track
                </label>
                <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl cursor-pointer hover:border-[#ec1e24] transition-all duration-200">
                  <Upload className="w-6 h-6 text-[#ec1e24]" />
                  <span className="text-sm text-gray-600 dark:text-[#9CA3AF] text-center">
                    {reviewMusic ? reviewMusic.name : 'Upload Music'}
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setReviewMusic(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            {/* Music Genre Selector */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">
                Music Genre
              </label>
              <div className="flex gap-2 flex-wrap">
                {musicGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      haptics.light();
                      setReviewMusicGenre(genre);
                    }}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                      reviewMusicGenre === genre
                        ? 'bg-[#ec1e24] text-white'
                        : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-[#9CA3AF] hover:border-[#ec1e24]'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Video Length */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">
                  Aspect Ratio
                </label>
                <div className="flex gap-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => {
                        haptics.light();
                        setReviewAspectRatio(ratio);
                        setPromptStatus('outdated');
                      }}
                      className={`flex-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                        reviewAspectRatio === ratio
                          ? 'bg-[#ec1e24] text-white'
                          : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-[#9CA3AF] hover:border-[#ec1e24]'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">
                  Video Length
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      haptics.light();
                      setReviewVideoLength('auto');
                    }}
                    className={`flex-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                      reviewVideoLength === 'auto'
                        ? 'bg-[#ec1e24] text-white'
                        : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-[#9CA3AF] hover:border-[#ec1e24]'
                    }`}
                  >
                    Auto
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={reviewVideoLength !== 'auto' ? Math.floor(parseInt(reviewVideoLength) / 60) || '' : ''}
                    onChange={(e) => {
                      const minutes = parseInt(e.target.value) || 0;
                      const seconds = reviewVideoLength !== 'auto' ? parseInt(reviewVideoLength) % 60 : 0;
                      setReviewVideoLength(String(minutes * 60 + seconds));
                    }}
                    className="w-20 md:w-24 px-3 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-[#ec1e24]"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="SS"
                    value={reviewVideoLength !== 'auto' ? (parseInt(reviewVideoLength) % 60).toString() : ''}
                    onChange={(e) => {
                      const minutes = reviewVideoLength !== 'auto' ? Math.floor(parseInt(reviewVideoLength) / 60) : 0;
                      const seconds = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setReviewVideoLength(String(minutes * 60 + seconds));
                    }}
                    className="w-20 md:w-24 px-3 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-[#ec1e24]"
                  />
                </div>
              </div>
            </div>

            {/* Generate LLM Prompt Button - Shows first */}
            {!isPromptGenerated && (
              <Button
                onClick={handleRegenerateJSON}
                className="w-full bg-[#ec1e24] hover:bg-[#d01a20] text-white"
              >
                <Settings2 className="w-5 h-5 mr-2" />
                Generate LLM Prompt
              </Button>
            )}
          </div>
        </div>
      )}

      {/* LLM + JSON Prompt Panel - Shows after Generate LLM Prompt is clicked */}
      {activeModule === 'review' && isPromptGenerated && (
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings2 className="w-6 h-6 text-[#ec1e24]" />
              <div>
                <h3 className="text-gray-900 dark:text-white">LLM Prompt Configuration</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Configure AI generation settings before creating video</p>
              </div>
            </div>
            <button
              onClick={() => {
                haptics.light();
                setIsPromptPanelOpen(!isPromptPanelOpen);
              }}
              className="text-gray-600 dark:text-[#9CA3AF] hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              {isPromptPanelOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {isPromptPanelOpen && (
            <div className="space-y-4">
              {/* Status Banner */}
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                promptStatus === 'ready' ? 'bg-[#D1FAE5] dark:bg-[#065F46] text-[#065F46] dark:text-[#D1FAE5]' :
                promptStatus === 'warning' ? 'bg-[#FEF3C7] dark:bg-[#92400E] text-[#92400E] dark:text-[#FEF3C7]' :
                promptStatus === 'outdated' ? 'bg-[#FED7AA] dark:bg-[#9A3412] text-[#9A3412] dark:text-[#FED7AA]' :
                'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
              }`}>
                {promptStatus === 'ready' && <CheckCircle className="w-5 h-5" />}
                {promptStatus === 'warning' && <AlertCircle className="w-5 h-5" />}
                {promptStatus === 'outdated' && <Clock className="w-5 h-5" />}
                
                <span>
                  {promptStatus === 'ready' && 'Prompt Ready for Generation'}
                  {promptStatus === 'warning' && 'Warning: Missing required inputs'}
                  {promptStatus === 'outdated' && 'Prompt Outdated - Regenerate Required'}
                  {promptStatus === 'empty' && 'Awaiting Required Inputs'}
                </span>
              </div>

              {/* Diff Mode Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">
                  View Mode
                </span>
                <button
                  onClick={() => {
                    haptics.light();
                    setShowDiffMode(!showDiffMode);
                  }}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    showDiffMode
                      ? 'bg-[#ec1e24] text-white'
                      : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-[#9CA3AF]'
                  }`}
                >
                  {showDiffMode ? 'Side-by-Side' : 'Stacked'}
                </button>
              </div>

              {/* JSON Preview */}
              <div className={`${showDiffMode ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-900 dark:text-white">
                      Structured JSON
                    </label>
                    <Button
                      onClick={handleRegenerateJSON}
                      size="sm"
                      variant="outline"
                      className="border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
                    >
                      <RefreshCw className="w-4 h-4 mr-2 text-[#ec1e24]" />
                      Regenerate JSON
                    </Button>
                  </div>
                  <pre className="p-4 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-sm text-gray-900 dark:text-white overflow-x-auto max-h-96 overflow-y-auto">
                    {JSON.stringify(jsonData, null, 2) || '{\n  // Upload assets to generate JSON\n}'}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-900 dark:text-white">
                      Natural Language Prompt
                    </label>
                    <Button
                      onClick={copyPromptToClipboard}
                      size="sm"
                      variant="outline"
                      className="border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
                    >
                      <Copy className="w-4 h-4 mr-2 text-[#ec1e24]" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-sm text-gray-900 dark:text-white max-h-96 overflow-y-auto">
                    {naturalPrompt || 'Upload assets and generate JSON to see the prompt...'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Module - Generate Video Button Section */}
      {activeModule === 'review' && isPromptGenerated && (
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="space-y-4">
            {/* Caption Template Editor Button */}
            <Button
              onClick={() => {
                haptics.light();
                const newState = !isCaptionEditorOpen;
                setIsCaptionEditorOpen(newState);
                onCaptionEditorChange?.(newState);
              }}
              variant="outline"
              className="w-full border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
            >
              <Settings2 className="w-5 h-5 mr-2 text-[#ec1e24]" />
              {isCaptionEditorOpen ? 'Hide' : 'Configure'} Caption Template
            </Button>

            {/* Generate Video Button - Shows after prompt is generated */}
            <Button
              onClick={handleGenerateReviewVideo}
              disabled={reviewIsGenerating}
              className="w-full bg-[#ec1e24] hover:bg-[#d01a20] text-white"
            >
              {reviewIsGenerating ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Film className="w-5 h-5 mr-2" />
                  Generate Video
                </>
              )}
            </Button>

            {/* Progress Bar */}
            {reviewIsGenerating && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 dark:bg-[#0A0A0A] rounded-full h-2.5">
                  <div 
                    className="bg-[#ec1e24] h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${reviewProgress}%` }}
                  />
                </div>
                <p className="text-sm text-center text-gray-600 dark:text-[#9CA3AF]">
                  Processing... {reviewProgress}%
                </p>
              </div>
            )}

            {/* Video Preview */}
            {reviewProgress === 100 && (
              <div className="space-y-4 mt-6 pt-6 border-t border-gray-200 dark:border-[#333333]">
                <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative group">
                  <p className="text-white">Video Preview</p>
                  
                  {/* Video Controls - Inside Player */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-200">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          haptics.light();
                          setReviewIsPlaying(!reviewIsPlaying);
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                      >
                        {reviewIsPlaying ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          haptics.light();
                          setReviewIsMuted(!reviewIsMuted);
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                      >
                        {reviewIsMuted ? (
                          <VolumeX className="w-4 h-4 text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>

                      <div 
                        className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                        onClick={(e) => handleProgressClick(e, 'review')}
                      >
                        <div 
                          className="h-full bg-[#ec1e24] transition-all duration-150" 
                          style={{ width: `${(reviewVideoTime / reviewVideoDuration) * 100}%` }}
                        />
                      </div>

                      <span className="text-xs text-white/90 min-w-[70px] text-right">
                        {formatTime(reviewVideoTime)} / {formatTime(reviewVideoDuration)}
                      </span>

                      <button
                        onClick={() => handleFullscreen('review')}
                        className="w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                      >
                        <Maximize className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="text-gray-900 dark:text-white mb-2 block">
                    Upload Thumbnail (Auto-sized for each platform)
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl cursor-pointer hover:border-[#ec1e24] transition-all duration-200">
                    <Upload className="w-6 h-6 text-[#ec1e24]" />
                    <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">
                      {reviewThumbnail ? reviewThumbnail.name : 'Upload Thumbnail'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setReviewThumbnail(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleDownloadVideo('review')}
                    variant="outline"
                    className="border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
                  >
                    <Download className="w-5 h-5 mr-2 text-[#ec1e24]" />
                    Download Video
                  </Button>

                  <Button
                    onClick={() => {
                      haptics.light();
                      setIsPublishDialogOpen(true);
                    }}
                    className="bg-[#ec1e24] hover:bg-[#d01a20] text-white"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Publish to Social Media
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monthly Releases Module */}
      {activeModule === 'monthly' && (
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6 hover:shadow-md dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.08)] transition-shadow duration-200">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-[#ec1e24]" />
            <div>
              <h3 className="text-gray-900 dark:text-white">Monthly Releases Module</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Create monthly compilation videos</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Filter */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">
                Content Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    haptics.light();
                    setMonthlyFilter('Movies');
                  }}
                  className={`flex-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                    monthlyFilter === 'Movies'
                      ? 'bg-[#ec1e24] text-white'
                      : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-[#9CA3AF] hover:border-[#ec1e24]'
                  }`}
                >
                  Movies
                </button>
                <button
                  onClick={() => {
                    haptics.light();
                    setMonthlyFilter('TV Shows');
                  }}
                  className={`flex-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                    monthlyFilter === 'TV Shows'
                      ? 'bg-[#ec1e24] text-white'
                      : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-[#9CA3AF] hover:border-[#ec1e24]'
                  }`}
                >
                  TV Shows
                </button>
              </div>
            </div>

            {/* YouTube URLs */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 flex items-center justify-between">
                <span>YouTube URLs</span>
                <span className="text-sm text-gray-500 dark:text-[#6B7280]">
                  {monthlyYoutubeUrls.length} / 10
                </span>
              </label>
              
              {/* URL List */}
              <div className="space-y-2">
                {monthlyYoutubeUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...monthlyYoutubeUrls];
                        newUrls[index] = e.target.value;
                        setMonthlyYoutubeUrls(newUrls);
                      }}
                      placeholder="https://youtube.com/watch?v=..."
                      className="flex-1 px-4 py-3 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ec1e24]"
                    />
                    {monthlyYoutubeUrls.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          haptics.light();
                          setMonthlyYoutubeUrls(monthlyYoutubeUrls.filter((_, i) => i !== index));
                        }}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-[#111111] rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
                      >
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Add URL Button */}
              {monthlyYoutubeUrls.length < 10 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    haptics.light();
                    setMonthlyYoutubeUrls([...monthlyYoutubeUrls, '']);
                  }}
                  className="mt-2 w-full px-4 py-2 bg-white dark:bg-[#000000] border border-dashed border-gray-300 dark:border-[#333333] rounded-xl text-gray-600 dark:text-gray-400 hover:border-[#ec1e24] hover:text-[#ec1e24] transition-all duration-200"
                >
                  + Add Another URL
                </button>
              )}
              
              {/* Max Warning */}
              {monthlyYoutubeUrls.length >= 10 && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                  <span className="text-sm text-amber-700 dark:text-amber-400">
                    Maximum 10 URLs reached
                  </span>
                </div>
              )}
            </div>

            {/* Local Video Upload */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 flex items-center justify-between">
                <span>Video files</span>
                <span className="text-sm text-gray-500 dark:text-[#6B7280]">
                  {monthlyVideoFiles.length} / 10
                </span>
              </label>
              
              {/* Uploaded Videos List */}
              {monthlyVideoFiles.length > 0 && (
                <div className="mb-3 space-y-2">
                  {monthlyVideoFiles.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl"
                    >
                      <Film className="w-4 h-4 text-[#ec1e24] flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white flex-1 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-[#6B7280] flex-shrink-0">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          haptics.light();
                          setMonthlyVideoFiles(monthlyVideoFiles.filter((_, i) => i !== index));
                        }}
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-[#111111] rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-900 transition-all duration-200"
                      >
                        <X className="w-4 h-4 text-gray-500 dark:text-[#6B7280] hover:text-red-600 dark:hover:text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Button */}
              {monthlyVideoFiles.length < 10 && (
                <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl cursor-pointer hover:border-[#ec1e24] transition-all duration-200">
                  <Upload className="w-6 h-6 text-[#ec1e24]" />
                  <span className="text-sm text-gray-600 dark:text-[#9CA3AF] text-center">
                    {monthlyVideoFiles.length === 0 ? 'Upload Videos' : 'Upload More Videos'}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const remainingSlots = 10 - monthlyVideoFiles.length;
                      const filesToAdd = files.slice(0, remainingSlots);
                      if (filesToAdd.length > 0) {
                        setMonthlyVideoFiles([...monthlyVideoFiles, ...filesToAdd]);
                        haptics.light();
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              )}
              
              {monthlyVideoFiles.length >= 10 && (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-[#333333] rounded-xl">
                  <AlertCircle className="w-4 h-4 text-gray-500 dark:text-[#6B7280]" />
                  <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">
                    Maximum 10 videos reached
                  </span>
                </div>
              )}
            </div>

            {/* File Uploaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">
                  Voice-over
                </label>
                <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl cursor-pointer hover:border-[#ec1e24] transition-all duration-200">
                  <Upload className="w-6 h-6 text-[#ec1e24]" />
                  <span className="text-sm text-gray-600 dark:text-[#9CA3AF] text-center">
                    {monthlyVoiceover ? monthlyVoiceover.name : 'Upload Audio'}
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setMonthlyVoiceover(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">
                  Music Track
                </label>
                <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl cursor-pointer hover:border-[#ec1e24] transition-all duration-200">
                  <Upload className="w-6 h-6 text-[#ec1e24]" />
                  <span className="text-sm text-gray-600 dark:text-[#9CA3AF] text-center">
                    {monthlyMusic ? monthlyMusic.name : 'Upload Music'}
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setMonthlyMusic(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            {/* Music Genre Selector */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">
                Music Genre
              </label>
              <div className="flex gap-2 flex-wrap">
                {musicGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      haptics.light();
                      setMonthlyMusicGenre(genre);
                    }}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                      monthlyMusicGenre === genre
                        ? 'bg-[#ec1e24] text-white'
                        : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-[#9CA3AF] hover:border-[#ec1e24]'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Video Length */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">
                  Aspect Ratio
                </label>
                <div className="flex gap-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => {
                        haptics.light();
                        setMonthlyAspectRatio(ratio);
                        setPromptStatus('outdated');
                      }}
                      className={`flex-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                        monthlyAspectRatio === ratio
                          ? 'bg-[#ec1e24] text-white'
                          : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-[#9CA3AF] hover:border-[#ec1e24]'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">
                  Video Length
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      haptics.light();
                      setMonthlyVideoLength('auto');
                    }}
                    className={`flex-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                      monthlyVideoLength === 'auto'
                        ? 'bg-[#ec1e24] text-white'
                        : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-[#9CA3AF] hover:border-[#ec1e24]'
                    }`}
                  >
                    Auto
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={monthlyVideoLength !== 'auto' ? Math.floor(parseInt(monthlyVideoLength) / 60) || '' : ''}
                    onChange={(e) => {
                      const minutes = parseInt(e.target.value) || 0;
                      const seconds = monthlyVideoLength !== 'auto' ? parseInt(monthlyVideoLength) % 60 : 0;
                      setMonthlyVideoLength(String(minutes * 60 + seconds));
                    }}
                    className="w-20 md:w-24 px-3 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-[#ec1e24]"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="SS"
                    value={monthlyVideoLength !== 'auto' ? (parseInt(monthlyVideoLength) % 60).toString() : ''}
                    onChange={(e) => {
                      const minutes = monthlyVideoLength !== 'auto' ? Math.floor(parseInt(monthlyVideoLength) / 60) : 0;
                      const seconds = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setMonthlyVideoLength(String(minutes * 60 + seconds));
                    }}
                    className="w-20 md:w-24 px-3 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-[#ec1e24]"
                  />
                </div>
              </div>
            </div>

            {/* Generate LLM Prompt Button - Shows first */}
            {!isPromptGenerated && (
              <Button
                onClick={handleRegenerateJSON}
                className="w-full bg-[#ec1e24] hover:bg-[#d01a20] text-white"
              >
                <Settings2 className="w-5 h-5 mr-2" />
                Generate LLM Prompt
              </Button>
            )}
          </div>
        </div>
      )}

      {/* LLM + JSON Prompt Panel - Shows after Generate LLM Prompt is clicked (Monthly) */}
      {activeModule === 'monthly' && isPromptGenerated && (
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings2 className="w-6 h-6 text-[#ec1e24]" />
              <div>
                <h3 className="text-gray-900 dark:text-white">LLM Prompt Configuration</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Configure AI generation settings before creating video</p>
              </div>
            </div>
            <button
              onClick={() => {
                haptics.light();
                setIsPromptPanelOpen(!isPromptPanelOpen);
              }}
              className="text-gray-600 dark:text-[#9CA3AF] hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              {isPromptPanelOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {isPromptPanelOpen && (
            <div className="space-y-4">
              {/* Status Banner */}
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                promptStatus === 'ready' ? 'bg-[#D1FAE5] dark:bg-[#065F46] text-[#065F46] dark:text-[#D1FAE5]' :
                promptStatus === 'warning' ? 'bg-[#FEF3C7] dark:bg-[#92400E] text-[#92400E] dark:text-[#FEF3C7]' :
                promptStatus === 'outdated' ? 'bg-[#FED7AA] dark:bg-[#9A3412] text-[#9A3412] dark:text-[#FED7AA]' :
                'bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-[#9CA3AF]'
              }`}>
                {promptStatus === 'ready' && <CheckCircle className="w-5 h-5" />}
                {promptStatus === 'warning' && <AlertCircle className="w-5 h-5" />}
                {promptStatus === 'outdated' && <Clock className="w-5 h-5" />}
                
                <span>
                  {promptStatus === 'ready' && 'Prompt Ready for Generation'}
                  {promptStatus === 'warning' && 'Warning: Missing required inputs'}
                  {promptStatus === 'outdated' && 'Prompt Outdated - Regenerate Required'}
                  {promptStatus === 'empty' && 'Awaiting Required Inputs'}
                </span>
              </div>

              {/* Diff Mode Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">
                  View Mode
                </span>
                <button
                  onClick={() => {
                    haptics.light();
                    setShowDiffMode(!showDiffMode);
                  }}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    showDiffMode
                      ? 'bg-[#ec1e24] text-white'
                      : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-[#9CA3AF]'
                  }`}
                >
                  {showDiffMode ? 'Side-by-Side' : 'Stacked'}
                </button>
              </div>

              {/* JSON Preview */}
              <div className={`${showDiffMode ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-900 dark:text-white">
                      Structured JSON
                    </label>
                    <Button
                      onClick={handleRegenerateJSON}
                      size="sm"
                      variant="outline"
                      className="border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
                    >
                      <RefreshCw className="w-4 h-4 mr-2 text-[#ec1e24]" />
                      Regenerate JSON
                    </Button>
                  </div>
                  <pre className="p-4 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-sm text-gray-900 dark:text-white overflow-x-auto max-h-96 overflow-y-auto">
                    {JSON.stringify(jsonData, null, 2) || '{\n  // Upload assets to generate JSON\n}'}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-900 dark:text-white">
                      Natural Language Prompt
                    </label>
                    <Button
                      onClick={copyPromptToClipboard}
                      size="sm"
                      variant="outline"
                      className="border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
                    >
                      <Copy className="w-4 h-4 mr-2 text-[#ec1e24]" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-4 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-sm text-gray-900 dark:text-white max-h-96 overflow-y-auto">
                    {naturalPrompt || 'Upload assets and generate JSON to see the prompt...'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Monthly Module - Generate Video Button Section */}
      {activeModule === 'monthly' && isPromptGenerated && (
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="space-y-4">
            {/* Caption Template Editor Button */}
            <Button
              onClick={() => {
                haptics.light();
                const newState = !isCaptionEditorOpen;
                setIsCaptionEditorOpen(newState);
                onCaptionEditorChange?.(newState);
              }}
              variant="outline"
              className="w-full border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
            >
              <Settings2 className="w-5 h-5 mr-2 text-[#ec1e24]" />
              {isCaptionEditorOpen ? 'Hide' : 'Configure'} Caption Template
            </Button>

            {/* Generate Video Button - Shows after prompt is generated */}
            <Button
              onClick={handleGenerateMonthlyVideo}
              disabled={monthlyIsGenerating}
              className="w-full bg-[#ec1e24] hover:bg-[#d01a20] text-white"
            >
              {monthlyIsGenerating ? (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-spin" />
                  Generating Compilation...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5 mr-2" />
                  Generate Monthly Video Compilation
                </>
              )}
            </Button>

            {/* Progress Bar */}
            {monthlyIsGenerating && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 dark:bg-[#0A0A0A] rounded-full h-2.5">
                  <div 
                    className="bg-[#ec1e24] h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${monthlyProgress}%` }}
                  />
                </div>
                <p className="text-sm text-center text-gray-600 dark:text-[#9CA3AF]">
                  Processing... {monthlyProgress}%
                </p>
              </div>
            )}

            {/* Video Preview */}
            {monthlyProgress === 100 && (
              <div className="space-y-4 mt-6 pt-6 border-t border-gray-200 dark:border-[#333333]">
                <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative group">
                  <p className="text-white">Video Compilation Preview</p>
                  
                  {/* Video Controls - Inside Player */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-200">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          haptics.light();
                          setMonthlyIsPlaying(!monthlyIsPlaying);
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                      >
                        {monthlyIsPlaying ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          haptics.light();
                          setMonthlyIsMuted(!monthlyIsMuted);
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                      >
                        {monthlyIsMuted ? (
                          <VolumeX className="w-4 h-4 text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>

                      <div 
                        className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                        onClick={(e) => handleProgressClick(e, 'monthly')}
                      >
                        <div 
                          className="h-full bg-[#ec1e24] transition-all duration-150" 
                          style={{ width: `${(monthlyVideoTime / monthlyVideoDuration) * 100}%` }}
                        />
                      </div>

                      <span className="text-xs text-white/90 min-w-[70px] text-right">
                        {formatTime(monthlyVideoTime)} / {formatTime(monthlyVideoDuration)}
                      </span>

                      <button
                        onClick={() => handleFullscreen('monthly')}
                        className="w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                      >
                        <Maximize className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="text-gray-900 dark:text-white mb-2 block">
                    Upload Thumbnail (Auto-sized for each platform)
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl cursor-pointer hover:border-[#ec1e24] transition-all duration-200">
                    <Upload className="w-6 h-6 text-[#ec1e24]" />
                    <span className="text-sm text-gray-600 dark:text-[#9CA3AF]">
                      {monthlyThumbnail ? monthlyThumbnail.name : 'Upload Thumbnail'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setMonthlyThumbnail(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleDownloadVideo('monthly')}
                    variant="outline"
                    className="border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
                  >
                    <Download className="w-5 h-5 mr-2 text-[#ec1e24]" />
                    Download Compilation
                  </Button>

                  <Button
                    onClick={() => {
                      haptics.light();
                      setIsPublishDialogOpen(true);
                    }}
                    className="bg-[#ec1e24] hover:bg-[#d01a20] text-white"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Publish to Social Media
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audio Dynamics Panel - Shown when voiceover is uploaded */}
      {(reviewVoiceover || monthlyVoiceover) && (
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-[#ec1e24]" />
              <div>
                <h3 className="text-gray-900 dark:text-white">Audio Dynamics Controls</h3>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Configure audio ducking and mixing</p>
              </div>
            </div>
            <button
              onClick={() => {
                haptics.light();
                setIsAudioPanelOpen(!isAudioPanelOpen);
              }}
              className="text-gray-600 dark:text-[#9CA3AF] hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              {isAudioPanelOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {isAudioPanelOpen && (
            <div className="space-y-4">
              {/* Auto-Ducking Toggle */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl">
                <span className="text-gray-900 dark:text-white">
                  Enable Auto-Ducking
                </span>
                <button
                  onClick={() => {
                    haptics.light();
                    setEnableAutoDucking(!enableAutoDucking);
                    setPromptStatus('outdated');
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    enableAutoDucking ? 'bg-[#ec1e24]' : 'bg-gray-300 dark:bg-[#333333]'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      enableAutoDucking ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Ducking Mode */}
              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">
                  Ducking Mode
                </label>
                <div className="flex gap-2">
                  {duckingModes.map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        haptics.light();
                        setDuckingMode(mode);
                        setPromptStatus('outdated');
                      }}
                      className={`flex-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                        duckingMode === mode
                          ? 'bg-[#ec1e24] text-white'
                          : 'bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] text-gray-600 dark:text-[#9CA3AF] hover:border-[#ec1e24]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numeric Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-900 dark:text-white mb-2 block">
                    Duck Level (dB)
                  </label>
                  <input
                    type="number"
                    value={duckLevel}
                    onChange={(e) => {
                      setDuckLevel(parseInt(e.target.value));
                      setPromptStatus('outdated');
                    }}
                    className="w-full px-4 py-3 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ec1e24]"
                  />
                </div>

                <div>
                  <label className="text-gray-900 dark:text-white mb-2 block">
                    Attack (ms)
                  </label>
                  <input
                    type="number"
                    value={attackMs}
                    onChange={(e) => {
                      setAttackMs(parseInt(e.target.value));
                      setPromptStatus('outdated');
                    }}
                    className="w-full px-4 py-3 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ec1e24]"
                  />
                </div>

                <div>
                  <label className="text-gray-900 dark:text-white mb-2 block">
                    Release (ms)
                  </label>
                  <input
                    type="number"
                    value={releaseMs}
                    onChange={(e) => {
                      setReleaseMs(parseInt(e.target.value));
                      setPromptStatus('outdated');
                    }}
                    className="w-full px-4 py-3 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ec1e24]"
                  />
                </div>
              </div>

              {/* Waveform Visualization */}
              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">
                  Waveform Preview
                </label>
                <div className="p-4 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl">
                  <div className="space-y-4">
                    {/* Voice-over waveform */}
                    <div>
                      <span className="text-xs text-gray-500 dark:text-[#6B7280] mb-2 block">
                        Voice-over Segments
                      </span>
                      <div className="h-12 bg-gray-100 dark:bg-[#1A1A1A] rounded-xl relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center px-2 gap-2">
                          <div className="h-8 bg-[#ec1e24]/30 rounded" style={{ width: '20%' }} />
                          <div className="h-8 bg-[#ec1e24]/30 rounded" style={{ width: '25%', marginLeft: '15%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Trailer waveform */}
                    <div>
                      <span className="text-xs text-gray-500 dark:text-[#6B7280] mb-2 block">
                        Trailer Dialog Segments
                      </span>
                      <div className="h-12 bg-gray-100 dark:bg-[#1A1A1A] rounded-xl relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center px-2">
                          <div className="h-8 bg-blue-500/30 rounded" style={{ width: '18%', marginLeft: '22%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-[#6B7280] italic mt-2">
                  Drag segment boundaries to manually adjust detection
                </p>
              </div>

              {/* Audio Preview Button */}
              <Button
                onClick={() => haptics.light()}
                variant="outline"
                className="w-full border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
              >
                <Play className="w-5 h-5 mr-2 text-[#ec1e24]" />
                Render 15s Audio Preview
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Caption Template Editor */}
      {isCaptionEditorOpen && (
        <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-2xl shadow-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] p-6">
          <h3 className="text-gray-900 dark:text-white mb-6">
            Caption Template Editor
          </h3>

          <div className="space-y-6">
            
            {/* Template Presets */}
            <div>
              <label className="text-gray-900 dark:text-white mb-3 block">Template Presets</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {captionTemplates.map((template) => (
                  <button
                    key={template}
                    onClick={() => applyTemplatePreset(template)}
                    className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                      captionTemplate === template
                        ? 'bg-[#ec1e24] text-white border-[#ec1e24]'
                        : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:border-[#ec1e24]'
                    }`}
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Templates */}
            {savedTemplates.length > 0 && (
              <div>
                <label className="text-gray-900 dark:text-white mb-3 block">My Saved Templates</label>
                <div className="space-y-2">
                  {savedTemplates.map((template) => (
                    <div
                      key={template.name}
                      className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg"
                    >
                      <button
                        onClick={() => loadSavedTemplate(template)}
                        className="flex-1 text-left text-gray-900 dark:text-white hover:text-[#ec1e24] dark:hover:text-[#ec1e24] transition-colors"
                      >
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
                          {template.fontFamily} • {template.fontSize}px • {template.wordsPerLine} {template.wordsPerLine === 1 ? 'word' : 'words'} per segment
                        </div>
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowRenameMenu(showRenameMenu === template.name ? null : template.name);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {showRenameMenu === template.name && (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333333] rounded-lg shadow-lg z-10 min-w-[120px]"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRenameTemplate(template.name);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors rounded-t-lg"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Rename
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSavedTemplate(template.name);
                                setShowRenameMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors rounded-b-lg"
                            >
                              <X className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Preview */}
            <div>
              <label className="text-gray-900 dark:text-white mb-3 block">
                Live Preview
                <span className="text-xs text-gray-500 dark:text-[#6B7280] ml-2">
                  (Kinetic caption label: {captionWordsPerLine} {captionWordsPerLine === 1 ? 'word' : 'words'} per segment)
                </span>
              </label>
              <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                <div className={`absolute ${
                  captionPosition === 'Top' ? 'top-8' : 
                  captionPosition === 'Center' ? 'top-1/2 -translate-y-1/2' : 
                  captionPosition === 'Bottom-Center' ? 'bottom-[20%]' : 
                  'bottom-8'
                } left-0 right-0 px-8 flex ${captionAlignment === 'Left' ? 'justify-start' : captionAlignment === 'Right' ? 'justify-end' : 'justify-center'}`}>
                  <div 
                    className="px-4 py-2 rounded inline-block"
                    style={{
                      backgroundColor: `${captionBgColor}${Math.round(captionBgOpacity * 2.55).toString(16).padStart(2, '0')}`,
                      color: captionTextColor,
                      fontFamily: captionFontFamily,
                      fontSize: `${captionFontSize}px`,
                      fontWeight: captionFontWeight === 'Regular' ? 400 : captionFontWeight === 'Medium' ? 500 : captionFontWeight === 'Bold' ? 700 : 900,
                      textShadow: captionShadow ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
                      ...(captionStrokeWidth > 0 && { WebkitTextStroke: `${captionStrokeWidth}px ${captionStrokeColor}` }),
                    }}
                  >
                    {(() => {
                      const samplePhrase = "this is a banger";
                      const words = samplePhrase.split(' ');
                      const segmentWords = words.slice(0, captionWordsPerLine);
                      return segmentWords.join(' ') + '.';
                    })()}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-2 italic">
                Each caption segment will appear separately as the video plays
              </p>
            </div>

            {/* Font Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">Font Family</label>
                <select
                  value={captionFontFamily}
                  onChange={(e) => setCaptionFontFamily(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">Font Weight</label>
                <select
                  value={captionFontWeight}
                  onChange={(e) => setCaptionFontWeight(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white"
                >
                  {fontWeights.map((weight) => (
                    <option key={weight} value={weight}>{weight}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">Font Size: {captionFontSize}px</label>
              <input
                type="range"
                min="12"
                max="48"
                value={captionFontSize}
                onChange={(e) => setCaptionFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-[#0A0A0A] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ec1e24]"
              />
            </div>

            {/* Text Color */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">Text Color</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    haptics.light();
                    setShowTextColorPicker(true);
                  }}
                  className="w-12 h-12 rounded-lg border border-gray-200 dark:border-[#333333] cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: captionTextColor }}
                  title={captionTextColor}
                />
                <input
                  type="text"
                  value={captionTextColor}
                  onChange={(e) => setCaptionTextColor(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white uppercase"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">Background Color</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    haptics.light();
                    setShowBgColorPicker(true);
                  }}
                  className="w-12 h-12 rounded-lg border border-gray-200 dark:border-[#333333] cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: captionBgColor }}
                  title={captionBgColor}
                />
                <input
                  type="text"
                  value={captionBgColor}
                  onChange={(e) => setCaptionBgColor(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white uppercase"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Background Opacity */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">Background Opacity: {captionBgOpacity}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={captionBgOpacity}
                onChange={(e) => setCaptionBgOpacity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-[#0A0A0A] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ec1e24]"
              />
            </div>

            {/* Position & Alignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">Position</label>
                <select
                  value={captionPosition}
                  onChange={(e) => setCaptionPosition(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white"
                >
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-900 dark:text-white mb-2 block">Alignment</label>
                <select
                  value={captionAlignment}
                  onChange={(e) => setCaptionAlignment(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white"
                >
                  {alignments.map((align) => (
                    <option key={align} value={align}>{align}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stroke Settings */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">Stroke Width: {captionStrokeWidth}px</label>
              <input
                type="range"
                min="0"
                max="5"
                value={captionStrokeWidth}
                onChange={(e) => setCaptionStrokeWidth(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-[#0A0A0A] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ec1e24]"
              />
              {captionStrokeWidth > 0 && (
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => {
                      haptics.light();
                      setShowStrokeColorPicker(true);
                    }}
                    className="w-12 h-12 rounded-lg border border-gray-200 dark:border-[#333333] cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: captionStrokeColor }}
                    title={captionStrokeColor}
                  />
                  <input
                    type="text"
                    value={captionStrokeColor}
                    onChange={(e) => setCaptionStrokeColor(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white uppercase"
                    placeholder="#000000"
                  />
                </div>
              )}
            </div>

            {/* Shadow Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-gray-900 dark:text-white">Text Shadow</label>
              <button
                onClick={() => {
                  haptics.light();
                  setCaptionShadow(!captionShadow);
                }}
                className={`w-12 h-6 rounded-full transition-all duration-200 ${
                  captionShadow ? 'bg-[#ec1e24]' : 'bg-gray-300 dark:bg-[#333333]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-all duration-200 ${
                    captionShadow ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Animation */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">Animation</label>
              <select
                value={captionAnimation}
                onChange={(e) => setCaptionAnimation(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-xl text-gray-900 dark:text-white"
              >
                {animations.map((anim) => (
                  <option key={anim} value={anim}>{anim}</option>
                ))}
              </select>
            </div>

            {/* Words Per Line */}
            <div>
              <label className="text-gray-900 dark:text-white mb-2 block">Words Per Line</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      haptics.light();
                      setCaptionWordsPerLine(num);
                    }}
                    className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                      captionWordsPerLine === num
                        ? 'bg-[#ec1e24] text-white border-[#ec1e24]'
                        : 'bg-white dark:bg-[#000000] text-gray-900 dark:text-white border-gray-200 dark:border-[#333333] hover:border-[#ec1e24]'
                    }`}
                  >
                    {num} {num === 1 ? 'Word' : 'Words'}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Template Button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSaveCaptionTemplate}
                className="flex-1 bg-[#ec1e24] hover:bg-[#ec1e24] text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Template
              </Button>
              {showSaveSuccess && (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </span>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Publish Dialog */}
      <Dialog 
        open={isPublishDialogOpen} 
        onOpenChange={(open) => {
          setIsPublishDialogOpen(open);
          if (open && !generatedCaption) {
            // Auto-generate caption when dialog opens
            generateCaption(activeModule);
          }
        }}
      >
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
                onClick={() => generateCaption(activeModule)}
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
          
          {/* Publish Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => {
                haptics.light();
                setIsPublishDialogOpen(false);
                setGeneratedCaption('');
                setCaptionEditMode(false);
              }}
              variant="outline"
              className="flex-1 border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white hover:bg-gray-50 dark:bg-[#000000] dark:hover:bg-[#000000]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                haptics.medium();
                // Handle publish logic here with generatedCaption
                setIsPublishDialogOpen(false);
                setGeneratedCaption('');
                setCaptionEditMode(false);
              }}
              className="flex-1 bg-[#ec1e24] hover:bg-[#d01a20] text-white shadow-none hover:shadow-none active:shadow-none focus:shadow-none hover:scale-100 active:scale-100"
            >
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Naming/Renaming Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {isRenaming ? 'Rename Template' : 'Save Template'}
            </DialogTitle>
            <DialogDescription className="text-[#6B7280] dark:text-[#9CA3AF]">
              {isRenaming ? 'Enter a new name for your template.' : 'Enter a name for your caption template.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  isRenaming ? renameTemplate() : saveTemplateWithName();
                }
              }}
              placeholder="e.g., My Custom Style"
              className="w-full px-4 py-3 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#333333] rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#6B7280] focus:outline-none focus:border-[#ec1e24] transition-colors"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setShowNameDialog(false);
                setTemplateName('');
                setIsRenaming(false);
                setRenamingTemplate(null);
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={isRenaming ? renameTemplate : saveTemplateWithName}
              disabled={!templateName.trim()}
              className="flex-1 bg-[#ec1e24] hover:bg-[#d11b20] text-white disabled:opacity-50"
            >
              {isRenaming ? 'Rename' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Fullscreen Dialog */}
      <Dialog open={reviewIsFullscreen} onOpenChange={setReviewIsFullscreen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] bg-black border-0 p-0 [&>button]:hidden">
          <VisuallyHidden>
            <DialogTitle>Review Video Fullscreen</DialogTitle>
            <DialogDescription>Fullscreen video player for review module</DialogDescription>
          </VisuallyHidden>
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <p className="text-white text-xl">Video Preview (Fullscreen)</p>
            </div>
            
            {/* Fullscreen Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    haptics.light();
                    setReviewIsPlaying(!reviewIsPlaying);
                  }}
                  className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  {reviewIsPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>

                <button
                  onClick={() => {
                    haptics.light();
                    setReviewIsMuted(!reviewIsMuted);
                  }}
                  className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  {reviewIsMuted ? (
                    <VolumeX className="w-6 h-6 text-white" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-white" />
                  )}
                </button>

                <div 
                  className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => handleProgressClick(e, 'review')}
                >
                  <div 
                    className="h-full bg-[#ec1e24] transition-all duration-150" 
                    style={{ width: `${(reviewVideoTime / reviewVideoDuration) * 100}%` }}
                  />
                </div>

                <span className="text-sm text-white/90 min-w-[80px] text-right">
                  {formatTime(reviewVideoTime)} / {formatTime(reviewVideoDuration)}
                </span>

                <button
                  onClick={() => {
                    haptics.light();
                    setReviewIsFullscreen(false);
                  }}
                  className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Monthly Fullscreen Dialog */}
      <Dialog open={monthlyIsFullscreen} onOpenChange={setMonthlyIsFullscreen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] bg-black border-0 p-0 [&>button]:hidden">
          <VisuallyHidden>
            <DialogTitle>Monthly Video Fullscreen</DialogTitle>
            <DialogDescription>Fullscreen video player for monthly releases module</DialogDescription>
          </VisuallyHidden>
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <p className="text-white text-xl">Video Compilation Preview (Fullscreen)</p>
            </div>
            
            {/* Fullscreen Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    haptics.light();
                    setMonthlyIsPlaying(!monthlyIsPlaying);
                  }}
                  className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  {monthlyIsPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>

                <button
                  onClick={() => {
                    haptics.light();
                    setMonthlyIsMuted(!monthlyIsMuted);
                  }}
                  className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  {monthlyIsMuted ? (
                    <VolumeX className="w-6 h-6 text-white" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-white" />
                  )}
                </button>

                <div 
                  className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => handleProgressClick(e, 'monthly')}
                >
                  <div 
                    className="h-full bg-[#ec1e24] transition-all duration-150" 
                    style={{ width: `${(monthlyVideoTime / monthlyVideoDuration) * 100}%` }}
                  />
                </div>

                <span className="text-sm text-white/90 min-w-[80px] text-right">
                  {formatTime(monthlyVideoTime)} / {formatTime(monthlyVideoDuration)}
                </span>

                <button
                  onClick={() => {
                    haptics.light();
                    setMonthlyIsFullscreen(false);
                  }}
                  className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Color Picker Popups */}
      <ColorPickerPopup
        isOpen={showTextColorPicker}
        onClose={() => setShowTextColorPicker(false)}
        currentColor={captionTextColor}
        onColorSelect={(color) => {
          haptics.light();
          setCaptionTextColor(color);
        }}
      />

      <ColorPickerPopup
        isOpen={showBgColorPicker}
        onClose={() => setShowBgColorPicker(false)}
        currentColor={captionBgColor}
        onColorSelect={(color) => {
          haptics.light();
          setCaptionBgColor(color);
        }}
      />

      <ColorPickerPopup
        isOpen={showStrokeColorPicker}
        onClose={() => setShowStrokeColorPicker(false)}
        currentColor={captionStrokeColor}
        onColorSelect={(color) => {
          haptics.light();
          setCaptionStrokeColor(color);
        }}
      />
    </div>
  );
}