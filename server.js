const express = require('express');
const path = require('path');
//const hbs = require('express-handlebars');
//const bodyParser = require('body-parser');
//const multer = require('multer');
const {db} = require('./db/db');

const app = express();

//HANDLEBARS

//app.engine('.hbs', hbs.engine());
//app.set('view engine', '.hbs');

//MIDDLEWARES

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//ENDPOINTS

app.get('/testimonials', (req, res) => {
    console.log('DATABASE',db);
    res.json(db);
});

app.get('/testimonials/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = db.find(item => item.id === id);
  
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
});

app.get('/testimonials/random', (req, res) => {
    const randomItem = db[Math.floor(Math.random() * db.length)];
    res.json(randomItem);
});

app.post('/testimonials', (req, res) => {
    const { author, text } = req.body;

    if (author && text) {
        // Find the maximum ID in the current database
        const maxId = db.reduce((max, item) => (item.id > max ? item.id : max), 0);
        const id = maxId + 1;

        db.push({ id, author, text });
        res.json({ message: 'OK' });
    } else {
        res.status(400).json({ message: 'Error' });
    }
});

app.put('/testimonials/:id', (req, res) => {
    const { author, text } = req.body;

    const id = parseInt(req.params.id, 10);
    const item = db.find(item => item.id === id);
    if (author && text) {
        item.author = author;
        item.text = text;
        res.json({ message: 'OK' });
    } else {
        res.status(400).json({ message: 'Error' });
    }
});

app.delete('/testimonials/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = db.find(item => item.id === id);
    if (item) {
        db.splice(db.indexOf(item), 1);
        res.json({ message: 'OK' });
    } else {
        res.status(404).json({ message: 'Error' });
    }
});

//ERROR HANDLING

app.use((req, res) => {
    res.status(404).json({ message: 'Not found...' });
})

//LISTENING

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});