const express = require('express');
const path = require('path');
const cors = require('cors');
const {db} = require('./db/db');
const socket = require('socket.io');

const app = express();
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');   

//MIDDLEWARES

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cors());
//app.use(express.static(path.join(__dirname, '/public')));
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//ENDPOINTS
app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

//ERROR HANDLING

app.use((req, res) => {
    res.status(404).json({ message: 'Not found...' });
})

//LISTENING

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New socket!');
});