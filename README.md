# Personal OS

A full-stack productivity app — tasks, habits with streaks, Pomodoro focus
tracking, calendar, and notes — behind JWT auth with rotating refresh tokens.

**Stack:** React 18 · Vite · Tailwind · Framer Motion · TanStack Query · Zustand
· Express · Mongoose (MongoDB) · Zod

## Development

```bash
npm install
cp server/.env.example server/.env   # fill in MONGODB_URI + JWT secrets
npm run dev                          # client on :5173, API on :5000
```

Generate JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Production build & run

```bash
npm run build   # compiles server to server/dist, client to client/dist
npm start       # serves API + built client from one Express process
```

In production (`NODE_ENV=production`) Express serves `client/dist` with an SPA
fallback, so a single service hosts everything — no separate static host or
CORS setup needed.

## Deploying (Render / Railway / Fly / any Node host)

1. Create a MongoDB Atlas cluster (free tier works) and grab the connection string.
2. Create a Node web service from this repo:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
3. Set environment variables:

   | Variable | Value |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_ACCESS_SECRET` | 64+ random hex chars |
   | `JWT_REFRESH_SECRET` | 64+ random hex chars (different from access) |
   | `CLIENT_URL` | the service's public URL, e.g. `https://your-app.onrender.com` |
   | `PORT` | usually injected by the host automatically |

4. Deploy. The health check endpoint is `GET /api/health`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Run client + server in watch mode |
| `npm run build` | Production build of both workspaces |
| `npm start` | Run the production server (after build) |
| `npm run typecheck` | Typecheck both workspaces |
