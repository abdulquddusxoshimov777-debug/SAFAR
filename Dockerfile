# ===========================
# Safar App - Dockerfile
# For Google Cloud Run & Docker deployment
# ===========================

# Use Node.js LTS Alpine (small & fast)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy backend package files first (for Docker layer caching)
COPY backend/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy backend source code and seed data
COPY backend/server.js ./
COPY backend/seeds.js ./
COPY backend/listings.json ./
COPY backend/.env.example ./.env.example

# Copy public frontend files (one level up from /app)
COPY public/ /public/

# Ensure initial data files exist if not present
RUN touch /app/users.json && echo '[]' > /app/users.json && \
    touch /app/reviews.json && echo '[]' > /app/reviews.json && \
    touch /app/messages.json && echo '[]' > /app/messages.json

# Cloud Run uses port 8080 by default
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

# Start the server
CMD ["node", "server.js"]
