import { ApiResponse, CityResponse, LocalityResponse, StateResponse } from '../types/api-responses';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { apiFetch } from '../utils/api-fetch';

export class LocationService {
  /**
   * Get all states
   * @returns Promise with list of states
   */
  static async getAllStates(): Promise<ApiResponse<StateResponse[]>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.STATES);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('States API call error:', error);
      throw error;
    }
  }

  /**
   * Get cities by state ID
   * @param stateId - State ID
   * @returns Promise with list of cities
   */
  static async getCitiesByState(stateId: number): Promise<ApiResponse<CityResponse[]>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CITIES_BY_STATE(stateId));
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Cities by state API call error:', error);
      throw error;
    }
  }

  /**
   * Get localities by city ID
   * @param cityId - City ID
   * @returns Promise with list of localities
   */
  static async getLocalitiesByCity(cityId: number): Promise<ApiResponse<LocalityResponse[]>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.LOCALITIES_BY_CITY(cityId));
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Localities by city API call error:', error);
      throw error;
    }
  }

  /**
   * Create a new state
   * @param stateData - State data with name and code
   * @returns Promise with created state
   */
  static async createState(stateData: { name: string }): Promise<ApiResponse<StateResponse>> {
    try {
      // Adding a code derived from name (first 2 letters uppercase)
      const stateCode = stateData.name.substring(0, 2).toUpperCase();

      const response = await apiFetch(API_ENDPOINTS.STATES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: stateData.name,
          code: stateCode,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create state API call error:', error);
      throw error;
    }
  }

  /**
   * Create a new city
   * @param cityData - City data with name and stateId
   * @returns Promise with created city
   */
  static async createCity(cityData: {
    name: string;
    stateId: number;
  }): Promise<ApiResponse<CityResponse>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.CITIES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cityData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create city API call error:', error);
      throw error;
    }
  }

  /**
   * Create a new locality
   * @param localityData - Locality data with name, pincode and cityId
   * @returns Promise with created locality
   */
  static async createLocality(localityData: {
    name: string;
    pincode: string;
    cityId: number;
  }): Promise<ApiResponse<LocalityResponse>> {
    try {
      const response = await apiFetch(API_ENDPOINTS.LOCALITIES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localityData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create locality API call error:', error);
      throw error;
    }
  }
}
