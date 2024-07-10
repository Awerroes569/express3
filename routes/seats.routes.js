const express = require('express');
const router = express.Router();
const {db} = require('../db/db');

const seats = db.seats;

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
    const { author, text } = req.body;

    if (author && text) {
        // Find the maximum ID in the current database
        const maxId = seats.reduce((max, item) => (item.id > max ? item.id : max), 0);
        const id = maxId + 1;

        seats.push({ id, author, text });
        res.json({ message: 'OK' });
    } else {
        res.status(400).json({ message: 'Error' });
    }
});

// put one seat by id
router.route('/seats/:id').put((req, res) => {
    const { author, text } = req.body;

    const id = parseInt(req.params.id, 10);
    const item = seats.find(item => item.id === id);
    if (author && text) {
        item.author = author;
        item.text = text;
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