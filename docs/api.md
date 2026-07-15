# API Docs

Base URL: `http://localhost:3000`
Auth: `x-api-key` or `Authorization: Bearer <API_KEY>`

Endpoints:
- GET /api/works
- GET /api/blog
- GET /api/plugins
- POST /api/plugins/:name/activate
- GET /api/projects
- POST /api/projects
- GET /api/projects/:id
- PATCH /api/projects/:id
- DELETE /api/projects/:id

Error: `{ "error": "<message>" }`
Success: JSON payload per resource
