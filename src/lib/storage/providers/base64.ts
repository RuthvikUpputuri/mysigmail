import type { StorageProvider, UploadOptions } from '../index'

export class Base64Provider implements StorageProvider {
  name = 'none' // 'none' translates to Local/Base64 fallback

  isConfigured(): boolean {
    // This is the default/fallback provider, always considered configured
    // if selected or if no other provider is configured.
    return true
  }

  async upload(file: File, _options?: UploadOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })
  }
}
