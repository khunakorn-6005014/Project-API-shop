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
COPY notification/ .

EXPOSE 3003

CMD ["node", "server.js"]