// pages/api/bookings.js
import axios from 'axios';

export default async function handler(req, res) {
  const { method, query } = req;
  const { tripId, action } = query; // Extract tripId and action from query parameters
  const token = req.headers.authorization;

  if (method === 'GET') {
    try {
      const response = await axios.get(`https://madinaback.flaamingo.com/api/admin/trips/${tripId}/seats`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(error.response?.status || 500).json({ error: 'Failed to fetch bookings' });
    }
  } else if (method === 'POST') {
    // Handle actions like approve/reject
    try {
      const response = await axios.post(`https://madinaback.flaamingo.com/api/admin/bookings/${action}`, req.body, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      console.error(`Error performing action ${action} on bookings:`, error);
      res.status(error.response?.status || 500).json({ error: `Failed to ${action} bookings` });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
