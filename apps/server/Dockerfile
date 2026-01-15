# ============================================
# API Server Dockerfile (Hono + tRPC + Bun)
# ============================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files for workspace resolution
COPY apps/server/package.json ./apps/server/
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/config/package.json ./packages/config/

# Install pnpm and dependencies
RUN npm install -g pnpm@10.10.0
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source code
COPY apps/server ./apps/server
COPY packages ./packages

# Build the server
WORKDIR /app/apps/server
RUN pnpm build

# Stage 2: Production
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copy built files and node_modules from builder
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/node_modules ./apps/server/node_modules

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Create data directory for SQLite and make it writable
RUN mkdir -p /data && chmod 0777 /data
VOLUME ["/data"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the server
CMD ["bun", "run", "dist/index.mjs"]
