const express = require('express');
const router = express.Router();
const {db} = require('../db/db');

const testimonials = db.testimonials;

// get all testimonials
router.route('/testimonials').get((req, res) => {
    console.log('DATABASE',db);
    res.json(testimonials);
});

// get one random testimonial
router.route('/testimonials').get((req, res) => {
    const randomItem = testimonials[Math.floor(Math.random() * testimonials.length)];
    console.log('RANDOM ITEM',randomItem);
    res.json(randomItem);
});

// get testimonial by id
router.route('/testimonials/:id').get((req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = testimonials.find(item => item.id === id);
  
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
});

// post one new testimonial
router.route('/testimonials').post((req, res) => {
    const { author, text } = req.body;

    if (author && text) {
        // Find the maximum ID in the current database
        const maxId = testimonials.reduce((max, item) => (item.id > max ? item.id : max), 0);
        const id = maxId + 1;

        testimonials.push({ id, author, text });
        res.json({ message: 'OK' });
    } else {
        res.status(400).json({ message: 'Error' });
    }
});

// put one testimonial by id
router.route('/testimonials/:id').put((req, res) => {
    const { author, text } = req.body;

    const id = parseInt(req.params.id, 10);
    const item = testimonials.find(item => item.id === id);
    if (author && text) {
        item.author = author;
        item.text = text;
        res.json({ message: 'OK' });
    } else {
        res.status(400).json({ message: 'Error' });
    }
});

// delete one testimonial by id
router.route('/testimonials').delete((req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = testimonials.find(item => item.id === id);
    if (item) {
        testimonials.splice(testimonials.indexOf(item), 1);
        res.json({ message: 'OK' });
    } else {
        res.status(404).json({ message: 'Error' });
    }
});

module.exports = router;