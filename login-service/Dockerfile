# Use official Node.js image with Alpine (smaller footprint)
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1

# Run application
CMD ["node", "app.js"]