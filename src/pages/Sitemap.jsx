import { useEffect } from 'react';
import blogAPI from '../utils/blogAPI';

const Sitemap = () => {
  useEffect(() => {
    // Fetch sitemap from API and serve as XML
    const fetchAndServeSitemap = async () => {
      try {
        // Fetch sitemap content from your Vercel backend
        const response = await fetch(`${import.meta.env.VITE_API_URL?.replace('/api', '')}/sitemap.xml`);
        const sitemapContent = await response.text();

        // Set content type and serve the XML
        document.querySelector('meta[name="robots"]')?.setAttribute('content', 'index, follow');

        // Create a blob with the XML content and set appropriate headers
        const blob = new Blob([sitemapContent], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);

        // Replace the current page content with XML
        document.open();
        document.write(sitemapContent);
        document.close();

        // Set content type header
        if (document.contentType) {
          document.contentType = 'application/xml';
        }

      } catch (error) {
        console.error('Error fetching sitemap:', error);
        // Fallback to basic sitemap
        const fallbackSitemap = generateFallbackSitemap();
        document.open();
        document.write(fallbackSitemap);
        document.close();
      }
    };

    fetchAndServeSitemap();
  }, []);

  return null; // Component doesn't render anything
};

const generateFallbackSitemap = () => {
  const currentDate = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://www.theinnovationcurve.com/</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://www.theinnovationcurve.com/about</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://www.theinnovationcurve.com/blog</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://www.theinnovationcurve.com/portfolio</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://www.theinnovationcurve.com/pricing</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://www.theinnovationcurve.com/contact</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
</urlset>`;
};

export default Sitemap;
