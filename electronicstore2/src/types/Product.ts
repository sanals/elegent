// API types that match the backend models
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  specifications: Record<string, string>;
  images: string[];
  status: 'ACTIVE' | 'INACTIVE';
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  parentCategory?: Category;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// Legacy types for backwards compatibility with mock data
export interface LegacyProduct {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  description: string;
  imageUrl: string;
  images: string[];
  specifications: Record<string, string>;
  variants?: string[];
  popularity: number;
}

export interface LegacyCategory {
  name: string;
  subCategories: string[];
  imageUrl?: string;
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
} 