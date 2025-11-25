// ============================================================================
// VIZLA API SERVICE
// ============================================================================
// Handles all Vizla video generation API interactions

import { apiClient } from './client';
import { 
  VizlaJobRequest, 
  VizlaJobResponse, 
  VizlaJobStatus,
  ApiResponse 
} from './types';

export class VizlaApi {
  /**
   * Create a new video generation job
   */
  async createJob(request: VizlaJobRequest): Promise<ApiResponse<VizlaJobResponse>> {
    // Mock implementation - replace with real Vizla API
    return new Promise((resolve) => {
      setTimeout(() => {
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        resolve({
          success: true,
          data: {
            jobId,
            status: 'queued',
            createdAt: new Date().toISOString(),
            estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
          },
        });
      }, 500);
    });
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<ApiResponse<VizlaJobStatus>> {
    // Mock implementation - simulates job progression
    return new Promise((resolve) => {
      setTimeout(() => {
        const random = Math.random();
        let status: VizlaJobStatus['status'] = 'processing';
        let progress = Math.floor(random * 100);
        
        if (progress > 95) {
          status = 'completed';
          progress = 100;
        }
        
        resolve({
          success: true,
          data: {
            jobId,
            status,
            progress,
            currentStep: status === 'processing' ? 'Generating video scenes...' : undefined,
            outputUrl: status === 'completed' ? `https://vizla.com/videos/${jobId}.mp4` : undefined,
            previewUrl: progress > 50 ? `https://vizla.com/previews/${jobId}.mp4` : undefined,
          },
        });
      }, 500);
    });
  }

  /**
   * Create preview job (15s sample)
   */
  async createPreviewJob(request: VizlaJobRequest): Promise<ApiResponse<VizlaJobResponse>> {
    // Create a shortened version for preview
    const previewRequest = {
      ...request,
      duration: Math.min(15, request.duration),
      segments: request.segments.slice(0, 2), // First 2 segments only
    };
    
    return this.createJob(previewRequest);
  }

  /**
   * Cancel a job
   */
  async cancelJob(jobId: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/vizla/jobs/${jobId}/cancel`);
  }

  /**
   * Poll job status until completion
   */
  async pollJobStatus(
    jobId: string,
    onProgress?: (status: VizlaJobStatus) => void,
    intervalMs: number = 5000,
    maxAttempts: number = 60 // 5 minutes with 5s interval
  ): Promise<ApiResponse<VizlaJobStatus>> {
    let attempts = 0;

    const poll = async (): Promise<ApiResponse<VizlaJobStatus>> => {
      const response = await this.getJobStatus(jobId);
      
      if (!response.success) {
        return response;
      }

      const status = response.data!;
      
      if (onProgress) {
        onProgress(status);
      }

      // Job completed or failed
      if (status.status === 'completed' || status.status === 'failed') {
        return response;
      }

      // Max attempts reached
      attempts++;
      if (attempts >= maxAttempts) {
        return {
          success: false,
          error: {
            code: 'TIMEOUT',
            message: 'Job polling timeout exceeded',
            statusCode: 408,
          },
        };
      }

      // Wait and poll again
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      return poll();
    };

    return poll();
  }

  /**
   * Validate job request
   */
  validateJobRequest(request: VizlaJobRequest): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate required fields
    if (!request.prompt || request.prompt.trim().length === 0) {
      errors.push('Prompt is required');
    }

    if (!request.aspectRatio) {
      errors.push('Aspect ratio is required');
    }

    if (!request.duration || request.duration <= 0) {
      errors.push('Duration must be greater than 0');
    }

    if (!request.segments || request.segments.length === 0) {
      errors.push('At least one segment is required');
    }

    // Validate segments
    request.segments?.forEach((segment, index) => {
      if (segment.startTime >= segment.endTime) {
        errors.push(`Segment ${index + 1}: Start time must be before end time`);
      }
      
      if (segment.startTime < 0 || segment.endTime > request.duration) {
        errors.push(`Segment ${index + 1}: Times must be within video duration`);
      }
      
      if (!segment.text || segment.text.trim().length === 0) {
        errors.push(`Segment ${index + 1}: Text is required`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Estimate job cost based on duration and settings
   */
  estimateCost(request: VizlaJobRequest): {
    estimatedCost: number;
    currency: string;
    breakdown: {
      baseCost: number;
      durationCost: number;
      qualityCost: number;
    };
  } {
    const baseCost = 0.50; // Base cost per job
    const costPerSecond = 0.05; // Cost per second of video
    const qualityMultiplier = request.aspectRatio === '16:9' ? 1.0 : 1.2; // Higher for vertical/square

    const durationCost = request.duration * costPerSecond;
    const qualityCost = durationCost * (qualityMultiplier - 1);
    const totalCost = baseCost + durationCost + qualityCost;

    return {
      estimatedCost: Math.round(totalCost * 100) / 100,
      currency: 'USD',
      breakdown: {
        baseCost,
        durationCost,
        qualityCost,
      },
    };
  }
}

export const vizlaApi = new VizlaApi();
