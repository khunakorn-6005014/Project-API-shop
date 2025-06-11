# APIproject/shipping/Dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files first (to leverage Docker cache)
COPY shipping/package*.json ./

# IMPORTANT: Copy the shared directory into the build (adjust the destination as needed)
# This command copies the entire "shared" folder from the root (which is available because context is .)
# You need to choose a destination such that the package.json dependency "auth-lib": "file:../shared/auth-lib" can resolve.
COPY shared ./../shared

# Install dependencies
RUN npm install

# Copy the shipping service source code:
COPY shipping/ .

# You can also copy any additional required files if needed.
# Sometimes, if your shipping service depends on more than just the "shipping" folder, adjust accordingly.
# EXPOSE port:
EXPOSE 3002

# Run the service
CMD ["node", "server.js"]