/**
 * Shotstack API Integration
 * Programmatic video editing and rendering
 */

import { TrailerAnalysis, getBRollMoment, VideoMoment } from './googleVideoIntelligence';
import { calculateAutoframing, AutoframingResult } from './autoframing';
import { validateShotstackConfig, sanitizeShotstackConfig } from '../validation/shotstackSchema';
import { toast } from 'sonner';

export interface ShotstackClip {
  asset: {
    type: 'video' | 'audio' | 'html' | 'image';
    src: string;
    trim?: number;
    volume?: number;
    html?: string;
    css?: string;
  };
  start: number;
  length: number;
  fit?: 'cover' | 'contain' | 'crop' | 'none'; // 'cover' = scale to fill (removes letterbox), 'contain' = fit inside (shows letterbox)
  scale?: number; // Additional zoom factor
  position?: 'top' | 'center' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  offset?: {
    x?: number;
    y?: number;
  };
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  transform?: {
    rotate?: {
      angle?: number;
    };
    skew?: {
      x?: number;
      y?: number;
    };
    flip?: {
      horizontal?: boolean;
      vertical?: boolean;
    };
  };
  transition?: {
    in?: 'fade' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'zoom';
    out?: 'fade' | 'fadeOut' | 'slideLeft' | 'slideRight';
    duration?: number;
  };
  effect?: 'zoomIn' | 'zoomOut' | 'slideRight' | 'slideLeft';
}

export interface ShotstackTimeline {
  soundtrack?: {
    src: string;
    effect?: string;
    volume?: number;
  };
  tracks: {
    clips: ShotstackClip[];
  }[];
}

export interface ShotstackConfig {
  timeline: ShotstackTimeline;
  output: {
    format: 'mp4' | 'gif' | 'jpg' | 'png';
    resolution: 'preview' | 'mobile' | 'sd' | 'hd' | '1080' | '4k';
    aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5' | '4:3';
    fps?: number;
    quality?: 'low' | 'medium' | 'high';
  };
}

export interface ReviewVideoData {
  movieTitle: string;
  trailerVideoUrl: string;
  voiceoverUrl: string;
  voiceoverDuration: number;
  voiceoverTranscript?: string;
  backgroundMusicUrl?: string;
  rating?: string;
  commentKeyword?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  removeLetterbox?: boolean; // Scale video to fill frame and eliminate black bars
  enableAutoframing?: boolean; // AI-powered intelligent cropping to center faces/action
  trailerAnalysis?: any; // TrailerAnalysis data for autoframing calculations
}

export interface AudioSettings {
  enableTrailerAudioHooks: boolean;
  hookPlacements: string[];
  hookDuration: number;
  trailerVolume: number;
  crossfadeDuration: number;
  audioVariety: 'balanced' | 'heavy-voiceover' | 'heavy-trailer';
  backgroundMusicVolume?: number;
}

export interface AudioChoreographySegment {
  type: 'trailer_audio' | 'voiceover_with_music';
  placement?: 'opening' | 'mid-video' | 'ending';
  startTime: number;
  duration: number;
  scene?: string;
  fadeIn?: number;
  fadeOut?: number;
  volume?: number;
  description: string;
  includeRating?: boolean;
  voiceover_text?: string;
  rating?: string;
}

export interface AudioChoreography {
  enabled: boolean;
  variety: string;
  hook_placements: string[];
  segments: AudioChoreographySegment[];
  trailer_volume: number;
  crossfade_duration: number;
  background_music_volume: number;
}

/**
 * Generate Shotstack JSON configuration from review data and trailer analysis
 */
