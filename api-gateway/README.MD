

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
