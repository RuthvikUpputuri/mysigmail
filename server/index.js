import * as argon2 from 'argon2'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import multer from 'multer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { uploadFile } from './storage.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Enable trust proxy for reverse proxies (Traefik, Nginx, Cloudflare)
app.set('trust proxy', 1)

// We assume the REQUIRE_AUTH is used to enable auth
const requireAuth = process.env.REQUIRE_AUTH === 'true'
const adminUser = process.env.ADMIN_USERNAME || 'admin'
let adminPassHash = process.env.ADMIN_PASSWORD_HASH || null

if (!adminPassHash && process.env.ADMIN_PASSWORD) {
  // Hash the password on startup so we only keep the hash in memory for verification
  argon2.hash(process.env.ADMIN_PASSWORD).then((hash) => {
    adminPassHash = hash
  }).catch((err) => {
    console.error('Failed to hash admin password on startup', err)
  })
}

app.use(express.json())
app.use(cookieParser())

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  // Basic CSP allowing inline styles and scripts (Vue requires some for dev, but we can be stricter for prod if we wanted)
  res.setHeader('Content-Security-Policy', 'default-src \'self\'; img-src \'self\' data: https: http: blob:; style-src \'self\' \'unsafe-inline\' https:; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https:; connect-src \'self\' https: http: wss:;')
  next()
})

if (requireAuth) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-development-only',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: 'auto',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }))
}

// Auth middleware
function authMiddleware(req, res, next) {
  if (!requireAuth)
    return next()

  // Always allow access to login and auth status APIs
  if (req.path === '/api/login' || req.path === '/api/auth/status')
    return next()

  // API requests check
  if (req.path.startsWith('/api/')) {
    if (req.session && req.session.isAuthenticated)
      return next()
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Frontend routes: If not authenticated, we could redirect to /login
  // but since we are serving a SPA, we should probably serve the index.html
  // and let the client-side router handle the login page logic based on a check API.
  next()
}

app.use(authMiddleware)

// Auth check API
app.get('/api/auth/status', (req, res) => {
  res.setHeader('Cache-Control', 'no-store')
  if (!requireAuth)
    return res.json({ requireAuth: false, isAuthenticated: true })
  res.json({ requireAuth: true, isAuthenticated: !!req.session.isAuthenticated })
})

// Login API
app.post('/api/login', async (req, res) => {
  const { password, username } = req.body

  if (!requireAuth) {
    return res.json({ success: true })
  }

  if (username !== adminUser) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  if (!adminPassHash) {
    console.error('ADMIN_PASSWORD is not set in environment or hashing failed.')
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  try {
    const isMatch = await argon2.verify(adminPassHash, password)
    if (isMatch) {
      req.session.isAuthenticated = true
      return req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err)
          return res.status(500).json({ error: 'Session error' })
        }
        res.json({ success: true })
      })
    }
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  catch (err) {
    console.error('Error verifying password', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Logout API
app.post('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy()
  }
  res.json({ success: true })
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

// Upload API
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  try {
    const url = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype)
    res.json({ url })
  }
  catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

// Serve static files from dist directory
const distPath = path.join(__dirname, '../dist')
app.use(express.static(distPath))

// SPA fallback for vue-router
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
  if (requireAuth) {
    console.log('Authentication is REQUIRED.')
  }
  else {
    console.log('Authentication is DISABLED.')
  }
})
