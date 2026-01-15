#!/bin/sh
set -e

echo "Running database push..."
cd /app/packages/db && bun run db:push

echo "Running database seed..."
cd /app/packages/db && bun run db:seed || echo "Seed failed or already run"

echo "Starting application..."
cd /app
exec "$@"