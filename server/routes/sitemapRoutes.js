import express from 'express';
import { allQuery } from '../config/database.js';

const router = express.Router();

// Dynamic sitemap endpoint
router.get('/sitemap.xml', async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];

    // Get all published blog posts
    const posts = await allQuery(`
      SELECT slug, created_at, updated_at 
      FROM blog_posts 
      WHERE published = 1 
      ORDER BY created_at DESC
    `);

    // Static pages
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

    // Dynamic blog post URLs
    const blogUrls = posts.map(post => ({
      loc: `https://www.theinnovationcurve.com/blog/${post.slug}`,
      lastmod: new Date(post.updated_at || post.created_at).toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7'
    }));

    // Combine all URLs
    const allUrls = [...staticUrls, ...blogUrls];

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

    // Set appropriate headers for XML sitemap
    res.set({
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.send(sitemap);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).set('Content-Type', 'application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://www.theinnovationcurve.com/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>`);
  }
});

// Enhanced automatic sitemap submission to search engines
router.post('/submit', async (req, res) => {
  try {
    const sitemapUrl = 'https://www.theinnovationcurve.com/sitemap.xml';
    const results = { google: false, bing: false, errors: [] };

    // Submit to Google Search Console
    try {
      const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const googleResponse = await fetch(googlePingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'The Innovation Curve Blog Bot 1.0'
        },
        timeout: 10000
      });

      results.google = googleResponse.ok;
      if (!googleResponse.ok) {
        results.errors.push(`Google submission failed: ${googleResponse.status} ${googleResponse.statusText}`);
      }
    } catch (googleError) {
      results.errors.push(`Google submission error: ${googleError.message}`);
    }

    // Submit to Bing Webmaster Tools
    try {
      const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const bingResponse = await fetch(bingPingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'The Innovation Curve Blog Bot 1.0'
        },
        timeout: 10000
      });

      results.bing = bingResponse.ok;
      if (!bingResponse.ok) {
        results.errors.push(`Bing submission failed: ${bingResponse.status} ${bingResponse.statusText}`);
      }
    } catch (bingError) {
      results.errors.push(`Bing submission error: ${bingError.message}`);
    }

    // Log submission attempt
    console.log(`Sitemap submission attempt - Google: ${results.google ? 'SUCCESS' : 'FAILED'}, Bing: ${results.bing ? 'SUCCESS' : 'FAILED'}`);

    res.json({
      success: results.google || results.bing,
      message: 'Sitemap submission completed',
      details: {
        sitemap: sitemapUrl,
        google: results.google,
        bing: results.bing,
        timestamp: new Date().toISOString(),
        errors: results.errors
      }
    });

  } catch (error) {
    console.error('Error submitting sitemap:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit sitemap to search engines',
      details: error.message
    });
  }
});

// Automatic submission with retry logic
async function autoSubmitSitemap(maxRetries = 3) {
  const sitemapUrl = 'https://www.theinnovationcurve.com/sitemap.xml';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Automatic sitemap submission attempt ${attempt}/${maxRetries}`);

      // Submit to Google
      const googleResponse = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
        method: 'GET',
        headers: { 'User-Agent': 'The Innovation Curve Blog Bot 1.0' },
        timeout: 10000
      });

      // Submit to Bing
      const bingResponse = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
        method: 'GET',
        headers: { 'User-Agent': 'The Innovation Curve Blog Bot 1.0' },
        timeout: 10000
      });

      if (googleResponse.ok || bingResponse.ok) {
        console.log(`✅ Sitemap submitted successfully on attempt ${attempt}`);
        return true;
      }

    } catch (error) {
      console.log(`❌ Submission attempt ${attempt} failed:`, error.message);
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
      }
    }
  }

  console.log(`⚠️ All sitemap submission attempts failed after ${maxRetries} tries`);
  return false;
}

// Endpoint to trigger manual submission with retry
router.post('/submit-with-retry', async (req, res) => {
  try {
    const success = await autoSubmitSitemap(3);

    res.json({
      success,
      message: success
        ? 'Sitemap successfully submitted to search engines'
        : 'Sitemap submission failed after multiple attempts',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error during sitemap submission process',
      details: error.message
    });
  }
});

// Health check for sitemap service
router.get('/health', async (req, res) => {
  try {
    // Test database connection
    const testQuery = await allQuery('SELECT COUNT(*) as count FROM blog_posts WHERE published = 1');
    const publishedCount = testQuery[0]?.count || 0;

    res.json({
      status: 'healthy',
      sitemap_url: 'https://www.theinnovationcurve.com/sitemap.xml',
      published_posts: publishedCount,
      last_check: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Export the auto-submit function for use in other routes
export { autoSubmitSitemap };

export default router;
