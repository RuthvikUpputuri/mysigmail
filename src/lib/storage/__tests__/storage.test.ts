import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getStorageProvider } from '../index'
import { GenericS3Provider } from '../providers/s3'
import { SupabaseProvider } from '../providers/supabase'
import { Base64Provider } from '../providers/base64'
import { CustomHttpProvider } from '../providers/custom'

describe('Storage Provider Factory', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should return Base64Provider by default when no provider is configured', () => {
    vi.stubEnv('VITE_STORAGE_PROVIDER', '')
    const provider = getStorageProvider()
    expect(provider).toBeInstanceOf(Base64Provider)
  })

  it('should return GenericS3Provider when VITE_STORAGE_PROVIDER=s3', () => {
    vi.stubEnv('VITE_STORAGE_PROVIDER', 's3')
    vi.stubEnv('VITE_S3_BUCKET', 'test')
    vi.stubEnv('VITE_S3_ACCESS_KEY_ID', 'test')
    vi.stubEnv('VITE_S3_SECRET_ACCESS_KEY', 'test')
    const provider = getStorageProvider()
    expect(provider).toBeInstanceOf(GenericS3Provider)
    expect(provider.isConfigured()).toBe(true)
  })

  it('should return SupabaseProvider when VITE_STORAGE_PROVIDER=supabase', () => {
    vi.stubEnv('VITE_STORAGE_PROVIDER', 'supabase')
    vi.stubEnv('VITE_SUPABASE_URL', 'test')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test')
    vi.stubEnv('VITE_SUPABASE_BUCKET', 'test')
    const provider = getStorageProvider()
    expect(provider).toBeInstanceOf(SupabaseProvider)
    expect(provider.isConfigured()).toBe(true)
  })

  it('should return CustomHttpProvider when VITE_STORAGE_PROVIDER=custom', () => {
    vi.stubEnv('VITE_STORAGE_PROVIDER', 'custom')
    vi.stubEnv('VITE_CUSTOM_UPLOAD_URL', 'test')
    const provider = getStorageProvider()
    expect(provider).toBeInstanceOf(CustomHttpProvider)
    expect(provider.isConfigured()).toBe(true)
  })
})

describe('Base64Provider', () => {
  it('should correctly convert a file to base64', async () => {
    const provider = new Base64Provider()
    // Mock FileReader since we are in node env
    global.FileReader = class {
      onload: any;
      result: any;
      readAsDataURL() {
        setTimeout(() => {
          this.result = 'data:text/plain;base64,test'
          this.onload()
        }, 10)
      }
    } as any
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const base64 = await provider.upload(file)
    expect(base64).toContain('data:text/plain;base64,')
  })
})
