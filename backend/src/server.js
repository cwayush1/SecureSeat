const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const dbPool = require('./config/db');
const { connectRedis } = require('./config/redisClient');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://secure-seat-rho.vercel.app",
  "https://secure-seat-git-main-cwayush1s-projects.vercel.app",
  "https://secure-seat-itjsypibk-cwayush1s-projects.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'SecureSeat Backend is running', timestamp: new Date() });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const stadiumRoutes = require('./routes/stadiumRoutes');
const securityRoutes = require('./routes/securityRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/stadiums', stadiumRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/payments', paymentRoutes);

const startServer = async () => {
    try {
        // Ensure Redis connects before starting server
        try {
            await connectRedis();
        } catch (rErr) {
            console.warn('⚠️ Redis initial connection error:', rErr.message);
        }
        
        // Verify PostgreSQL connection
        try {
            const client = await dbPool.connect();
            console.log('Connected to PostgreSQL successfully');
            client.release();
        } catch (dbErr) {
            console.warn('⚠️ PostgreSQL initial connection notice:', dbErr.message);
            console.warn('⚠️ Server will still listen on port', PORT);
        }

        app.listen(PORT, () => {
            console.log(`✓ SecureSeat Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();