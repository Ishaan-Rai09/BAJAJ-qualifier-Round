require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware (relax CSP for frontend assets & Google Fonts)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(cors());

// Body parsing with size limit
app.use(express.json({ limit: '1mb' }));

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/', routes);

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`BFHL API server running on port ${PORT}`);
});

module.exports = app;
