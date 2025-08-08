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

// Auth callback endpoint for OAuth/SSO flows
app.post('/api/auth/callback', async (c) => {
  try {
    const url = new URL(c.req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    // Handle OAuth error responses
    if (error) {
      return c.json({
        error: `OAuth error: ${error}`,
        details: url.searchParams.get('error_description')
      }, 400);
    }

    // Validate required parameters
    if (!code) {
      return c.json({ error: 'Missing authorization code' }, 400);
    }

    // TODO: Implement your OAuth token exchange logic here
    // For example, exchanging the authorization code for access tokens
    // const tokens = await exchangeCodeForTokens(code, c.env);

    // TODO: Create user session and set cookies
    // const sessionId = await createUserSession(tokens, c.env);

    // For now, return success response
    // In production, you would set HttpOnly cookies here
    return c.json({
      success: true,
      message: 'Authentication successful',
      // Set cookies in production:
      // headers: {
      //   'Set-Cookie': `sessionId=${sessionId}; HttpOnly; SameSite=Strict; Secure; Path=/; Max-Age=86400`
      // }
    });

  } catch (error) {
    console.error('Auth callback error:', error);
    return c.json({
      error: 'Authentication processing failed',
      details: error.message
    }, 500);
  }
})

// Auth callback endpoint - now handles navigation requests directly
app.get('/auth/callback', async (c) => {
  try {
    const url = new URL(c.req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    // Handle OAuth error responses
    if (error) {
      return c.html(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authentication Error - The Innovation Curve</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: system-ui; padding: 40px; text-align: center; background: #f8fafc; }
            .error { color: #dc2626; margin: 20px 0; }
            .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Authentication Error</h1>
            <p class="error">${error}: ${url.searchParams.get('error_description') || 'Unknown error'}</p>
            <a href="/" style="color: #4f46e5; text-decoration: none;">← Return to Home</a>
          </div>
        </body>
        </html>
      `, 400);
    }

    // Validate required parameters
    if (!code) {
      return c.html(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authentication Error - The Innovation Curve</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: system-ui; padding: 40px; text-align: center; background: #f8fafc; }
            .error { color: #dc2626; margin: 20px 0; }
            .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Authentication Error</h1>
            <p class="error">Missing authorization code</p>
            <a href="/" style="color: #4f46e5; text-decoration: none;">← Return to Home</a>
          </div>
        </body>
        </html>
      `, 400);
    }

    // TODO: Implement your OAuth token exchange logic here
    // For example, exchanging the authorization code for access tokens
    // const tokens = await exchangeCodeForTokens(code, c.env);

    // TODO: Create user session and set cookies
    // const sessionId = await createUserSession(tokens, c.env);

    // For now, return success page with redirect
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Successful - The Innovation Curve</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: system-ui; padding: 40px; text-align: center; background: #f8fafc; }
          .success { color: #059669; margin: 20px 0; }
          .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; margin: 0 auto; }
          .spinner { border: 3px solid #f3f4f6; border-top: 3px solid #4f46e5; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h1>Authentication Successful!</h1>
          <p class="success">Redirecting you to the application...</p>
        </div>
        <script>
          setTimeout(() => {
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/';
            window.location.href = redirectUrl;
          }, 2000);
        </script>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Auth callback error:', error);
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Error - The Innovation Curve</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: system-ui; padding: 40px; text-align: center; background: #f8fafc; }
          .error { color: #dc2626; margin: 20px 0; }
          .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Authentication Error</h1>
          <p class="error">Authentication processing failed. Please try again.</p>
          <a href="/" style="color: #4f46e5; text-decoration: none;">← Return to Home</a>
        </div>
      </body>
      </html>
    `, 500);
  }
})

export default app
