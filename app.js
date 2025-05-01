const cors = require('cors');
const express = require('express');
const http = require('http'); // Dibutuhkan untuk WebSocket
const WebSocket = require('ws'); // Gantikan socket.io
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const commentsRouter = require('./routes/comments');
const rsvpRouter = require('./routes/rsvp');
const morgan = require('morgan');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Buat WebSocket server

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

// WebSocket native logic
wss.on('connection', (ws) => {
  console.log('Client WebSocket terhubung');

  ws.on('message', (data) => {
    console.log('Pesan masuk:', data.toString());

    // Broadcast ke semua klien (kecuali pengirim)
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Client WebSocket terputus');
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
