import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import type { StorageProvider, UploadOptions } from '../index'

export class R2Provider implements StorageProvider {
  name = 'r2'
  private s3Client: S3Client | null = null

  constructor() {
    if (this.isConfigured()) {
      try {
        const accountId = import.meta.env.VITE_R2_ACCOUNT_ID
        this.s3Client = new S3Client({
          region: 'auto',
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID,
            secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY,
          },
        })
      } catch (err) {
        console.error('Failed to initialize Cloudflare R2 Client', err)
      }
    }
  }

  isConfigured(): boolean {
    return !!(
      import.meta.env.VITE_R2_ACCOUNT_ID &&
      import.meta.env.VITE_R2_BUCKET &&
      import.meta.env.VITE_R2_ACCESS_KEY_ID &&
      import.meta.env.VITE_R2_SECRET_ACCESS_KEY
    )
  }

  async upload(file: File, options?: UploadOptions): Promise<string> {
    if (!this.s3Client) {
      throw new Error('Cloudflare R2 provider is not properly configured.')
    }

    const key = `signature/upload/${Date.now()}-${file.name}`
    const bucket = import.meta.env.VITE_R2_BUCKET

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: options?.contentType || file.type,
      },
    })

    await upload.done()

    const publicUrl = import.meta.env.VITE_R2_PUBLIC_URL
    if (publicUrl) {
      return `${publicUrl.replace(/\/$/, '')}/${key}`
    }
    
    throw new Error('Upload succeeded, but VITE_R2_PUBLIC_URL is not set so cannot return public image URL.')
  }
}
