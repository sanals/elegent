// API endpoint constants and API keys

// Google Maps API Key using Vite's environment variables
// If the environment variable is not set, fall back to default (should not happen in production)
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Base API URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api/v1';

// API version
export const API_VERSION = 'v1';

// Other API-related constants can be added here 