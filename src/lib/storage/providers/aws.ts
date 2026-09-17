import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import type { StorageProvider, UploadOptions } from '../index'

export class AwsS3Provider implements StorageProvider {
  name = 'aws-s3'
  private s3Client: S3Client | null = null

  constructor() {
    if (this.isConfigured()) {
      try {
        this.s3Client = new S3Client({
          region: import.meta.env.AWS_S3_REGION,
          credentials: {
            accessKeyId: import.meta.env.AWS_S3_ID,
            secretAccessKey: import.meta.env.AWS_S3_KEY,
          },
        })
      } catch (err) {
        console.error('Failed to initialize AWS S3 Client', err)
      }
    }
  }

  isConfigured(): boolean {
    return !!(
      import.meta.env.AWS_S3_URL &&
      import.meta.env.AWS_S3_BASKET &&
      import.meta.env.AWS_S3_ID &&
      import.meta.env.AWS_S3_KEY &&
      import.meta.env.AWS_S3_REGION
    )
  }

  async upload(file: File, options?: UploadOptions): Promise<string> {
    if (!this.s3Client) {
      throw new Error('AWS S3 provider is not properly configured.')
    }

    const key = `signature/upload/${Date.now()}-${file.name}`

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: import.meta.env.AWS_S3_BASKET,
        Key: key,
        Body: file,
        ContentType: options?.contentType || file.type,
        ACL: 'public-read',
      },
    })

    await upload.done()

    const cdnUrl = import.meta.env.AWS_S3_URL
    return `${cdnUrl}/${key}`
  }
}
