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

app.get('/api/slangs', (req, res) => {
  let db = getSlangsDb();
  if (req.query.q) db = db.filter(item => item.slang.includes(req.query.q));
  if (req.query.category) db = db.filter(item => item.category === req.query.category);
  res.json(db);
});

app.listen(PORT, () => console.log('Server running'));