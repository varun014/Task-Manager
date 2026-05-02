# Team Task Manager

A full-stack collaborative task management app built with React, Tailwind CSS, Node.js/Express, and MongoDB.

## Features

- JWT auth (signup, login, current user)
- Project management with role-based member access
- Task management with status/priority/due date
- Dashboard summary with task status chart and overdue list
- Admin/member access rules at project level

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, React Router, Axios, Recharts
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs, express-validator
- Database: MongoDB

## Folder Structure

- `client/` React app
- `server/` Express API

## Quick Start

1. Backend setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

2. Frontend setup

```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

3. Open

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`

## Environment Variables

Server (`server/.env`):

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/team_task_manager
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=
NODE_ENV=development
```

Client (`client/.env`):

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

## API Base

`http://localhost:5001/api`

Main route groups:

- `/auth`
- `/projects`
- `/tasks`
- `/dashboard`
