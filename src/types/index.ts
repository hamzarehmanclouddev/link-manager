export interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  favicon: string;
  createdAt: number;
  lastVisited?: number;
  visitCount: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'most-visited';
export type ViewMode = 'grid' | 'list';
