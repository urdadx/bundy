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

# Install dependencies (they will now be flat/physical folders)
RUN pnpm install --frozen-lockfile

# Copy source code and build
COPY apps/server ./apps/server
COPY packages ./packages
RUN pnpm --filter server build

# Stage 2: Production
FROM oven/bun:1-slim AS production

WORKDIR /app

# 3. Copy the flattened node_modules from the root
# Since we used 'hoisted', all dependencies (including @hono/trpc-server) 
# are now physically inside this folder.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/server/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

RUN mkdir -p /data && chmod 0777 /data
VOLUME ["/data"]

CMD ["bun", "run", "dist/index.mjs"]