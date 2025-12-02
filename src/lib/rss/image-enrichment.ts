/**
 * RSS Feed Image Enrichment
 * 
 * Integrates smart image selection into the RSS feed workflow
 */

import { selectSmartImages, type SmartImageResult } from '../ai/image-selection';
import type { Settings } from '../../contexts/SettingsContext';

export interface EnrichmentResult {
  success: boolean;
  images: Array<{
    url: string;
    width: number;
    height: number;
    source: string;
    reason: string;
  }>;
  confidence?: number;
  confidenceLevel?: 'high' | 'medium' | 'low';
  analysis?: {
    primarySubject: string;
    contextType: string;
  };
  error?: string;
}

/**
 * Enrich RSS article with smart image selection
 */
export async function enrichArticleWithImages(
  article: {
    title: string;
    description?: string;
    link?: string;
    images?: Array<{ url: string }>;
  },
  settings: Settings,
  imageCount: number = 2
): Promise<EnrichmentResult> {
  
  // Check if required API keys are configured
  if (!settings.serperKey || settings.serperKey === '••••••••••••••••') {
    return {
      success: false,
      images: [],
      error: 'Serper API key not configured. Please add your API key in Settings → API Keys.'
    };
  }
  
  if (!settings.openaiKey || settings.openaiKey === '••••••••••••••••') {
    return {
      success: false,
      images: [],
      error: 'OpenAI API key not configured. Please add your API key in Settings → API Keys.'
    };
  }
  
  try {
    console.log(`🎨 Enriching article: "${article.title}"`);
    
    const result = await selectSmartImages(
      {
        title: article.title,
        description: article.description,
        images: article.images
      },
      {
        imageCount,
        serperApiKey: settings.serperKey,
        openaiApiKey: settings.openaiKey,
        enableFallback: true
      }
    );
    
    console.log(`✅ Enrichment complete: ${result.images.length} images, ${result.confidence}% confidence`);
    
    return {
      success: true,
      images: result.images.map(img => ({
        url: img.url,
        width: img.width,
        height: img.height,
        source: img.source,
        reason: img.reason
      })),
      confidence: result.confidence,
      confidenceLevel: result.confidenceLevel,
      analysis: {
        primarySubject: result.analysis.primarySubject.name,
        contextType: result.analysis.contextType
      }
    };
    
  } catch (error) {
    console.error('❌ Image enrichment failed:', error);
    
    // Try fallback to RSS images
    if (article.images && article.images.length > 0) {
      console.log('⚠️ Using RSS fallback images');
      
      return {
        success: true,
        images: article.images.slice(0, imageCount).map((img, index) => ({
          url: img.url,
          width: 1200,
          height: 800,
          source: 'RSS Feed (Fallback)',
          reason: 'Fallback image from RSS feed'
        })),
        confidence: 50,
        confidenceLevel: 'low'
      };
    }
    
    return {
      success: false,
      images: [],
      error: error instanceof Error ? error.message : 'Unknown error during image enrichment'
    };
  }
}

/**
 * Preview image enrichment results (for testing in Feed Editor)
 */
export async function previewImageEnrichment(
  articleTitle: string,
  settings: Settings,
  imageCount: number = 2
): Promise<{
  success: boolean;
  preview?: {
    primarySubject: string;
    contextType: string;
    queries: string[];
    images: Array<{
      url: string;
      reason: string;
      score: number;
    }>;
    confidence: number;
  };
  error?: string;
}> {
  
  try {
    const result = await selectSmartImages(
      {
        title: articleTitle,
        description: ''
      },
      {
        imageCount,
        serperApiKey: settings.serperKey,
        openaiApiKey: settings.openaiKey,
        enableFallback: false
      }
    );
    
    return {
      success: true,
      preview: {
        primarySubject: result.analysis.primarySubject.name,
        contextType: result.analysis.contextType,
        queries: result.queries,
        images: result.images.map(img => ({
          url: img.url,
          reason: img.reason,
          score: img.totalScore
        })),
        confidence: result.confidence
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Preview failed'
    };
  }
}

/**
 * Validate that smart image selection is properly configured
 */
export function validateSmartImageConfig(settings: Settings): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check Serper API key
  if (!settings.serperKey || settings.serperKey === '••••••••••••••••') {
    errors.push('Serper API key not configured');
  }
  
  // Check OpenAI API key
  if (!settings.openaiKey || settings.openaiKey === '••••••••••••••••') {
    errors.push('OpenAI API key not configured');
  }
  
  // Check if keys look valid (basic format check)
  if (settings.serperKey && settings.serperKey !== '••••••••••••••••') {
    if (settings.serperKey.length < 20) {
      warnings.push('Serper API key looks too short');
    }
  }
  
  if (settings.openaiKey && settings.openaiKey !== '••••••••••••••••') {
    if (!settings.openaiKey.startsWith('sk-')) {
      warnings.push('OpenAI API key should start with "sk-"');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
