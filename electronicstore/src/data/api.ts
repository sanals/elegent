import axios from 'axios';
import { Category, Product } from '../types/Product';
import { ApiResponse, Page } from './models';

// Define response types that match our API structure
type ApiProductsResponse = ApiResponse<Page<Product>>;
type ApiProductResponse = ApiResponse<Product>;
type ApiCategoriesResponse = ApiResponse<Category[]>;
type ApiCategoryResponse = ApiResponse<Category>;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:8090/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type-safe way to check if an object has a data property
const hasDataProperty = (obj: any): obj is { data: any; status?: string } => {
  return obj && typeof obj === 'object' && 'data' in obj;
};

// Response interceptor to handle API response structure
apiClient.interceptors.response.use(
  response => {
    console.log('Raw API response:', response.data);

    // Extract the nested data from our API's standard response format
    if (hasDataProperty(response.data) && response.data.status === 'SUCCESS') {
      console.log('Extracting data from standard API response');
      return response.data.data;
    }

    // Handle paginated responses directly - if the data itself is already a Page
    if (response.data && typeof response.data === 'object' && 'content' in response.data) {
      console.log('Found direct page object in response');
      return response.data;
    }

    // If it's already in a usable format, return as-is
    console.log('Using response data as-is');
    return response.data;
  },
  error => {
    // Handle error responses
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  getProducts: async (
    page = 0,
    size = 10,
    keyword = '',
    categoryId?: number
  ): Promise<Page<Product>> => {
    try {
      const params: Record<string, any> = {
        page,
        size,
        sort: 'name,asc'
      };

      if (keyword) params.keyword = keyword;
      if (categoryId) params.categoryId = categoryId;

      const response = await apiClient.get<ApiProductsResponse>('/products', { params });
      return response as unknown as Page<Product>;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get<ApiProductResponse>(`/products/${id}`);
      return response as unknown as Product;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiProductsResponse>('/products', {
        params: { keyword: query }
      });
      const pageData = response as unknown as Page<Product>;
      return pageData.content;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<ApiCategoriesResponse | ApiResponse<Page<Category>>>('/categories');

      // Check if the response is paginated (has content array)
      if (response && typeof response === 'object' && 'content' in response) {
        console.log('Received paginated categories response', response);
        return response.content as Category[];
      }

      // If it's already an array, return it directly
      if (Array.isArray(response)) {
        console.log('Received array categories response', response);
        return response as Category[];
      }

      // If it's another type of object but not an array or paginated, log and return empty array
      console.error('Unexpected categories response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    try {
      const response = await apiClient.get<ApiCategoryResponse>(`/categories/${id}`);
      return response as unknown as Category;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw error;
    }
  },

  // Get products by category ID
  getProductsByCategory: async (
    categoryId: number,
    page = 0,
    size = 10
  ): Promise<Page<Product>> => {
    try {
      const response = await apiClient.get<ApiProductsResponse>('/products', {
        params: {
          categoryId,
          page,
          size,
          sort: 'name,asc'
        }
      });
      return response as unknown as Page<Product>;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }
}; 