import { Product, Category } from '../types/Product';

// API response structure matching the backend
export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR';
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

// Pagination structure for responses
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Response types
export type ProductResponse = ApiResponse<Product>;
export type ProductsPageResponse = ApiResponse<Page<Product>>;
export type CategoryResponse = ApiResponse<Category>;
export type CategoriesResponse = ApiResponse<Category[]>; 