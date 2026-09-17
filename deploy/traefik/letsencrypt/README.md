# Let's Encrypt Storage

This directory is used by Traefik to store the `acme.json` file which contains your SSL certificates.
Do not commit `acme.json` to version control.

If `acme.json` does not exist, Docker might create it as a directory.
You should create the file manually before running docker-compose:

```bash
touch acme.json
chmod 600 acme.json
```
