#stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Create .env file for build (requires env vars at build time for Vite)
ARG VITE_APP_NAME
ARG VITE_APP_VERSION
ARG VITE_API_BASE_URL
ARG VITE_API_TIMEOUT
ARG VITE_API_RETRY_ATTEMPTS
ARG VITE_ENABLE_AI_ANALYSIS
ARG VITE_ENABLE_REAL_TIME_NOTIFICATIONS
ARG VITE_ENABLE_DARK_MODE_BY_DEFAULT
ARG VITE_AUTH_TOKEN_KEY
ARG VITE_REFRESH_TOKEN_KEY
ARG VITE_TOKEN_EXPIRY_DAYS
ARG VITE_ENABLE_ANALYTICS
ARG VITE_ANALYTICS_TRACKING_ID
ARG VITE_DEV_MOCK_API
ARG VITE_DEV_DELAY_MS

# Build the application
RUN npm run build

#stage 2: Create production image
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create env.js template for runtime configuration
RUN echo 'window.ENV = {}; // Server & runtime' > /usr/share/nginx/html/env-config.js

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
