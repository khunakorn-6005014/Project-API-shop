# APIproject/shipping/Dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files first (to leverage Docker cache)
COPY shipping/package*.json ./

# IMPORTANT: Copy the shared directory into the build (adjust the destination as needed)
# This command copies the entire "shared" folder from the root (which is available because context is .)
# Copy the shared folder to an absolute path /shared
COPY shared /shared

# Copy the order folder into the container
COPY order ./order

# Copy the product folder
COPY product ./product

COPY shipping/ .
# Install dependencie
RUN npm install

# Copy the shipping service source code:
COPY shipping/ .

# You can also copy any additional required files if needed.
# Sometimes, if your shipping service depends on more than just the "shipping" folder, adjust accordingly.
# EXPOSE port:
EXPOSE 3002

# Run the service
CMD ["node", "server.js"]