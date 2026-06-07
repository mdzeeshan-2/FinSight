# FinSight Deployment Guide

Deploy the full stack: **Railway (backend + PostgreSQL)** + **Vercel (frontend)**.

---

## Prerequisites

- GitHub account
- [Railway](https://railway.app) account (free $5/month credit)
- [Vercel](https://vercel.com) account (free)
- OpenAI or Groq API key for Maya AI chat

---

## Part 1 — Deploy Backend (Railway)

### Step 1: Push monorepo to GitHub

```bash
cd finsight
git add .
git commit -m "FinSight full-stack monorepo"
git push -u origin main
```

Repo: `https://github.com/mdzeeshan-2/FinSight`

### Step 2: Create Railway project

1. Go to [railway.app/new](https://railway.app/new)
2. **Deploy from GitHub repo** → select `FinSight`
3. Set **Root Directory** to `backend`
3. Click **+ New** → **Database** → **PostgreSQL**
4. Railway auto-links `DATABASE_URL` to your service

### Step 3: Set environment variables

In Railway → your backend service → **Variables**:

| Variable | Example |
|----------|---------|
| `JWT_SECRET` | `my-super-secret-jwt-key-min-32-chars-long` |
| `OPENAI_API_KEY` | `sk-...` or Groq `gsk_...` |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` (or Groq URL) |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app,http://localhost:5173` |

Optional for Groq (free AI):

```
OPENAI_BASE_URL=https://api.groq.com/openai/v1
```

And set model in backend `application.yml` to `llama-3.1-8b-instant`.

### Step 4: Get backend URL

Railway → Settings → **Generate Domain**

Example: `https://finsight-backend-production.up.railway.app`

Test: `https://YOUR-URL/actuator/health` → should return `"status":"UP"`

---

## Part 2 — Deploy Frontend (Vercel)

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → select `FinSight`
3. Set **Root Directory** to `frontend`
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`

### Step 3: Environment variable

Add in Vercel → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://finsight-backend-production.up.railway.app` |

(No trailing slash)

### Step 4: Deploy

Click **Deploy**. Your live URL: `https://finsight-xyz.vercel.app`

### Step 5: Update Railway CORS

Go back to Railway and update `CORS_ALLOWED_ORIGINS` with your Vercel URL:

```
https://finsight-xyz.vercel.app,http://localhost:5173
```

Redeploy backend if needed.

---

## Part 3 — Local Development

### Terminal 1 — Backend

```bash
cd backend
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
./start-local.sh
```

### Terminal 2 — Frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local if needed
npm install
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

---

## End-to-End Test Checklist

| # | Test | Expected |
|---|------|----------|
| 1 | Register new user | Redirect to dashboard, SAVINGS account created |
| 2 | Dashboard loads | Stats, chart, recent transactions |
| 3 | Deposit ₹5000 | Balance updates instantly |
| 4 | Withdraw ₹1000 | Balance decreases, validation on overdraft |
| 5 | Create CURRENT account | New card appears on Accounts page |
| 6 | Transfer to another account number | Both balances update |
| 7 | Chat with Maya | AI responds (needs API key) |
| 8 | Logout + Login | Session persists with refresh token |
| 9 | Mobile view | Sidebar collapses to hamburger menu |

---

## Free API Sign-Up Summary

| Service | URL | Cost |
|---------|-----|------|
| Railway | [railway.app](https://railway.app) | Free $5/month credit |
| Vercel | [vercel.com](https://vercel.com) | Free forever |
| OpenAI | [platform.openai.com](https://platform.openai.com) | ~$0.01/conversation |
| Groq (free alt) | [console.groq.com](https://console.groq.com) | Free tier |

---

## Troubleshooting

**CORS errors:** Ensure `CORS_ALLOWED_ORIGINS` on Railway includes your exact Vercel URL (no trailing slash).

**401 on all requests:** Check `JWT_SECRET` is set on Railway. Re-login after deploy.

**AI chat offline:** Set `OPENAI_API_KEY` on Railway. Without it, Maya returns a friendly offline message.

**Database connection failed:** Verify PostgreSQL plugin is linked and `DATABASE_URL` is set automatically.

**Blank page on Vercel:** Check `VITE_API_BASE_URL` is set and rebuild.

---

## Live Demo URL Structure

```
https://your-app.vercel.app/login       → Login page
https://your-app.vercel.app/register    → Register
https://your-app.vercel.app/dashboard   → Main dashboard
https://your-app.vercel.app/ai-chat     → Maya AI chat
```

Share the Vercel URL with recruiters — everything runs live.
