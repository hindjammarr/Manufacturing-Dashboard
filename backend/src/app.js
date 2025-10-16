const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./utils/db');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth');
const machineRoutes = require('./routes/machines');
const productionRoutes = require('./routes/production');
const reportRoutes = require('./routes/reports');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handler
app.use(errorHandler);

module.exports = app;