import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://madinaback.flaamingo.com/api',
  timeout: 5000, // 5-second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Axios retry configuration
axiosRetry(axiosInstance, {
  retries: 6, // Retry failed requests 3 times
  retryDelay: (retryCount) => retryCount * 1000, // Exponential backoff
  retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500,
});

// Utility function to handle the API response
const handleResponse = (response: any) => {
  if (!response || !response.data) {
    throw new Error('Invalid API response');
  }
  return response.data;
};

// Fetch trips
export const fetchTrips = async (token: string) => {
  try {
    const response = await axiosInstance.get('/trips', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network error, please try again later.');
  }
};
