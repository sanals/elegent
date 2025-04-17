import {
    ApiResponse,
    OutletCreateRequest,
    OutletResponse,
    OutletUpdateRequest,
    Page
} from '../types/api-responses';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { apiFetch } from '../utils/api-fetch';

export class OutletService {
    /**
     * Get all outlets with proper authentication
     * @returns Promise with paginated list of outlets
     */
    static async getAllOutlets(page = 0, size = 10): Promise<ApiResponse<Page<OutletResponse>>> {
        try {
            console.log('OutletService: Calling getAllOutlets API');
            const url = `${API_ENDPOINTS.OUTLETS}?page=${page}&size=${size}`;
            const response = await apiFetch(url);

            if (!response.ok) {
                console.error('OutletService: API returned error status:', response.status);
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            console.log('OutletService: API response data:', data);

            return data;
        } catch (error) {
            console.error('Outlets API call error:', error);
            throw error;
        }
    }

    /**
     * Get active outlets with proper authentication
     * @returns Promise with list of active outlets
     */
    static async getActiveOutlets(): Promise<ApiResponse<OutletResponse[]>> {
        try {
            console.log('OutletService: Calling getActiveOutlets API');
            const response = await apiFetch(API_ENDPOINTS.ACTIVE_OUTLETS);

            if (!response.ok) {
                console.error('OutletService: API returned error status:', response.status);
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            console.log('OutletService: API response data:', data);

            return data;
        } catch (error) {
            console.error('Active outlets API call error:', error);
            throw error;
        }
    }

    /**
     * Get an outlet by ID with proper authentication
     * @param id - Outlet ID
     * @returns Promise with outlet data
     */
    static async getOutletById(id: number): Promise<ApiResponse<OutletResponse>> {
        try {
            const response = await apiFetch(API_ENDPOINTS.OUTLET_BY_ID(id));
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Outlet API call error:', error);
            throw error;
        }
    }

    /**
     * Create a new outlet with proper authentication
     * @param outlet - Outlet create request data
     * @returns Promise with created outlet data
     */
    static async createOutlet(outlet: OutletCreateRequest): Promise<ApiResponse<OutletResponse>> {
        try {
            const response = await apiFetch(API_ENDPOINTS.OUTLETS, {
                method: 'POST',
                body: JSON.stringify(outlet)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Create outlet API call error:', error);
            throw error;
        }
    }

    /**
     * Update an existing outlet with proper authentication
     * @param id - Outlet ID
     * @param outlet - Outlet update request data
     * @returns Promise with updated outlet data
     */
    static async updateOutlet(id: number, outlet: OutletUpdateRequest): Promise<ApiResponse<OutletResponse>> {
        try {
            const response = await apiFetch(API_ENDPOINTS.OUTLET_BY_ID(id), {
                method: 'PUT',
                body: JSON.stringify(outlet)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Update outlet API call error:', error);
            throw error;
        }
    }

    /**
     * Delete an outlet with proper authentication
     * @param id - Outlet ID
     * @returns Promise with success/failure response
     */
    static async deleteOutlet(id: number): Promise<ApiResponse<null>> {
        try {
            const response = await apiFetch(API_ENDPOINTS.OUTLET_BY_ID(id), {
                method: 'DELETE'
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Delete outlet API call error:', error);
            throw error;
        }
    }

    /**
     * Get outlets by locality ID
     * @param localityId - Locality ID
     * @returns Promise with list of outlets
     */
    static async getOutletsByLocality(localityId: number): Promise<ApiResponse<OutletResponse[]>> {
        try {
            const response = await apiFetch(API_ENDPOINTS.OUTLETS_BY_LOCALITY(localityId));
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Outlets by locality API call error:', error);
            throw error;
        }
    }

    /**
     * Get outlets by city ID
     * @param cityId - City ID
     * @returns Promise with list of outlets
     */
    static async getOutletsByCity(cityId: number): Promise<ApiResponse<OutletResponse[]>> {
        try {
            const response = await apiFetch(API_ENDPOINTS.OUTLETS_BY_CITY(cityId));
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Outlets by city API call error:', error);
            throw error;
        }
    }

    /**
     * Get outlets by state ID
     * @param stateId - State ID
     * @returns Promise with list of outlets
     */
    static async getOutletsByState(stateId: number): Promise<ApiResponse<OutletResponse[]>> {
        try {
            const response = await apiFetch(API_ENDPOINTS.OUTLETS_BY_STATE(stateId));
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Outlets by state API call error:', error);
            throw error;
        }
    }
} 