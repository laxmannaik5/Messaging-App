const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

const app = express();

// Middleware to handle CORS for the Express app
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/messaging-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your React app
    methods: ['GET', 'POST'], // Specify allowed methods
    credentials: true, // Allow credentials
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
