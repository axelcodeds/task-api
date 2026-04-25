# Production Deployment Guide

## Overview

This project runs on Docker with Nginx reverse proxy. All services communicate on an internal Docker network, with Nginx as the public gateway.

## Architecture

```
Internet → Nginx (80/443) → Frontend (internal:3000) & API (internal:3000)
                         ↓
                      PostgreSQL (internal:5432)
```

## Local Development

```bash
docker-compose up --build
```

Visit: `http://localhost:3001` (frontend running on port 3001 for dev)

## Production Deployment (DigitalOcean/VPS)

### 1. Prerequisites

- Docker & Docker Compose installed
- Domain name (for HTTPS)
- DigitalOcean Droplet or VPS with 2GB+ RAM

### 2. Clone and Setup

```bash
git clone <your-repo> task-api
cd task-api

# Update environment variables
cp .env.example .env
nano .env  # Edit DB credentials, JWT secret, NODE_ENV=production
```

### 3. SSL/TLS Certificate (Optional but Recommended)

If using a domain:

```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate (replace your-domain.com)
sudo certbot certonly --standalone -d your-domain.com

# Copy certs to project
mkdir -p certs
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem certs/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem certs/
```

Then update Nginx config with HTTPS block.

### 4. Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 5. Firewall Rules (DigitalOcean)

Allow only:

- **80** (HTTP)
- **443** (HTTPS)
- **22** (SSH, for your management)

Block all other inbound traffic.

### 6. Domain DNS Setup

Add A record:

```
your-domain.com  A  [Droplet IP Address]
```

### 7. Test Deployment

```bash
# Health check
curl http://your-ip/api/health

# Frontend
curl http://your-ip/
```

## Architecture Breakdown

### Nginx (Reverse Proxy)

- Listens on 80 (and 443 if HTTPS)
- Routes `/api/*` → `api:3000/api/*`
- Routes `/` → `frontend:3000`
- Only public-facing service

### Frontend (React + Vite)

- Runs on internal port 3000
- API calls use relative path `/api`
- Served through Nginx proxy

### API (Node.js + Express)

- Runs on internal port 3000
- Rate-limited (5 attempts/15 min for auth)
- Database connection pooling enabled
- CORS enabled for frontend

### Database (PostgreSQL)

- Runs on internal port 5432
- Only accessible from API container
- Data persists in Docker volume `postgres_data`

## Environment Variables

**Production .env**:

```
NODE_ENV=production
DB_USER=postgres
DB_PASSWORD=your-strong-password
DB_NAME=task_api
JWT_SECRET=your-very-long-random-secret-key
PORT=3000
```

## Monitoring & Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f api
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart api
```

## Scaling Notes

Current setup handles ~100-200 concurrent users. For more:

1. Add PM2 cluster mode in API container
2. Add Redis caching layer
3. Use managed database (DigitalOcean PostgreSQL)
4. Add load balancer (DigitalOcean LB)

## SSL/TLS Auto-Renewal

If using Certbot, set up auto-renewal:

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Troubleshooting

### "Connection refused" from frontend to API

- Check Nginx logs: `docker-compose logs nginx`
- Verify API container is running: `docker-compose ps`
- Test API directly: `curl http://localhost/api/health`

### Database connection errors

- Check DB credentials in `.env`
- Verify PostgreSQL is running: `docker-compose ps db`
- Check DB logs: `docker-compose logs db`

### Rate limit errors

- Wait 15 minutes or restart API: `docker-compose restart api`

## Security Best Practices

✅ Done:

- Rate limiting enabled
- CORS configured
- Helmet security headers
- JWT authentication

⚠️ TODO:

- Enable HTTPS (use Certbot above)
- Rotate JWT_SECRET periodically
- Use strong DB password
- Run container as non-root user
- Set up log aggregation (ELK stack)

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-25
