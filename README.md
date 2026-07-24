# FlowTrack

FlowTrack is a full-stack productivity dashboard for managing daily work in one place. It combines tasks, habit streaks, Pomodoro focus sessions, calendar planning, quick notes, and productivity insights behind secure account authentication.

## Features

- Personal dashboard with today's progress, productivity score, recent activity, and time-worked summaries
- Daily task management with create, rename, complete, and delete actions
- Habit tracking with emoji labels, daily check-ins, and streak calculation
- Configurable Pomodoro timer with persisted focus-session history
- Weekly focus summaries and visual productivity analytics
- Calendar view for navigating day-based activity
- Autosaved personal notes
- Account settings for theme and Pomodoro preferences
- Responsive light and dark interface with animated interactions
- Protected routes and automatic session refresh

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, React Router, Tailwind CSS |
| UI and state | Framer Motion, Lucide React, Recharts, Zustand |
| Server state | TanStack Query |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens, rotating refresh tokens, bcrypt |
| Validation and security | Zod, Helmet, CORS, Express Rate Limit |

## Project structure

```text
flowtrack/
├── client/                 # React single-page application
│   └── src/
│       ├── components/     # Dashboard cards, layout, and reusable UI
│       ├── lib/            # API client, queries, and utilities
│       ├── pages/          # Application routes
│       └── store/          # Authentication and UI state
├── server/                 # Express API and production web server
│   └── src/
│       ├── config/         # Environment and database configuration
│       ├── middleware/     # Authentication, validation, and errors
│       └── modules/        # Feature controllers, routes, and models
├── package.json            # Workspace scripts
└── server/.env.example     # Safe environment-variable template
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- A local MongoDB instance or MongoDB Atlas connection string

### 1. Clone and install

```bash
git clone https://github.com/MohdSafwan-ai/personal-OS.git
cd personal-OS
npm install
```

The root installation command installs dependencies for both npm workspaces.

### 2. Configure the server

Copy the example environment file:

```bash
cp server/.env.example server/.env
```

On PowerShell:

```powershell
Copy-Item server/.env.example server/.env
```

Replace the placeholders in `server/.env` with your own database URL and secrets. Generate separate JWT secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Run that command twice and use a different value for each JWT secret.

### 3. Start development

```bash
npm run dev
```

- Client: `http://localhost:5173`
- API: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

The root development command starts the Vite client and Express server concurrently with file watching enabled.

## Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NODE_ENV` | No | `development` | Runtime mode: `development`, `production`, or `test` |
| `PORT` | No | `5000` | Port used by the Express server |
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Yes | — | Secret used to sign short-lived access tokens; minimum 32 characters |
| `JWT_REFRESH_SECRET` | Yes | — | Separate secret for refresh tokens; minimum 32 characters |
| `ACCESS_TOKEN_TTL` | No | `15m` | Access-token lifetime |
| `REFRESH_TOKEN_TTL_DAYS` | No | `30` | Refresh-token lifetime in days |
| `CLIENT_URL` | No | `http://localhost:5173` | Allowed browser origin; use the public application URL in production |

Never commit `server/.env`. It is ignored by Git; only the placeholder-based `.env.example` belongs in the repository.

## Available scripts

Run these commands from the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the client and server in development mode |
| `npm run typecheck` | Type-check both workspaces without emitting files |
| `npm run build` | Compile the API and create an optimized client build |
| `npm start` | Start the compiled production server |

Workspace-specific scripts can also be run with `-w client` or `-w server`.

## API overview

