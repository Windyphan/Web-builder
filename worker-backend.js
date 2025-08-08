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
  try {
    // Fetch blog posts from Neon DB via Vercel backend API
    const response = await fetch(`${c.env.VITE_API_URL}/blog/posts?limit=10`, {
      headers: {
        'User-Agent': 'Cloudflare Worker Blog Fetcher'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data = await response.json();
    return c.json({ posts: data.posts || [] });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return c.json({ posts: [] });
  }
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

    // OAuth token exchange logic
    const tokenExchangeResult = await exchangeCodeForTokens(code, state, c.env);
    if (!tokenExchangeResult.success) {
      return c.json({ error: 'Token exchange failed' }, 400);
    }

    // Create user session and set cookies
    const sessionId = await createUserSession(tokenExchangeResult.user, c.env);

    return c.json({
      success: true,
      message: 'Authentication successful',
      user: tokenExchangeResult.user
    }, {
      headers: {
        'Set-Cookie': `sessionId=${sessionId}; HttpOnly; SameSite=Strict; Secure; Path=/; Max-Age=86400`
      }
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

    // OAuth token exchange logic
    const tokenExchangeResult = await exchangeCodeForTokens(code, state, c.env);
    if (!tokenExchangeResult.success) {
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
            <p class="error">Failed to exchange authorization code</p>
            <a href="/" style="color: #4f46e5; text-decoration: none;">← Return to Home</a>
          </div>
        </body>
        </html>
      `, 400);
    }

    // Create user session and set cookies
    const sessionId = await createUserSession(tokenExchangeResult.user, c.env);

    // Return success page with redirect and set session cookie
    const response = c.html(`
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

    response.headers.set('Set-Cookie', `sessionId=${sessionId}; HttpOnly; SameSite=Strict; Secure; Path=/; Max-Age=86400`);
    return response;

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

// Sitemap endpoint - serves dynamic XML sitemap
app.get('/sitemap.xml', async (c) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    // Static pages for your site
    const staticUrls = [
      {
        loc: 'https://www.theinnovationcurve.com/',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '1.0'
      },
      {
        loc: 'https://www.theinnovationcurve.com/about',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        loc: 'https://www.theinnovationcurve.com/blog',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        loc: 'https://www.theinnovationcurve.com/pricing',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        loc: 'https://www.theinnovationcurve.com/portfolio',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        loc: 'https://www.theinnovationcurve.com/contact',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6'
      }
    ];

    // Fetch blog posts from Neon DB via Vercel backend API
    let blogUrls = [];
    try {
      const response = await fetch(`https://web-builder-five-rust.vercel.app/api/blog/posts`, {
        headers: {
          'User-Agent': 'Cloudflare Worker Sitemap Generator'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const posts = data.posts || [];

        blogUrls = posts.map(post => ({
          loc: `https://www.theinnovationcurve.com/blog/${post.slug}`,
          lastmod: new Date(post.updated_at || post.created_at).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.7'
        }));
      }
    } catch (dbError) {
      console.warn('Failed to fetch blog posts from Neon DB via API:', dbError);
      // Continue with empty blog URLs array if API fails
    }

    // Combine all URLs
    const allUrls = [...staticUrls, ...blogUrls];

    // Generate proper XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

    // Set proper XML headers
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return minimal sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://www.theinnovationcurve.com/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      }
    });
  }
});

// Helper function: Exchange OAuth code for tokens
async function exchangeCodeForTokens(code, state, env) {
  try {
    // Example for Google OAuth - adjust based on your OAuth provider
    const tokenEndpoint = 'https://oauth2.googleapis.com/token';

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: env.OAUTH_CLIENT_ID,
        client_secret: env.OAUTH_CLIENT_SECRET,
        redirect_uri: env.OAUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
        state
      })
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    const tokens = await response.json();

    // Get user info with access token
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to get user info: ${userResponse.status}`);
    }

    const user = await userResponse.json();

    return {
      success: true,
      tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    };

  } catch (error) {
    console.error('Token exchange error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper function: Create user session
async function createUserSession(user, env) {
  try {
    // Generate session ID
    const sessionId = crypto.randomUUID();

    // Store session in KV storage (Cloudflare Workers KV)
    // Session expires in 24 hours
    await env.SESSIONS_KV.put(sessionId, JSON.stringify({
      userId: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }), {
      expirationTtl: 86400 // 24 hours in seconds
    });

    return sessionId;

  } catch (error) {
    console.error('Session creation error:', error);
    throw error;
  }
}

export default app
