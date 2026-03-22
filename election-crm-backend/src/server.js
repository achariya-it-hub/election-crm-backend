import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'election_crm',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Make pool available to routes
app.set('db', pool);

// Import routes
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import boothsRoutes from './routes/booths.js';
import votersRoutes from './routes/voters.js';
import volunteersRoutes from './routes/volunteers.js';
import complaintsRoutes from './routes/complaints.js';
import campaignsRoutes from './routes/campaigns.js';
import settingsRoutes from './routes/settings.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/booths', boothsRoutes);
app.use('/api/voters', votersRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});
