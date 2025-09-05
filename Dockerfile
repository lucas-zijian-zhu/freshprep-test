# Multi-stage Dockerfile for React Native/Expo app
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install all dependencies including dev dependencies
RUN npm ci

# Build the app
RUN npx expo export --platform web

# Production image, copy all the files and run expo
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expo

# Copy built application
COPY --from=builder --chown=expo:nodejs /app/dist ./dist
COPY --from=builder --chown=expo:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expo:nodejs /app/package*.json ./

USER expo

EXPOSE 8081

# Start the application
CMD ["npm", "start"]
