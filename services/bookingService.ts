import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'https://madinaback.flaamingo.com/api/admin',
  timeout: 5000, // Set a timeout of 5 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Axios retry configuration to handle transient errors (network or 5xx responses)
axiosRetry(axiosInstance, {
  retries: 7, // Retry failed requests 3 times
  retryDelay: (retryCount) => retryCount * 1000, // Exponential backoff: 1s, 2s, 3s
  retryCondition: (error) => {
    // Retry only if the error is a network error or a 5xx response
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500 || error.response?.status === 429;
  },
});

// Utility function to handle the API response
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
    // Server-side error (non 2xx response)
    throw new Error(error.response.data?.message || `Error: ${error.response.status}`);
  } else if (error.request) {
    // No response was received
    throw new Error('No response from the server. Please check your network connection.');
  } else {
    // Other unknown errors
    throw new Error(error.message || 'An unknown error occurred.');
  }
};

// Fetch bookings for a specific trip
export const fetchBookings = async (tripId: number, token: string) => {
  try {
    const response = await axiosInstance.get(`/trips/${tripId}/seats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Fetch non-admin users
export const fetchUsers = async (token: string) => {
  try {
    const response = await axiosInstance.get('/non-admin', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

// Approve or reject bookings
export const handleBookingAction = async (
  action: 'approve' | 'reject',
  bookingIds: number[],
  token: string,
  userId?: number
) => {
  try {
    const response = await axiosInstance.post(
      `/bookings/${action}`,
      {
        booking_ids: bookingIds,
        user_id: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
