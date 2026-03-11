const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { pool, testConnection } = require('./config/database');

dotenv.config();
require('./scripts/setupAdmin');

const app = express();

/* ---------------- SECURITY ---------------- */
app.use(helmet());

/* ---------------- CORS ---------------- */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://cms-chi-self.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.options('*', cors()); // handle preflight requests

/* ---------------- BODY PARSER ---------------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ---------------- DATABASE MIDDLEWARE ---------------- */
app.use((req, res, next) => {
  req.db = pool;
  next();
});

/* ---------------- RATE LIMIT ---------------- */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/auth', limiter);

/* ---------------- ROUTES ---------------- */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/panchang', require('./routes/panchangRoutes'));

/* ---------------- HEALTH CHECK ---------------- */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

/* ---------------- 404 ---------------- */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error('Global error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

/* ---------------- SERVER START ---------------- */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const isDbConnected = await testConnection();

  if (!isDbConnected) {
    console.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();

module.exports = app;