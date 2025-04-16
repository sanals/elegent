import {
  ApiResponse,
  Page,
  Product,
  ProductCreateRequest,
  ProductResponse,
  ProductUpdateRequest
} from '../types/api-responses';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { apiFetch } from '../utils/api-fetch';
import { ApiService } from './api.service';

// Define base URL for direct API calls
const DIRECT_API_BASE_URL = 'http://localhost:8090';

export class ProductService {
  /**
   * Get all products with proper authentication
   * @returns Promise with paginated list of products
   */
  static async getAllProducts(): Promise<ApiResponse<Page<ProductResponse>>> {
    try {
      console.log('ProductService: Calling getAllProducts API');
      const response = await apiFetch(API_ENDPOINTS.PRODUCTS);

      if (!response.ok) {
        console.error('ProductService: API returned error status:', response.status);
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log('ProductService: API response data:', data);

      // Ensure data structure is correct
      if (!data || typeof data !== 'object') {
        console.error('ProductService: Invalid response data structure:', data);
        throw new Error('Invalid API response structure');
      }

      // Check if data is already in Page format
      if (data?.data?.content && Array.isArray(data.data.content)) {
        return data;
      }

      // Convert array response to Page format if needed
      if (data?.data && Array.isArray(data.data)) {
        const products = data.data;
        const pageData: Page<ProductResponse> = {
          content: products,
          pageable: {
            pageNumber: 0,
            pageSize: products.length,
            sort: { sorted: false, empty: true, unsorted: true },
            offset: 0,
            paged: true,
            unpaged: false
          },
          last: true,
          totalElements: products.length,
          totalPages: 1,
          first: true,
          size: products.length,
          number: 0,
          sort: { sorted: false, empty: true, unsorted: true },
          numberOfElements: products.length,
          empty: products.length === 0
        };

        return {
          ...data,
          data: pageData
        };
      }

      // If response is an array directly
      if (Array.isArray(data)) {
        const products = data;
        return {
          status: 'SUCCESS',
          code: 200,
          message: 'Products fetched successfully',
          data: {
            content: products,
            pageable: {
              pageNumber: 0,
              pageSize: products.length,
              sort: { sorted: false, empty: true, unsorted: true },
              offset: 0,
              paged: true,
              unpaged: false
            },
            last: true,
            totalElements: products.length,
            totalPages: 1,
            first: true,
            size: products.length,
            number: 0,
            sort: { sorted: false, empty: true, unsorted: true },
            numberOfElements: products.length,
            empty: products.length === 0
          },
          timestamp: new Date().toISOString()
        };
      }

      return data;
    } catch (error) {
      console.error('Products API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for products');

      try {
        const response = await ApiService.get<Product[]>(API_ENDPOINTS.PRODUCTS);

        // Convert the response to Page format
        if (response?.data && Array.isArray(response.data)) {
          const products = response.data;
          return {
            ...response,
            data: {
              content: products,
              pageable: {
                pageNumber: 0,
                pageSize: products.length,
                sort: { sorted: false, empty: true, unsorted: true },
                offset: 0,
                paged: true,
                unpaged: false
              },
              last: true,
              totalElements: products.length,
              totalPages: 1,
              first: true,
              size: products.length,
              number: 0,
              sort: { sorted: false, empty: true, unsorted: true },
              numberOfElements: products.length,
              empty: products.length === 0
            }
          };
        }

        // Return empty page if no data
        return {
          status: 'SUCCESS',
          code: 200,
          message: 'No products found',
          data: {
            content: [],
            pageable: {
              pageNumber: 0,
              pageSize: 0,
              sort: { sorted: false, empty: true, unsorted: true },
              offset: 0,
              paged: true,
              unpaged: false
            },
            last: true,
            totalElements: 0,
            totalPages: 0,
            first: true,
            size: 0,
            number: 0,
            sort: { sorted: false, empty: true, unsorted: true },
            numberOfElements: 0,
            empty: true
          },
          timestamp: new Date().toISOString()
        };
      } catch (fallbackError) {
        console.error('Fallback for products also failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Get a product by ID with proper authentication
   * @param id - Product ID
   * @returns Promise with product data
   */
  static async getProductById(id: number): Promise<ApiResponse<Product>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.PRODUCT_BY_ID(id));
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Product API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for product');
      return await ApiService.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
    }
  }

  /**
   * Create a new product with proper authentication
   * @param product - Product create request data
   * @returns Promise with created product data
   */
  static async createProduct(product: ProductCreateRequest): Promise<ApiResponse<Product>> {
    try {
      console.log('Creating product with data:', product);
      const response = await apiFetch(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log('Create product response:', data);
      return data;
    } catch (error) {
      console.error('Create product API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for create product');
      return await ApiService.post<Product>(API_ENDPOINTS.PRODUCTS, product);
    }
  }

  /**
   * Update an existing product with proper authentication
   * @param id - Product ID
   * @param product - Product update request data
   * @returns Promise with API response
   */
  static async updateProduct(id: number, product: ProductUpdateRequest): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.PRODUCT_BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(product),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update product API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for update product');
      return await ApiService.put<null>(API_ENDPOINTS.PRODUCT_BY_ID(id), product);
    }
  }

  /**
   * Delete a product with proper authentication
   * @param id - Product ID
   * @returns Promise with API response
   */
  static async deleteProduct(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.PRODUCT_BY_ID(id), {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete product API call error:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for delete product');
      return await ApiService.delete<null>(API_ENDPOINTS.PRODUCT_BY_ID(id));
    }
  }

  /**
   * Upload a product image with proper authentication
   * @param file - Image file to upload
   * @param productId - Optional product ID to associate with
   * @returns Promise with uploaded image URLs
   */
  static async uploadProductImage(file: File, productId?: number): Promise<ApiResponse<string[]>> {
    try {
      console.log('Uploading image file:', file.name, 'size:', file.size);

      // Create FormData and append file
      const formData = new FormData();
      // Use 'images' as parameter name to match the backend controller
      formData.append('images', file);

      if (productId) {
        formData.append('productId', productId.toString());
      }

      // Use direct fetch to ensure correct Content-Type handling
      const response = await apiFetch(API_ENDPOINTS.UPLOAD_PRODUCT_IMAGE, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - the browser will set it with the correct boundary
        headers: {}
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log('Upload response data:', data);
      return data;
    } catch (error) {
      console.error('Upload image API call error:', error);

      // Try direct fallback with fetch API
      try {
        console.log('Trying direct fetch fallback for image upload');

        const formData = new FormData();
        // Use 'images' as parameter name to match the backend controller
        formData.append('images', file);

        if (productId) {
          formData.append('productId', productId.toString());
        }

        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${DIRECT_API_BASE_URL}${API_ENDPOINTS.UPLOAD_PRODUCT_IMAGE}`, {
          method: 'POST',
          body: formData,
          headers
        });

        const data = await response.json();
        console.log('Direct fetch upload response:', data);
        return data;
      } catch (fallbackError) {
        console.error('Direct fallback upload failed:', fallbackError);

        // Last resort - try API service
        console.log('Falling back to ApiService for upload image');
        const additionalData = productId ? { productId } : undefined;
        // Pass file with the correct parameter name
        return await ApiService.uploadFile<string[]>(
          API_ENDPOINTS.UPLOAD_PRODUCT_IMAGE,
          file,
          additionalData,
          'images' // Parameter name to use for the file
        );
      }
    }
  }

  /**
   * Update product status with proper authentication
   * @param id - Product ID
   * @param status - New product status (ACTIVE or INACTIVE)
   * @returns Promise with updated product
   */
  static async updateProductStatus(id: number, status: 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse<ProductResponse>> {
    try {
      console.log(`Updating product ${id} status to ${status}`);
      const response = await apiFetch(API_ENDPOINTS.UPDATE_PRODUCT_STATUS(id) + `?status=${status}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        console.error('Server returned error updating product status:', response.status);
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log('Update status response:', data);
      return data;
    } catch (error) {
      console.error('Error updating product status:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for update product status');
      try {
        return await ApiService.put<ProductResponse>(
          `${API_ENDPOINTS.UPDATE_PRODUCT_STATUS(id)}?status=${status}`
        );
      } catch (fallbackError) {
        console.error('Fallback for update product status also failed:', fallbackError);
        return {
          status: 'ERROR',
          code: 500,
          message: `Error updating product status: ${error instanceof Error ? error.message : 'Unknown error'}`,
          data: null as unknown as ProductResponse,
          timestamp: new Date().toISOString()
        };
      }
    }
  }

  /**
   * Create product with images in a single API call
   * @param productData - Product data
   * @param imageFiles - Array of image files
   * @returns Promise with created product data
   */
  static async createProductWithImages(
    productData: ProductCreateRequest,
    imageFiles: File[]
  ): Promise<ApiResponse<Product | null>> {
    try {
      console.log('Creating product with images:', productData, `(${imageFiles.length} images)`);

      // Create FormData and append product data
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description || '');
      formData.append('price', productData.price.toString());
      formData.append('stock', productData.stock.toString());
      formData.append('categoryId', productData.categoryId.toString());
      formData.append('specifications', productData.specifications || '{}');

      // Append all image files with the same field name 'images'
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await apiFetch(API_ENDPOINTS.CREATE_PRODUCT_WITH_IMAGES, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with the correct boundary
        headers: {}
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', response.status, errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      // Get response as text first
      const responseText = await response.text();

      try {
        // Try to parse the text as JSON
        const data = JSON.parse(responseText) as ApiResponse<ProductResponse>;
        console.log('Create product with images response:', data);

        // Return success with simplified data if status is SUCCESS
        if (data.status === 'SUCCESS' && data.data) {
          return {
            status: data.status,
            code: data.code,
            message: data.message,
            data: {
              id: data.data.id,
              name: data.data.name,
              description: data.data.description,
              price: data.data.price,
              category: {
                id: data.data.category?.id || productData.categoryId,
                name: data.data.category?.name || 'Unknown',
                description: data.data.category?.description || '',
                parentCategory: undefined,
                status: 'ACTIVE',
                createdAt: data.data.createdAt || '',
                updatedAt: data.data.updatedAt || '',
                createdBy: data.data.createdBy || '',
                lastModifiedBy: data.data.lastModifiedBy || ''
              },
              specifications: data.data.specifications,
              images: data.data.images || [],
              stock: data.data.stock,
              featured: data.data.featured || false,
              status: data.data.status || 'ACTIVE',
              createdAt: data.data.createdAt,
              updatedAt: data.data.updatedAt,
              createdBy: data.data.createdBy || '',
              lastModifiedBy: data.data.lastModifiedBy || ''
            },
            timestamp: data.timestamp
          };
        } else {
          return data as unknown as ApiResponse<Product | null>;
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        // Return a simplified success response if we can't parse the JSON
        // This allows the UI to continue even with malformed JSON response
        if (response.status >= 200 && response.status < 300) {
          return {
            status: 'SUCCESS',
            code: response.status,
            message: 'Product created successfully (response parsing error)',
            data: {
              id: -1, // Placeholder ID
              name: productData.name,
              description: productData.description || '',
              price: productData.price,
              category: {
                id: productData.categoryId,
                name: 'Unknown',
                description: '',
                parentCategory: undefined,
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: '',
                lastModifiedBy: ''
              },
              specifications: productData.specifications || '{}',
              images: [],
              featured: false,
              stock: productData.stock,
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: '',
              lastModifiedBy: ''
            },
            timestamp: new Date().toISOString()
          };
        } else {
          throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
        }
      }
    } catch (error) {
      console.error('Create product with images API call error:', error);
      return {
        status: 'ERROR',
        code: 500,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Update product with images in a single API call
   * @param id - Product ID
   * @param productData - Product data
   * @param newImageFiles - Array of new image files to add
   * @returns Promise with updated product data
   */
  static async updateProductWithImages(
    id: number,
    productData: ProductUpdateRequest,
    newImageFiles: File[]
  ): Promise<ApiResponse<Product | null>> {
    try {
      console.log('Updating product with images:', id, productData, `(${newImageFiles.length} new images)`);

      // Create FormData and append product data
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description || '');
      formData.append('price', productData.price.toString());
      formData.append('stock', productData.stock.toString());
      formData.append('categoryId', productData.categoryId.toString());
      formData.append('specifications', productData.specifications || '{}');

      // Append existing image URLs if provided
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((url, index) => {
          formData.append(`existingImages[${index}]`, url);
        });
      }

      // Append all new image files with the same field name 'images'
      newImageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await apiFetch(API_ENDPOINTS.UPDATE_PRODUCT_WITH_IMAGES(id), {
        method: 'PUT',
        body: formData,
        // Don't set Content-Type header - browser will set it with the correct boundary
        headers: {}
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', response.status, errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      // Get response as text first
      const responseText = await response.text();

      try {
        // Try to parse the text as JSON
        const data = JSON.parse(responseText) as ApiResponse<ProductResponse>;
        console.log('Update product with images response:', data);

        // Return success with simplified data if status is SUCCESS
        if (data.status === 'SUCCESS' && data.data) {
          return {
            status: data.status,
            code: data.code,
            message: data.message,
            data: {
              id: data.data.id,
              name: data.data.name,
              description: data.data.description,
              price: data.data.price,
              category: {
                id: data.data.category?.id || productData.categoryId,
                name: data.data.category?.name || 'Unknown',
                description: data.data.category?.description || '',
                parentCategory: undefined,
                status: 'ACTIVE',
                createdAt: data.data.createdAt || '',
                updatedAt: data.data.updatedAt || '',
                createdBy: data.data.createdBy || '',
                lastModifiedBy: data.data.lastModifiedBy || ''
              },
              specifications: data.data.specifications,
              images: data.data.images || [],
              stock: data.data.stock,
              featured: data.data.featured || false,
              status: data.data.status || 'ACTIVE',
              createdAt: data.data.createdAt,
              updatedAt: data.data.updatedAt,
              createdBy: data.data.createdBy || '',
              lastModifiedBy: data.data.lastModifiedBy || ''
            },
            timestamp: data.timestamp
          };
        } else {
          return data as unknown as ApiResponse<Product | null>;
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        // Return a simplified success response if we can't parse the JSON
        // This allows the UI to continue even with malformed JSON response
        if (response.status >= 200 && response.status < 300) {
          return {
            status: 'SUCCESS',
            code: response.status,
            message: 'Product updated successfully (response parsing error)',
            data: {
              id: id,
              name: productData.name,
              description: productData.description || '',
              price: productData.price,
              category: {
                id: productData.categoryId,
                name: 'Unknown',
                description: '',
                parentCategory: undefined,
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: '',
                lastModifiedBy: ''
              },
              specifications: productData.specifications || '{}',
              images: productData.images || [],
              featured: false,
              stock: productData.stock,
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: '',
              lastModifiedBy: ''
            },
            timestamp: new Date().toISOString()
          };
        } else {
          throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
        }
      }
    } catch (error) {
      console.error('Update product with images API call error:', error);
      return {
        status: 'ERROR',
        code: 500,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Toggles whether a product is featured on the homepage
   * @param id Product ID
   * @param featured Whether the product should be featured
   * @returns ApiResponse with updated product
   */
  static async toggleProductFeatured(id: number, featured: boolean): Promise<ApiResponse<ProductResponse>> {
    try {
      console.log(`Toggling featured status for product ${id} to ${featured}`);
      const response = await apiFetch(API_ENDPOINTS.TOGGLE_PRODUCT_FEATURED(id) + `?featured=${featured}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        console.error('Server returned error toggling product featured status:', response.status);
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      console.log('Toggle featured response:', data);
      return data;
    } catch (error) {
      console.error('Error toggling product featured status:', error);
      // Fallback to proxy in case of issues
      console.log('Falling back to proxy for toggle product featured');
      try {
        return await ApiService.put<ProductResponse>(
          `${API_ENDPOINTS.TOGGLE_PRODUCT_FEATURED(id)}?featured=${featured}`
        );
      } catch (fallbackError) {
        console.error('Fallback for toggle product featured also failed:', fallbackError);
        return {
          status: 'ERROR',
          code: 500,
          message: `Error updating featured status: ${error instanceof Error ? error.message : 'Unknown error'}`,
          data: null as unknown as ProductResponse,
          timestamp: new Date().toISOString()
        };
      }
    }
  }
} 