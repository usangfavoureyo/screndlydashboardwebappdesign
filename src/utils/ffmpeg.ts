/**
 * FFmpeg.wasm Integration for Browser-Based Video Processing
 * 
 * Performs mechanical video cuts with precision timestamps.
 * No scene detection. No AI analysis. Pure extraction.
 * 
 * Now supports HTTP Range Requests for bandwidth optimization.
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { getKeyframeIndex, downloadAndCutSegment } from './videoRangeRequest';

let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;

/**
 * Load FFmpeg.wasm (lazy initialization)
 */
export async function loadFFmpeg(onProgress?: (progress: number) => void): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance;
  }

  if (isLoading) {
    // Wait for existing load to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (ffmpegInstance) return ffmpegInstance;
  }

  isLoading = true;

  try {
    const ffmpeg = new FFmpeg();

    // Listen to progress events
    ffmpeg.on('progress', ({ progress }) => {
      if (onProgress) {
        onProgress(Math.round(progress * 100));
      }
    });

    ffmpeg.on('log', ({ message }) => {
      console.log('[FFmpeg]', message);
    });

    // We use 0.12.6 which is known to be stable
    // We use jsdelivr because it properly sets Cross-Origin-Resource-Policy headers
    const CORE_VERSION = '0.12.6';
    const BASE_URL = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

    console.log(`[FFmpeg] Loading version ${CORE_VERSION} from ${BASE_URL}`);

    try {
        // Manually fetch blobs to verify content type and size
        // This helps debugging "Network Error" vs "Empty File"
        const fetchBlob = async (url: string, type: string) => {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status} ${resp.statusText}`);
            const blob = await resp.blob();
            console.log(`[FFmpeg] Fetched ${url}: ${blob.size} bytes, type: ${blob.type}`);
            if (blob.size < 1000) throw new Error(`File too small: ${blob.size} bytes (likely error page)`);
            return blob;
        };

        const coreBlob = await fetchBlob(`${BASE_URL}/ffmpeg-core.js`, 'text/javascript');
        const wasmBlob = await fetchBlob(`${BASE_URL}/ffmpeg-core.wasm`, 'application/wasm');

        // Create object URLs
        const coreURL = URL.createObjectURL(coreBlob);
        const wasmURL = URL.createObjectURL(wasmBlob);

        await ffmpeg.load({
          coreURL,
          wasmURL,
        });

        console.log('[FFmpeg] Loaded successfully');
        ffmpegInstance = ffmpeg;
        isLoading = false;
        return ffmpeg;

    } catch (error) {
        console.error('[FFmpeg] Load failed:', error);
        throw error;
    }

  } catch (error) {
    isLoading = false;
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load FFmpeg: ${msg}. Check console for details.`);
  }
}

/**
 * Convert timestamp string (HH:MM:SS or MM:SS) to seconds
 */
function timestampToSeconds(timestamp: string): number {
  const parts = timestamp.split(':').map(p => parseInt(p, 10));
  
  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else {
    return parseInt(timestamp, 10);
  }
}

/**
 * Convert seconds to FFmpeg timestamp format (HH:MM:SS)
 */
function secondsToTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface CutVideoOptions {
  input: File | string; // File object or URL
  startTime: string; // Format: "HH:MM:SS" or "MM:SS"
  endTime: string;   // Format: "HH:MM:SS" or "MM:SS"
  outputFormat?: string; // Default: 'mp4'
  onProgress?: (progress: number, message: string) => void;
}

interface CutVideoResult {
  success: boolean;
  outputBlob?: Blob;
  outputUrl?: string;
  error?: string;
  duration?: number;
}

/**
 * Cut video segment using FFmpeg.wasm
 * Uses -c copy for fast, lossless extraction
 */
