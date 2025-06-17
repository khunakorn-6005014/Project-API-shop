FROM node:18-alpine
WORKDIR /app

# Copy package files for the notification service
COPY notification/package*.json ./

# Copy the shared folder so that file-based dependencies (auth-lib) are accessible
COPY shared /shared

# Install dependencies; this freshly installs everything without using a local node_modules
RUN npm install

# Copy the rest of the notification service code
COPY notification/ .

EXPOSE 3003

CMD ["node", "server.js"]