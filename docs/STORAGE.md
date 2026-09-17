# Storage Configuration Guiders

This application supports multiple storage providers for hosting your uploaded signature images.

Set `STORAGE_PROVIDER` in your `.env` file to one of the following options.

## aws
Uses the official AWS SDK.
- `AWS_S3_REGION`
- `AWS_S3_ID`
- `AWS_S3_KEY`
- `AWS_S3_BASKET`
- `AWS_S3_URL`

## r2
Cloudflare R2 storage.
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_URL`

## supabase
Supabase Storage bucket.
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_BUCKET`

## s3 / minio / do / b2 / wasabi
Generic S3-compatible providers.
- `S3_ENDPOINT` (e.g. `https://s3.us-west-004.backblazeb2.com`)
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_PUBLIC_URL`

## custom
Custom HTTP POST upload endpoint.
- `CUSTOM_UPLOAD_URL`
- `CUSTOM_UPLOAD_HEADERS` (optional JSON string)

## none (Default)
Falls back to Base64 encoding. No external server required.
