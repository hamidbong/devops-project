FROM node:18

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose port and run application
EXPOSE 3000
CMD ["node", "app.js"]