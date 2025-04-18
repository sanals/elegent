// Import the Page interface from common types
import type { Page } from './common.types';

// Export it for use elsewhere
export type { Page };

// API Response format
export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR';
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  username: string;
  role: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Category Types
export interface CategorySummary {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface ProductSummary {
  id: number;
  name: string;
  description: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  specifications: string; // JSON string
  images: string[]; // URLs
  status: 'ACTIVE' | 'INACTIVE';
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface ProductCreateRequest {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  specifications?: string;
  stock: number;
  images?: File[]; // For multipart/form-data requests
}

export interface ProductUpdateRequest {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  specifications?: string;
  stock: number;
  images?: string[]; // URLs for existing images
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  category: CategorySummary;
  specifications: string;
  images: string[];
  status: 'ACTIVE' | 'INACTIVE';
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  parentCategory?: Category;
  subCategories?: CategorySummary[];
  products?: ProductSummary[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface CategoryCreateRequest {
  name: string;
  description: string;
  parentCategoryId?: number;
  imageUrl?: string;
}

export interface CategoryUpdateRequest {
  name: string;
  description?: string;
  parentCategoryId?: number;
  imageUrl?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  parentCategory?: CategorySummary;
  subCategories?: CategorySummary[];
  products?: ProductSummary[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

export interface UserResponse {
  id: number;
}

export interface UserStatusUpdateRequest {
  status: 'ACTIVE' | 'INACTIVE';
}

// Location-related Types
export interface StateResponse {
  id: number;
  name: string;
}

export interface CityResponse {
  id: number;
  name: string;
  state: StateResponse;
}

export interface LocalityResponse {
  id: number;
  name: string;
  pincode: string;
  city: CityResponse;
}

// Outlet Types
export interface OutletResponse {
  id: number;
  name: string;
  address: string;
  contactNumber: string;
  email?: string;
  openingTime?: string;
  closingTime?: string;
  active: boolean;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  locality: LocalityResponse;
  city: CityResponse;
  state: StateResponse;
}

export interface OutletCreateRequest {
  name: string;
  address: string;
  contactNumber: string;
  email?: string;
  openingTime?: string;
  closingTime?: string;
  localityId: number;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  active?: boolean;
}

export interface OutletUpdateRequest {
  name: string;
  address: string;
  contactNumber: string;
  email?: string;
  openingTime?: string;
  closingTime?: string;
  localityId: number;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  active?: boolean;
}
