import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api/v1', // The base URL for our API
  withCredentials: true, // This is crucial for sending the session cookie
});

// Function to set the CSRF token on the axios instance
export const setCsrfToken = (token) => {
  api.defaults.headers.common['x-csrf-token'] = token;
};

export default api; 