# Root Dockerfile untuk Railway
# Build backend Trackify

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json dari backend
COPY Trackify_Back_End/package.json Trackify_Back_End/package-lock.json* ./

# Install dependencies production
RUN npm ci --only=production || npm install --production

# Copy seluruh isi backend
COPY Trackify_Back_End/. ./

# Set environment variable default
ENV PORT=3000

# Expose port
EXPOSE 3000

# Jalankan backend
CMD ["node", "index.js"]