# API Gateway

A centralized entrypoint for all microservice traffic.  
It handles authentication, rate-limiting, header enrichment and proxies requests to your downstream services (User, Product, Shipping, Payment, etc.) over HTTPS.

---

## Table of Contents

1. [Features](#features)  
2. [Prerequisites](#prerequisites)  
3. [Getting Started](#getting-started)  
4. [Configuration](#configuration)  
5. [Running Locally](#running-locally)  
6. [Docker & Docker Compose](#docker-docker-compose)  
7. [Routes & Proxying](#routes-proxying)  
8. [Security](#security)  
9. [Rate Limiting](#rate-limiting)  
10. [Health Check](#health-check)  
11. [Troubleshooting](#troubleshooting)  
12. [Contributing](#contributing)

---

## Features

- JWKS‐based JWT validation (with `express-jwt` & `jwks-rsa`)  
- Automatic header enrichment (`X-User-Id`, `X-User-Roles`)  
- Circuit‐breaker support for flaky services (via Opossum)  
- Global rate limiting (using token‐bucket algorithm)  
- Security HTTP headers (via Helmet)  
- HTTPS (self-signed or production certificates)  
- Zero-trust proxying of microservice endpoints

---

## Prerequisites

- Node.js ≥ 18  
- npm ≥ 8  
- Docker & Docker Compose (for containerized dev/test)  
- A running JWKS provider (Auth Service or Identity Provider)  
- Downstream microservices:  
  - **User Service**  
  - **Product Service**  
  - **Shipping Service**  
  - **Payment Service**  
  - **Notification Service**

---

## Getting Started

1. Clone this repo  
   ```bash
   git clone https://github.com/your-org/api-gateway.git
   cd api-gateway


   
# 1. Create a 2048-bit RSA private key
openssl genrsa -out key.pem 2048

# 2. Generate a self-signed cert, valid 365 days
openssl req -x509 -new -nodes -key key.pem -sha256 -days 365 `
  -out cert.pem -subj "/C=US/ST=California/L=San Francisco/O=MyOrg/OU=Dev/CN=localhost"

  2) API Gateway (all other services go through here)
— — —
Assuming your gateway is listening on 443 with HTTPS (self-signed), your base is:
https://localhost


(if you turned off TLS for local dev, use http://localhost:443 or whatever port you chose)
