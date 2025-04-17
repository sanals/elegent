/**
 * API Endpoints for the Electronics Store Admin
 * These paths are relative to the API base URL which already includes http://localhost:8090
 */

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/v1/auth/login',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',
  LOGOUT: '/api/v1/auth/logout',
  CHANGE_PASSWORD: '/api/v1/auth/change-password',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password',

  // Users endpoints
  USERS: '/api/v1/users',
  CREATE_USER: '/api/v1/users/create',
  USER_BY_ID: (id: number) => `/api/v1/users/${id}`,
  UPDATE_USER_STATUS: (id: number) => `/api/v1/users/${id}/status`,

  // Products endpoints
  PRODUCTS: '/api/v1/products',
  PRODUCT_BY_ID: (id: number) => `/api/v1/products/${id}`,
  UPLOAD_PRODUCT_IMAGE: '/api/v1/products/upload-image',
  UPDATE_PRODUCT_STATUS: (id: number) => `/api/v1/products/${id}/status`,
  TOGGLE_PRODUCT_FEATURED: (id: number) => `/api/v1/products/${id}/featured`,
  CREATE_PRODUCT_WITH_IMAGES: '/api/v1/products/with-images',
  UPDATE_PRODUCT_WITH_IMAGES: (id: number) => `/api/v1/products/${id}/with-images`,

  // Categories endpoints
  CATEGORIES: '/api/v1/categories',
  CATEGORY_BY_ID: (id: number) => `/api/v1/categories/${id}`,
  CREATE_CATEGORY_WITH_IMAGE: '/api/v1/categories/with-image',
  UPDATE_CATEGORY_WITH_IMAGE: (id: number) => `/api/v1/categories/${id}/with-image`,
  UPDATE_CATEGORY_STATUS: (id: number) => `/api/v1/categories/${id}/status`,

  // Outlets endpoints
  OUTLETS: '/api/v1/outlets',
  OUTLET_BY_ID: (id: number) => `/api/v1/outlets/${id}`,
  ACTIVE_OUTLETS: '/api/v1/outlets/active',
  OUTLETS_BY_LOCALITY: (localityId: number) => `/api/v1/outlets/by-locality/${localityId}`,
  OUTLETS_BY_CITY: (cityId: number) => `/api/v1/outlets/by-city/${cityId}`,
  OUTLETS_BY_STATE: (stateId: number) => `/api/v1/outlets/by-state/${stateId}`,

  // Location endpoints
  STATES: '/api/v1/states',
  CITIES: '/api/v1/cities',
  LOCALITIES: '/api/v1/localities',
  CITIES_BY_STATE: (stateId: number) => `/api/v1/cities/by-state/${stateId}`,
  LOCALITIES_BY_CITY: (cityId: number) => `/api/v1/localities/by-city/${cityId}`,

  // Settings endpoints
  SETTINGS: '/api/v1/settings',
  SETTING_BY_KEY: (key: string) => `/api/v1/settings/${key}`,
  SETTINGS_BY_GROUP: (group: string) => `/api/v1/settings?group=${group}`,
  HOMEPAGE_SETTINGS: '/api/v1/settings/homepage',

  // Health check endpoints
  HEALTH: '/api/v1/health',
  HEALTH_INFO: '/api/v1/health/info'
}; 