# User Management System – RESTful API

Node.js + Express + MongoDB (Mongoose) with Basic Authentication.

## Setup
```bash
npm install
cp .env.example .env      # edit MONGO_URI if needed
npm run dev               # or: npm start
```
Requires a running MongoDB (local or Atlas connection string).

## Endpoints
| Method | Route            | Auth            | Description                  |
|--------|------------------|-----------------|------------------------------|
| POST   | /api/users       | Public          | Create (register) a user     |
| GET    | /api/users       | Basic           | List users (`?page=&limit=`) |
| GET    | /api/users/:id   | Basic           | Get one user                 |
| PUT    | /api/users/:id   | Basic (self/admin) | Update a user             |
| DELETE | /api/users/:id   | Basic (self/admin) | Delete a user             |

- The first registered user becomes `admin`; later users are `user`.
- Only admins can change a user's `role`.
- Passwords are hashed with bcrypt and never returned.

## Basic Auth
Send `Authorization: Basic base64(email:password)`. In Postman: Authorization tab → Basic Auth.

## Testing with Postman
1. Postman → Import → `postman_collection.json`.
2. Start the server, then run the requests in order (1 → 6), or use the Collection Runner.
   Request 1 saves the new user's id into `{{userId}}` automatically; each request has test scripts.

## Sample status codes
201 created · 200 ok · 400 validation/invalid id · 401 bad/missing credentials · 403 forbidden · 404 not found · 409 duplicate email
