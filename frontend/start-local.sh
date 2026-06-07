#!/bin/bash
set -e
cd "$(dirname "$0")"

if [ ! -f .env.local ]; then
  cp .env.example .env.local
fi

echo "Starting FinSight frontend on http://localhost:5173"
echo "API URL: $(grep VITE_API_BASE_URL .env.local)"

npm run dev
