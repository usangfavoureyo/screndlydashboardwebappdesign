/**
 * Mock implementation of Google Video Intelligence
 * In production, this would call the actual Google Cloud API
 */

import { getCachedAnalysis, cacheAnalysis } from '../cache/videoIntelligenceCache';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface VideoMoment {
  type: string;
  startTime: number;
  endTime: number;
  duration?: number;
  description: string;
  confidence: number;
  intensityScore?: number;
  labels?: string[];
  hasDialogue?: boolean;
  reason?: string;
  index?: number;
}

export interface TrailerAnalysis {
  moments: VideoMoment[];
  suggestedHooks: {
    opening: VideoMoment;
    midVideo: VideoMoment;
    ending: VideoMoment;
  };
  metadata: {
    duration: number;
    frameRate: number;
    resolution: string;
  };
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

export async function analyzeTrailer(videoFile: File): Promise<TrailerAnalysis> {
  // Check if analysis is already cached
  const cachedAnalysis = await getCachedAnalysis(videoFile);
  if (cachedAnalysis) {
    return cachedAnalysis;
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, we'll generate realistic mock data
  // In production, this would call: @google-cloud/video-intelligence
  const mockAnalysis = generateMockAnalysis(videoFile);
  
  // Cache the analysis for future use
  await cacheAnalysis(videoFile, mockAnalysis);
  
  return mockAnalysis;
}

// ============================================================================
// B-ROLL MOMENT SELECTION
// ============================================================================

/**
 * Selects an appropriate B-roll moment from the trailer analysis
 * @param analysis - The trailer analysis containing all detected moments
 * @param preferredType - Preferred moment type (e.g., 'general', 'character_moment', 'action_peak')
 * @param afterTime - Find moments that occur after this timestamp
 * @returns Start time of the selected B-roll moment
 */
export function getBRollMoment(
  analysis: TrailerAnalysis,
  preferredType: string,
  afterTime: number = 0
): number {
  // Find moments of the preferred type that occur after the specified time
  const matchingMoments = analysis.moments.filter(moment => 
    moment.type === preferredType && moment.startTime > afterTime
  );
  
  // If we found matching moments, return the first one
  if (matchingMoments.length > 0) {
    return matchingMoments[0].startTime;
  }
  
  // Fallback: find any moment after the specified time
  const anyMomentsAfter = analysis.moments.filter(moment => 
    moment.startTime > afterTime
  );
  
  if (anyMomentsAfter.length > 0) {
    return anyMomentsAfter[0].startTime;
  }
  
  // Last resort: return a time slightly after the afterTime parameter
  return afterTime + 1.0;
}

// ============================================================================
// MOCK DATA GENERATION
// ============================================================================

function generateMockAnalysis(videoFile: File): TrailerAnalysis {
  // Generate realistic mock moments based on typical trailer structure
  const moments: VideoMoment[] = [];
  const duration = 150; // Assume 2.5 minute trailer
  
  // Generate moments at various timestamps
  const momentTypes = [
    'establishing_shot',
    'action_peak',
    'dramatic_dialogue',
    'character_moment',
    'title_card',
    'suspense_moment',
    'general'
  ];
  
  const labelOptions = [
    ['explosion', 'action', 'fire'],
    ['car chase', 'vehicle', 'speed'],
    ['dramatic scene', 'emotion', 'close-up'],
    ['character introduction', 'portrait'],
    ['title reveal', 'text', 'logo'],
    ['dark scene', 'tension', 'mystery'],
    ['wide shot', 'landscape', 'environment']
  ];
  
  // Generate 30-50 moments throughout the trailer
  const numMoments = 35 + Math.floor(Math.random() * 15);
  
  for (let i = 0; i < numMoments; i++) {
    const startTime = (i / numMoments) * duration + Math.random() * 2;
    const momentDuration = 2 + Math.random() * 4;
    const typeIndex = Math.floor(Math.random() * momentTypes.length);
    
    moments.push({
      type: momentTypes[typeIndex],
      startTime,
      endTime: startTime + momentDuration,
      duration: momentDuration,
      description: `${momentTypes[typeIndex].replace('_', ' ')} at ${startTime.toFixed(1)}s`,
      confidence: 0.7 + Math.random() * 0.3,
      intensityScore: Math.random(),
      labels: labelOptions[typeIndex] || ['general'],
      hasDialogue: Math.random() > 0.5,
      index: i
    });
  }
  
  // Sort by start time
  moments.sort((a, b) => a.startTime - b.startTime);
  
  // Select suggested hooks (opening, mid, ending)
  const opening = moments.find(m => m.type === 'action_peak' && m.startTime < 30) || moments[0];
  const midVideo = moments.find(m => m.type === 'dramatic_dialogue' && m.startTime > 60 && m.startTime < 100) || moments[Math.floor(moments.length / 2)];
  const ending = moments.find(m => m.type === 'suspense_moment' && m.startTime > 120) || moments[moments.length - 1];
  
  // Add reasons for AI suggestions
  opening.reason = 'High-intensity action sequence perfect for grabbing attention';
  midVideo.reason = 'Compelling dialogue moment that builds narrative interest';
  ending.reason = 'Suspenseful scene that creates anticipation for the full movie';
  
  return {
    moments,
    suggestedHooks: {
      opening,
      midVideo,
      ending
    },
    metadata: {
      duration,
      frameRate: 24,
      resolution: '1920x1080'
    }
  };
}
