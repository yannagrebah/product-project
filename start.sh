#!/usr/bin/env bash

# Shell script to start both Backend (NestJS) and Frontend (Vite + React) concurrently

echo "🚀 Launching Product Catalog Services..."
echo "• Backend API:  http://localhost:3000"
echo "• Frontend UI:   http://localhost:5173"
echo "-----------------------------------------"

pnpm --parallel --filter backend --filter frontend dev
