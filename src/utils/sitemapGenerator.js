import { useEffect, useState } from 'react';
import blogAPI from '../utils/blogAPI';

// Generate dynamic sitemap based on blog posts
export const generateSitemap = async () => {
  try {
    // Get all published blog posts
    const posts = await blogAPI.getPosts();

    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

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

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return null;
  }
};

// Hook to automatically update sitemap when blog posts change
export const useDynamicSitemap = () => {
  const [sitemap, setSitemap] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const updateSitemap = async () => {
      const newSitemap = await generateSitemap();
      if (newSitemap) {
        setSitemap(newSitemap);
        setLastUpdated(new Date().toISOString());

        // Optionally trigger sitemap submission to search engines
        await submitSitemapToSearchEngines();
      }
    };

    updateSitemap();
  }, []);

  return { sitemap, lastUpdated };
};

// Function to automatically notify search engines about sitemap updates
const submitSitemapToSearchEngines = async () => {
  const sitemapUrl = 'https://www.theinnovationcurve.com/sitemap.xml';

  try {
    // Google Search Console API (requires setup)
    // await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);

    // Bing Webmaster Tools
    // await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);

    console.log('Sitemap submission triggered for:', sitemapUrl);
  } catch (error) {
    console.error('Error submitting sitemap:', error);
  }
};

export default { generateSitemap, useDynamicSitemap };
