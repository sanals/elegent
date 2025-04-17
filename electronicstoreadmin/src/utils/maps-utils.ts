/**
 * Google Maps utility functions for the admin dashboard
 */
import { GOOGLE_MAPS_API_KEY } from '../constants/api';

// Validate if API key is available
if (!GOOGLE_MAPS_API_KEY) {
  console.error(
    'Google Maps API key is missing! Add it to your .env file as VITE_GOOGLE_MAPS_API_KEY'
  );
}

/**
 * Loads the Google Maps API script once
 * @returns Promise that resolves when the API is loaded
 */
export const loadGoogleMapsApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    if (document.getElementById('google-maps-script')) {
      // If script is loading, wait for it
      const checkGoogleMapsLoaded = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogleMapsLoaded);
          resolve();
        }
      }, 100);

      // Set timeout to avoid infinite waiting
      setTimeout(() => {
        clearInterval(checkGoogleMapsLoaded);
        if (!window.google) {
          reject(new Error('Google Maps failed to load within the timeout period'));
        }
      }, 10000);

      return;
    }

    // Load the script
    const googleMapsScript = document.createElement('script');
    googleMapsScript.id = 'google-maps-script';
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;

    // Set event listeners
    googleMapsScript.addEventListener('load', () => {
      console.log('Google Maps API loaded');
      resolve();
    });

    googleMapsScript.addEventListener('error', e => {
      console.error('Error loading Google Maps API', e);
      reject(new Error('Failed to load Google Maps API'));
    });

    // Add to document
    document.head.appendChild(googleMapsScript);
  });
};

/**
 * Creates a Google Maps URL from latitude and longitude
 * @param lat latitude value
 * @param lng longitude value
 * @returns Google Maps URL string
 */
export const createGoogleMapsUrl = (lat: number | null, lng: number | null): string => {
  if (lat === null || lng === null) {
    return '';
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};

/**
 * Fetches location name (formatted address) from coordinates using Google Maps Geocoding API
 * @param lat latitude value
 * @param lng longitude value
 * @returns Promise that resolves to the formatted address string or empty string if not found
 */
export const fetchLocationNameFromCoordinates = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    // Check if API key exists
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is missing. Check your environment variables.');
      return '';
    }

    // Use the Google Maps Geocoding API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      console.warn('No geocoding results found:', data.status);
      return '';
    }
  } catch (error) {
    console.error('Error fetching location name:', error);
    return '';
  }
};
