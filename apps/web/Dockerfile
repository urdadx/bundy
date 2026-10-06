# ============================================
# Web Client Dockerfile (Vite + React)
# ============================================

# Stage 1: Build
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files for workspace resolution
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web ./apps/web
COPY packages ./packages

# Build arguments for environment variables (needed at build time for Vite)
ARG VITE_SERVER_URL
ARG VITE_WS_URL

ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_WS_URL=$VITE_WS_URL

# Build the web app
WORKDIR /app/apps/web
RUN pnpm build

# Stage 2: Production with Node.js server
FROM node:22-alpine AS production

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/apps/web/dist ./dist

# Copy package.json for serve package
COPY apps/web/package.json ./package.json

# Install serve to host static files
RUN npm install -g serve

# Expose port 3001 (different from server)
EXPOSE 3001

# Start the static file server
CMD ["serve", "-s", "dist", "-l", "3001"]
