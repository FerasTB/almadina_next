// pages/api/users.js
import axios from 'axios';

export default async function handler(req, res) {
  const { method } = req;
  const token = req.headers.authorization;

  if (method === 'GET') {
    try {
      const response = await axios.get('https://madinaback.flaamingo.com/api/admin/non-admin', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
        },
      });
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(error.response?.status || 500).json({ error: 'Failed to fetch users' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
