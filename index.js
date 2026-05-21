const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/slangs', (req, res) => res.json([]));
app.listen(3000);
