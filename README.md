# BFHL Placement Qualifier REST API

A production-ready REST API for the Bajaj Placement Qualifier. Exposes `/health` and `/bfhl` endpoints for math operations and AI-powered Q&A.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Start the server
npm start
# Or for development with auto-reload:
npm run dev
```

## Environment Variables

| Variable         | Description                         |
| ---------------- | ----------------------------------- |
| `PORT`           | Server port (default: 3000)         |
| `NODE_ENV`       | Environment mode (development/prod) |
| `AI_API_KEY`     | Google Gemini API key               |
| `GROK_API_KEY`   | Groq API key (llama-3.3-70b)        |
| `OFFICIAL_EMAIL` | Your Chitkara email address         |

## API Endpoints

### GET /health

Returns server health status.

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "your_email@chitkara.edu.in"
}
```

### POST /bfhl

Performs computation based on a single key. Exactly **one** key must be present.

#### Fibonacci

```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"fibonacci": 7}'
```

**Response:** `{ "is_success": true, "official_email": "...", "data": [0,1,1,2,3,5,8] }`

#### Prime Filter

```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"prime": [1,2,3,4,5,6,7,8,9,10]}'
```

**Response:** `{ "is_success": true, "official_email": "...", "data": [2,3,5,7] }`

#### LCM

```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"lcm": [4,6,8]}'
```

**Response:** `{ "is_success": true, "official_email": "...", "data": 24 }`

#### HCF

```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"hcf": [12,18,24]}'
```

**Response:** `{ "is_success": true, "official_email": "...", "data": 6 }`

#### AI Query

Choose between Google Gemini or Groq (Llama 3.3) for AI-powered answers. Use the `?provider` query parameter.

**Using Gemini:**
```bash
curl -X POST "http://localhost:3000/bfhl?provider=gemini" \
  -H "Content-Type: application/json" \
  -d '{"AI": "What is the capital of France?"}'
```

**Using Groq:**
```bash
curl -X POST "http://localhost:3000/bfhl?provider=grok" \
  -H "Content-Type: application/json" \
  -d '{"AI": "What is the capital of France?"}'
```

**Response:** `{ "is_success": true, "official_email": "...", "data": "Paris" }`

> **Note:** The frontend UI includes a dropdown to select your preferred AI provider.

## Error Responses

```json
{
  "is_success": false,
  "error": "Descriptive error message"
}
```

| Code | Meaning          |
| ---- | ---------------- |
| 400  | Invalid input    |
| 422  | Validation error |
| 500  | Server error     |

## Deployment

Deploy to **Vercel**, **Render**, or **Railway**. Ensure environment variables are configured on the platform.

## License

ISC
