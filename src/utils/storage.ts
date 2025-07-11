import { Link, Category } from '../types';

// Local storage keys
const LINKS_STORAGE_KEY = 'linkVault_links';
const CATEGORIES_STORAGE_KEY = 'linkVault_categories';

// Default categories
const defaultCategories: Category[] = [
  { id: 'work', name: 'Work', color: '#4f46e5' },
  { id: 'personal', name: 'Personal', color: '#10b981' },
  { id: 'education', name: 'Education', color: '#f59e0b' },
  { id: 'entertainment', name: 'Entertainment', color: '#ec4899' },
  { id: 'finance', name: 'Finance', color: '#6366f1' },
  { id: 'health', name: 'Health', color: '#ef4444' },
  { id: 'shopping', name: 'Shopping', color: '#8b5cf6' },
  { id: 'social', name: 'Social', color: '#3b82f6' },
  { id: 'travel', name: 'Travel', color: '#14b8a6' },
  { id: 'other', name: 'Other', color: '#6b7280' },
];

// Get links from local storage
export const getLinks = (): Link[] => {
  const storedLinks = localStorage.getItem(LINKS_STORAGE_KEY);
  return storedLinks ? JSON.parse(storedLinks) : [];
};

// Save links to local storage
export const saveLinks = (links: Link[]): void => {
  localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));
};

// Get categories from local storage
export const getCategories = (): Category[] => {
  const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (!storedCategories) {
    saveCategories(defaultCategories);
    return defaultCategories;
  }
  return JSON.parse(storedCategories);
};

// Save categories to local storage
export const saveCategories = (categories: Category[]): void => {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
};

// Extract favicon from URL
export const extractFavicon = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch (error) {
    return '';
  }
};

// Extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return '';
  }
};

// Validate URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};
