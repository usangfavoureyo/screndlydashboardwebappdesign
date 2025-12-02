/**
 * AI Subject Matter Extraction
 * 
 * Uses GPT-4 to analyze entertainment news articles and extract
 * primary/secondary subjects for intelligent image search
 */

import OpenAI from 'openai';

export interface SubjectEntity {
  name: string;
  type: 'movie' | 'tv_show' | 'actor' | 'director' | 'studio' | 'franchise';
  relevance: 'high' | 'medium' | 'low';
}

export interface SubjectMatterAnalysis {
  primarySubject: {
    name: string;
    type: 'movie' | 'tv_show' | 'franchise';
    status: 'released' | 'production' | 'development' | 'rumored';
  };
  secondarySubjects: SubjectEntity[];
  contextType: 'trailer' | 'announcement' | 'interview' | 'review' | 'boxoffice' | 'bts' | 'casting' | 'quote' | 'general';
  imagePreferences: string[];
}

const EXTRACTION_PROMPT = `You are an expert at analyzing entertainment news articles and extracting key entities for image search.

Analyze this article and extract:
1. Primary subject (the main movie/TV show/project being discussed)
2. Secondary subjects (actors, directors, franchises, studios, etc.)
3. Context type (what kind of news is this?)
4. Production status (where is the project in development?)
5. Image search query suggestions (prioritized list)

Rules:
- The PRIMARY subject should ALWAYS be the movie/TV show/project, NOT the person
- For interviews about a movie, the movie is primary, the person is secondary
- For casting news, the movie is primary, the actor is secondary
- For sequels without images, include the previous movie in secondary subjects
- Context type helps determine what kind of images to search for

Respond in JSON format:
{
  "primarySubject": {
    "name": "Movie or TV show name (exact title)",
    "type": "movie|tv_show|franchise",
    "status": "released|production|development|rumored"
  },
  "secondarySubjects": [
    {
      "name": "Person or entity name",
      "type": "actor|director|studio|franchise|movie",
      "relevance": "high|medium|low"
    }
  ],
  "contextType": "trailer|announcement|interview|review|boxoffice|bts|casting|quote|general",
  "imagePreferences": [
    "Query suggestion 1 (most specific)",
    "Query suggestion 2 (fallback)",
    "Query suggestion 3 (broader fallback)",
    "Query suggestion 4 (final fallback)"
  ]
}`;

/**
 * Extract subject matter from article using GPT-4
 */
export async function extractSubjectMatter(
  article: {
    title: string;
    description?: string;
  },
  openaiKey: string
): Promise<SubjectMatterAnalysis> {
  if (!openaiKey || openaiKey === '••••••••••••••••') {
    throw new Error('OpenAI API key not configured. Please add your API key in Settings → API Keys.');
  }

  const openai = new OpenAI({
    apiKey: openaiKey,
    dangerouslyAllowBrowser: true // Note: In production, this should be server-side
  });

  const userMessage = `Article Title: "${article.title}"${
    article.description ? `\nArticle Description: "${article.description}"` : ''
  }`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: EXTRACTION_PROMPT
        },
        { 
          role: 'user', 
          content: userMessage 
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI API');
    }

    const analysis = JSON.parse(content) as SubjectMatterAnalysis;
    
    // Validate response structure
    if (!analysis.primarySubject || !analysis.imagePreferences) {
      throw new Error('Invalid response structure from OpenAI API');
    }

    return analysis;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid OpenAI API key. Please check your API key in Settings.');
      } else if (error.message.includes('quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your billing.');
      }
    }
    
    // Fallback to basic extraction
    console.error('GPT-4 extraction failed, using fallback:', error);
    return extractSubjectMatterFallback(article);
  }
}

/**
 * Fallback extraction when GPT-4 is unavailable
 * Uses simple heuristics to extract subject matter
 */
