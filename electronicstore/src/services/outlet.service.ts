import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface OutletLocation {
    id: number;
    name: string;
    address: string;
    contactNumber: string;
    email?: string;
    openingTime?: string;
    closingTime?: string;
    latitude?: number;
    longitude?: number;
    mapUrl?: string;
    state: {
        id: number;
        name: string;
    };
    city: {
        id: number;
        name: string;
    };
    locality: {
        id: number;
        name: string;
        pincode: string;
    };
    active: boolean;
}

export interface ApiResponse<T> {
    status: 'SUCCESS' | 'ERROR';
    code: number;
    message: string;
    data: T;
    timestamp: string;
}

export const OutletService = {
    /**
     * Get all outlets
     * @returns Promise with all active outlets
     */
    getAllOutlets: async (): Promise<ApiResponse<OutletLocation[]>> => {
        try {
            const response = await api.get<ApiResponse<OutletLocation[]>>('/outlets?active=true');
            return response.data;
        } catch (error) {
            console.error('Error fetching outlets:', error);
            throw error;
        }
    },

    /**
     * Get all states with outlets
     * @returns Promise with all states that have outlets
     */
    getStatesWithOutlets: async (): Promise<ApiResponse<{ id: number; name: string }[]>> => {
        try {
            const response = await api.get<ApiResponse<{ id: number; name: string }[]>>('/states');
            return response.data;
        } catch (error) {
            console.error('Error fetching states:', error);
            throw error;
        }
    },

    /**
     * Get cities by state ID
     * @param stateId State ID
     * @returns Promise with cities in the specified state
     */
    getCitiesByState: async (stateId: number): Promise<ApiResponse<{ id: number; name: string }[]>> => {
        try {
            const response = await api.get<ApiResponse<{ id: number; name: string }[]>>(`/cities/by-state/${stateId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching cities for state ${stateId}:`, error);
            throw error;
        }
    },

    /**
     * Get localities by city ID
     * @param cityId City ID
     * @returns Promise with localities in the specified city
     */
    getLocalitiesByCity: async (cityId: number): Promise<ApiResponse<{ id: number; name: string; pincode: string }[]>> => {
        try {
            const response = await api.get<ApiResponse<{ id: number; name: string; pincode: string }[]>>(`/localities/by-city/${cityId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching localities for city ${cityId}:`, error);
            throw error;
        }
    },

    /**
     * Get outlets by state ID
     * @param stateId State ID
     * @returns Promise with outlets in the specified state
     */
    getOutletsByState: async (stateId: number): Promise<ApiResponse<OutletLocation[]>> => {
        try {
            const response = await api.get<ApiResponse<OutletLocation[]>>(`/outlets/by-state/${stateId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching outlets for state ${stateId}:`, error);
            throw error;
        }
    },

    /**
     * Get outlets by city ID
     * @param cityId City ID
     * @returns Promise with outlets in the specified city
     */
    getOutletsByCity: async (cityId: number): Promise<ApiResponse<OutletLocation[]>> => {
        try {
            const response = await api.get<ApiResponse<OutletLocation[]>>(`/outlets/by-city/${cityId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching outlets for city ${cityId}:`, error);
            throw error;
        }
    },

    /**
     * Get outlets by locality ID
     * @param localityId Locality ID
     * @returns Promise with outlets in the specified locality
     */
    getOutletsByLocality: async (localityId: number): Promise<ApiResponse<OutletLocation[]>> => {
        try {
            const response = await api.get<ApiResponse<OutletLocation[]>>(`/outlets/by-locality/${localityId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching outlets for locality ${localityId}:`, error);
            throw error;
        }
    }
}; 