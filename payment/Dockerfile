# APIproject/payment/Dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files first (to leverage Docker cache)
COPY payment/package*.json ./
# IMPORTANT: Copy the shared directory into the build (adjust the destination as needed)
# This command copies the entire "shared" folder from the root (which is available because context is .)
# Copy the shared folder to an absolute path /shared
COPY shared /shared

# Copy the .order folder into the container
COPY order ./order

# Install dependencies
RUN npm install
# Copy the payment service source code:
COPY payment/ .
# You can also copy any additional required files if needed.
# Sometimes, if your payment service depends on more than just the "payment" folder, adjust accordingly.
# EXPOSE port:
EXPOSE 3001
# Run the service
CMD ["node", "server.js"]