import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import type { StorageProvider, UploadOptions } from '../index'

export class GenericS3Provider implements StorageProvider {
  name: string
  private s3Client: S3Client | null = null

  constructor(name = 's3') {
    this.name = name
    if (this.isConfigured()) {
      try {
        const endpoint = import.meta.env.S3_ENDPOINT
        this.s3Client = new S3Client({
          region: import.meta.env.S3_REGION || 'auto',
          endpoint: endpoint ? endpoint : undefined,
          credentials: {
            accessKeyId: import.meta.env.S3_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.S3_SECRET_ACCESS_KEY,
          },
          // Important for S3-compatible endpoints like MinIO, DO, etc.
          forcePathStyle: true,
        })
      } catch (err) {
        console.error(`Failed to initialize ${name} Client`, err)
      }
    }
  }

  isConfigured(): boolean {
    return !!(
      import.meta.env.S3_BUCKET &&
      import.meta.env.S3_ACCESS_KEY_ID &&
      import.meta.env.S3_SECRET_ACCESS_KEY
    )
  }

  async upload(file: File, options?: UploadOptions): Promise<string> {
    if (!this.s3Client) {
      throw new Error(`${this.name} provider is not properly configured.`)
    }

    const key = `signature/upload/${Date.now()}-${file.name}`
    const bucket = import.meta.env.S3_BUCKET

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: options?.contentType || file.type,
        ACL: 'public-read',
      },
    })

    await upload.done()

    const publicUrl = import.meta.env.S3_PUBLIC_URL
    if (publicUrl) {
      return `${publicUrl.replace(/\/$/, '')}/${key}`
    }

    const endpoint = import.meta.env.S3_ENDPOINT
    if (endpoint) {
      return `${endpoint.replace(/\/$/, '')}/${bucket}/${key}`
    }

    // Fallback if no public URL and no endpoint is defined but it's S3
    return `https://${bucket}.s3.${import.meta.env.S3_REGION}.amazonaws.com/${key}`
  }
}