export function generateShotstackJSON(
  reviewData: ReviewVideoData,
  trailerAnalysis: TrailerAnalysis,
  audioSettings: AudioSettings
): ShotstackConfig {
  const { opening, midVideo, ending } = trailerAnalysis.suggestedHooks;
  const voiceoverDuration = reviewData.voiceoverDuration;
  
  // Calculate segment timing
  const openingHookDuration = audioSettings.hookDuration;
  const endingHookDuration = audioSettings.hookDuration;
  const midHookDuration = audioSettings.hookDuration;
  
  // Detect rating mention timestamp (simplified - in production use speech-to-text)
  const ratingTimestamp = detectRatingInVoiceover(reviewData.voiceoverTranscript);
  const midHookStart = ratingTimestamp 
    ? Math.max(ratingTimestamp - 3, voiceoverDuration * 0.5)  // 3 seconds before rating, but not before 50%
    : voiceoverDuration * 0.6; // Otherwise 60% through
  
  // Determine fit mode based on aspect ratio and letterbox settings
  const targetAspectRatio = reviewData.aspectRatio || '9:16';
  const shouldFillFrame = reviewData.removeLetterbox && (targetAspectRatio === '9:16' || targetAspectRatio === '1:1');
  const fitMode: 'cover' | 'contain' = shouldFillFrame ? 'cover' : 'contain';
  
  // Helper function to apply autoframing to a clip
  const applyAutoframingToClip = (clip: ShotstackClip, moment: VideoMoment): ShotstackClip => {
    if (!reviewData.enableAutoframing || !shouldFillFrame) {
      return clip;
    }
    
    const autoframing = calculateAutoframing(
      moment,
      '16:9',
      targetAspectRatio as '9:16' | '1:1',
      {
        enabled: true,
        priorityMode: 'balanced',
        dynamicTracking: false
      }
    );
    
    return {
      ...clip,
      position: autoframing.position,
      offset: autoframing.offset
    };
  };
  
  const config: ShotstackConfig = {
    timeline: {
      tracks: []
    },
    output: {
      format: 'mp4',
      resolution: '1080',
      aspectRatio: targetAspectRatio,
      fps: 30,
      quality: 'high'
    }
  };
  
  // Add background music if provided
  if (reviewData.backgroundMusicUrl) {
    config.timeline.soundtrack = {
      src: reviewData.backgroundMusicUrl,
      effect: 'fadeOut',
      volume: audioSettings.backgroundMusicVolume || 0.85
    };
  }
  
  // VIDEO TRACK - Main visual content
  const videoClips: ShotstackClip[] = [];
  
  if (audioSettings.enableTrailerAudioHooks) {
    // OPENING HOOK (if enabled)
    if (audioSettings.hookPlacements.includes('opening')) {
      const openingClip = applyAutoframingToClip({
        asset: {
          type: 'video',
          src: reviewData.trailerVideoUrl,
          trim: opening.startTime,
          volume: audioSettings.trailerVolume / 100
        },
        start: 0,
        length: openingHookDuration,
        fit: fitMode,
        transition: {
          out: 'fadeOut',
          duration: audioSettings.crossfadeDuration
        }
      }, opening);
      videoClips.push(openingClip);
    }
    
    const voiceoverStart = audioSettings.hookPlacements.includes('opening') 
      ? openingHookDuration 
      : 0;
    
    // VOICEOVER SECTION 1 (before mid-hook)
    const section1End = audioSettings.hookPlacements.includes('mid-video')
      ? voiceoverStart + midHookStart
      : voiceoverStart + voiceoverDuration;
    
    const bRollMoment: VideoMoment = {
      type: 'establishing_shot',
      startTime: getBRollMoment(trailerAnalysis, 'general', opening.endTime),
      endTime: getBRollMoment(trailerAnalysis, 'general', opening.endTime) + (section1End - voiceoverStart),
      description: 'B-roll general footage',
      confidence: 0.8
    };
    
    const section1Clip = applyAutoframingToClip({
      asset: {
        type: 'video',
        src: reviewData.trailerVideoUrl,
        trim: getBRollMoment(trailerAnalysis, 'general', opening.endTime),
        volume: 0  // Muted during voiceover
      },
      start: voiceoverStart,
      length: section1End - voiceoverStart,
      fit: fitMode,
      effect: 'zoomIn'
    }, bRollMoment);
    videoClips.push(section1Clip);
    
    // MID-VIDEO HOOK (if enabled)
    if (audioSettings.hookPlacements.includes('mid-video')) {
      const midClip = applyAutoframingToClip({
        asset: {
          type: 'video',
          src: reviewData.trailerVideoUrl,
          trim: midVideo.startTime,
          volume: audioSettings.trailerVolume / 100
        },
        start: section1End,
        length: midHookDuration,
        fit: fitMode,
        transition: {
          in: 'fadeIn',
          out: 'fadeOut',
          duration: audioSettings.crossfadeDuration
        }
      }, midVideo);
      videoClips.push(midClip);
    }
    
    const section2Start = audioSettings.hookPlacements.includes('mid-video')
      ? section1End + midHookDuration
      : section1End;
    
    // VOICEOVER SECTION 2 (rating + CTA)
    const section2End = voiceoverStart + voiceoverDuration;
    if (section2End > section2Start) {
      const characterMoment: VideoMoment = {
        type: 'character_moment',
        startTime: getBRollMoment(trailerAnalysis, 'character_moment', midVideo.endTime),
        endTime: getBRollMoment(trailerAnalysis, 'character_moment', midVideo.endTime) + (section2End - section2Start),
        description: 'Character moment B-roll',
        confidence: 0.8
      };
      
      const section2Clip = applyAutoframingToClip({
        asset: {
          type: 'video',
          src: reviewData.trailerVideoUrl,
          trim: getBRollMoment(trailerAnalysis, 'character_moment', midVideo.endTime),
          volume: 0
        },
        start: section2Start,
        length: section2End - section2Start,
        fit: fitMode,
        effect: 'slideRight'
      }, characterMoment);
      videoClips.push(section2Clip);
    }
    
    // ENDING HOOK (if enabled)
    if (audioSettings.hookPlacements.includes('ending')) {
      const endingClip = applyAutoframingToClip({
        asset: {
          type: 'video',
          src: reviewData.trailerVideoUrl,
          trim: ending.startTime,
          volume: audioSettings.trailerVolume / 100
        },
        start: section2End,
        length: endingHookDuration,
        fit: fitMode,
        transition: {
          in: 'fadeIn',
          duration: 0.3
        }
      }, ending);
      videoClips.push(endingClip);
    }
  } else {
    // No hooks - just voiceover with B-roll
    const noHookMoment: VideoMoment = {
      type: 'establishing_shot',
      startTime: 0,
      endTime: voiceoverDuration,
      description: 'B-roll for full voiceover',
      confidence: 0.8
    };
    
    const noHookClip = applyAutoframingToClip({
      asset: {
        type: 'video',
        src: reviewData.trailerVideoUrl,
        trim: 0,
        volume: 0
      },
      start: 0,
      length: voiceoverDuration,
      fit: fitMode
    }, noHookMoment);
    videoClips.push(noHookClip);
  }
  
  config.timeline.tracks.push({ clips: videoClips });
  
  // VOICEOVER AUDIO TRACK
  const voiceoverStart = audioSettings.enableTrailerAudioHooks && 
                        audioSettings.hookPlacements.includes('opening')
    ? openingHookDuration
    : 0;
  
  config.timeline.tracks.push({
    clips: [{
      asset: {
        type: 'audio',
        src: reviewData.voiceoverUrl,
        volume: 1.0
      },
      start: voiceoverStart,
      length: voiceoverDuration,
      transition: {
        in: 'fadeIn',
        out: 'fadeOut',
        duration: audioSettings.crossfadeDuration
      }
    }]
  });
  
  // TEXT OVERLAYS TRACK
  const textClips: ShotstackClip[] = [];
  
  // Movie Title (appears with opening hook or at start)
  textClips.push({
    asset: {
      type: 'html',
      html: `<div class="title">${reviewData.movieTitle}</div>`,
      css: `.title { 
        font-size: 48px; 
        color: white; 
        font-weight: bold; 
        text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
        padding: 20px;
      }`
    },
    start: 0.5,
    length: 2.5,
    position: 'bottom',
    offset: { y: 0.1 }
  });
  
  // Rating Graphic (appears during rating mention)
  if (reviewData.rating) {
    textClips.push({
      asset: {
        type: 'html',
        html: `<div class="rating">${reviewData.rating}/10</div>`,
        css: `.rating { 
          font-size: 120px; 
          color: #ec1e24; 
          font-weight: bold;
          text-shadow: 3px 3px 10px rgba(0,0,0,0.9);
        }`
      },
      start: (ratingTimestamp || voiceoverDuration * 0.7) + voiceoverStart,
      length: 4,
      position: 'center',
      transition: {
        in: 'zoom',
        out: 'fade'
      }
    });
  }
  
  // CTA Text (final section)
  if (reviewData.commentKeyword) {
    textClips.push({
      asset: {
        type: 'html',
        html: `<div class="cta">Comment "${reviewData.commentKeyword}" for link</div>`,
        css: `.cta { 
          font-size: 32px; 
          color: white; 
          background: rgba(236, 30, 36, 0.9);
          padding: 20px 40px;
          border-radius: 12px;
        }`
      },
      start: voiceoverDuration * 0.85 + voiceoverStart,
      length: voiceoverDuration * 0.15,
      position: 'bottom',
      offset: { y: 0.15 }
    });
  }
  
  config.timeline.tracks.push({ clips: textClips });
  
  // Validate and sanitize the config
  const validation = validateShotstackConfig(config);
  if (!validation.valid) {
    console.error('Shotstack validation errors:', validation.errors);
    toast.error(`Video config has ${validation.errors.length} validation error(s)`);
    return sanitizeShotstackConfig(config);
  }
  
  return config;
}

