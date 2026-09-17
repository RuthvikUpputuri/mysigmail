export interface UploadOptions {
  contentType?: string
}

export interface StorageProvider {
  name: string
  upload(file: File, options?: UploadOptions): Promise<string>
  isConfigured(): boolean
}

import { AwsS3Provider } from './providers/aws'
import { R2Provider } from './providers/r2'
import { SupabaseProvider } from './providers/supabase'
import { GenericS3Provider } from './providers/s3'
import { CustomHttpProvider } from './providers/custom'
import { Base64Provider } from './providers/base64'

export function getStorageProvider(): StorageProvider {
  const providerName = import.meta.env.STORAGE_PROVIDER || 'none'

  let provider: StorageProvider

  switch (providerName) {
    case 'aws':
      provider = new AwsS3Provider()
      break
    case 'r2':
      provider = new R2Provider()
      break
    case 'supabase':
      provider = new SupabaseProvider()
      break
    case 'minio':
    case 'do':
    case 'b2':
    case 'wasabi':
    case 's3':
      provider = new GenericS3Provider(providerName)
      break
    case 'custom':
      provider = new CustomHttpProvider()
      break
    case 'none':
    default:
      provider = new Base64Provider()
      break
  }

  // Fallback to base64 if selected provider is not properly configured
  if (!provider.isConfigured() && providerName !== 'none') {
    console.warn(`Storage provider '${providerName}' is selected but not configured properly. Falling back to base64.`)
    return new Base64Provider()
  }

  return provider
}
