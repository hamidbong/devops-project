FROM node:18-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install production dependencies only (now includes dotenv)
RUN npm ci --only=production

# Copy the rest of the application files
COPY . .

# Environment variables should come from Kubernetes, not .env file
# If you must use .env in development, add it to .dockerignore
# and use Kubernetes secrets in production

EXPOSE 3000

CMD ["node", "app.js"]