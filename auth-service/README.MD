# Auth-Service

A standalone microservice responsible for user authentication and token issuance (JWT).
Features registration, login, password hashing and JWKS key‐management.

## Table of Contents

- Features
- Prerequisites
- Getting Started
- Configuration
- Running Locally
- Docker & Docker Compose
- API Endpoints
- Key Generation (JWKS)
- Error Handling
- Contributing

---

## Features

- User registration & login with email/password
- Password hashing (bcrypt)
- JWT issuance with RS256
- JWKS endpoint (/.well-known/jwks.json) for public key discovery
- Configurable token claims: sub, roles, aud, iss
- Dockerized for easy deployment

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 8
- MongoDB URI (local or Atlas)
- OpenSSL (for key generation)

---

## Getting Started

1. Clone this repo  
   ```bash
   git clone https://github.com/your-org/api-gateway.git
   cd api-gateway


# 1. Generate a 2048-bit RSA private key
openssl genrsa -out auth-service/config/tls/jwt-private.pem 2048

# 2. Derive the public key from the private key
openssl rsa -in auth-service/config/tls/jwt-private.pem \
       -pubout -out auth-service/config/tls/jwt-public.pem



auth-service/
├── config/jwt.config.js     # JWT signing key, token TTL
├── src/
│   ├── controllers/auth.controller.js  # register, login, refresh
│   ├── models/user.model.js           # Mongoose schema
│   ├── routes/auth.routes.js          # POST /register, /login, /jwks.json
│   ├── app.js                         # Express setup
│   └── server.js                      # Listen on port 3000
└── Dockerfile                         # Exposes port 3000

- Auth Service (no gateway in front)
— — —
• Register
• POST
• URL → http://localhost:3000/auth/register
• Body (JSON):
- {
"userId": "u123",
"firstName":"Jane",
"lastName":"Doe",
"email":"jane@doe.com",
"birthDay":"1990-01-01",
"password":"hunter2"
}
• Login
• POST
• URL → http://localhost:3000/auth/login
• Body:
{ "email":"jane@doe.com", "password":"hunter2" }
• Response → { “accessToken”: “eyJ…” }
• JWKS (used by gateway)
• GET
• URL → http://localhost:3000/.well-known/jwks.json


