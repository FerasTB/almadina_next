// services/tripService.ts
import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create an Axios instance with a base URL and timeout
const axiosInstance = axios.create({
  baseURL: 'https://madinaback.flaamingo.com/api',
  timeout: 5000, // 5 seconds timeout for all requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add retry mechanism with exponential backoff
axiosRetry(axiosInstance, {
  retries: 7, // Retry up to 3 times
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Exponential backoff: 1s, 2s, 3s
  },
  retryCondition: (error) => {
    // Retry only if it's a network error or a 5xx response
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
  },
});

// Utility function to handle the response
const handleResponse = (response: any) => {
  // Ensure the response structure is valid
  if (!response.data || typeof response.data !== 'object') {
    throw new Error('Invalid response format');
  }

  return response.data.data;
};

// Utility function to handle errors
const handleError = (error: any) => {
  // Log detailed error for debugging
  console.error('API error:', error);
  
  if (error.response) {
    // Server-side error (status code out of 2xx range)
    throw new Error(`Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
  } else if (error.request) {
    // No response received
    throw new Error('No response from the server. Please check your network connection.');
  } else {
    // Other errors like timeout
    throw new Error(error.message || 'An unknown error occurred.');
  }
};

// Function to fetch trips
export const fetchTrips = async (token: string) => {
  try {
    const response = await axiosInstance.get('/trips', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Function to delete a trip
export const deleteTrip = async (id: number, token: string) => {
  try {
    const response = await axiosInstance.delete(`/trips/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
