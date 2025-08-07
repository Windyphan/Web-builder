import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'

const app = new Hono()

// CORS middleware
app.use('*', cors({
  origin: [
    'https://www.theinnovationcurve.com',
    'https://theinnovationcurve.com',
    'http://localhost:5173'
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Blog routes placeholder
app.get('/api/blog', async (c) => {
  // Use Cloudflare D1 database instead of PostgreSQL
  // const db = c.env.DB
  // const posts = await db.prepare('SELECT * FROM blog_posts WHERE published = 1').all()
  return c.json({ posts: [] })
})

// Auth routes placeholder
app.post('/api/auth/login', async (c) => {
  // Implement authentication with Cloudflare Workers
  return c.json({ message: 'Login endpoint' })
})

export default app
