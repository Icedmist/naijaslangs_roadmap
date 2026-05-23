# NaijaSlangs API 🇳🇬⚡

Linguistic infrastructure for Nigerian street culture. The definitive open-source developer API and dataset for Nigerian street slang, pidgin vocabulary, and cultural expressions.

## Features

- **Structured Semantics:** Detailed translations, deep cultural meaning, origins, usage examples, tags, and popularity ratings for every slang word.
- **REST Endpoints:** Flexible lookup, query search, category filtering, and paginated listings.
- **High Performance:** Lightweight JSON database with sub-50ms response times.
- **Interactive Playground:** Premium developer portal built with glassmorphic obsidian styling for live request testing.

## Endpoint Reference

### 1. Get All Slangs (with Filters)
```http
GET /api/slangs
```
**Query Parameters:**
- `q`: Search keyword inside slangs, meanings, translations, or tags.
- `category`: Filter by category (e.g. `finance`, `lifestyle`, `expression`, `personality`).
- `origin`: Filter by origin (e.g. `Yoruba`, `Igbo`, `Hausa`, `street`).
- `page`: Page index (default: `1`).
- `limit`: Results per page (default: `10`).

### 2. Get Random Slang
```http
GET /api/slangs/random
```

### 3. Get Slang by ID
```http
GET /api/slangs/:id
```

### 4. Submit Slang
```http
POST /api/slangs
```
**JSON Request Body:**
```json
{
  "slang": "aza",
  "translation": "Account number",
  "meaning": "Street term referencing a bank account...",
  "examples": ["Send your aza, let me credit you."],
  "category": "finance",
  "origin": "Street Slang",
  "popularity": 5,
  "tags": ["money", "bank"]
}
```

## Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Icedmist/naijaslangs-api.git
   cd naijaslangs-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local server:
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:3000`. You can access the interactive developer documentation portal by opening `http://localhost:3000` in your web browser.

## Author

- **Icedmist** — [talk2icedmist@gmail.com](mailto:talk2icedmist@gmail.com)
