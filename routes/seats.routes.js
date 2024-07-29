const express = require('express');
const router = express.Router();
const {db} = require('../db/db');

const seats = db.seats;

const isTaken = (seat, day) => {
     seats.some(item => (item.seat === seat && item.day === day));
};

// get all seats
router.route('/seats').get((req, res) => {
    res.json(seats);
});

// get one random seat
router.route('/seats/random').get((req, res) => {
    const randomItem = seats[Math.floor(Math.random() * seats.length)];
    res.json(randomItem);
});

// get seat by id
router.route('/seats/:id').get((req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = seats.find(item => item.id === id);
  
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
});

// post one new seat
router.route('/seats').post((req, res) => {
    const { day, seat, client, email } = req.body;

    if (day && seat && client && email) {
        // Find the maximum ID in the current database
        const maxId = seats.reduce((max, item) => (item.id > max ? item.id : max), 0);
        const id = maxId + 1;

        seats.push({ id, day, seat, client, email});

        //EMIT
        req.io.emit('seatsUpdated', seats);
        
        res.json({ message: 'OK' });
    } else if (isTaken(seat, day)) {
        res.status(400).json({ message: 'This seat is already taken...' });
    } else {
        res.status(400).json({ message: 'Error' });
    }
});

// put one seat by id
router.route('/seats/:id').put((req, res) => {
    const { day, seat, client, email } = req.body;

    const id = parseInt(req.params.id, 10);
    const item = seats.find(item => item.id === id);
    if (day && seat && client && email) {
        item.day = day;
        item.seat = seat;
        item.client = client;
        item.email = email;
        res.json({ message: 'OK' });
    } else {
        res.status(400).json({ message: 'Error' });
    }
});

// delete one seat by id
router.route('/seats/:id').delete((req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = seats.find(item => item.id === id);
    if (item) {
        seats.splice(seats.indexOf(item), 1);
        res.json({ message: 'OK' });
    } else {
        res.status(404).json({ message: 'Error' });
    }
});

module.exports = router;