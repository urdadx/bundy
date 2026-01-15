#!/bin/sh
set -e

echo "Running database migrations..."
cd /app/packages/db && npx drizzle-kit migrate

echo "Running database seed..."
cd /app/packages/db && bun run seed || echo "Seed failed or already run"

echo "Starting application..."
cd /app
exec "$@"