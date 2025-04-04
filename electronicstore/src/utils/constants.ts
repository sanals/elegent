export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

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