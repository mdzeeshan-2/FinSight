# FinSight — Digital Banking Platform

A full-stack personal banking demo with a React dashboard, Spring Boot REST API, PostgreSQL, and an AI assistant named **Maya**.

## What This App Does

FinSight simulates a modern banking experience:

- **Authentication** — Register, login, JWT sessions with automatic token refresh
- **Dashboard** — Total balance, monthly income/expenses, spending chart, recent transactions
- **Accounts** — Create Savings or Current accounts; view balances in Indian Rupees (₹)
- **Transactions** — Deposit, withdraw, and transfer money between accounts
- **AI Chat (Maya)** — Ask banking questions via an OpenAI-powered assistant

Built as a portfolio / interview-ready project demonstrating REST API design, secure auth, transactional money operations, and a polished React UI.

## Live Demo

| | |
|---|---|
| **Live app** | **https://mdzeeshan-finsight.vercel.app** |
| **Demo email** | `demo@finsight.com` |
| **Demo password** | `password123` |

### How to try it

1. Open **https://mdzeeshan-finsight.vercel.app**
2. Click **Sign In**
3. Use the demo credentials above
4. Explore **Dashboard**, **Accounts**, **Transactions**, **Transfer**, and **AI Chat**

You can also register a new account from the **Register** page.

## Project Structure

```
finsight/
├── backend/     # Spring Boot REST API (Java 21)
├── frontend/    # React + Vite UI (TypeScript)
└── README.md
```

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, Recharts |
| **Backend** | Java 21, Spring Boot 3.2, PostgreSQL, JWT, OpenAI API |
| **Deploy** | Vercel (frontend) · Railway (backend) |

## Local Development

### Prerequisites

- JDK **21**, Maven 3.9+, Node.js 18+, Docker

### 1. Start PostgreSQL

```bash
cd backend
docker compose up -d
```

### 2. Run backend (Terminal 1)

```bash
cd backend
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
export JWT_SECRET='local-dev-secret-key-minimum-32-characters-long'
export DB_USERNAME='postgres'
export DB_PASSWORD='password'
export DATABASE_URL='jdbc:postgresql://localhost:5432/finsight'
export CORS_ALLOWED_ORIGINS='http://localhost:5173'
./start-local.sh
```

API: http://localhost:8080 · Swagger: http://localhost:8080/swagger-ui.html

### 3. Run frontend (Terminal 2)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App: http://localhost:5173

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register + auto-create Savings account |
| POST | `/api/auth/login` | Login |
| GET | `/api/dashboard` | Dashboard stats |
| GET/POST | `/api/accounts` | List / create accounts |
| POST | `/api/transactions/deposit` | Deposit money |
| POST | `/api/transactions/withdraw` | Withdraw money |
| POST | `/api/transactions/transfer` | Transfer by account number |
| POST | `/api/ai/chat` | Chat with Maya |

## Deployment

See [frontend/DEPLOYMENT.md](./frontend/DEPLOYMENT.md) for Railway + Vercel production setup.

## Author

**Md Zeeshan** — [GitHub](https://github.com/mdzeeshan-2)
