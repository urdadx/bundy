# Stage 1: Build
FROM node:20-alpine AS builder

# 1. Install pnpm
RUN npm install -g pnpm@10.10.0

WORKDIR /app

# 2. Force pnpm to "hoist" (flatten) node_modules so there are no symlinks
RUN pnpm config set node-linker hoisted

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/server ./apps/server
COPY packages ./packages

# Build all packages that have a build script
# Add || true to continue even if some packages don't have build scripts
RUN pnpm -r run build || true

# Stage 2: Production
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copy workspace structure
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/node_modules ./node_modules

# Copy server
COPY --from=builder /app/apps/server ./apps/server

# Copy ALL packages (this includes both src and dist)
COPY --from=builder /app/packages ./packages

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

RUN mkdir -p /data && chmod 0777 /data
VOLUME ["/data"]

CMD ["bun", "run", "apps/server/dist/index.mjs"]