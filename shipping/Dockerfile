# APIproject/shipping/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
# Run the service
CMD ["node", "server.js"]

