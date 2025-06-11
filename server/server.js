const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = 3001; // Port for our backend server

// Middleware Setup
// Enable CORS for our React app which will run on port 3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
}));

// To parse JSON bodies
app.use(express.json());
// To parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Session Middleware
// In a real app, use a persistent session store like connect-redis.
app.use(session({
  secret: 'a_very_secret_key_for_signing_session_id',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // In production, set this to true and use HTTPS
    httpOnly: true, // Prevents client-side JS from accessing the session cookie
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// CSRF Protection Middleware
const csrfProtection = (req, res, next) => {
  // Generate CSRF secret in session if it doesn't exist
  if (!req.session.csrfSecret) {
    req.session.csrfSecret = crypto.randomBytes(32).toString('hex');
  }

  // Check token on "unsafe" methods
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

// Apply CSRF protection to all routes
app.use(csrfProtection);


// API Routes
app.get('/api/v1/csrf-token', (req, res) => {
  // Send the token to the client
  res.json({ csrfToken: req.session.csrfSecret });
});

app.post('/api/v1/submit', (req, res) => {
  const { message } = req.body;
  console.log('Received data:', message);
  res.json({ success: true, message: `Server received your message: "${message}"` });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('This server provides CSRF tokens and handles protected API calls.');
}); 