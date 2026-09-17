<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/logo-white.png">
    <source media="(prefers-color-scheme: light)" srcset=".github/logo-black.png">
    <img src=".github/logo-black.png" width="100" alt="EmailSign Logo" />
  </picture>
</p>

<p align="center">
  <img src=".github/hero.png" width="500" alt="EmailSign - Email Signature Generator" />
</p>

<h1 align="center">EmailSign (formerly MySigMail Self-Host)</h1>
<p align="center">
  <strong>An open-source email signature generator for Gmail, Outlook, Apple Mail, etc.</strong>
  <br>
  Build a sleek, professional-looking signature that enhances your brand.
</p>

<p align="center">
  <em>This project is a self-hosted fork of the original <a href="https://github.com/antonreshetov/mysigmail">MySigMail</a> project.</em>
</p>

---

## About
Creating an email signature is not a trivial task, especially for non-technical people.
Most existing solutions are either paid or closed-source.

**EmailSign** makes it easy, free, open-source, and natively self-hostable.
Let’s make creating professional signatures accessible for everyone!

## Features
- **Customization** – fonts, colors, avatar shapes, social icons, custom fields.
- **Templates** – ready-to-use layouts for quick start.
- **Add-ons** – disclaimer, call-to-action, and more.
- **Multi Package Manager Support** – works seamlessly with `npm`, `pnpm`, `yarn`, and `bun`.
- **Pluggable Storage** – extensive support for Cloudflare R2, AWS S3, Supabase, MinIO, DO Spaces, or local Base64 fallback.
- **Docker-First Architecture** – effortlessly deploy using included Nginx, Caddy, or Traefik configurations.

---

## Self-Hosting Guide

### 1. Docker Deployment (Recommended)
This repository includes a multi-stage Docker build optimized for production. I provided sample pre-configured docker-compose files for your favorite (caddy/traefik/nginx) reverse proxy.

```bash
git clone https://github.com/your-org/emailsign
cd emailsign

# For Traefik (Default)
docker compose -f docker/docker-compose.yml up -d

# For Caddy (Automatic HTTPS)
docker compose -f docker/docker-compose.caddy.yml up -d

# For Nginx
docker compose -f docker/docker-compose.nginx.yml up -d
```

For advanced details regarding Docker and reverse proxy setups, please read our [Docker Deployment Guide](docs/DOCKER.md).

### 2. Manual Installation (Node.js)

You can run this project locally using your preferred package manager (Node.js >= 20 is recommended).

```bash
# Clone the repository
git clone https://github.com/your-org/emailsign
cd emailsign

# Install dependencies using npm, pnpm, yarn, or bun
npm install   # OR pnpm install / yarn install / bun install

# Start the development server
npm run dev

# Build for production
npm run build
```

---

## Configuration & Storage

Copy the `.env.example` file to `.env` and configure it according to your needs:
```bash
cp .env.example .env
```

**Authentication (Optional)**:
If you are running the project using the Node.js backend instead of just the static files, you can require users to log in before using the editor:
```env
VITE_REQUIRE_AUTH=true
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_me_to_a_strong_password
```

**Storage Providers**:
EmailSign supports saving uploaded images directly to the cloud without requiring a backend. You can use:
- `s3` (AWS S3)
- `r2` (Cloudflare R2)
- `supabase`
- `minio` / `do` / `b2` / `wasabi`
- `none` (Fallback to Base64 encoding - images are embedded directly into the HTML)

For full details on configuring these storage providers securely, please see the [Storage Configuration Guide](docs/STORAGE.md).

---

## Security & Architecture
- All credentials should be provided via `.env` or Docker secrets.
- **Client-Side First**: The visual signature editor and rendering are completely client-side.
- If you are deploying securely to the public internet, ensure you are utilizing the provided Traefik or Caddy TLS configurations and keeping API endpoints locked down. Read our [Security Guidelines](docs/SECURITY.md) for more details.

---

## Original MySigMail SaaS Version
Don’t want to deal with setup and running locally?

Use the original **[MySigMail](https://mysigmail.com)** – a production-ready SaaS version hosted and packed with extra features.

### Key SaaS Features
- **Manage multiple signatures** – create, save, and switch between multiple signatures effortlessly, all stored safely on their servers.
- **Shared signatures** – share ready-to-use signatures that your teammates can copy and install.
- **Analytics** – track clicks and engagement from your email signature.
- **Presets library** – professionally designed signature styles you can apply in one click.
- **Image hosting** – reliable CDN hosting for logos, banners, and photos.

Check out **[MySigMail](https://mysigmail.com)** and start creating professional email signatures in seconds.

---

## Contribution Policy

This specific fork is actively maintained. Please feel free to open PRs for bug fixes, new storage providers, or core enhancements. 

For the upstream repository's contribution policy, please read [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the **AGPL-3.0 License**.
See the [LICENSE](LICENSE) file for more details.

## Commercial Use

For commercial use inquiries regarding the original MySigMail codebase, please contact the original author for a commercial license at reshetov.art@gmail.com.

By using this software, you agree to the terms of the license.

Copyright (c) 2019-present, [Anton Reshetov](https://github.com/antonreshetov).
