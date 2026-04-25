# Deployment Runbook

## Required Environment Variables

Set these values in `.env.production`:

- `NODE_ENV=production`
- `PORT=3000`
- `DB_HOST=db`
- `DB_PORT=5432`
- `DB_NAME=task_api`
- `DB_USER=postgres`
- `DB_PASSWORD=<strong-production-password>`
- `JWT_SECRET=<long-random-secret>`
- `JWT_EXPIRE=7d`

The app now fails fast on startup in production if `JWT_SECRET` or `DB_PASSWORD` are missing or using insecure defaults.

## Build and Run

```bash
docker compose build
docker compose up -d
```

## Health Check

```bash
curl http://localhost:3000/health
```

## Rollback

If the latest image was tagged with the previous stable version:

```bash
docker compose down
docker compose pull
docker compose up -d
```

If you need to pin a previous image tag, set that tag in `docker-compose.yml` and redeploy:

```bash
docker compose down
docker compose up -d
```

## Basic Troubleshooting

- View API logs:

```bash
docker compose logs -f api
```

- View DB logs:

```bash
docker compose logs -f db
```

- Validate running containers:

```bash
docker compose ps
```

- Check effective compose config:

```bash
docker compose config
```

- Restart services:

```bash
docker compose restart api db
```
