import express from 'express'
import session from 'express-session'
import * as argon2 from 'argon2'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// We assume the VITE_REQUIRE_AUTH is used to enable auth
const requireAuth = process.env.VITE_REQUIRE_AUTH === 'true'
const adminUser = process.env.AUTH_USERNAME || 'admin'
const adminPassHash = process.env.AUTH_PASSWORD_HASH // Should be generated with argon2

app.use(express.json())
app.use(cookieParser())

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  // Basic CSP allowing inline styles and scripts (Vue requires some for dev, but we can be stricter for prod if we wanted)
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https: http: blob:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' https: http: wss:;")
  next()
})

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-for-development-only',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Auth middleware
const authMiddleware = (req, res, next) => {
  if (!requireAuth) return next()

  // Always allow access to login API
  if (req.path === '/api/login') return next()
  
  // API requests check
  if (req.path.startsWith('/api/')) {
    if (req.session.isAuthenticated) return next()
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
  if (!requireAuth) return res.json({ requireAuth: false, isAuthenticated: true })
  res.json({ requireAuth: true, isAuthenticated: !!req.session.isAuthenticated })
})

// Login API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  if (!requireAuth) {
    return res.json({ success: true })
  }

  if (username !== adminUser) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  if (!adminPassHash) {
    console.error('AUTH_PASSWORD_HASH is not set in environment.')
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  try {
    const isMatch = await argon2.verify(adminPassHash, password)
    if (isMatch) {
      req.session.isAuthenticated = true
      return res.json({ success: true })
    }
    return res.status(401).json({ error: 'Invalid credentials' })
  } catch (err) {
    console.error('Error verifying password', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Logout API
app.post('/api/logout', (req, res) => {
  req.session.destroy()
  res.json({ success: true })
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
  } else {
    console.log('Authentication is DISABLED.')
  }
})