function extractSubjectMatterFallback(article: {
  title: string;
  description?: string;
}): SubjectMatterAnalysis {
  const title = article.title;
  const text = `${title} ${article.description || ''}`.toLowerCase();

  // Detect context type
  let contextType: SubjectMatterAnalysis['contextType'] = 'general';
  if (text.includes('trailer')) contextType = 'trailer';
  else if (text.includes('announce') || text.includes('confirmed')) contextType = 'announcement';
  else if (text.includes('interview') || text.includes('says') || text.includes('tells')) contextType = 'interview';
  else if (text.includes('review')) contextType = 'review';
  else if (text.includes('box office') || text.includes('weekend')) contextType = 'boxoffice';
  else if (text.includes('behind the scenes') || text.includes('set photo')) contextType = 'bts';
  else if (text.includes('cast') || text.includes('joins')) contextType = 'casting';

  // Detect status
  let status: SubjectMatterAnalysis['primarySubject']['status'] = 'rumored';
  if (text.includes('released') || text.includes('premieres') || text.includes('now playing')) {
    status = 'released';
  } else if (text.includes('filming') || text.includes('production')) {
    status = 'production';
  } else if (text.includes('development') || text.includes('talks')) {
    status = 'development';
  }

  // Extract quoted titles (most reliable)
  const quotedTitles = title.match(/'([^']+)'|"([^"]+)"/g);
  const extractedTitle = quotedTitles 
    ? quotedTitles[0].replace(/['"]/g, '')
    : title.split(/\s+/).slice(0, 4).join(' '); // First few words as fallback

  return {
    primarySubject: {
      name: extractedTitle,
      type: text.includes('series') || text.includes('season') ? 'tv_show' : 'movie',
      status
    },
    secondarySubjects: [],
    contextType,
    imagePreferences: [
      `${extractedTitle} official poster`,
      `${extractedTitle} promotional image`,
      `${extractedTitle} movie poster`,
      extractedTitle
    ]
  };
}

/**
 * Find previous movie in a series (for intelligent fallback)
 */
export function findPreviousInSeries(movieTitle: string): string | null {
  const patterns = [
    { regex: /(.+?)\s+(\d+)$/, type: 'numbered' as const },           // "Movie 3"
    { regex: /(.+?)\s+Part\s+(\d+)$/i, type: 'part' as const },       // "Movie Part 3"
    { regex: /(.+?):\s+(.+)$/, type: 'subtitle' as const }            // "Movie: Subtitle"
  ];

  for (const pattern of patterns) {
    const match = movieTitle.match(pattern.regex);
    
    if (match) {
      if (pattern.type === 'numbered') {
        const base = match[1];
        const num = parseInt(match[2]);
        
        if (num > 1) {
          return `${base} ${num - 1}`;  // Return previous sequel
        } else {
          return base;  // Return original
        }
      }
      
      if (pattern.type === 'part') {
        const base = match[1];
        const num = parseInt(match[2]);
        
        if (num > 1) {
          return `${base} Part ${num - 1}`;
        } else {
          return base;
        }
      }
      
      if (pattern.type === 'subtitle') {
        return match[1];  // Return base title without subtitle
      }
    }
  }

  return null;
}

/**
 * Detect if a movie title suggests it's a sequel
 */
export function isSequelTitle(title: string): boolean {
  const sequelPatterns = [
    /\s+\d+$/,                    // Ends with number: "Movie 3"
    /\s+Part\s+\d+$/i,            // "Movie Part 3"
    /\s+II$/i,                     // "Movie II"
    /\s+III$/i,                    // "Movie III"
    /:\s+/,                        // Has subtitle: "Movie: Subtitle"
    /\s+Returns?$/i,              // "Movie Returns"
    /\s+Reloaded$/i,              // "Movie Reloaded"
    /\s+Revolutions?$/i,          // "Movie Revolution"
  ];

  return sequelPatterns.some(pattern => pattern.test(title));
}
