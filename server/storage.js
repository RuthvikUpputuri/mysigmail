import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { createClient } from '@supabase/supabase-js'

/**
 * Auto-detects configured storage provider based on environment variables
 * and uploads the file buffer securely from the backend.
 */
export async function uploadFile(fileBuffer, originalName, mimeType) {
  const timestamp = Date.now()
  const key = `signature/upload/${timestamp}-${originalName.replace(/\s+/g, '_')}`

  // 1. Check Cloudflare R2
  if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET) {
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
    
    const upload = new Upload({
      client: s3Client,
      params: { 
        Bucket: process.env.R2_BUCKET, 
        Key: key, 
        Body: fileBuffer, 
        ContentType: mimeType 
      },
    })
    await upload.done()
    
    if (process.env.R2_PUBLIC_URL) {
      return `${process.env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
    }
    return `https://${process.env.R2_BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`
  }

  // 2. Check Generic S3 / AWS S3
  if (process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && process.env.S3_BUCKET) {
    const s3Client = new S3Client({
      region: process.env.S3_REGION || 'auto',
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: !!process.env.S3_ENDPOINT,
    })
    
    const upload = new Upload({
      client: s3Client,
      params: { 
        Bucket: process.env.S3_BUCKET, 
        Key: key, 
        Body: fileBuffer, 
        ContentType: mimeType, 
        ACL: 'public-read' 
      },
    })
    await upload.done()
    
    if (process.env.S3_PUBLIC_URL) {
      return `${process.env.S3_PUBLIC_URL.replace(/\/$/, '')}/${key}`
    }
    if (process.env.S3_ENDPOINT) {
      return `${process.env.S3_ENDPOINT.replace(/\/$/, '')}/${process.env.S3_BUCKET}/${key}`
    }
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION || 'us-east-1'}.amazonaws.com/${key}`
  }
  
  // 3. Check Supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_BUCKET) {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
    const { data, error } = await supabase.storage.from(process.env.SUPABASE_BUCKET).upload(key, fileBuffer, {
      contentType: mimeType,
      upsert: true
    })
    if (error) throw error
    const { data: publicData } = supabase.storage.from(process.env.SUPABASE_BUCKET).getPublicUrl(key)
    return publicData.publicUrl
  }

  // 4. Check Custom HTTP
  if (process.env.CUSTOM_UPLOAD_URL) {
    const formData = new FormData()
    formData.append('file', new Blob([fileBuffer], { type: mimeType }), originalName)
    
    let headers = {}
    if (process.env.CUSTOM_UPLOAD_HEADERS) {
      try { 
        headers = JSON.parse(process.env.CUSTOM_UPLOAD_HEADERS) 
      } catch(e) {
        console.error('Invalid CUSTOM_UPLOAD_HEADERS JSON')
      }
    }
    
    const res = await fetch(process.env.CUSTOM_UPLOAD_URL, { 
      method: 'POST', 
      body: formData, 
      headers 
    })
    
    if (!res.ok) {
      throw new Error(`Custom upload failed with status ${res.status}`)
    }
    
    const json = await res.json()
    return json.url || json.publicUrl || json.fileUrl
  }

  // 5. Fallback: Base64
  return `data:${mimeType};base64,${fileBuffer.toString('base64')}`
}
