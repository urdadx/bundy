# Stage 1: Build
FROM node:20-alpine AS builder
RUN npm install -g pnpm@10.10.0
WORKDIR /app

# Copy workspace configs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy all package.json files
COPY apps/server/package.json ./apps/server/
COPY packages ./packages/

# Install ALL dependencies (including devDeps for building)
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY apps/server ./apps/server
RUN pnpm --filter server build

# --- Stage 2: Production ---
FROM oven/bun:1-slim AS production
WORKDIR /app

# 1. Copy the ROOT node_modules (This contains the .pnpm virtual store)
COPY --from=builder /app/node_modules ./node_modules

# 2. Copy the server's node_modules (This contains the symlinks)
COPY --from=builder /app/apps/server/node_modules ./apps/server/node_modules

# 3. Copy the built code and the server's package.json
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./package.json

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# SQLite setup
RUN mkdir -p /data && chmod 0777 /data
VOLUME ["/data"]

# Use Bun to run the compiled mjs file
CMD ["bun", "run", "dist/index.mjs"]