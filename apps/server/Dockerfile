# Stage 1: Build
FROM node:20-alpine AS builder
RUN npm install -g pnpm@10.10.0
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages ./packages 
# (Simplifying copy for brevity, keep your specific COPYs if preferred)

RUN pnpm install --frozen-lockfile

COPY apps/server ./apps/server
RUN pnpm --filter server build

# --- NEW STEP: Isolate the server for production ---
# This creates a standalone folder at /prod/server with only prod deps
RUN pnpm --filter server --prod deploy /prod/server

# Stage 2: Production
FROM oven/bun:1-slim AS production
WORKDIR /app

# Copy the "deployed" standalone folder
COPY --from=builder /prod/server . 
# This folder now contains its own flat node_modules and your built dist

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Since 'pnpm deploy' includes the package.json, we run the start script
CMD ["bun", "run", "dist/index.mjs"]