/**
 * Serper API Integration
 * 
 * Provides Google Image Search functionality via Serper.dev API
 * Documentation: https://serper.dev/docs
 */

import axios from 'axios';

export interface SerperImageResult {
  title: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  thumbnailUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  source: string;
  domain: string;
  link: string;
  position: number;
}

export interface SerperSearchParams {
  q: string;                    // Search query
  num?: number;                 // Number of results (default: 10, max: 100)
  gl?: string;                  // Country code (e.g., "us", "uk")
  hl?: string;                  // Language (e.g., "en", "es")
  autocorrect?: boolean;        // Auto-correct spelling (default: true)
  page?: number;                // Page number for pagination
  type?: 'images';              // Search type
  engine?: 'google';            // Search engine
}

export interface SerperResponse {
  images: SerperImageResult[];
  searchParameters: {
    q: string;
    gl: string;
    hl: string;
    num: number;
    type: string;
    engine: string;
  };
}

/**
 * Search Google Images via Serper API
 */
export async function searchSerperImages(
  query: string,
  apiKey: string,
  options: Partial<SerperSearchParams> = {}
): Promise<SerperImageResult[]> {
  if (!apiKey || apiKey === '••••••••••••••••') {
    throw new Error('Serper API key not configured. Please add your API key in Settings → API Keys.');
  }

  const params: SerperSearchParams = {
    q: query,
    num: options.num || 10,
    gl: options.gl || 'us',
    hl: options.hl || 'en',
    autocorrect: options.autocorrect !== false,
    page: options.page || 1,
    type: 'images',
    engine: 'google'
  };

  try {
    const response = await axios.post<SerperResponse>(
      'https://google.serper.dev/images',
      params,
      {
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    return response.data.images || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid Serper API key. Please check your API key in Settings.');
      } else if (error.response?.status === 429) {
        throw new Error('Serper API rate limit exceeded. Please try again later.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Serper API request timed out. Please try again.');
      }
    }
    
    throw new Error(`Serper API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Search with retry logic (exponential backoff)
 */
export async function searchSerperImagesWithRetry(
  query: string,
  apiKey: string,
  options: Partial<SerperSearchParams> = {},
  maxRetries: number = 3
): Promise<SerperImageResult[]> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await searchSerperImages(query, apiKey, options);
    } catch (error) {
      // Don't retry on authentication errors
      if (error instanceof Error && error.message.includes('Invalid Serper API key')) {
        throw error;
      }

      // Last attempt - throw error
      if (attempt === maxRetries - 1) {
        throw error;
      }

      // Wait with exponential backoff (1s, 2s, 4s)
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Serper API retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return [];
}

/**
 * Test Serper API connection
 */
export async function testSerperConnection(apiKey: string): Promise<{
  success: boolean;
  message: string;
  sampleResults?: number;
}> {
  try {
    const results = await searchSerperImages('test movie poster', apiKey, { num: 5 });
    
    return {
      success: true,
      message: `Serper API connected successfully. Found ${results.length} test results.`,
      sampleResults: results.length
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error testing Serper API'
    };
  }
}
