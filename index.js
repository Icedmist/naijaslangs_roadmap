const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const getSlangsDb = () => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'slangs.json'), 'utf8'));
};

app.get('/api/slangs', (req, res) => res.json(getSlangsDb()));
app.get('/api/slangs/random', (req, res) => {
  const db = getSlangsDb();
  res.json(db[Math.floor(Math.random() * db.length)]);
});

app.listen(PORT, () => console.log('Server running'));