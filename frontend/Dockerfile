# Use Node.js 20 Alpine for Angular CLI compatibility
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 4200

# Start the Angular development server
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"] 