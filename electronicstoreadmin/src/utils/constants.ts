// API Base URL - using the direct URL since process.env isn't working
export const API_BASE_URL = 'http://localhost:8090/api/v1';

// Google Maps API Key - import from environment variables
// This should be loaded from the VITE_GOOGLE_MAPS_API_KEY variable in .env
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const PRODUCT_CATEGORIES = {
  FANS: 'Fans',
  LIGHTING: 'Lighting',
  ELECTRICAL_SUPPLIES: 'Electrical Supplies',
  TOOLS: 'Tools'
} as const;

export const SORT_OPTIONS = {
  PRICE_LOW_TO_HIGH: 'price_asc',
  PRICE_HIGH_TO_LOW: 'price_desc',
  POPULARITY: 'popularity',
  NEWEST: 'newest'
} as const;

export const PAGE_SIZE = 12;

export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
} as const; 