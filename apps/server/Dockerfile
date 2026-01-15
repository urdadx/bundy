# Stage 1: Build
FROM node:20-alpine AS builder

RUN npm install -g pnpm@10.10.0

WORKDIR /app

RUN pnpm config set node-linker hoisted

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/config/package.json ./packages/config/

RUN pnpm install --frozen-lockfile

COPY apps/server ./apps/server
COPY packages ./packages

RUN pnpm -r run build || true

# Stage 2: Production
FROM oven/bun:1-alpine AS production

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/apps/server ./apps/server
COPY --from=builder /app/packages ./packages

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3000
ENV SQLITE_PATH=/data/sqlite.db
EXPOSE 3000

RUN mkdir -p /data && chmod 0777 /data
VOLUME ["/data"]

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bun", "run", "apps/server/dist/index.mjs"]