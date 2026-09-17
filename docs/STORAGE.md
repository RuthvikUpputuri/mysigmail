# Storage Providers

This application supports multiple storage providers for hosting your uploaded signature images.

Set `VITE_STORAGE_PROVIDER` in your `.env` file to one of the following options.

## aws
Uses the official AWS SDK.
- `VITE_AWS_S3_REGION`
- `VITE_AWS_S3_ID`
- `VITE_AWS_S3_KEY`
- `VITE_AWS_S3_BASKET`
- `VITE_AWS_S3_URL`

## r2
Cloudflare R2 storage.
- `VITE_R2_ACCOUNT_ID`
- `VITE_R2_ACCESS_KEY_ID`
- `VITE_R2_SECRET_ACCESS_KEY`
- `VITE_R2_BUCKET`
- `VITE_R2_PUBLIC_URL`

## supabase
Supabase Storage bucket.
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_BUCKET`

## s3 / minio / do / b2 / wasabi
Generic S3-compatible providers.
- `VITE_S3_ENDPOINT` (e.g. `https://s3.us-west-004.backblazeb2.com`)
- `VITE_S3_REGION`
- `VITE_S3_BUCKET`
- `VITE_S3_ACCESS_KEY_ID`
- `VITE_S3_SECRET_ACCESS_KEY`
- `VITE_S3_PUBLIC_URL`

## custom
Custom HTTP POST upload endpoint.
- `VITE_CUSTOM_UPLOAD_URL`
- `VITE_CUSTOM_UPLOAD_HEADERS` (optional JSON string)

## none (Default)
Falls back to Base64 encoding. No external server required.
