import type { StorageProvider, UploadOptions } from '../index'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export class SupabaseProvider implements StorageProvider {
  name = 'supabase'
  private supabase: SupabaseClient | null = null

  constructor() {
    if (this.isConfigured()) {
      try {
        const supabaseUrl = import.meta.env.SUPABASE_URL
        const supabaseKey = import.meta.env.SUPABASE_ANON_KEY
        this.supabase = createClient(supabaseUrl, supabaseKey)
      } catch (err) {
        console.error('Failed to initialize Supabase Client', err)
      }
    }
  }

  isConfigured(): boolean {
    return !!(
      import.meta.env.SUPABASE_URL &&
      import.meta.env.SUPABASE_ANON_KEY &&
      import.meta.env.SUPABASE_BUCKET
    )
  }

  async upload(file: File, options?: UploadOptions): Promise<string> {
    if (!this.supabase) {
      throw new Error('Supabase provider is not properly configured.')
    }

    const bucketName = import.meta.env.SUPABASE_BUCKET
    const key = `signature/upload/${Date.now()}-${file.name}`

    const { error } = await this.supabase.storage
      .from(bucketName)
      .upload(key, file, {
        contentType: options?.contentType || file.type,
        upsert: false,
      })

    if (error) {
      throw error
    }

    const { data: publicUrlData } = this.supabase.storage
      .from(bucketName)
      .getPublicUrl(key)

    return publicUrlData.publicUrl
  }
}
