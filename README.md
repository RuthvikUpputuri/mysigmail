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

<h1 align="center">EmailSign (formerly MySigMail)</h1>
<p align="center">
  <strong>An open-source email signature generator for Gmail, Outlook, Apple Mail, etc.</strong>
  <br>
  Build a sleek, professional-looking signature that enhances your brand.
</p>

<p align="center">
  <a href="https://github.com/RuthvikUpputuri/mysigmail/releases"><img alt="GitHub package.json version" src="https://img.shields.io/badge/version-v2.1.0-blue"></a>
  <a href="https://github.com/RuthvikUpputuri/mysigmail/blob/test/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/RuthvikUpputuri/mysigmail"></a>
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
git clone https://github.com/RuthvikUpputuri/mysigmail
cd mysigmail

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
git clone https://github.com/RuthvikUpputuri/mysigmail
cd mysigmail

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
By default, the editor is publicly accessible. To secure your self-hosted instance, you can enable authentication to restrict access to public.

You can set `ADMIN_USERNAME` to any username of your choice, and `ADMIN_PASSWORD` to a secure string:
```env
REQUIRE_AUTH=true
ADMIN_USERNAME=your_custom_username
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
- **Manage multiple signatures** – create, save, and switch between multiple signatures effortlessly, all stored safely on their servers
- **Shared signatures** – share ready-to-use signatures that your teammates can copy and install.
- **Analytics** – track clicks and engagement from your email signature.
- **Presets library** – professionally designed signature styles you can apply in one click.
- **Image hosting** – reliable CDN hosting for logos, banners, and photos.

### Tools
Extend your signatures with powerful marketing and branding tools:

- **Sign Off** – create a handwritten signature and add it as a personal sign-off to your email signature
- **URL Builder** – generate UTM-tagged URLs and seamlessly track your campaigns in Google Analytics
- **Banner Maker** *(coming soon)* – design and add eye-catching banners to promote events, offers, or announcements directly in your email signature

Check out **[MySigMail](https://mysigmail.com)** and start creating professional email signatures in seconds.

---

## Contribution Policy

This specific fork is actively maintained. Please feel free to open PRs for bug fixes, new storage providers, or core enhancements.

For the upstream repository's contribution policy, please read [CONTRIBUTING.md](CONTRIBUTING.md).

## Modded Open Source Notice

This repository is a modified fork of the original MySigMail project (originally licensed under AGPL-3.0 by Anton Reshetov).

### Major Changes Implemented (2026):
* **Docker-First Deployment**: Completely refactored deployment architecture to support production-ready multi-stage Docker builds with Caddy, Nginx, and Traefik reverse proxy configurations.
* **Pluggable Storage Subsystem**: Built a comprehensive backend storage provider interface natively supporting AWS S3, Cloudflare R2, Supabase, Custom HTTP, and local Base64 fallback.
* **Authentication Layer**: Implemented a Node.js Express backend using Argon2 password hashing to support private, single-admin authenticated deployments.
* **Cross-Platform Architecture**: Added cross-compilation support via `docker buildx` for multi-architecture deployments.
* **Tooling Modernization**: Fixed TypeScript DOM declaration errors and expanded support for modern package managers (`bun`, `pnpm`, `yarn`).

All custom modifications and files added under this forked repository since 16th September 2026 are authored by [Ruthvik Upputuri](https://github.com/RuthvikUpputuri) and remain released under the terms of the GNU AGPL-3.0 license.

## License

This project is licensed under the **AGPL-3.0 License**.
See the [LICENSE](LICENSE) file for more details.

## Commercial Use

For commercial use inquiries regarding the original MySigMail codebase, please contact the original author for a commercial license at reshetov.art@gmail.com.

For custom features added in this fork, Ruthvik Upputuri at connect@upputuri.in

By using this software, you agree to the terms of the AGPL-3.0 license.

Copyright (c) 2019-present, Anton Reshetov.
Copyright (c) 2026, Ruthvik Upputuri.