export async function cutVideoSegment(options: CutVideoOptions): Promise<CutVideoResult> {
  const { input, startTime, endTime, outputFormat = 'mp4', onProgress } = options;

  try {
    // Step 1: Load FFmpeg
    if (onProgress) onProgress(5, 'Loading FFmpeg.wasm...');
    const ffmpeg = await loadFFmpeg();

    // Step 2: Load input file
    if (onProgress) onProgress(15, 'Loading video file...');
    
    let inputFileName = 'input.mp4';
    let inputData: Uint8Array;

    if (typeof input === 'string') {
      // URL (Backblaze or other)
      if (onProgress) onProgress(20, 'Fetching video from cloud...');
      inputData = await fetchFile(input);
      inputFileName = `input.${input.split('.').pop() || 'mp4'}`;
    } else {
      // File object
      if (onProgress) onProgress(20, 'Reading local file...');
      inputData = await fetchFile(input);
      inputFileName = `input.${input.name.split('.').pop() || 'mp4'}`;
    }

    await ffmpeg.writeFile(inputFileName, inputData);

    // Step 3: Calculate duration
    const startSeconds = timestampToSeconds(startTime);
    const endSeconds = timestampToSeconds(endTime);
    const duration = endSeconds - startSeconds;

    if (duration <= 0) {
      return {
        success: false,
        error: 'End time must be after start time'
      };
    }

    if (onProgress) onProgress(30, 'Preparing to cut video...');

    // Step 4: Execute FFmpeg cut command
    // Using -c copy for fast, lossless cutting
    const outputFileName = `output.${outputFormat}`;
    const startTimestamp = secondsToTimestamp(startSeconds);
    const endTimestamp = secondsToTimestamp(endSeconds);

    if (onProgress) onProgress(35, `Cutting from ${startTimestamp} to ${endTimestamp}...`);

    await ffmpeg.exec([
      '-i', inputFileName,
      '-ss', startTimestamp,
      '-to', endTimestamp,
      '-c', 'copy', // Copy codec (no re-encoding)
      outputFileName
    ]);

    if (onProgress) onProgress(90, 'Reading output file...');

    // Step 5: Read output
    const outputData = await ffmpeg.readFile(outputFileName);
    const outputBlob = new Blob([outputData], { type: `video/${outputFormat}` });
    const outputUrl = URL.createObjectURL(outputBlob);

    // Step 6: Cleanup
    if (onProgress) onProgress(95, 'Cleaning up...');
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    if (onProgress) onProgress(100, 'Complete!');

    return {
      success: true,
      outputBlob,
      outputUrl,
      duration
    };

  } catch (error) {
    console.error('FFmpeg cutting error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during video cutting'
    };
  }
}

/**
 * Check if FFmpeg is loaded
 */
export function isFFmpegLoaded(): boolean {
  return ffmpegInstance !== null && ffmpegInstance.loaded;
}

/**
 * Validate timestamp format
 */
export function validateTimestamp(timestamp: string): boolean {
  // Accepts HH:MM:SS or MM:SS format
  const hhmmss = /^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/;
  const mmss = /^([0-5]?[0-9]):([0-5][0-9])$/;
  
  return hhmmss.test(timestamp) || mmss.test(timestamp);
}

/**
 * Get video duration estimate from timestamps
 */
export function getClipDuration(startTime: string, endTime: string): number {
  const startSeconds = timestampToSeconds(startTime);
  const endSeconds = timestampToSeconds(endTime);
  return endSeconds - startSeconds;
}

/**
 * Cut video segment with optimized range request (if available)
 * Falls back to standard cutting if range requests not supported
 */
export async function cutVideoSegmentOptimized(options: CutVideoOptions): Promise<CutVideoResult> {
  const { input, startTime, endTime, outputFormat = 'mp4', onProgress } = options;

  // Only use range requests for URLs
  if (typeof input === 'string') {
    const keyframeIndex = getKeyframeIndex(input);
    
    if (keyframeIndex) {
      // Use optimized range request approach
      try {
        if (onProgress) onProgress(5, 'Using optimized range request...');
        
        const startSeconds = timestampToSeconds(startTime);
        const endSeconds = timestampToSeconds(endTime);
        
        const outputBlob = await downloadAndCutSegment(
          input,
          startSeconds,
          endSeconds,
          outputFormat,
          onProgress
        );
        
        const outputUrl = URL.createObjectURL(outputBlob);
        const duration = endSeconds - startSeconds;
        
        return {
          success: true,
          outputBlob,
          outputUrl,
          duration
        };
      } catch (error) {
        console.warn('Range request failed, falling back to standard download:', error);
        // Fall through to standard approach
      }
    }
  }
  
  // Fall back to standard approach
  return cutVideoSegment(options);
}