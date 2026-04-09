# Property Search API

A NestJS REST API that accepts natural language UK property queries, uses Groq / LLaMA 3.3 to extract structured search criteria, and returns matching properties from a PostgreSQL database.

## Architecture Decisions
- **Why Groq / LLaMA 3.3 for NLP**: Blazing fast inference speeds and free usage tiers make it perfect for this application. It provides reliable structured JSON output from natural language, handles UK property terminology (brownfield, planning status, regions), and with temperature=0 gives deterministic results. Regex fallback means API works without API key.
- **Why raw pg over ORM**: Task required demonstrating PostgreSQL knowledge directly. Dynamic parameterized WHERE clauses are cleaner in raw SQL than ORM query builders for this use case.
- **Why POST for /api/search**: Natural language queries can be long, POST body avoids URL encoding issues, enables clean server-side logging for analytics.
- **Why NestJS**: Modular architecture, built-in dependency injection makes services testable, ValidationPipe handles input validation cleanly.

## Prerequisites
- Node.js 18+
- PostgreSQL running locally
- Groq API key (optional — regex fallback works without it)

## Setup
1. Clone the repo
2. `npm install`
3. Create a PostgreSQL database: `createdb property_search`
4. Copy `.env.example` to `.env` and fill in values
5. `npm run migrate`
6. `npm run seed`
7. `npm run start:dev`

## API Endpoints

### `GET /api/health`
Check API and database health.

```bash
curl -X GET http://localhost:3035/api/health
```

### `GET /api/properties`
Returns all properties with optional filtering by `site_type` and `region`.

```bash
curl -X GET "http://localhost:3035/api/properties?site_type=brownfield&region=Midlands"
```

### `GET /api/properties/:id`
Returns a single property by ID.

```bash
curl -X GET http://localhost:3035/api/properties/some-uuid
```

### `POST /api/search`
Accepts a natural language query and returns matching properties.

```bash
curl -X POST http://localhost:3035/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "brownfield sites over 5 acres in the Midlands under £2m"}'
```

## Example Queries
- "brownfield sites over 5 acres in the Midlands under £2m"
- "commercial land in London over £5m"
- "greenfield sites in Yorkshire under 20 acres"
- "residential development in the South East with full planning permission"
- "mixed use sites in the North West between £1m and £4m"

## Trade-offs & What I'd Improve
- Redis caching for repeated LLM queries
- Fuzzy/semantic region matching using vector embeddings
- Query history table for analytics and prompt refinement
- Rate limiting on search endpoint
- Pagination on search results
- Authentication for multi-tenant branch access
