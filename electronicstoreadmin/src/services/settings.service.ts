import { ApiResponse } from '../types/api-responses';
import { API_ENDPOINTS } from '../utils/api-endpoints';
import { ApiService } from './api.service';

interface HomepageSettings {
  featuredProductsCount: number;
  latestProductsCount: number;
}

export class SettingsService {
  /**
   * Get homepage settings
   * @returns Promise with homepage settings
   */
  static async getHomepageSettings(): Promise<ApiResponse<HomepageSettings>> {
    try {
      return await ApiService.get<HomepageSettings>(API_ENDPOINTS.HOMEPAGE_SETTINGS);
    } catch (error) {
      console.error('Error getting homepage settings:', error);
      throw error;
    }
  }

  /**
   * Save homepage settings
   * @param settings Homepage settings
   * @returns Promise with saved homepage settings
   */
  static async saveHomepageSettings(
    settings: HomepageSettings
  ): Promise<ApiResponse<HomepageSettings>> {
    try {
      return await ApiService.post<HomepageSettings>(API_ENDPOINTS.HOMEPAGE_SETTINGS, settings);
    } catch (error) {
      console.error('Error saving homepage settings:', error);
      throw error;
    }
  }
}
