const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

const normalizeOrigin = (value) => value.trim().replace(/\/$/, '');

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ALLOWED_ORIGINS
]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map((value) => normalizeOrigin(value))
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools (no Origin header) and same-origin/server requests.
    if (!origin) {
      return callback(null, true);
    }

    const requestOrigin = normalizeOrigin(origin);

    // If no allow-list is configured, allow all origins (safe for this project API).
    if (!allowedOrigins.length) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(requestOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Team Task Manager API is running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
