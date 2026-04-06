require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const serverRoutes = require('./routes/servers');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Simple auth endpoint (ganti dengan database auth)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Demo credentials: email: admin@panel.com, pass: admin123
  if (email === 'admin@panel.com' && password === 'admin123') {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
      success: true, 
      token,
      user: { email, role: 'admin' }
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// Routes
app.use('/api/servers', serverRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Pterodactyl Creator API is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
