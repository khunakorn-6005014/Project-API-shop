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