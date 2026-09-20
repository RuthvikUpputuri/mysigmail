# Docker Deployment Guide provide multi-stage Dockerfiles to make deployment as easy as possible.

## Traefik (Default)

The provided `docker-compose.yml` is configured for Traefik. It enables automatic Let's Encrypt SSL and routing.

```bash
docker-compose up -d
```

## Caddy

If you prefer Caddy for automatic HTTPS, we provide `Dockerfile.caddy` and `docker-compose.caddy.yml`.

```bash
docker-compose -f docker-compose.caddy.yml up -d
```

You can mount your own `Caddyfile` using the volumes directive in the compose file.

## Nginx

For a traditional Nginx setup:

```bash
docker-compose -f docker-compose.nginx.yml up -d
```

## Authentication

When running the main `Dockerfile`, the app is served via a lightweight Node.js Express server. This allows you to optionally enable authentication. Set `REQUIRE_AUTH=true` in `.env` to enforce a login page.
