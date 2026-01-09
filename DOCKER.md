# Docker Deployment Guide

This guide explains how to deploy the WordSearch application using Docker on Dokploy or any VPS.

## Architecture

The application is split into 3 services:

1. **Web Client** (`apps/web`) - React + Vite SPA served by nginx
2. **API Server** (`apps/server`) - Hono + tRPC + Better Auth
3. **WebSocket Server** (`apps/server/src/ws-server.ts`) - Multiplayer game logic

## Dockerfiles

| Service | Dockerfile | Port | Build Context |
|---------|------------|------|---------------|
| Web | `apps/web/Dockerfile` | 80 | Root (`.`) |
| API Server | `apps/server/Dockerfile` | 3000 | Root (`.`) |
| WebSocket | `apps/server/Dockerfile.websocket` | 3003 | Root (`.`) |

## Local Development with Docker

```bash
# Copy environment file
cp .env.docker.example .env

# Edit .env with your values
nano .env

# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

Services will be available at:
- Web: http://localhost:3001
- API: http://localhost:3000
- WebSocket: ws://localhost:3003

## Deploying to Dokploy (with Traefik)

Dokploy uses **Traefik** as its reverse proxy, which automatically handles:
- SSL/TLS termination (Let's Encrypt)
- Routing based on domains
- WebSocket connection upgrades (native support)
- Load balancing

### Step 1: Create Services in Dokploy

Create 3 separate **Application** services in Dokploy:

#### 1. Web Client Service
- **Name**: `wordsearch-web`
- **Source**: Git repository
- **Dockerfile Path**: `apps/web/Dockerfile`
- **Build Context**: `.` (root)
- **Port**: `80`
- **Domain**: `yourdomain.com`
- **Build Args** (set in Environment → Build Args):
  - `VITE_SERVER_URL`: `https://api.yourdomain.com`
  - `VITE_WS_URL`: `https://ws.yourdomain.com`

#### 2. API Server Service
- **Name**: `wordsearch-api`
- **Source**: Git repository
- **Dockerfile Path**: `apps/server/Dockerfile`
- **Build Context**: `.` (root)
- **Port**: `3000`
- **Domain**: `api.yourdomain.com`
- **Environment Variables**:
  - `DATABASE_URL`: Your PostgreSQL connection string
  - `BETTER_AUTH_SECRET`: A secure random string (32+ chars)
  - `BETTER_AUTH_URL`: `https://api.yourdomain.com`
  - `CORS_ORIGIN`: `https://yourdomain.com`

#### 3. WebSocket Server Service
- **Name**: `wordsearch-ws`
- **Source**: Git repository
- **Dockerfile Path**: `apps/server/Dockerfile.websocket`
- **Build Context**: `.` (root)
- **Port**: `3003`
- **Domain**: `ws.yourdomain.com`
- **Environment Variables**:
  - `CORS_ORIGIN`: `https://yourdomain.com`
  - `WS_PORT`: `3003`

### Step 2: Traefik & WebSocket Configuration

Traefik in Dokploy handles WebSocket upgrades automatically. No special configuration needed!

When you set a domain in Dokploy, it automatically:
1. Creates Traefik router rules
2. Configures SSL via Let's Encrypt
3. Handles WebSocket `Upgrade` and `Connection` headers

**Important**: Use `https://` for `VITE_WS_URL` (not `wss://`). The client code automatically converts it to `wss://` for the WebSocket connection.

### Step 3: Database Setup

Make sure you have a PostgreSQL database. Options:
- **Dokploy Database**: Create a PostgreSQL service in Dokploy
- **External**: Use Supabase, Neon, Railway, or any managed PostgreSQL

After deployment, run migrations:
```bash
# SSH into your server or use Dokploy's terminal
pnpm db:migrate
```

### Step 4: Deploy

1. Push your code to Git
2. In Dokploy, click "Deploy" for each service
3. Wait for builds to complete
4. Test your application!

## Environment Variables Reference

### API Server

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `BETTER_AUTH_SECRET` | Auth signing secret | Random 32+ char string |
| `BETTER_AUTH_URL` | Auth base URL | `https://api.yourdomain.com` |
| `CORS_ORIGIN` | Allowed CORS origin | `https://yourdomain.com` |
| `PORT` | Server port (optional) | `3000` |

### WebSocket Server

| Variable | Description | Example |
|----------|-------------|---------|
| `CORS_ORIGIN` | Allowed CORS origin | `https://yourdomain.com` |
| `WS_PORT` | WebSocket port | `3003` |

### Web Client (Build Args)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SERVER_URL` | API server URL | `https://api.yourdomain.com` |
| `VITE_WS_URL` | WebSocket server URL | `https://ws.yourdomain.com` |

> **Note**: Use `https://` for both URLs. The client automatically uses `wss://` for WebSocket connections.

## Health Checks

All services have health check endpoints:
- Web: `GET /health`
- API: `GET /`
- WebSocket: `GET /health`

## Troubleshooting

### Build Fails
- Ensure Docker build context is set to repository root (`.`)
- Check that all workspace packages are copied in Dockerfile
- Review build logs in Dokploy

### WebSocket Connection Issues
- Verify domain is correctly set in Dokploy for the WS service
- Check CORS_ORIGIN matches your web client domain exactly (including `https://`)
- Traefik handles upgrades automatically, but check Dokploy logs if issues persist
- Test with: `wscat -c wss://ws.yourdomain.com/ws/multiplayer`

### Database Connection Issues
- Verify DATABASE_URL is accessible from Dokploy's network
- If using Dokploy's PostgreSQL, use the internal network hostname
- Check connection string format

### CORS Errors
- Ensure `CORS_ORIGIN` exactly matches your frontend URL (protocol + domain)
- No trailing slash in the URL

## Manual Docker Build

```bash
# Build web client
docker build -f apps/web/Dockerfile \
  --build-arg VITE_SERVER_URL=https://api.yourdomain.com \
  --build-arg VITE_WS_URL=https://ws.yourdomain.com \
  -t wordsearch-web .

# Build API server
docker build -f apps/server/Dockerfile -t wordsearch-api .

# Build WebSocket server
docker build -f apps/server/Dockerfile.websocket -t wordsearch-ws .
```
