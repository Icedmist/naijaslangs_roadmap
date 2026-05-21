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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  res.json(db.slice((page-1)*limit, page*limit));
});

app.listen(PORT, () => console.log('Server running'));