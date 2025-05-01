const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const commentsRouter = require('./routes/comments');
const rsvpRouter = require('./routes/rsvp');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://be-production-41a4.up.railway.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Tambahkan untuk tangani preflight
app.options('*', cors());

app.use(express.json());
app.use(morgan('dev'));

// Koneksi MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Terhubung ke MongoDB'))
  .catch((error) => console.error('Gagal konek ke MongoDB:', error));

// Routing
app.use('/api/comments', commentsRouter);
app.use('/api/rsvp', rsvpRouter);

// Endpoint test
app.get('/', (req, res) => {
  res.send('API Buku Tamu & RSVP aktif!');
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Terjadi kesalahan pada server!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di http://0.0.0.0:${PORT}`);
});
