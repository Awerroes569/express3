const express = require('express');
const router = express.Router();
const {db} = require('../db/db');

const concerts = db.concerts;

// get all concerts
router.route('/concerts').get((req, res) => {
    res.json(concerts);
});

// get one random concert
router.route('/concerts/random').get((req, res) => {
    const randomItem = concerts[Math.floor(Math.random() * concerts.length)];
    res.json(randomItem);
});

// get concert by id
router.route('/concerts/:id').get((req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = concerts.find(item => item.id === id);
  
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
});

// post one new concert
router.route('/concerts').post((req, res) => {
    const { author, text } = req.body;

    if (author && text) {
        // Find the maximum ID in the current database
        const maxId = concerts.reduce((max, item) => (item.id > max ? item.id : max), 0);
        const id = maxId + 1;

        concerts.push({ id, author, text });
        res.json({ message: 'OK' });
    } else {
        res.status(400).json({ message: 'Error' });
    }
});

// put one concert by id
router.route('/concerts/:id').put((req, res) => {
    const { author, text } = req.body;

    const id = parseInt(req.params.id, 10);
    const item = concerts.find(item => item.id === id);
    if (author && text) {
        item.author = author;
        item.text = text;
        res.json({ message: 'OK' });
    } else {
        res.status(400).json({ message: 'Error' });
    }
});

// delete one concert by id
router.route('/concerts/:id').delete((req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = concerts.find(item => item.id === id);
    if (item) {
        concerts.splice(concerts.indexOf(item), 1);
        res.json({ message: 'OK' });
    } else {
        res.status(404).json({ message: 'Error' });
    }
});

module.exports = router;