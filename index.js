const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// Load database helper
const getSlangsDb = () => {
  const filePath = path.join(__dirname, 'slangs.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading slangs database:', error);
    return [];
  }
};

const saveSlangsDb = (data) => {
  const filePath = path.join(__dirname, 'slangs.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to slangs database:', error);
    return false;
  }
};

// --- API Endpoints ---

app.get('/api/slangs', (req, res) => {
  let slangs = getSlangsDb();
  const { q, category, origin, popularity, page = 1, limit = 10 } = req.query;

  if (q) {
    const query = q.toLowerCase();
    slangs = slangs.filter(item => 
      item.slang.toLowerCase().includes(query) ||
      item.translation.toLowerCase().includes(query) ||
      item.meaning.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (category) {
    slangs = slangs.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (origin) {
    slangs = slangs.filter(item => item.origin.toLowerCase().includes(origin.toLowerCase()));
  }

  if (popularity) {
    const popVal = parseInt(popularity, 10);
    if (!isNaN(popVal)) {
      slangs = slangs.filter(item => item.popularity === popVal);
    }
  }

  const total = slangs.length;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const results = slangs.slice(startIndex, endIndex);

  res.json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    data: results
  });
});

app.get('/api/slangs/random', (req, res) => {
  const slangs = getSlangsDb();
  if (slangs.length === 0) {
    return res.status(404).json({ success: false, message: 'No slangs found' });
  }
  const randomIndex = Math.floor(Math.random() * slangs.length);
  res.json({
    success: true,
    data: slangs[randomIndex]
  });
});

app.get('/api/slangs/:id', (req, res) => {
  const slangs = getSlangsDb();
  const idVal = parseInt(req.params.id, 10);
  const found = slangs.find(item => item.id === idVal);

  if (!found) {
    return res.status(404).json({
      success: false,
      message: `Slang with ID ${req.params.id} was not found`
    });
  }

  res.json({
    success: true,
    data: found
  });
});

app.post('/api/slangs', (req, res) => {
  const { slang, translation, meaning, examples, category, origin, popularity, tags } = req.body;

  if (!slang || !translation || !meaning) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: slang, translation, and meaning are mandatory.'
    });
  }

  const db = getSlangsDb();
  const exists = db.some(item => item.slang.toLowerCase() === slang.toLowerCase());
  if (exists) {
    return res.status(409).json({
      success: false,
      message: `The slang '${slang}' already exists in our database.`
    });
  }

  const newSlang = {
    id: db.length > 0 ? Math.max(...db.map(item => item.id)) + 1 : 1,
    slang: slang.toLowerCase(),
    translation,
    origin: origin || 'Street Slang',
    meaning,
    examples: Array.isArray(examples) ? examples : [examples || ''],
    popularity: parseInt(popularity, 10) || 3,
    category: category || 'expression',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['user-submitted']),
    status: 'pending_moderation'
  };

  db.push(newSlang);
  
  if (saveSlangsDb(db)) {
    res.status(201).json({
      success: true,
      message: 'Slang successfully submitted and queued for moderation review!',
      data: newSlang
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to write data to database.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`NaijaSlangs API running locally at http://localhost:${PORT}`);
});
