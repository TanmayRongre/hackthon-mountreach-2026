const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// routes 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bedRoutes = require('./routes/bedRoutes');
const feeRoutes = require('./routes/feeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const messRoutes = require('./routes/messRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// ─── Load Environment Variables ──────────────────────────────────────────────
dotenv.config();

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Initialize Express App ───────────────────────────────────────────────────
const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
  credentials: true,
}));

app.use(express.json());           // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', require('./routes/healthRoutes'));

// TODO: Add feature routes here as the project grows
// Example:
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/notifications', notificationRoutes);
// ─── 404 Handler (must be after all routes) ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
