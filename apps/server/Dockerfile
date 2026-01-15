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
RUN pnpm --filter @wordsearch/api build && pnpm --filter server build

# Stage 2: Production
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copy workspace root files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy node_modules (hoisted dependencies)
COPY --from=builder /app/node_modules ./node_modules

# Copy the server's built output
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json

# Copy ALL built packages with their dist folders
COPY --from=builder /app/packages/api/dist ./packages/api/dist
COPY --from=builder /app/packages/api/package.json ./packages/api/package.json
COPY --from=builder /app/packages/auth/dist ./packages/auth/dist
COPY --from=builder /app/packages/auth/package.json ./packages/auth/package.json
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/package.json ./packages/db/package.json
COPY --from=builder /app/packages/env/dist ./packages/env/dist
COPY --from=builder /app/packages/env/package.json ./packages/env/package.json
COPY --from=builder /app/packages/config/dist ./packages/config/dist
COPY --from=builder /app/packages/config/package.json ./packages/config/package.json

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

RUN mkdir -p /data && chmod 0777 /data
VOLUME ["/data"]

CMD ["bun", "run", "apps/server/dist/index.mjs"]