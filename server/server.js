const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = 3001; // Порт для нашего бэкенд-сервера

// Настройка Middleware
// Включаем CORS для нашего React-приложения, которое будет работать на порту 3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Разрешаем отправку cookie
}));

// Для парсинга JSON-тел запросов
app.use(express.json());
// Для парсинга URL-encoded тел запросов
app.use(express.urlencoded({ extended: true }));

// Middleware для сессий
// В реальном приложении используйте постоянное хранилище сессий, например, connect-redis.
app.use(session({
  secret: 'a_very_secret_key_for_signing_session_id',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // В production установите true и используйте HTTPS
    httpOnly: true, // Запрещает доступ к cookie сессии из клиентского JS
    maxAge: 1000 * 60 * 60 * 24 // 1 день
  }
}));

// Middleware для защиты от CSRF
const csrfProtection = (req, res, next) => {
  // Генерируем CSRF-секрет в сессии, если он не существует
  if (!req.session.csrfSecret) {
    req.session.csrfSecret = crypto.randomBytes(32).toString('hex');
  }

  // Проверяем токен на "небезопасных" методах
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    const tokenFromRequest = req.headers['x-csrf-token'];
    
    if (!tokenFromRequest || tokenFromRequest !== req.session.csrfSecret) {
      console.error('CSRF Token Mismatch!');
      console.error(`Token from request: ${tokenFromRequest}`);
      console.error(`Token from session: ${req.session.csrfSecret}`);
      return res.status(403).send('Forbidden: Invalid CSRF token');
    }
  }

  next();
};

// Применяем CSRF-защиту ко всем маршрутам
app.use(csrfProtection);


// Маршруты API
app.get('/api/v1/csrf-token', (req, res) => {
  // Отправляем токен клиенту
  res.json({ csrfToken: req.session.csrfSecret });
});

app.post('/api/v1/submit', (req, res) => {
  const { message } = req.body;
  console.log('Received data:', message);
  res.json({ success: true, message: `Server received your message: "${message}"` });
});


// Запуск сервера
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('This server provides CSRF tokens and handles protected API calls.');
}); 