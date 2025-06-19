# APIproject/shipping/Dockerfile
FROM node:18-alpine
WORKDIR /app

# First, copy package files (to leverage Docker cache)
COPY shipping/package*.json ./

# Install dependencies
COPY shared /shared

RUN npm install

# Copy the rest of the shipping service code into /app,
# which includes server.js, routes, mq, etc.
#COPY shipping/ ./
COPY shipping/ .
# Also copy any required directories from the root, if your code depends on them.
# For example, if the shipping service depends on shared modules:
COPY order ./order
COPY product ./product

# Expose the port the service will run on
EXPOSE 3002

# Run the service
CMD ["node", "server.js"]