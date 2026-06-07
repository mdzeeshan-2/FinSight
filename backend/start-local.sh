#!/bin/bash
set -e

export JWT_SECRET="${JWT_SECRET:-local-dev-secret-key-minimum-32-characters-long}"
export DB_USERNAME="${DB_USERNAME:-postgres}"
export DB_PASSWORD="${DB_PASSWORD:-password}"
export DATABASE_URL="${DATABASE_URL:-jdbc:postgresql://localhost:5432/finsight}"
export CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS:-http://localhost:5173}"
export OPENAI_API_KEY="${OPENAI_API_KEY:-}"

echo "Starting FinSight backend on http://localhost:8080"
echo "Swagger UI: http://localhost:8080/swagger-ui.html"

if command -v mvn >/dev/null 2>&1; then
  mvn spring-boot:run
elif [ -x /tmp/maven/bin/mvn ]; then
  /tmp/maven/bin/mvn spring-boot:run
else
  echo "Maven not found. Install with: brew install maven"
  exit 1
fi
