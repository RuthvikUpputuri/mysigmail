# Security Guidelines

## Client-Side Credentials

**WARNING**: This application is a Single Page Application (SPA). If you provide storage credentials (like AWS keys, R2 keys) in your `.env` file, they *will* be bundled into the client-side JavaScript. 

This approach is only suitable if you are hosting the tool internally on a private network, or if you use the authentication feature to prevent unauthorized access.

## Authentication

We have introduced an optional hybrid backend that forces users to log in before they can access the application.

Enable this by setting:
```bash
REQUIRE_AUTH=true
AUTH_USERNAME=your_username
AUTH_PASSWORD_HASH=$argon2id$v=19$m=65536,t=3,p=4$......
```

Passwords are required to be hashed using Argon2 to prevent exposure.

## Pre-Signed URLs (Advanced)

For a fully public deployment without exposing keys, you should use the `custom` storage provider and point it to a secure backend that generates pre-signed URLs or handles the upload securely.
