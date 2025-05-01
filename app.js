const cors = require('cors');
const express = require('express');
const http = require('http'); // Tambahan untuk socket.io
const { Server } = require('socket.io'); // Tambahan untuk socket.io
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const commentsRouter = require('./routes/comments');
const rsvpRouter = require('./routes/rsvp');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app); // Ganti dari app.listen ke server.listen
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://alim-risa.vercel.app',
      'https://alim-risa-kmperys-projects.vercel.app',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

// Middleware CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://alim-risa.vercel.app',
  'https://alim-risa-kmperys-projects.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        console.log('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
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

// Socket.io logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('new-comment', (data) => {
    // Broadcast ke semua klien kecuali pengirim
    socket.broadcast.emit('comment-added', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Terjadi kesalahan pada server!');
});

// Jalankan server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di http://0.0.0.0:${PORT}`);
});