All feature routes require a bearer access token unless stated otherwise. Refresh tokens are stored in an HTTP-only cookie.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check API availability |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/refresh` | Rotate the refresh token and issue a new access token |
| `POST` | `/api/auth/logout` | Revoke the active session |
| `GET` | `/api/auth/me` | Get the current user |
| `PATCH` | `/api/auth/me` | Update profile or application settings |
| `GET`, `POST` | `/api/tasks` | List or create daily tasks |
| `PATCH`, `DELETE` | `/api/tasks/:id` | Update or remove a task |
| `GET`, `POST` | `/api/habits` | List or create habits |
| `PATCH`, `DELETE` | `/api/habits/:id` | Update or remove a habit |
| `POST` | `/api/habits/:id/checkin` | Add or remove a daily habit check-in |
| `POST` | `/api/focus` | Record a completed focus session |
| `GET` | `/api/focus/summary` | Get focus totals for a date range |
| `GET`, `PUT` | `/api/notes` | Read or save the current user's note |

## Authentication and security

- Passwords are hashed with bcrypt before storage.
- Access tokens are short-lived and kept in browser memory instead of local storage.
- Refresh tokens use secure HTTP-only cookies and rotate on refresh.
- Reuse detection revokes a compromised refresh-token family.
- Credential endpoints are rate-limited to reduce brute-force attempts.
- Request bodies, parameters, and query strings are validated with Zod.
- Helmet applies HTTP security headers, and CORS is restricted to `CLIENT_URL`.
- Each protected database query is scoped to the authenticated user.

## Production deployment

The Express server serves both the API and the compiled React application in production, so the project can run as a single web service.

1. Provision a MongoDB database and copy its connection string.
2. Create a Node.js web service from this repository.
3. Use `npm install && npm run build` as the build command.
4. Use `npm start` as the start command.
5. Configure the production environment variables listed above.
6. Set `NODE_ENV=production` and set `CLIENT_URL` to the service's public HTTPS URL.
7. Configure `/api/health` as the health-check endpoint when supported by the host.

This setup works with platforms such as Render, Railway, Fly.io, or any provider that can run a Node.js process and supply environment variables.

## Vercel frontend with Render backend

The repository includes `client/vercel.json`, configured for the deployed Render API at `https://personal-os-ahjy.onrender.com`.

Vercel forwards every `/api/*` request to Render while keeping the request on the frontend's origin in the browser. This allows the existing HTTP-only authentication cookie flow to work without exposing the backend URL in client code or relying on cross-site cookies. The second rewrite sends all non-API routes to `index.html` so React Router deep links work on Vercel.

Use these Vercel project settings:

| Setting | Value |
| --- | --- |
| Root Directory | `client` |
| Framework Preset | Vite or Other |
| Install Command | `npm install` |
| Build Command | Read from `vercel.json` |
| Output Directory | Read from `vercel.json` |

No environment variable is required in Vercel for the API connection. In Render, set `CLIENT_URL` to the final Vercel production URL, such as `https://your-project.vercel.app`, and redeploy the backend. Keep `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` in Render only; never copy those secrets to Vercel.

The Render service must remain available because Vercel acts only as a reverse proxy for `/api` requests. API responses are not cached by this configuration.

## Production behavior

After `npm run build`:

- Server output is written to `server/dist`.
- Client assets are written to `client/dist`.
- `npm start` launches the compiled Express server.
- API requests continue to use the `/api` prefix.
- Non-API browser routes fall back to `client/dist/index.html` for React Router.
- Express trusts one hosting proxy in production for correct secure-cookie and rate-limit behavior.

## Troubleshooting

### The server exits during startup

Check the environment-validation output. `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` must be set, and both secrets must contain at least 32 characters.

### The browser cannot authenticate or refresh a session

Confirm that `CLIENT_URL` exactly matches the browser origin, including the protocol and port. In production, use an HTTPS URL so secure refresh-token cookies can be sent.

### A client route returns 404 in production

Start the application with `npm start` after a successful `npm run build`. The production Express process provides the SPA fallback; the development server does not use the compiled client.

## Data and privacy

Tasks, habits, focus sessions, notes, account details, and preferences are stored in the configured MongoDB database. Secrets and local tool configuration—including `.env`, `.claude/`, build output, and dependencies—are excluded through `.gitignore`.