/**
 * Detect rating mention in voiceover transcript
 */
function detectRatingInVoiceover(transcript?: string): number | null {
  if (!transcript) return null;
  
  const ratingRegex = /rating.*?(\d+(\.\d+)?)\s*out\s*of\s*10/i;
  const match = transcript.match(ratingRegex);
  
  if (match) {
    // Calculate approximate timestamp based on word position
    const words = transcript.split(' ');
    const ratingWordIndex = words.findIndex(w => 
      /rating|give|giving/i.test(w)
    );
    const wordsPerSecond = 2.5; // Average speaking rate
    return ratingWordIndex / wordsPerSecond;
  }
  
  return null;
}

/**
 * Generate audio choreography data for LLM prompt
 */
export function generateAudioChoreography(
  reviewData: ReviewVideoData,
  trailerAnalysis: TrailerAnalysis,
  audioSettings: AudioSettings
): AudioChoreography {
  const { opening, midVideo, ending } = trailerAnalysis.suggestedHooks;
  const voiceoverDuration = reviewData.voiceoverDuration;
  
  const segments: AudioChoreographySegment[] = [];
  
  if (!audioSettings.enableTrailerAudioHooks) {
    // Simple voiceover-only mode
    segments.push({
      type: 'voiceover_with_music',
      startTime: 0,
      duration: voiceoverDuration,
      description: 'Full voiceover with background music',
      volume: 100
    });
  } else {
    const openingHookDuration = audioSettings.hookDuration;
    const midHookDuration = audioSettings.hookDuration;
    const endingHookDuration = audioSettings.hookDuration;
    
    const ratingTimestamp = detectRatingInVoiceover(reviewData.voiceoverTranscript);
    const midHookStart = ratingTimestamp 
      ? Math.max(ratingTimestamp - 3, voiceoverDuration * 0.5)
      : voiceoverDuration * 0.6;
    
    let currentTime = 0;
    
    // Opening hook
    if (audioSettings.hookPlacements.includes('opening')) {
      segments.push({
        type: 'trailer_audio',
        placement: 'opening',
        startTime: 0,
        duration: openingHookDuration,
        scene: opening.type,
        fadeOut: audioSettings.crossfadeDuration,
        volume: audioSettings.trailerVolume,
        description: `Opening hook with trailer original audio - ${opening.reason}`
      });
      currentTime = openingHookDuration;
    }
    
    // First voiceover section
    const section1Duration = midHookStart - (currentTime - (audioSettings.hookPlacements.includes('opening') ? openingHookDuration : 0));
    segments.push({
      type: 'voiceover_with_music',
      startTime: currentTime,
      duration: section1Duration,
      fadeIn: audioSettings.crossfadeDuration,
      description: 'Main review section with analysis and critique',
      volume: 100
    });
    currentTime += section1Duration;
    
    // Mid-video hook
    if (audioSettings.hookPlacements.includes('mid-video')) {
      segments.push({
        type: 'trailer_audio',
        placement: 'mid-video',
        startTime: currentTime,
        duration: midHookDuration,
        scene: midVideo.type,
        fadeIn: audioSettings.crossfadeDuration,
        fadeOut: audioSettings.crossfadeDuration,
        volume: audioSettings.trailerVolume,
        description: `Mid-video hook before rating reveal - ${midVideo.reason}`
      });
      currentTime += midHookDuration;
    }
    
    // Second voiceover section (rating + CTA)
    const section2Duration = voiceoverDuration - midHookStart;
    segments.push({
      type: 'voiceover_with_music',
      startTime: currentTime,
      duration: section2Duration,
      fadeIn: audioSettings.crossfadeDuration,
      includeRating: true,
      rating: reviewData.rating,
      description: 'Voiceover continues with rating reveal and call-to-action',
      volume: 100
    });
    currentTime += section2Duration;
    
    // Ending hook
    if (audioSettings.hookPlacements.includes('ending')) {
      segments.push({
        type: 'trailer_audio',
        placement: 'ending',
        startTime: currentTime,
        duration: endingHookDuration,
        scene: ending.type,
        fadeIn: audioSettings.crossfadeDuration,
        fadeOut: 0.3,
        volume: audioSettings.trailerVolume,
        description: `Ending hook to close the video - ${ending.reason}`
      });
    }
  }
  
  return {
    enabled: audioSettings.enableTrailerAudioHooks,
    variety: audioSettings.audioVariety,
    hook_placements: audioSettings.hookPlacements,
    segments,
    trailer_volume: audioSettings.trailerVolume,
    crossfade_duration: audioSettings.crossfadeDuration,
    background_music_volume: audioSettings.backgroundMusicVolume || 85
  };
}

/**
 * Render video with Shotstack API
 * Mock implementation - in production this would call the real API
 */
export async function renderVideo(config: ShotstackConfig): Promise<{ id: string; status: string }> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock render ID
  const renderId = `render_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('Shotstack Render Started:', {
    id: renderId,
    config: JSON.stringify(config, null, 2)
  });
  
  return {
    id: renderId,
    status: 'queued'
  };
}

/**
 * Check render status
 * Mock implementation - in production this would poll the Shotstack API
 */
export async function checkRenderStatus(renderId: string): Promise<{
  id: string;
  status: 'queued' | 'rendering' | 'done' | 'failed';
  url?: string;
  error?: string;
  progress?: number;
}> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock progression (in production, this would be real status from Shotstack)
  const mockStatuses = ['queued', 'rendering', 'rendering', 'done'];
  const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
  
  return {
    id: renderId,
    status: randomStatus as any,
    url: randomStatus === 'done' ? `https://cdn.shotstack.io/videos/${renderId}.mp4` : undefined,
    progress: randomStatus === 'rendering' ? Math.floor(Math.random() * 100) : undefined
  };
}