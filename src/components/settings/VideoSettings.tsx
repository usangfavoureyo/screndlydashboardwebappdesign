import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { youtubePoller } from '../../utils/youtube-poller';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { haptics } from '../../utils/haptics';

interface VideoSettingsProps {
  settings: any;
  updateSetting: (key: string, value: any) => void;
  onBack: () => void;
}

export function VideoSettings({ settings, updateSetting, onBack }: VideoSettingsProps) {
  const [pollInterval, setPollInterval] = useState(2);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    // Get current polling state
    setIsPolling(youtubePoller.getIsPolling());
    setPollInterval(youtubePoller.getCurrentInterval());
  }, []);

  const handleIntervalChange = (value: string) => {
    const minutes = parseInt(value) || 2;
    updateSetting('fetchInterval', value);
    setPollInterval(minutes);
    
    // Update the poller
    if (isPolling) {
      youtubePoller.stopPolling();
      youtubePoller.startPolling(minutes);
      toast.success(`Polling interval updated to ${minutes} minute(s)`);
    }
  };

  const handleKeywordsChange = (value: string) => {
    updateSetting('advancedFilters', value);
    
    // Update the poller's custom keywords
    youtubePoller.setCustomKeywords(value);
    toast.success('Trailer keywords updated');
  };

  const handlePostIntervalChange = (value: string) => {
    const minutes = parseInt(value) || 10;
    updateSetting('postInterval', value);
    toast.success(`Post interval updated to ${minutes} minute(s)`);
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 w-full lg:w-[600px] bg-white dark:bg-[#000000] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#333333] p-4 flex items-center gap-3">
        <button 
          className="text-gray-900 dark:text-white p-1" 
          onClick={onBack}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12H2M9 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="text-gray-900 dark:text-white text-xl">Video</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Polling Interval */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">Polling Interval</h3>
          <div>
            <Label className="text-[#9CA3AF]">Polling Interval (minutes)</Label>
            <Input
              type="number"
              min="1"
              max="60"
              value={settings.fetchInterval || pollInterval}
              onChange={(e) => handleIntervalChange(e.target.value)}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
            />
          </div>
        </div>

        {/* Post Interval */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">Post Interval</h3>
          <div>
            <Label className="text-[#9CA3AF]">Post Interval (minutes)</Label>
            <Input
              type="number"
              min="1"
              max="1440"
              value={settings.postInterval || 10}
              onChange={(e) => handlePostIntervalChange(e.target.value)}
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
            />
          </div>
        </div>

        {/* Trailer Detection Settings */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">Trailer Detection</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-[#9CA3AF]">Trailer Keywords (comma-separated)</Label>
              <Input
                value={settings.advancedFilters || 'trailer, teaser, official, first look, sneak peek'}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                placeholder="trailer, official, teaser"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
              />
            </div>
            
            <div>
              <Label className="text-[#9CA3AF]">Region Filter (optional)</Label>
              <Input
                value={settings.regionFilter || ''}
                onChange={(e) => updateSetting('regionFilter', e.target.value)}
                placeholder="US,UK,CA"
                className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-[#333333]"></div>

        {/* Caption Generation Section */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-1">Caption Generation</h3>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-3">
            AI-powered caption generation from Video content for social media publishing
          </p>
          
          {/* OpenAI Model Selection */}
          <div>
            <Label htmlFor="video-openai-model" className="text-[#9CA3AF]">Caption AI Model</Label>
            <Select
              value={settings.videoOpenaiModel || 'gpt-4o-mini'}
              onValueChange={(value) => {
                updateSetting('videoOpenaiModel', value);
                toast.success(`AI Model changed to ${value}`);
              }}
            >
              <SelectTrigger id="video-openai-model" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-5-nano">GPT-5 Nano (Latest)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Cheapest)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-[#333333]"></div>

        {/* Universal Social Media Caption Generation */}
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white mb-1">Universal Social Media Caption Generation</h3>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
              Single prompt generates optimized captions for all 5 platforms in one API call
            </p>
          </div>

          {/* Universal Caption Prompt */}
          <div>
            <Label htmlFor="video-universal-caption-prompt" className="text-[#9CA3AF]">Universal Caption Generation Prompt</Label>
            <textarea
              id="video-universal-caption-prompt"
              value={settings.videoUniversalCaptionPrompt || `You are a social media caption writer for Screen Render. Generate platform-optimized captions for all 5 platforms in one response using Google Search API context.

INPUT: Movie/TV title, 1-2 major cast members, release date, synopsis, Google Search API trending data
OUTPUT: JSON object with 5 platform-specific captions

Platform Requirements:

X (Twitter) - Culture Crave Style:
- Format: "#TitleNoSpaces hits [platform/theatres] [date] — [1-2 cast] [hook]"
- Max 280 characters
- 1-2 emojis max
- Human, conversational tone
- Example: "#DunePartTwo hits theatres March 1 — Timothée Chalamet and Zendaya bring the spice again."

Facebook:
- Strong opening hook (15-20 words)
- 150-300 words total
- 3-5 hashtags at end
- 4-6 emojis throughout
- Storytelling, community-building
- Include call-to-action

Instagram:
- Eye-catching opening (8-12 words)
- 150-200 words
- 8-12 hashtags (separate section)
- 5-8 emojis
- Line breaks for readability
- Visual, aesthetic language

Threads:
- Conversational opening (10-15 words)
- Under 500 characters
- 2-3 hashtags only
- 2-4 emojis
- Discussion-starting, authentic

TikTok:
- Hook-first (5-8 words, can be lowercase)
- Under 300 characters
- 3-5 trending hashtags
- 2-3 emojis
- Gen Z, meme-friendly, viral

Output Format (JSON):
{
  "x": "Caption text here...",
  "facebook": "Caption text here...",
  "instagram": "Caption text here...",
  "threads": "Caption text here...",
  "tiktok": "Caption text here..."
}

IMPORTANT: Return ONLY valid JSON. Use Google Search data for trending context and buzz.

Tone: Platform-aware, optimized for engagement, culturally relevant`}
              onChange={(e) => {
                haptics.light();
                updateSetting('videoUniversalCaptionPrompt', e.target.value);
              }}
              rows={38}
              className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono mt-1 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              Generates all 5 platform captions in one API call with JSON output
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-[#333333]"></div>

        {/* YouTube-Specific Settings */}
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white mb-1">YouTube Upload Settings</h3>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
              AI-powered title, description, and playlist detection for YouTube uploads
            </p>
          </div>

          {/* YouTube Title Generation Prompt */}
          <div>
            <Label htmlFor="video-youtube-title-prompt" className="text-[#9CA3AF]">YouTube Title Generation Prompt</Label>
            <textarea
              id="video-youtube-title-prompt"
              value={settings.videoYoutubeTitlePrompt || `You are a YouTube SEO expert for Screen Render. Create optimized YouTube titles using Google Search API to determine content type.

INPUT: Movie/TV title, trailer type, year, Google Search API data
OUTPUT: YouTube title in strict format

REQUIRED FORMAT:
[Title] | [Trailer Type] | ([Year] [TV Show OR Movie])

Examples:
- "Mottoehead Season 1 | Official Trailer | (2025 TV Show)"
- "The Holy Trinity | Official Trailer | (2025 Movie)"
- "The Surfer | 'My Board' Movie Clip | (2025 Movie)"
- "Gladiator II | Official Trailer | (2024 Movie)"
- "House of the Dragon Season 3 | Teaser Trailer | (2026 TV Show)"

Guidelines:
- Use Google Search API to determine if content is TV Show or Movie
- For TV shows: Include "Season X" if applicable
- For movie clips: Include clip name in single quotes
- Use " | " (space-pipe-space) as separator
- Always end with year and type in parentheses
- Keep total under 70 characters
- Use title case

Tone: Professional, SEO-optimized, consistent format`}
              onChange={(e) => {
                haptics.light();
                updateSetting('videoYoutubeTitlePrompt', e.target.value);
              }}
              rows={20}
              className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono mt-1 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              Strict format: &quot;Title | Trailer Type | (Year TV Show/Movie)&quot; with Google Search API
            </p>
          </div>

          {/* YouTube Description Generation Prompt */}
          <div>
            <Label htmlFor="video-youtube-description-prompt" className="text-[#9CA3AF]">YouTube Description Generation Prompt</Label>
            <textarea
              id="video-youtube-description-prompt"
              value={settings.videoYoutubeDescriptionPrompt || `You are a YouTube SEO expert for Screen Render, a movie and TV trailer platform. Create optimized YouTube video descriptions for trailer uploads.

INPUT: Movie/TV title, cast, release date, synopsis, director, studio
OUTPUT: YouTube-optimized video description

Guidelines:
- First 2 lines (150 chars) are most important - front-load key info
- Include movie/show title, release date, and key cast in opening
- Add full synopsis (2-3 paragraphs)
- Include:
  * Director and key crew
  * Main cast list
  * Release date and studio
  * Relevant links (official site, tickets, etc.)
- Add hashtags at the end (5-8 relevant)
- Include timestamps if applicable
- Add "Subscribe for more trailers" CTA
- Use proper formatting with line breaks

Structure:
[Opening hook with title and release date]

[Synopsis paragraph 1]

[Synopsis paragraph 2]

Director: [Name]
Cast: [Names]
Release Date: [Date]
Studio: [Studio]

🔔 Subscribe to Screen Render for the latest movie and TV trailers!

#MovieTitle #Trailers #Movies #ComingSoon

Tone: Professional, informative, SEO-rich`}
              onChange={(e) => {
                haptics.light();
                updateSetting('videoYoutubeDescriptionPrompt', e.target.value);
              }}
              rows={20}
              className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono mt-1 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              Full SEO-optimized description with structure, metadata, and CTAs
            </p>
          </div>

          {/* YouTube Playlist Detection Prompt */}
          <div>
            <Label htmlFor="video-youtube-playlist-prompt" className="text-[#9CA3AF]">YouTube Playlist Detection Prompt</Label>
            <textarea
              id="video-youtube-playlist-prompt"
              value={settings.videoYoutubePlaylistPrompt || `You are a content categorization expert for Screen Render's YouTube channel. Analyze trailer videos and determine which playlist(s) they belong to.

INPUT: Movie/TV title, genre, content type, studio, trailer metadata
OUTPUT: JSON array of matching playlist names

Available Playlists:
- "Movie Trailers" - All theatrical movie trailers
- "TV Show Trailers" - All TV series, limited series, and streaming show trailers
- "Movie Clips" - Exclusive clips, scenes, and featurettes from movies
- "Anime Trailers" - Anime films and series trailers
- "Horror Trailers" - Horror genre films and shows
- "Action Trailers" - Action genre films and shows
- "Comedy Trailers" - Comedy genre films and shows
- "Documentary Trailers" - Documentary films and series
- "4K Trailers" - High quality 4K resolution trailers
- "Coming Soon 2025" - All content releasing in 2025
- "Awards Season" - Oscar bait and awards contenders

Detection Rules:
- A video can belong to multiple playlists
- Always include the primary category (Movie/TV/Clip/Anime)
- Add genre-specific playlist if applicable
- Add "4K Trailers" if video quality is 4K
- Add year-specific playlist based on release date
- Add "Awards Season" for prestige films (September-February releases, A24, Searchlight, etc.)

Output Format:
Return ONLY a JSON array: ["Playlist 1", "Playlist 2", "Playlist 3"]

Example outputs:
- Action movie in 4K releasing 2025: ["Movie Trailers", "Action Trailers", "4K Trailers", "Coming Soon 2025"]
- Horror anime film: ["Anime Trailers", "Movie Trailers", "Horror Trailers"]
- TV drama for awards season: ["TV Show Trailers", "Awards Season"]`}
              onChange={(e) => {
                haptics.light();
                updateSetting('videoYoutubePlaylistPrompt', e.target.value);
              }}
              rows={22}
              className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono mt-1 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              AI automatically categorizes trailers into appropriate YouTube playlists
            </p>
          </div>

          {/* YouTube Playlist Management */}
          <div>
            <Label htmlFor="video-youtube-playlists" className="text-[#9CA3AF]">YouTube Playlists (comma-separated)</Label>
            <textarea
              id="video-youtube-playlists"
              value={settings.videoYoutubePlaylists || 'Movie Trailers, TV Show Trailers, Movie Clips, Anime Trailers, Horror Trailers, Action Trailers, Comedy Trailers, Documentary Trailers, 4K Trailers, Coming Soon 2025, Awards Season'}
              onChange={(e) => {
                haptics.light();
                updateSetting('videoYoutubePlaylists', e.target.value);
              }}
              rows={4}
              className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white mt-1 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              List of available playlists on your YouTube channel (one per line or comma-separated)
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-[#333333]"></div>

        {/* Pre-Download Content Filtering */}
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white mb-1">Pre-Download Content Filtering</h3>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
              GPT-5 Nano with Google Search API filters trailers before download
            </p>
          </div>

          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-4">
            <h4 className="text-sm text-gray-900 dark:text-white mb-2">Filtering Strategy</h4>
            <div className="space-y-2 text-xs text-gray-600 dark:text-[#9CA3AF]">
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">•</span>
                <span><span className="text-gray-900 dark:text-white">Step 1:</span> YouTube watcher detects new trailer video</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">•</span>
                <span><span className="text-gray-900 dark:text-white">Step 2:</span> Google Search API fetches title, country, language, genres</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">•</span>
                <span><span className="text-gray-900 dark:text-white">Step 3:</span> GPT-5 Nano validates if content matches criteria (YES/NO)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">•</span>
                <span><span className="text-gray-900 dark:text-white">Step 4:</span> Only queue video for download if GPT returns YES</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="video-filter-prompt" className="text-[#9CA3AF]">Content Filtering Prompt (GPT-5 Nano)</Label>
            <textarea
              id="video-filter-prompt"
              value={settings.videoFilterPrompt || `You are a content filter for Screen Render. Validate trailer titles using Google Search API data.

INPUT: Trailer title, Google Search API results (title, country, language, genres from IMDb/TMDb/Wikipedia)
OUTPUT: YES or NO

Criteria (ALL must match):
✓ Production: US or British-produced only
✓ Language: English-language only (original language must be "en")
✓ Genres: Must be ONE of: action, adventure, thriller, sci-fi, drama, fantasy, comedy, science fiction, romance
✗ Exclude: wrestling, sports, documentary, WWE, boxing, reality shows, cooking shows, foreign dubs, non-English content

Instructions:
1. Use Google Search API to fetch: title, production country, original language, genres
2. Validate against criteria above
3. Answer ONLY "YES" or "NO" (no explanation)

Examples:
Input: "Emily In Paris" (France, French, drama)
Output: NO (French-produced)

Input: "Dune: Part Two" (US, English, sci-fi/adventure)
Output: YES

Input: "WWE Monday Night RAW" (US, English, sports/wrestling)
Output: NO (wrestling/sports excluded)

Input: "Squid Game Season 2" (South Korea, Korean, thriller)
Output: NO (Korean-produced, non-English)

Tone: Binary validation, strict criteria enforcement`}
              onChange={(e) => {
                haptics.light();
                updateSetting('videoFilterPrompt', e.target.value);
              }}
              rows={24}
              className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono mt-1 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              GPT-5 Nano validates US/UK English-language content only, excludes foreign/dubbed/sports
            </p>
          </div>

          <div>
            <Label className="text-[#9CA3AF]">Filtering Performance Settings</Label>
            <div className="space-y-2 mt-1">
              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  id="video-filter-cache"
                  checked={settings.videoFilterCache !== false}
                  onChange={(e) => {
                    haptics.light();
                    updateSetting('videoFilterCache', e.target.checked);
                  }}
                  className="w-4 h-4 border-gray-300 dark:border-[#333333] accent-black dark:accent-white"
                />
                <Label htmlFor="video-filter-cache" className="text-xs text-gray-600 dark:text-[#9CA3AF] cursor-pointer">
                  Cache filtered titles to reduce API calls
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="checkbox"
                  id="video-filter-tmdb-validation"
                  checked={settings.videoFilterTmdbValidation !== false}
                  onChange={(e) => {
                    haptics.light();
                    updateSetting('videoFilterTmdbValidation', e.target.checked);
                  }}
                  className="w-4 h-4 border-gray-300 dark:border-[#333333] accent-black dark:accent-white"
                />
                <Label htmlFor="video-filter-tmdb-validation" className="text-xs text-gray-600 dark:text-[#9CA3AF] cursor-pointer">
                  Validate with TMDb API (country code: US/GB, language: en)
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-[#333333]"></div>

        {/* TMDb Asset Fetching */}
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white mb-1">TMDb Asset Fetching & Matching</h3>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
              Reliable title matching and asset fetching from TMDb API
            </p>
          </div>

          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-4">
            <h4 className="text-sm text-gray-900 dark:text-white mb-2">Title Matching Pipeline</h4>
            <div className="space-y-2 text-xs text-gray-600 dark:text-[#9CA3AF]">
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">1.</span>
                <span><span className="text-gray-900 dark:text-white">Extract:</span> Remove &quot;Official Trailer&quot;, &quot;Teaser&quot;, &quot;2025&quot;, &quot;HD&quot; from YouTube title using regex</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">2.</span>
                <span><span className="text-gray-900 dark:text-white">Search TMDb:</span> GET /search/movie or /search/tv with cleaned title + year</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">3.</span>
                <span><span className="text-gray-900 dark:text-white">Filter:</span> Keep only original_language=en, production_countries=US/GB, matching genres</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">4.</span>
                <span><span className="text-gray-900 dark:text-white">Rank:</span> Exact title match, then release year match, then GPT confirmation</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">5.</span>
                <span><span className="text-gray-900 dark:text-white">Fetch Assets:</span> GET /movie/{`{id}`}/images for backdrop, logo, poster</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="video-title-cleaning-regex" className="text-[#9CA3AF]">Title Cleaning Regex</Label>
            <Input
              id="video-title-cleaning-regex"
              value={settings.videoTitleCleaningRegex || '(?:\\s*[–-]\\s*(?:Official|Teaser|Trailer|HD|4K|2024|2025|2026).*$)'}
              onChange={(e) => {
                haptics.light();
                updateSetting('videoTitleCleaningRegex', e.target.value);
              }}
              placeholder="Regex pattern to remove trailer keywords"
              className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1 font-mono text-xs"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              Regex to strip &quot;Official Trailer&quot;, years, etc. from YouTube titles
            </p>
          </div>

          <div>
            <Label htmlFor="video-tmdb-fallback" className="text-[#9CA3AF]">TMDb Asset Fallback Behavior</Label>
            <Select
              value={settings.videoTmdbFallback || 'use-youtube-thumbnail'}
              onValueChange={(value) => {
                haptics.light();
                updateSetting('videoTmdbFallback', value);
                toast.success(`TMDb fallback changed to ${value}`);
              }}
            >
              <SelectTrigger id="video-tmdb-fallback" className="bg-white dark:bg-[#000000] border-gray-200 dark:border-[#333333] text-gray-900 dark:text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="use-youtube-thumbnail">Use YouTube Auto-Generated Thumbnail</SelectItem>
                <SelectItem value="skip-upload">Skip Upload (Manual Intervention)</SelectItem>
                <SelectItem value="backdrop-only">Use Backdrop Without Logo</SelectItem>
                <SelectItem value="poster-only">Use Poster Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              What to do if TMDb returns no valid backdrop or logo
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-[#333333]"></div>

        {/* Platform-Specific Thumbnail System */}
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white mb-1">Platform-Specific Thumbnail System</h3>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
              Automated thumbnail generation using TMDb assets (poster for social, backdrop+logo for YouTube/X)
            </p>
          </div>

          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-4">
            <h4 className="text-sm text-gray-900 dark:text-white mb-2">Thumbnail Strategy</h4>
            <div className="space-y-2 text-xs text-gray-600 dark:text-[#9CA3AF]">
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">•</span>
                <span><span className="text-gray-900 dark:text-white">Portrait (Poster):</span> Instagram, Facebook, Threads, TikTok use TMDb poster directly</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">•</span>
                <span><span className="text-gray-900 dark:text-white">Landscape (Backdrop + Logo):</span> YouTube (1280x720), X (1280x720) use backdrop with logo overlay</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24]">•</span>
                <span><span className="text-gray-900 dark:text-white">Processing:</span> Sharp composites backdrop + logo centered at bottom third</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="video-youtube-x-thumbnail-prompt" className="text-[#9CA3AF]">YouTube & X Thumbnail (Backdrop + Logo)</Label>
            <textarea
              id="video-youtube-x-thumbnail-prompt"
              value={settings.videoYoutubeXThumbnailPrompt || `You are a thumbnail designer for Screen Render. Generate YouTube and X thumbnails using TMDb backdrop + logo.

INPUT: TMDb backdrop URL, TMDb logo URL (transparent PNG), movie/TV title
OUTPUT: Thumbnail composition instructions (JSON)

Technical Specs:
- Dimensions: 1280x720px (16:9 aspect ratio)
- File size: Under 2MB
- Format: JPG or PNG
- Platforms: YouTube, X (Twitter)

Processing (using Sharp):
1. Download TMDb backdrop image
2. Resize to 1280x720px (smart crop if needed)
3. Download TMDb logo (transparent PNG)
4. Composite logo centered horizontally at bottom third of backdrop
5. If no logo: use backdrop only (no text overlay)
6. Export as JPG/PNG under 2MB

Logo Placement:
- Position: Center-bottom (horizontally centered, bottom third vertically)
- Max width: 60% of backdrop width
- Max height: 25% of backdrop height
- Maintain aspect ratio
- Add subtle drop shadow for visibility

Output Format (JSON):
{
  "backdropUrl": "https://image.tmdb.org/t/p/original/...",
  "logoUrl": "https://image.tmdb.org/t/p/original/..." or null,
  "dimensions": { "width": 1280, "height": 720 },
  "logoPlacement": {
    "position": "center-bottom",
    "maxWidthPercent": 60,
    "maxHeightPercent": 25,
    "verticalOffset": "bottom-third"
  }
}

Tone: Clean, minimal, professional`}
              onChange={(e) => {
                haptics.light();
                updateSetting('videoYoutubeXThumbnailPrompt', e.target.value);
              }}
              rows={24}
              className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono mt-1 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              Sharp composites TMDb backdrop + logo (centered bottom) for YouTube and X
            </p>
          </div>

          <div>
            <Label htmlFor="video-social-thumbnail-prompt" className="text-[#9CA3AF]">Instagram/Facebook/Threads/TikTok Thumbnail (Poster)</Label>
            <textarea
              id="video-social-thumbnail-prompt"
              value={settings.videoSocialThumbnailPrompt || `You are a thumbnail designer for Screen Render. Generate social media thumbnails using TMDb poster.

INPUT: TMDb poster URL, movie/TV title
OUTPUT: Thumbnail specifications (JSON)

Technical Specs:
- Source: TMDb poster (portrait 2:3 ratio)
- Platforms: Instagram, Facebook, Threads, TikTok
- File size: Under 2MB
- Format: JPG or PNG

Processing (using Sharp):
1. Download TMDb poster image
2. Use poster as-is (already optimized for portrait viewing)
3. Optional: Resize to 1080x1920 (9:16 for Reels/Stories)
4. Export as JPG/PNG under 2MB

Note: TMDb posters work perfectly for vertical platforms - no logo overlay needed

Output Format (JSON):
{
  "posterUrl": "https://image.tmdb.org/t/p/original/...",
  "targetDimensions": { "width": 1080, "height": 1920 },
  "platforms": ["instagram", "facebook", "threads", "tiktok"]
}

Tone: Clean poster presentation`}
              onChange={(e) => {
                haptics.light();
                updateSetting('videoSocialThumbnailPrompt', e.target.value);
              }}
              rows={20}
              className="w-full bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-3 text-sm text-gray-900 dark:text-white font-mono mt-1 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-[#6B7280] mt-1">
              TMDb poster used directly for Instagram, Facebook, Threads, TikTok
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-[#333333]"></div>

        {/* Complete Automation Pipeline */}
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 dark:text-white mb-1">Complete Automation Pipeline</h3>
            <p className="text-sm text-gray-600 dark:text-[#9CA3AF]">
              End-to-end workflow from detection to multi-platform upload
            </p>
          </div>

          <div className="bg-white dark:bg-[#000000] border border-gray-200 dark:border-[#333333] rounded-lg p-4 space-y-3">
            <div className="space-y-2 text-xs text-gray-600 dark:text-[#9CA3AF]">
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">1.</span>
                <span><span className="text-gray-900 dark:text-white">Detect:</span> YouTube RSS polling finds new trailer</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">2.</span>
                <span><span className="text-gray-900 dark:text-white">Filter:</span> Google Search API + GPT-5 Nano validates US/UK English content</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">3.</span>
                <span><span className="text-gray-900 dark:text-white">Download:</span> yt-dlp downloads video (only if GPT returns YES)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">4.</span>
                <span><span className="text-gray-900 dark:text-white">Clean Title:</span> Regex strips &quot;Official Trailer&quot;, years, keywords</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">5.</span>
                <span><span className="text-gray-900 dark:text-white">TMDb Match:</span> Search TMDb with cleaned title, filter by language/country/genre</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">6.</span>
                <span><span className="text-gray-900 dark:text-white">Fetch Assets:</span> Get backdrop, logo, poster, cast, release_date from TMDb</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">7.</span>
                <span><span className="text-gray-900 dark:text-white">Google Context:</span> GPT-5 Nano queries Google Search for trending data</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">8.</span>
                <span><span className="text-gray-900 dark:text-white">Generate Content:</span> GPT-5 Nano creates title, description, tags, captions (Culture Crave style)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">9.</span>
                <span><span className="text-gray-900 dark:text-white">Thumbnails:</span> Sharp composites backdrop+logo (YouTube/X), uses poster (Instagram/Facebook/Threads/TikTok)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">10.</span>
                <span><span className="text-gray-900 dark:text-white">Playlists:</span> GPT-5 Nano + Google Search determines YouTube playlists</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">11.</span>
                <span><span className="text-gray-900 dark:text-white">Upload:</span> Post to all enabled platforms with platform-specific thumbnails</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#ec1e24] shrink-0 w-5">12.</span>
                <span><span className="text-gray-900 dark:text-white">Queue:</span> Respect post intervals to avoid spam limits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}