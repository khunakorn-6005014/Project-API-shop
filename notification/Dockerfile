<<<<<<< HEAD
FROM node:18-alpine
WORKDIR /app

# Copy package files for the notification service
COPY notification/package*.json ./

# Copy the shared folder so that file-based dependencies (auth-lib) are accessible
COPY shared /shared

# Install dependencies; this freshly installs everything without using a local node_modules
RUN npm install

# Copy the rest of the notification service code
=======
# APIproject/notification/Dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files first (using the correct paths)
COPY notification/package*.json ./

# Copy shared code so that file dependencies are met
#COPY shared /shared

# Install dependencies (auth-lib from file:/shared/auth-lib will be resolved)
RUN npm install

# Copy the rest of the Notifications service code
>>>>>>> e2a817be2b092f7acb90a462b3c22d55d64ea9fb
COPY notification/ .

EXPOSE 3003

CMD ["node", "server.js"]