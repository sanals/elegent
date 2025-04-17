import {
  ApiResponse,
  Category,
  CategoryCreateRequest,
  CategoryResponse,
  CategoryUpdateRequest,
  Page,
} from '../types/api-responses';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { apiFetch } from '../utils/api-fetch';
import { ApiService } from './api.service';

// Define base URL for direct API calls
const DIRECT_API_BASE_URL = 'http://localhost:8090';

export class CategoryService {
  /**
   * Get all categories with proper authentication
   * @returns Promise with paginated list of categories
   */
  static async getAllCategories(): Promise<ApiResponse<Page<CategoryResponse>>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CATEGORIES);
      const data = await response.json();

      // Check if data is already in Page format
      if (data?.data?.content && Array.isArray(data.data.content)) {
        return data;
      }

      // Convert array response to Page format if needed
      if (data?.data && Array.isArray(data.data)) {
        const categories = data.data;
        const pageData: Page<CategoryResponse> = {
          content: categories,
          pageable: {
            pageNumber: 0,
            pageSize: categories.length,
            sort: { sorted: false, empty: true, unsorted: true },
            offset: 0,
            paged: true,
            unpaged: false,
          },
          last: true,
          totalElements: categories.length,
          totalPages: 1,
          first: true,
          size: categories.length,
          number: 0,
          sort: { sorted: false, empty: true, unsorted: true },
          numberOfElements: categories.length,
          empty: categories.length === 0,
        };

        return {
          ...data,
          data: pageData,
        };
      }

      // If response is an array directly
      if (Array.isArray(data)) {
        const categories = data;
        return {
          status: 'SUCCESS',
          code: 200,
          message: 'Categories fetched successfully',
          data: {
            content: categories,
            pageable: {
              pageNumber: 0,
              pageSize: categories.length,
              sort: { sorted: false, empty: true, unsorted: true },
              offset: 0,
              paged: true,
              unpaged: false,
            },
            last: true,
            totalElements: categories.length,
            totalPages: 1,
            first: true,
            size: categories.length,
            number: 0,
            sort: { sorted: false, empty: true, unsorted: true },
            numberOfElements: categories.length,
            empty: categories.length === 0,
          },
          timestamp: new Date().toISOString(),
        };
      }

      // Default to empty page if unable to parse
      console.error('Unexpected category API response format:', data);
      return {
        status: 'SUCCESS',
        code: 200,
        message: 'Unable to parse categories data',
        data: {
          content: [],
          pageable: {
            pageNumber: 0,
            pageSize: 0,
            sort: { sorted: false, empty: true, unsorted: true },
            offset: 0,
            paged: true,
            unpaged: false,
          },
          last: true,
          totalElements: 0,
          totalPages: 0,
          first: true,
          size: 0,
          number: 0,
          sort: { sorted: false, empty: true, unsorted: true },
          numberOfElements: 0,
          empty: true,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Categories API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for categories');

      try {
        const response = await ApiService.get<Category[]>(API_ENDPOINTS.CATEGORIES);

        // Convert the response to Page format
        if (response?.data && Array.isArray(response.data)) {
          const categories = response.data;
          return {
            ...response,
            data: {
              content: categories,
              pageable: {
                pageNumber: 0,
                pageSize: categories.length,
                sort: { sorted: false, empty: true, unsorted: true },
                offset: 0,
                paged: true,
                unpaged: false,
              },
              last: true,
              totalElements: categories.length,
              totalPages: 1,
              first: true,
              size: categories.length,
              number: 0,
              sort: { sorted: false, empty: true, unsorted: true },
              numberOfElements: categories.length,
              empty: categories.length === 0,
            },
          };
        }

        // Return empty page if no data
        return {
          status: 'SUCCESS',
          code: 200,
          message: 'No categories found',
          data: {
            content: [],
            pageable: {
              pageNumber: 0,
              pageSize: 0,
              sort: { sorted: false, empty: true, unsorted: true },
              offset: 0,
              paged: true,
              unpaged: false,
            },
            last: true,
            totalElements: 0,
            totalPages: 0,
            first: true,
            size: 0,
            number: 0,
            sort: { sorted: false, empty: true, unsorted: true },
            numberOfElements: 0,
            empty: true,
          },
          timestamp: new Date().toISOString(),
        };
      } catch (fallbackError) {
        console.error('Fallback for categories also failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Get a category by ID with proper authentication
   * @param id - Category ID
   * @returns Promise with category data
   */
  static async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CATEGORY_BY_ID(id));
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Category API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for category');
      return await ApiService.get<Category>(API_ENDPOINTS.CATEGORY_BY_ID(id));
    }
  }

  /**
   * Create a new category with proper authentication
   * @param category - Category create request data
   * @returns Promise with created category ID
   */
  static async createCategory(
    category: CategoryCreateRequest
  ): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CATEGORIES, {
        method: 'POST',
        body: JSON.stringify(category),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create category API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for create category');
      return await ApiService.post<CategoryResponse>(API_ENDPOINTS.CATEGORIES, category);
    }
  }

  /**
   * Update an existing category with proper authentication
   * @param id - Category ID
   * @param category - Category update request data
   * @returns Promise with API response
   */
  static async updateCategory(
    id: number,
    category: CategoryUpdateRequest
  ): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CATEGORY_BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(category),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update category API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for update category');
      return await ApiService.put<null>(API_ENDPOINTS.CATEGORY_BY_ID(id), category);
    }
  }

  /**
   * Delete a category with proper authentication
   * @param id - Category ID
   * @returns Promise with API response
   */
  static async deleteCategory(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CATEGORY_BY_ID(id), {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete category API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for delete category');
      return await ApiService.delete<null>(API_ENDPOINTS.CATEGORY_BY_ID(id));
    }
  }

  /**
   * Create a new category with image
   * @param formData - FormData containing category data and image
   * @returns Promise with created category
   */
  static async createCategoryWithImage(formData: FormData): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await fetch(
        `${DIRECT_API_BASE_URL}${API_ENDPOINTS.CREATE_CATEGORY_WITH_IMAGE}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create category with image API call error:', error);
      throw error;
    }
  }

  /**
   * Update a category with image
   * @param id - Category ID
   * @param formData - FormData containing category data and image
   * @returns Promise with updated category
   */
  static async updateCategoryWithImage(
    id: number,
    formData: FormData
  ): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await fetch(
        `${DIRECT_API_BASE_URL}${API_ENDPOINTS.UPDATE_CATEGORY_WITH_IMAGE(id)}`,
        {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update category with image API call error:', error);
      throw error;
    }
  }

  /**
   * Update category status with proper authentication
   * @param id - Category ID
   * @param status - New status
   * @returns Promise with API response
   */
  static async updateCategoryStatus(
    id: number,
    status: 'ACTIVE' | 'INACTIVE'
  ): Promise<ApiResponse<null>> {
    try {
      console.log(`Updating category ${id} status to ${status}`);

      // Use the dedicated status endpoint with status as a query parameter
      const response = await apiFetch(
        `${API_ENDPOINTS.UPDATE_CATEGORY_STATUS(id)}?status=${status}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Improve error handling
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error updating category status:', response.status, errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      try {
        const data = await response.json();
        return data;
      } catch (parseError) {
        console.error('Error parsing JSON response for category status update:', parseError);
        // If response is ok but JSON parsing failed, return a success response
        if (response.ok) {
          return {
            status: 'SUCCESS',
            code: response.status,
            message: 'Category status updated successfully',
            data: null,
            timestamp: new Date().toISOString(),
          };
        } else {
          throw parseError;
        }
      }
    } catch (error) {
      console.error('Update category status API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for update category status');

      try {
        // Try the proxy approach, also using query parameters
        return await ApiService.put<null>(
          `${API_ENDPOINTS.UPDATE_CATEGORY_STATUS(id)}?status=${status}`,
          null
        );
      } catch (fallbackError) {
        console.error('Fallback for update category status also failed:', fallbackError);
        return {
          status: 'ERROR',
          code: 500,
          message: `Error updating category status: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`,
          data: null,
          timestamp: new Date().toISOString(),
        };
      }
    }
  }
}
