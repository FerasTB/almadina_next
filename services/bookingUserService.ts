import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://madinaback.flaamingo.com/api',
  timeout: 7000, // 5 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Axios retry configuration
axiosRetry(axiosInstance, {
  retries: 10, // Retry failed requests 3 times
  retryDelay: (retryCount) => retryCount * 1000, // Exponential backoff: 1s, 2s, 3s
  retryCondition: (error) => {
    // Retry only if the error is a network error or a 5xx server response
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
  },
});

// Utility function to handle API response
const handleResponse = (response: any) => {
  if (!response || !response.data) {
    throw new Error('Invalid API response');
  }
  return response.data;
};

// Utility function to handle errors
const handleError = (error: any) => {
  console.error('API error:', error);
  if (error.response) {
    throw new Error(error.response.data?.message || `Error: ${error.response.status}`);
  } else if (error.request) {
    throw new Error('No response from the server. Please check your network connection.');
  } else {
    throw new Error(error.message || 'An unknown error occurred.');
  }
};

// Fetch user bookings
export const fetchUserBookings = async (token: string) => {
  try {
    const response = await axiosInstance.get('/users/bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
