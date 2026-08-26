# Task Management Board (Kanban Monorepo)

A full-stack Kanban Task Management application built with a modern React frontend and a NestJS backend powered by PostgreSQL and Prisma ORM.

---

## Tech Stack

### Frontend
- **Framework:** React 19 (Hooks only)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`)
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite
- **Testing:** Vitest

### Backend
- **Framework:** NestJS 11 (TypeScript)
- **Database & ORM:** PostgreSQL + Prisma ORM
- **Testing:** Jest

### DevOps & Code Quality
- **Containerization:** Docker & Docker Compose (Multi-stage builds)
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`)
- **Code Quality:** ESLint, Prettier, Husky pre-commit hooks

---

## Features

- **Board Management:** Create new boards, load existing boards by UUID, rename board titles inline, and delete boards.
- **3-Column Kanban Board:** `To Do`, `In Progress`, and `Done` status columns.
- **Card Operations:** Add new cards, edit card title and description inline, and delete cards.
- **Drag-and-Drop Reordering:** Drag cards across columns or reorder position within a column with real-time visual drop line indicators.
- **User Experience:** Instant inline confirmation dialogs, status badges, and human-readable API error feedback.

---

## Quick Start with Docker (Recommended)

Run the entire application (PostgreSQL, NestJS backend, Nginx frontend) with a single command:

```bash
docker compose up --build -d
```

### Accessing the App:
- **Frontend App:** [http://localhost:8080](http://localhost:8080)
- **Backend REST API:** [http://localhost:3000](http://localhost:3000)

To stop the container stack:
```bash
docker compose down
```

---

## 💻 Local Development Setup (Manual)

### 1. Prerequisites
- **Node.js:** v20 or higher
- **PostgreSQL:** Active PostgreSQL instance running locally or via Docker

### 2. Install Dependencies
Install dependencies across all workspaces from the monorepo root:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (or use `.env.example`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kanban?schema=public"
VITE_API_URL="http://localhost:3000"
```

### 4. Database Setup & Prisma Client
Generate Prisma Client and apply database migrations:
```bash
npx prisma generate --schema=backend/prisma/schema.prisma
npx prisma migrate dev --schema=backend/prisma/schema.prisma
```

### 5. Start Development Servers
Run backend and frontend dev servers concurrently:

```bash
# Terminal 1: Backend (NestJS)
npm run start:dev --workspace=backend

# Terminal 2: Frontend (Vite)
npm run dev --workspace=frontend
```

---

## Testing & Code Quality

### Running Unit Tests

#### Both Frontend & Backend Tests:
```bash
npm run test --workspace=backend && npm run test --workspace=frontend
```

#### Backend Unit Tests (Jest):
```bash
npm run test --workspace=backend
```

#### Frontend Unit Tests (Vitest):
```bash
npm run test --workspace=frontend
```

### Running Linters
```bash
# Frontend Linting
npm run lint --workspace=frontend

# Backend Linting
npm run lint --workspace=backend
```

---

## CI/CD Pipeline

The project includes an automated **GitHub Actions CI workflow** (`.github/workflows/ci.yml`) that triggers on all pushes and pull requests to `main` and `dev` branches:
- Runs ESLint code quality checks.
- Generates Prisma Client types.
- Runs backend Jest unit tests and frontend Vitest unit tests.
- Verifies production builds.
