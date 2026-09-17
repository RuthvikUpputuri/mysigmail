import type { StorageProvider, UploadOptions } from '../index'

export class CustomHttpProvider implements StorageProvider {
  name = 'custom'

  isConfigured(): boolean {
    return !!import.meta.env.CUSTOM_UPLOAD_URL
  }

  async upload(file: File, _options?: UploadOptions): Promise<string> {
    const uploadUrl = import.meta.env.CUSTOM_UPLOAD_URL
    if (!uploadUrl) {
      throw new Error('Custom upload URL is not configured.')
    }

    const formData = new FormData()
    formData.append('file', file)
    
    // Some implementations might require 'upload/form-data' or similar. 
    // We append the file directly.

    let customHeaders = {}
    if (import.meta.env.CUSTOM_UPLOAD_HEADERS) {
      try {
        customHeaders = JSON.parse(import.meta.env.CUSTOM_UPLOAD_HEADERS)
      } catch (err) {
        console.error('Failed to parse CUSTOM_UPLOAD_HEADERS', err)
      }
    }

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        ...customHeaders
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`)
    }

    // Assume the server returns JSON with { url: '...' }
    const json = await response.json()
    if (json && json.url) {
      return json.url
    }

    throw new Error('Custom upload server did not return a valid URL field in JSON response.')
  }
}
