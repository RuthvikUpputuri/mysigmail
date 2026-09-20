# Migration Guide

If you are migrating from the original `antonreshetov/mysigmail` v1.x or a standard Vue SPA deployment to `mysigmail-selfhost` (v2.0), follow these instructions to safely preserve your signatures and setup.

## Client-Side Signatures

MySigMail stores the user's customized signatures entirely in the browser's `localStorage` (under the key `signatures`).

- **If keeping the same domain**: No migration is needed! If you upgrade your Docker container and it serves on the same domain as before, the browser will automatically retain the `localStorage`.
- **If changing domains**: You must export your configuration.
  1. Open the original MySigMail app.
  2. Click the gear/settings icon.
  3. Download the JSON backup of your signatures.
  4. Once your new self-hosted instance is running, open it and import the JSON file.

## Backend and Storage

If you previously hard-coded AWS S3 credentials in your `.env` for the Vite build:

1. Copy `.env.example` to `.env` in the new repository.
2. Set `STORAGE_PROVIDER=aws`.
3. Move your `AWS_S3_*` variables over.

If you want to move away from AWS S3, you can easily switch `STORAGE_PROVIDER` to `r2`, `minio`, `supabase`, etc.

## Authentication

Authentication is a new feature in v2.0. If you do not set `REQUIRE_AUTH=true`, the application will behave exactly as the public MySigMail (anyone who accesses the domain can create signatures).

If you want to secure your self-hosted instance so only you can use it:
1. Set `REQUIRE_AUTH=true`.
2. Generate an Argon2 password hash.
3. Provide `AUTH_USERNAME` and `AUTH_PASSWORD_HASH` in your `.env` file.
