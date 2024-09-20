import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create an Axios instance with base URL and timeout
const axiosInstance = axios.create({
  baseURL: 'https://madinaback.flaamingo.com/api',
  timeout: 5000, // 5-second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Axios retry configuration for handling retries in case of failure
axiosRetry(axiosInstance, {
  retries: 7, // Retry failed requests 3 times
  retryDelay: (retryCount) => retryCount * 1000, // Exponential backoff: 1s, 2s, 3s
  retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500,
});

// Fetch seats for the user booking page
export const fetchSeats = async (tripId, token) => {
  try {
    const response = await axiosInstance.get(`/users/trips/${tripId}/seats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching seats');
  }
};

// Book seats
export const bookSeats = async (tripId, seatIds, paymentCode, token) => {
  try {
    const response = await axiosInstance.post(
      `/users/trips/${tripId}/seats/book`,
      {
        seat_ids: seatIds,
        payment_code: paymentCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error booking seats');
  }
};

// Update payment code for a seat
export const updatePaymentCode = async (tripId, seatId, paymentCode, token) => {
  try {
    const response = await axiosInstance.post(
      `/users/trips/${tripId}/seats/${seatId}/update`,
      {
        payment_code: paymentCode,
        '_method': "PUT",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating payment code');
  }
};