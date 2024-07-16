const express = require('express');
const path = require('path');
const cors = require('cors');
const {db} = require('./db/db');

const app = express();
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');   

//MIDDLEWARES

app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//ENDPOINTS
app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

//ERROR HANDLING

app.use((req, res) => {
    res.status(404).json({ message: 'Not found...' });
})

//LISTENING

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});