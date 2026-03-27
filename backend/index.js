require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.js');
const path = require('path');

const app = express();

// Enable CORS for frontend communication
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);

// Serve rendered videos (local dev) with proper range request support
const videoOutputPath = path.join(__dirname, '..', 'video-engine', 'output');
app.use('/videos', express.static(videoOutputPath, {
  setHeaders: (res, path) => {
    // Enable range requests for video streaming
    if (path.endsWith('.mp4')) {
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Type', 'video/mp4');
    }
  },
}));

const PORT = parseInt(process.env.PORT || 5000, 10);
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Success! Backend listening at http://localhost:${PORT}`);
    console.log(`[Server] Press Ctrl+C to stop.`);
});

// Explicitly keep the process alive
const keepAlive = setInterval(() => {
    if (server.listening) {
        // Just a heartbeat
    }
}, 60000);

server.on('error', (err) => {
    console.error('[Server] Critical Error:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.error(`[Server] Port ${PORT} is already in use by another process.`);
    }
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[Server] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('[Server] Uncaught Exception:', err);
    // On uncaught exception, we logging and keep going (or exit if critical)
});
