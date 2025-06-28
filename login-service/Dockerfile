# Use official Node.js image with Alpine
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose correct port
EXPOSE 5000

# Health check on correct port
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5000/health || exit 1

# Run app
CMD ["node", "app.js"]
