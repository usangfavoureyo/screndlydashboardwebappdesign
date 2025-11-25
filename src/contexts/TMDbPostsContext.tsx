import { createContext, useContext, useState, ReactNode } from 'react';

export interface TMDbPost {
  id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  year: number;
  releaseDate: string;
  caption: string;
  imageUrl: string;
  imageType: 'poster' | 'backdrop';
  scheduledTime: string;
  source: 'tmdb_today' | 'tmdb_weekly' | 'tmdb_monthly' | 'tmdb_anniversary';
  cast: string[];
  popularity: number;
  cacheHit: boolean;
  status: 'queued' | 'scheduled' | 'published' | 'failed';
  platforms?: string[];
  publishedTime?: string;
  errorMessage?: string;
}

interface TMDbPostsContextType {
  posts: TMDbPost[];
  schedulePost: (post: TMDbPost) => void;
  reschedulePost: (postId: string, newScheduledTime: string) => void;
  updatePostStatus: (postId: string, status: TMDbPost['status'], publishedTime?: string, errorMessage?: string) => void;
  deletePost: (postId: string) => void;
  getPostsByStatus: (status: TMDbPost['status']) => TMDbPost[];
}

const TMDbPostsContext = createContext<TMDbPostsContextType | undefined>(undefined);

export function TMDbPostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<TMDbPost[]>([
    // Some initial mock data for demo
    {
      id: 'published-1',
      tmdbId: 558449,
      mediaType: 'movie',
      title: 'Gladiator II',
      year: 2024,
      releaseDate: '2024-11-17',
      caption: '#GladiatorII arrives in theaters TODAY! 🎬⚔️',
      imageUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
      imageType: 'poster',
      scheduledTime: '2024-11-17T08:00:00Z',
      source: 'tmdb_today',
      cast: ['Paul Mescal', 'Denzel Washington', 'Pedro Pascal'],
      popularity: 456.89,
      cacheHit: false,
      status: 'published',
      platforms: ['X', 'Facebook', 'Instagram'],
      publishedTime: '2024-11-17T08:00:00Z',
    },
    {
      id: 'failed-1',
      tmdbId: 94605,
      mediaType: 'tv',
      title: 'Arcane',
      year: 2021,
      releaseDate: '2021-11-06',
      caption: '#Arcane returns for Season 2 next month.',
      imageUrl: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
      imageType: 'poster',
      scheduledTime: '2024-11-19T11:00:00Z',
      source: 'tmdb_monthly',
      cast: ['Hailee Steinfeld', 'Ella Purnell'],
      popularity: 312.78,
      cacheHit: false,
      status: 'failed',
      platforms: ['YouTube'],
      errorMessage: 'Upload quota exceeded',
    },
  ]);

  const schedulePost = (post: TMDbPost) => {
    setPosts(prev => {
      // Check if post already exists
      const existingIndex = prev.findIndex(p => p.id === post.id);
      if (existingIndex !== -1) {
        // Update existing post
        const updated = [...prev];
        updated[existingIndex] = { ...post, status: 'scheduled' };
        return updated;
      }
      // Add new post
      return [...prev, { ...post, status: 'scheduled' }];
    });
  };

  const reschedulePost = (postId: string, newScheduledTime: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, scheduledTime: newScheduledTime }
          : post
      )
    );
  };

  const updatePostStatus = (
    postId: string, 
    status: TMDbPost['status'], 
    publishedTime?: string,
    errorMessage?: string
  ) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              status, 
              publishedTime: status === 'published' ? publishedTime : post.publishedTime,
              errorMessage: status === 'failed' ? errorMessage : undefined
            }
          : post
      )
    );
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const getPostsByStatus = (status: TMDbPost['status']) => {
    return posts.filter(post => post.status === status);
  };

  return (
    <TMDbPostsContext.Provider
      value={{
        posts,
        schedulePost,
        reschedulePost,
        updatePostStatus,
        deletePost,
        getPostsByStatus,
      }}
    >
      {children}
    </TMDbPostsContext.Provider>
  );
}

export function useTMDbPosts() {
  const context = useContext(TMDbPostsContext);
  if (context === undefined) {
    throw new Error('useTMDbPosts must be used within a TMDbPostsProvider');
  }
  return context;
}
