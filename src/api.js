import axios from 'axios';

// Создаем экземпляр axios
const api = axios.create({
  baseURL: '/api/v1', // Базовый URL для нашего API
  withCredentials: true, // Это критически важно для отправки cookie сессии
});

// Функция для установки CSRF-токена в экземпляр axios
export const setCsrfToken = (token) => {
  api.defaults.headers.common['x-csrf-token'] = token;
};

export default api; 