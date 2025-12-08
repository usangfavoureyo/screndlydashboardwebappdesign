/**
 * Unified Web Search API Integration
 * 
 * Supports both Google Search Console and Serper.dev APIs
 * for enhanced AI context in Video Studio
 */

import axios from 'axios';

export interface WebSearchResult {
  title: string;
  snippet: string;
  url: string;
  displayUrl?: string;
}

export interface WebSearchResponse {
  results: WebSearchResult[];
  query: string;
  provider: 'google' | 'serper';
  totalResults: number;
}

/**
 * Search using Google Custom Search API
 */
async function searchGoogle(
  query: string,
  apiKey: string,
  searchEngineId: string,
  maxResults: number = 5
): Promise<WebSearchResult[]> {
  if (!apiKey || !searchEngineId) {
    throw new Error('Google Search API key or Search Engine ID not configured');
  }

  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: apiKey,
        cx: searchEngineId,
        q: query,
        num: Math.min(maxResults, 10) // Google API max is 10
      },
      timeout: 10000
    });

    if (!response.data.items || response.data.items.length === 0) {
      return [];
    }

    return response.data.items.map((item: any) => ({
      title: item.title || '',
      snippet: item.snippet || '',
      url: item.link || '',
      displayUrl: item.displayLink || ''
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('Invalid Google Search API key or quota exceeded');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid Search Engine ID');
      }
    }
    throw new Error(`Google Search API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Search using Serper API
 */
async function searchSerper(
  query: string,
  apiKey: string,
  maxResults: number = 5
): Promise<WebSearchResult[]> {
  if (!apiKey) {
    throw new Error('Serper API key not configured');
  }

  try {
    const response = await axios.post(
      'https://google.serper.dev/search',
      {
        q: query,
        num: Math.min(maxResults, 10)
      },
      {
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const results: WebSearchResult[] = [];

    // Extract organic results
    if (response.data.organic) {
      results.push(...response.data.organic.slice(0, maxResults).map((item: any) => ({
        title: item.title || '',
        snippet: item.snippet || '',
        url: item.link || '',
        displayUrl: item.displayedLink || item.link || ''
      })));
    }

    // Extract knowledge graph if available (useful for movies/TV shows)
    if (response.data.knowledgeGraph) {
      const kg = response.data.knowledgeGraph;
      results.unshift({
        title: kg.title || '',
        snippet: kg.description || '',
        url: kg.website || kg.descriptionLink || '',
        displayUrl: 'Knowledge Graph'
      });
    }

    return results;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid Serper API key');
      } else if (error.response?.status === 429) {
        throw new Error('Serper API rate limit exceeded');
      }
    }
    throw new Error(`Serper API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Unified web search function
 * Automatically selects the appropriate API based on settings
 */
export async function performWebSearch(
  query: string,
  provider: 'google' | 'serper',
  config: {
    googleApiKey?: string;
    googleSearchEngineId?: string;
    serperApiKey?: string;
    maxResults?: number;
  }
): Promise<WebSearchResponse> {
  const maxResults = config.maxResults || 5;

  let results: WebSearchResult[] = [];

  if (provider === 'google') {
    if (!config.googleApiKey || !config.googleSearchEngineId) {
      throw new Error('Google Search API credentials not configured');
    }
    results = await searchGoogle(query, config.googleApiKey, config.googleSearchEngineId, maxResults);
  } else if (provider === 'serper') {
    if (!config.serperApiKey) {
      throw new Error('Serper API key not configured');
    }
    results = await searchSerper(query, config.serperApiKey, maxResults);
  } else {
    throw new Error(`Unknown search provider: ${provider}`);
  }

  return {
    results,
    query,
    provider,
    totalResults: results.length
  };
}

/**
 * Build context string from search results for AI prompts
 */
export function formatSearchResultsForPrompt(results: WebSearchResult[]): string {
  if (results.length === 0) {
    return '';
  }

  return results.map((result, index) => {
    return `${index + 1}. ${result.title}
   ${result.snippet}
   Source: ${result.displayUrl || result.url}`;
  }).join('\n\n');
}

/**
 * Create a search query optimized for movie/TV scene information
 */
export function buildSceneSearchQuery(
  movieTitle: string,
  userQuery: string,
  includeKeywords: string[] = ['scene', 'timestamp', 'plot', 'summary']
): string {
  const keywords = includeKeywords.join(' ');
  return `"${movieTitle}" ${userQuery} ${keywords}`;
}
