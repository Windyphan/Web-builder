/**
 * SEO Crawler Utility
 * Fetches and analyzes web pages for SEO metrics
 */

/**
 * Fetch and parse a URL for SEO analysis
 * @param {string} url - The URL to analyze
 * @returns {Promise<Object>} - Parsed SEO data
 */
export const analyzePage = async (url) => {
    // List of CORS proxies to try (in order)
    const corsProxies = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
    ];

    let lastError = null;
    const startTime = performance.now();

    // Try each proxy in order
    for (let i = 0; i < corsProxies.length; i++) {
        try {
            const proxyUrl = corsProxies[i];
            console.log(`Attempting to fetch with proxy ${i + 1}/${corsProxies.length}...`);

            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html',
                },
                signal: AbortSignal.timeout(15000), // 15 second timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();

            // Validate we got HTML content
            if (!html || html.length < 100) {
                throw new Error('Invalid response - content too short');
            }

            const endTime = performance.now();
            const loadTime = endTime - startTime;

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Check if parsing was successful
            if (!doc.body) {
                throw new Error('Failed to parse HTML content');
            }

            console.log('✅ Successfully fetched and parsed page');
            return extractSEOData(doc, url, html, loadTime);

        } catch (error) {
            console.warn(`Proxy ${i + 1} failed:`, error.message);
            lastError = error;
            // Continue to next proxy
        }
    }

    // All proxies failed
    console.error('All CORS proxies failed');

    // Provide helpful error message
    const errorMessage = `
Unable to analyze this page due to CORS restrictions. 

This happens when:
• The website blocks cross-origin requests
• The website requires authentication
• The website blocks automated tools
• All CORS proxy services are unavailable

Solutions:
1. Try analyzing your own website instead
2. Use a browser extension to disable CORS temporarily
3. Contact your server admin to set up a server-side proxy
4. The website may have a robots.txt blocking crawlers

Last error: ${lastError?.message || 'Unknown error'}
    `.trim();

    throw new Error(errorMessage);
};

/**
 * Extract SEO data from parsed HTML document
 * @param {Document} doc - Parsed HTML document
 * @param {string} url - Original URL
 * @param {string} html - Raw HTML string
 * @param {number} loadTime - Page load time in ms
 * @returns {Object} - SEO data object
 */
const extractSEOData = (doc, url, html, loadTime) => {
    const headings = extractHeadings(doc);
    const images = extractImages(doc, url);
    const links = extractLinks(doc, url);
    const content = extractContent(doc);
    const metaTags = extractMetaTags(doc);
    const canonical = extractCanonical(doc, url);
    const robots = extractRobots(doc);

    return {
        url,
        analyzedAt: new Date().toISOString(),
        metaTags,
        openGraph: extractOpenGraph(doc),
        twitterCard: extractTwitterCard(doc),
        canonical,
        robots,
        structuredData: extractStructuredData(doc),
        // Content Analysis (Part 3)
        headingAnalysis: analyzeHeadings(headings),
        imageAnalysis: analyzeImages(images),
        contentMetrics: analyzeContent(content),
        linkAnalysis: analyzeLinks(links, url),
        keywordDensity: analyzeKeywordDensity(content),
        // Performance Metrics (Part 4)
        loadTime: analyzeLoadTime(loadTime),
        resources: analyzeResources(doc, html),
        imagePerformance: analyzeImagePerformance(images),
        mobileFriendly: analyzeMobileFriendliness(metaTags, doc),
        performanceScore: calculatePerformanceScore(loadTime, html, images, metaTags),
        // On-Page SEO (Part 5)
        titleDescription: analyzeTitleDescription(metaTags),
        urlStructure: analyzeURLStructure(url),
        brokenLinks: analyzeBrokenLinks(links),
        duplicateContent: analyzeDuplicateContent(metaTags, canonical, robots, content),
    };
};

/**
 * Extract standard meta tags
 */
const extractMetaTags = (doc) => {
    const title = doc.querySelector('title')?.textContent || '';
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const keywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
    const author = doc.querySelector('meta[name="author"]')?.getAttribute('content') || '';
    const viewport = doc.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';

    return {
        title: {
            content: title,
            length: title.length,
            status: getMetaTitleStatus(title),
            recommendation: getMetaTitleRecommendation(title),
        },
        description: {
            content: description,
            length: description.length,
            status: getMetaDescriptionStatus(description),
            recommendation: getMetaDescriptionRecommendation(description),
        },
        keywords: {
            content: keywords,
            present: !!keywords,
        },
        author: {
            content: author,
            present: !!author,
        },
        viewport: {
            content: viewport,
            present: !!viewport,
            isMobileFriendly: viewport.includes('width=device-width'),
        },
    };
};

/**
 * Extract Open Graph tags
 */
const extractOpenGraph = (doc) => {
    const ogTags = {};
    const ogMetaTags = doc.querySelectorAll('meta[property^="og:"]');

    ogMetaTags.forEach(tag => {
        const property = tag.getAttribute('property')?.replace('og:', '');
        const content = tag.getAttribute('content');
        if (property && content) {
            ogTags[property] = content;
        }
    });

    return {
        present: Object.keys(ogTags).length > 0,
        tags: ogTags,
        status: getOpenGraphStatus(ogTags),
        recommendation: getOpenGraphRecommendation(ogTags),
    };
};

/**
 * Extract Twitter Card tags
 */
const extractTwitterCard = (doc) => {
    const twitterTags = {};
    const twitterMetaTags = doc.querySelectorAll('meta[name^="twitter:"]');

    twitterMetaTags.forEach(tag => {
        const name = tag.getAttribute('name')?.replace('twitter:', '');
        const content = tag.getAttribute('content');
        if (name && content) {
            twitterTags[name] = content;
        }
    });

    return {
        present: Object.keys(twitterTags).length > 0,
        tags: twitterTags,
        status: getTwitterCardStatus(twitterTags),
        recommendation: getTwitterCardRecommendation(twitterTags),
    };
};

/**
 * Extract canonical URL
 */
const extractCanonical = (doc, currentUrl) => {
    const canonicalTag = doc.querySelector('link[rel="canonical"]');
    const canonicalUrl = canonicalTag?.getAttribute('href') || '';

    return {
        present: !!canonicalUrl,
        url: canonicalUrl,
        isCorrect: canonicalUrl === currentUrl || canonicalUrl === new URL(currentUrl).href,
        status: getCanonicalStatus(canonicalUrl, currentUrl),
        recommendation: getCanonicalRecommendation(canonicalUrl, currentUrl),
    };
};

/**
 * Extract robots meta tags
 */
const extractRobots = (doc) => {
    const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
    const googleBotMeta = doc.querySelector('meta[name="googlebot"]')?.getAttribute('content') || '';

    const directives = robotsMeta.toLowerCase().split(',').map(d => d.trim());

    return {
        present: !!robotsMeta,
        content: robotsMeta,
        googlebot: googleBotMeta,
        isIndexable: !directives.includes('noindex'),
        isFollowable: !directives.includes('nofollow'),
        directives: directives,
        status: getRobotsStatus(directives),
        recommendation: getRobotsRecommendation(directives),
    };
};

/**
 * Extract structured data (JSON-LD)
 */
const extractStructuredData = (doc) => {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    const schemas = [];

    scripts.forEach(script => {
        try {
            const data = JSON.parse(script.textContent);
            schemas.push(data);
        } catch (e) {
            console.error('Error parsing JSON-LD:', e);
        }
    });

    return {
        present: schemas.length > 0,
        count: schemas.length,
        schemas: schemas,
        types: schemas.map(s => s['@type']).filter(Boolean),
        status: getStructuredDataStatus(schemas),
        recommendation: getStructuredDataRecommendation(schemas),
    };
};

/**
 * Extract headings (for Part 3, but included here)
 */
const extractHeadings = (doc) => {
    const headings = {
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
    };

    for (let i = 1; i <= 6; i++) {
        const tags = doc.querySelectorAll(`h${i}`);
        tags.forEach(tag => {
            headings[`h${i}`].push(tag.textContent.trim());
        });
    }

    return headings;
};

/**
 * Extract images (for Part 3, but included here)
 */
const extractImages = (doc, baseUrl) => {
    const images = [];
    const imgTags = doc.querySelectorAll('img');

    imgTags.forEach(img => {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';
        const loading = img.getAttribute('loading') || '';

        // Resolve relative URLs
        let fullUrl = src;
        try {
            fullUrl = new URL(src, baseUrl).href;
        } catch (e) {
            // Keep original if URL resolution fails
        }

        images.push({
            src: fullUrl,
            alt,
            hasAlt: !!alt,
            loading,
            isLazyLoaded: loading === 'lazy',
        });
    });

    return images;
};

/**
 * Extract links (for Part 3, but included here)
 */
const extractLinks = (doc, baseUrl) => {
    const links = {
        internal: [],
        external: [],
    };

    const aTags = doc.querySelectorAll('a[href]');
    const baseDomain = new URL(baseUrl).hostname;

    aTags.forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;

        try {
            const url = new URL(href, baseUrl);
            const isInternal = url.hostname === baseDomain;

            const linkData = {
                url: url.href,
                text: a.textContent.trim(),
                rel: a.getAttribute('rel') || '',
            };

            if (isInternal) {
                links.internal.push(linkData);
            } else {
                links.external.push(linkData);
            }
        } catch (e) {
            // Skip invalid URLs
        }
    });

    return links;
};

/**
 * Check if sitemap exists
 */
export const checkSitemap = async (url) => {
    try {
        const baseUrl = new URL(url).origin;
        const sitemapUrls = [
            `${baseUrl}/sitemap.xml`,
            `${baseUrl}/sitemap_index.xml`,
        ];

        const results = await Promise.all(
            sitemapUrls.map(async (sitemapUrl) => {
                try {
                    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(sitemapUrl)}`;
                    const response = await fetch(proxyUrl);
                    return {
                        url: sitemapUrl,
                        exists: response.ok,
                        status: response.status,
                    };
                } catch {
                    return {
                        url: sitemapUrl,
                        exists: false,
                        status: null,
                    };
                }
            })
        );

        const existingSitemap = results.find(r => r.exists);

        return {
            present: !!existingSitemap,
            url: existingSitemap?.url || '',
            checked: results,
        };
    } catch (error) {
        return {
            present: false,
            url: '',
            error: error.message,
        };
    }
};

// Status and Recommendation Helper Functions

const getMetaTitleStatus = (title) => {
    if (!title) return 'critical';
    if (title.length < 30 || title.length > 60) return 'warning';
    return 'passed';
};

const getMetaTitleRecommendation = (title) => {
    if (!title) return 'Add a title tag to your page';
    if (title.length < 30) return 'Title is too short. Aim for 50-60 characters';
    if (title.length > 60) return 'Title is too long. Keep it under 60 characters';
    return 'Title length is optimal';
};

const getMetaDescriptionStatus = (description) => {
    if (!description) return 'critical';
    if (description.length < 120 || description.length > 160) return 'warning';
    return 'passed';
};

const getMetaDescriptionRecommendation = (description) => {
    if (!description) return 'Add a meta description to your page';
    if (description.length < 120) return 'Description is too short. Aim for 150-160 characters';
    if (description.length > 160) return 'Description is too long. Keep it under 160 characters';
    return 'Description length is optimal';
};

const getOpenGraphStatus = (ogTags) => {
    const required = ['title', 'description', 'image', 'url'];
    const hasRequired = required.every(tag => ogTags[tag]);

    if (!Object.keys(ogTags).length) return 'critical';
    if (!hasRequired) return 'warning';
    return 'passed';
};

const getOpenGraphRecommendation = (ogTags) => {
    if (!Object.keys(ogTags).length) return 'Add Open Graph tags for better social media sharing';
    const required = ['title', 'description', 'image', 'url'];
    const missing = required.filter(tag => !ogTags[tag]);
    if (missing.length) return `Add missing OG tags: ${missing.join(', ')}`;
    return 'All essential Open Graph tags are present';
};

const getTwitterCardStatus = (twitterTags) => {
    if (!Object.keys(twitterTags).length) return 'warning';
    if (!twitterTags['card']) return 'warning';
    return 'passed';
};

const getTwitterCardRecommendation = (twitterTags) => {
    if (!Object.keys(twitterTags).length) return 'Add Twitter Card tags for better Twitter sharing';
    if (!twitterTags['card']) return 'Add twitter:card tag';
    return 'Twitter Card tags are present';
};

const getCanonicalStatus = (canonicalUrl, currentUrl) => {
    if (!canonicalUrl) return 'warning';
    return 'passed';
};

const getCanonicalRecommendation = (canonicalUrl, currentUrl) => {
    if (!canonicalUrl) return 'Add a canonical URL to prevent duplicate content issues';
    return 'Canonical URL is set';
};

const getRobotsStatus = (directives) => {
    if (directives.includes('noindex')) return 'warning';
    return 'passed';
};

const getRobotsRecommendation = (directives) => {
    if (directives.includes('noindex')) return 'Page is set to noindex - it won\'t appear in search results';
    if (directives.includes('nofollow')) return 'Page is set to nofollow - search engines won\'t follow links';
    return 'Robots meta tag allows indexing and following';
};

const getStructuredDataStatus = (schemas) => {
    if (!schemas.length) return 'warning';
    return 'passed';
};

const getStructuredDataRecommendation = (schemas) => {
    if (!schemas.length) return 'Add structured data (Schema.org) for rich snippets in search results';
    return `${schemas.length} structured data schema(s) found`;
};

// ============================================
// PART 3: Content Analysis Functions
// ============================================

/**
 * Extract text content from the page
 */
const extractContent = (doc) => {
    // Remove script and style elements
    const clone = doc.cloneNode(true);
    const scripts = clone.querySelectorAll('script, style, noscript');
    scripts.forEach(el => el.remove());

    // Get body text
    const bodyText = clone.body?.textContent || '';
    return bodyText.trim();
};

/**
 * Analyze heading structure
 */
const analyzeHeadings = (headings) => {
    const counts = {
        h1: headings.h1.length,
        h2: headings.h2.length,
        h3: headings.h3.length,
        h4: headings.h4.length,
        h5: headings.h5.length,
        h6: headings.h6.length,
    };

    // Create hierarchy
    const hierarchy = [];
    for (let level = 1; level <= 6; level++) {
        const key = `h${level}`;
        headings[key].forEach(text => {
            hierarchy.push({ level, text });
        });
    }

    // Determine status
    let status = 'passed';
    let recommendation = 'Heading structure looks good';

    if (counts.h1 === 0) {
        status = 'critical';
        recommendation = 'Missing H1 tag - add a main heading to your page';
    } else if (counts.h1 > 1) {
        status = 'warning';
        recommendation = `Multiple H1 tags found (${counts.h1}) - use only one H1 per page`;
    } else if (counts.h2 === 0) {
        status = 'warning';
        recommendation = 'No H2 tags found - consider adding subheadings for better structure';
    }

    return {
        counts,
        hierarchy,
        status,
        recommendation,
    };
};

/**
 * Analyze images
 */
const analyzeImages = (images) => {
    let missingAlt = 0;
    let nextGenFormat = 0;
    let legacyFormat = 0;
    let lazyLoaded = 0;
    let responsive = 0;
    const formatBreakdown = {};

    const analyzedImages = images.map(img => {
        // Extract format from URL
        const format = getImageFormat(img.src);

        // Count formats
        formatBreakdown[format] = (formatBreakdown[format] || 0) + 1;

        // Check if next-gen format
        const isNextGen = format === 'webp' || format === 'avif';
        if (isNextGen) {
            nextGenFormat++;
        } else {
            legacyFormat++;
        }

        // Check alt text
        if (!img.hasAlt) {
            missingAlt++;
        }

        // Check lazy loading
        if (img.isLazyLoaded) {
            lazyLoaded++;
        }

        // Check responsive (srcset would be in the original element, this is simplified)
        const hasResponsive = false; // Simplified for now
        if (hasResponsive) {
            responsive++;
        }

        // Estimate size based on URL (simplified)
        const estimatedSize = estimateImageSize(img.src);

        return {
            ...img,
            format,
            isNextGen,
            hasResponsive,
            estimatedSize,
        };
    });

    // Determine status
    let status = 'passed';
    let recommendation = 'Image optimization looks good';

    if (missingAlt > 0) {
        status = 'warning';
        recommendation = `${missingAlt} image${missingAlt > 1 ? 's' : ''} missing alt text - add for accessibility and SEO`;
    } else if (legacyFormat > nextGenFormat && legacyFormat > 0) {
        status = 'warning';
        recommendation = `${legacyFormat} image${legacyFormat > 1 ? 's use' : ' uses'} legacy formats - consider converting to WebP or AVIF`;
    }

    if (missingAlt > images.length / 2) {
        status = 'critical';
        recommendation = 'Most images are missing alt text - this hurts accessibility and SEO';
    }

    return {
        total: images.length,
        missingAlt,
        nextGenFormat,
        legacyFormat,
        lazyLoaded,
        responsive,
        formatBreakdown,
        images: analyzedImages,
        status,
        recommendation,
    };
};

/**
 * Get image format from URL
 */
const getImageFormat = (url) => {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('.webp')) return 'webp';
    if (urlLower.includes('.avif')) return 'avif';
    if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) return 'jpg';
    if (urlLower.includes('.png')) return 'png';
    if (urlLower.includes('.gif')) return 'gif';
    if (urlLower.includes('.svg')) return 'svg';
    return 'unknown';
};

/**
 * Estimate image size (simplified)
 */
const estimateImageSize = (url) => {
    // This is a rough estimate based on typical image sizes
    const format = getImageFormat(url);
    const estimates = {
        'webp': 50000,  // ~50KB
        'avif': 40000,  // ~40KB
        'jpg': 100000,  // ~100KB
        'png': 150000,  // ~150KB
        'gif': 80000,   // ~80KB
        'svg': 10000,   // ~10KB
        'unknown': 75000,
    };
    return estimates[format] || 75000;
};

/**
 * Analyze content metrics
 */
const analyzeContent = (content) => {
    // Word count
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Character count
    const charCount = content.length;

    // Paragraph count (approximate)
    const paragraphCount = content.split(/\n\n+/).filter(p => p.trim().length > 0).length;

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);

    // Determine status
    let status = 'passed';
    let recommendation = 'Content length is good';

    if (wordCount < 300) {
        status = 'warning';
        recommendation = 'Content is thin - aim for at least 300 words for better SEO';
    } else if (wordCount < 100) {
        status = 'critical';
        recommendation = 'Very little content - add more quality content to rank better';
    }

    return {
        wordCount,
        charCount,
        paragraphCount,
        readingTime,
        status,
        recommendation,
    };
};

/**
 * Analyze links
 */
const analyzeLinks = (links, baseUrl) => {
    const internal = links.internal.length;
    const external = links.external.length;
    const total = internal + external;

    // We can't actually check for broken links without making requests
    // So this is simplified
    const broken = 0;

    // Determine status
    let status = 'passed';
    let recommendation = 'Link structure looks good';

    if (internal === 0) {
        status = 'warning';
        recommendation = 'No internal links found - add internal links for better navigation';
    } else if (external > internal * 3) {
        status = 'warning';
        recommendation = 'More external than internal links - balance with internal links';
    }

    return {
        total,
        internal,
        external,
        broken,
        internalLinks: links.internal,
        externalLinks: links.external,
        status,
        recommendation,
    };
};

/**
 * Analyze keyword density
 */
const analyzeKeywordDensity = (content) => {
    // Normalize content
    const normalized = content.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const words = normalized.split(' ').filter(word => word.length > 0);
    const totalWords = words.length;

    // Filter out common stop words
    const stopWords = new Set([
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
        'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
        'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
        'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
        'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
        'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
        'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
        'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had',
        'were', 'said', 'did', 'having', 'may', 'should', 'am', 'being', 'more'
    ]);

    const filteredWords = words.filter(word => !stopWords.has(word) && word.length > 2);

    // Count single word frequency
    const wordFreq = {};
    filteredWords.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Get top keywords
    const topKeywords = Object.entries(wordFreq)
        .map(([word, count]) => ({
            word,
            count,
            density: ((count / totalWords) * 100).toFixed(2),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    // Count 2-3 word phrases
    const phrases = {};
    for (let i = 0; i < filteredWords.length - 1; i++) {
        const twoWord = `${filteredWords[i]} ${filteredWords[i + 1]}`;
        phrases[twoWord] = (phrases[twoWord] || 0) + 1;

        if (i < filteredWords.length - 2) {
            const threeWord = `${filteredWords[i]} ${filteredWords[i + 1]} ${filteredWords[i + 2]}`;
            phrases[threeWord] = (phrases[threeWord] || 0) + 1;
        }
    }

    // Get top phrases
    const topPhrases = Object.entries(phrases)
        .map(([phrase, count]) => ({ phrase, count }))
        .filter(item => item.count > 1)
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    return {
        topKeywords,
        topPhrases,
        status: 'passed',
        recommendation: 'Keyword analysis complete - review top keywords for relevance',
    };
};

// ============================================
// PART 4: Performance Metrics Functions
// ============================================

/**
 * Analyze page load time
 */
const analyzeLoadTime = (loadTime) => {
    // Estimate realistic load times based on proxy load time
    const estimatedTime = loadTime;

    // These are estimates since we can't measure actual browser metrics through CORS proxy
    const domContentLoaded = estimatedTime * 0.7;
    const firstPaint = estimatedTime * 0.5;
    const timeToInteractive = estimatedTime * 1.2;

    let status = 'good';
    let recommendation = 'Page load time is excellent';

    if (estimatedTime > 5000) {
        status = 'poor';
        recommendation = 'Page is very slow - optimize resources and reduce file sizes';
    } else if (estimatedTime > 3000) {
        status = 'needs-improvement';
        recommendation = 'Page load time could be improved - consider optimizing resources';
    }

    return {
        estimatedTime,
        domContentLoaded,
        firstPaint,
        timeToInteractive,
        status,
        recommendation,
    };
};

/**
 * Analyze resource sizes
 */
const analyzeResources = (doc, html) => {
    // HTML size
    const htmlSize = new Blob([html]).size;

    // Estimate CSS size
    const styleSheets = doc.querySelectorAll('link[rel="stylesheet"], style');
    let cssSize = 0;
    styleSheets.forEach(style => {
        if (style.textContent) {
            cssSize += new Blob([style.textContent]).size;
        } else {
            // Estimate external CSS
            cssSize += 50000; // ~50KB average
        }
    });

    // Estimate JavaScript size
    const scripts = doc.querySelectorAll('script');
    let jsSize = 0;
    scripts.forEach(script => {
        if (script.textContent) {
            jsSize += new Blob([script.textContent]).size;
        } else if (script.src && !script.src.includes('cdn')) {
            // Estimate external JS
            jsSize += 100000; // ~100KB average
        }
    });

    // Estimate font sizes (if any font links detected)
    const fontLinks = doc.querySelectorAll('link[href*="font"]');
    const fontSize = fontLinks.length * 20000; // ~20KB per font file

    // Other resources
    const otherSize = 0;

    const totalSize = htmlSize + cssSize + jsSize + fontSize + otherSize;

    let status = 'good';
    let recommendation = 'Resource sizes are optimal';

    if (totalSize > 3000000) {
        status = 'poor';
        recommendation = `Total page size is ${(totalSize / 1000000).toFixed(2)}MB - reduce file sizes`;
    } else if (totalSize > 1000000) {
        status = 'needs-improvement';
        recommendation = 'Page size could be reduced - consider minification and compression';
    }

    return {
        totalSize,
        html: htmlSize,
        css: cssSize,
        javascript: jsSize,
        fonts: fontSize,
        other: otherSize,
        status,
        recommendation,
    };
};

/**
 * Analyze image performance
 */
const analyzeImagePerformance = (images) => {
    let totalWeight = 0;
    let nextGenCount = 0;
    let legacyCount = 0;

    images.forEach(img => {
        const size = estimateImageSize(img.src);
        totalWeight += size;

        const format = getImageFormat(img.src);
        if (format === 'webp' || format === 'avif') {
            nextGenCount++;
        } else if (format === 'jpg' || format === 'png' || format === 'gif') {
            legacyCount++;
        }
    });

    // Calculate potential savings (WebP is ~30% smaller than JPEG/PNG)
    const legacyWeight = legacyCount * 100000; // Estimated legacy image weight
    const potentialSavings = legacyWeight * 0.3;
    const optimizedWeight = totalWeight - potentialSavings;
    const avgReduction = totalWeight > 0 ? Math.round((potentialSavings / totalWeight) * 100) : 0;

    let status = 'good';
    let recommendation = 'Image performance is good';

    if (totalWeight > 2000000) {
        status = 'poor';
        recommendation = `Total image weight is ${(totalWeight / 1000000).toFixed(2)}MB - optimize and compress images`;
    } else if (totalWeight > 1000000 || legacyCount > nextGenCount) {
        status = 'needs-improvement';
        recommendation = 'Convert legacy images to WebP/AVIF for better performance';
    }

    return {
        totalWeight,
        potentialSavings,
        optimizedWeight,
        nextGenCount,
        legacyCount,
        totalImages: images.length,
        avgReduction,
        status,
        recommendation,
    };
};

/**
 * Analyze mobile-friendliness
 */
const analyzeMobileFriendliness = (metaTags, doc) => {
    const hasViewport = metaTags.viewport.present;
    const isMobileFriendly = metaTags.viewport.isMobileFriendly;

    // Check for responsive images
    const responsiveImages = doc.querySelectorAll('img[srcset]').length;
    const totalImages = doc.querySelectorAll('img').length;
    const isResponsive = hasViewport && isMobileFriendly;

    // Check for touch-friendly elements (simplified)
    const buttons = doc.querySelectorAll('button, a, input[type="button"]').length;
    const touchTargets = buttons > 0 ? 'Adequate' : 'Limited';

    // Text readability (check for readable font sizes - simplified)
    const textReadable = true; // Would need actual computed styles

    // No horizontal scrolling (simplified check)
    const noHorizontalScroll = hasViewport;

    // Calculate mobile score
    let score = 0;
    if (hasViewport) score += 30;
    if (isMobileFriendly) score += 30;
    if (isResponsive) score += 20;
    if (textReadable) score += 10;
    if (noHorizontalScroll) score += 10;

    let status = 'good';
    let recommendation = 'Page is mobile-friendly';

    if (score < 50) {
        status = 'poor';
        recommendation = 'Page needs major mobile optimization - add viewport meta tag and responsive design';
    } else if (score < 80) {
        status = 'needs-improvement';
        recommendation = 'Mobile experience could be improved - ensure responsive images and touch targets';
    }

    return {
        hasViewport,
        isResponsive,
        touchTargets,
        textReadable,
        noHorizontalScroll,
        score,
        status,
        recommendation,
    };
};

/**
 * Calculate overall performance score
 */
const calculatePerformanceScore = (loadTime, html, images, metaTags) => {
    // Speed score (based on load time)
    let speedScore = 100;
    if (loadTime > 5000) speedScore = 30;
    else if (loadTime > 3000) speedScore = 50;
    else if (loadTime > 2000) speedScore = 70;
    else if (loadTime > 1000) speedScore = 85;

    // Optimization score (based on file sizes and image formats)
    const htmlSize = new Blob([html]).size;
    let optimizationScore = 100;

    if (htmlSize > 500000) optimizationScore -= 20;
    else if (htmlSize > 200000) optimizationScore -= 10;

    // Check image optimization
    let nextGenCount = 0;
    let totalImages = images.length;
    images.forEach(img => {
        const format = getImageFormat(img.src);
        if (format === 'webp' || format === 'avif') nextGenCount++;
    });

    if (totalImages > 0) {
        const imageOptRatio = nextGenCount / totalImages;
        if (imageOptRatio < 0.3) optimizationScore -= 30;
        else if (imageOptRatio < 0.5) optimizationScore -= 20;
        else if (imageOptRatio < 0.7) optimizationScore -= 10;
    }

    // Mobile optimization
    if (!metaTags.viewport.isMobileFriendly) optimizationScore -= 15;

    // Overall score
    const overall = Math.round((speedScore + optimizationScore) / 2);

    return {
        overall: Math.max(0, Math.min(100, overall)),
        speed: Math.max(0, Math.min(100, speedScore)),
        optimization: Math.max(0, Math.min(100, optimizationScore)),
    };
};

// ============================================
// PART 5: On-Page SEO Functions
// ============================================

/**
 * Analyze title and meta description
 */
const analyzeTitleDescription = (metaTags) => {
    const title = metaTags.title.content;
    const titleLength = metaTags.title.length;
    const description = metaTags.description.content;
    const descriptionLength = metaTags.description.length;

    // Title status
    let titleStatus = 'good';
    let titleRecommendation = 'Title length is optimal (50-60 characters)';

    if (!title) {
        titleStatus = 'poor';
        titleRecommendation = 'Missing title tag - add a descriptive title';
    } else if (titleLength < 30) {
        titleStatus = 'poor';
        titleRecommendation = 'Title is too short - aim for 50-60 characters';
    } else if (titleLength > 70) {
        titleStatus = 'warning';
        titleRecommendation = 'Title is too long - keep it under 60 characters to avoid truncation';
    } else if (titleLength < 50 || titleLength > 60) {
        titleStatus = 'needs-improvement';
        titleRecommendation = 'Title length is acceptable but could be optimized to 50-60 characters';
    }

    // Description status
    let descriptionStatus = 'good';
    let descriptionRecommendation = 'Meta description length is optimal (150-160 characters)';

    if (!description) {
        descriptionStatus = 'poor';
        descriptionRecommendation = 'Missing meta description - add a compelling description';
    } else if (descriptionLength < 120) {
        descriptionStatus = 'warning';
        descriptionRecommendation = 'Description is too short - aim for 150-160 characters';
    } else if (descriptionLength > 160) {
        descriptionStatus = 'warning';
        descriptionRecommendation = 'Description is too long - keep it under 160 characters to avoid truncation';
    } else if (descriptionLength < 150) {
        descriptionStatus = 'needs-improvement';
        descriptionRecommendation = 'Description is acceptable but could be longer (150-160 characters)';
    }

    // Overall status
    let status = 'good';
    if (titleStatus === 'poor' || descriptionStatus === 'poor') {
        status = 'poor';
    } else if (titleStatus === 'warning' || descriptionStatus === 'warning') {
        status = 'warning';
    } else if (titleStatus === 'needs-improvement' || descriptionStatus === 'needs-improvement') {
        status = 'needs-improvement';
    }

    return {
        title,
        titleLength,
        titleStatus,
        titleRecommendation,
        description,
        descriptionLength,
        descriptionStatus,
        descriptionRecommendation,
        status,
    };
};

/**
 * Analyze URL structure
 */
const analyzeURLStructure = (url) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol.replace(':', '');
    const isSecure = protocol === 'https';
    const length = url.length;
    const pathname = urlObj.pathname;

    // Check URL length
    let lengthStatus = 'good';
    if (length > 100) lengthStatus = 'warning';
    if (length > 150) lengthStatus = 'poor';

    // Check if URL is readable (contains words, not just IDs)
    const hasReadableWords = /[a-z]{3,}/i.test(pathname);
    const isReadable = hasReadableWords && !pathname.includes('?id=') && !pathname.includes('&');

    // Check for keywords (simplified - checks for meaningful words)
    const words = pathname.split(/[/-]/).filter(w => w.length > 3);
    const hasKeywords = words.length > 0;

    // Check for special characters
    const hasSpecialChars = /[^a-zA-Z0-9/._~-]/.test(pathname);

    // Count subdirectories (depth)
    const depth = pathname.split('/').filter(p => p.length > 0).length;

    // Overall status
    let status = 'good';
    let recommendation = 'URL structure follows best practices';

    if (!isSecure) {
        status = 'poor';
        recommendation = 'Use HTTPS instead of HTTP for security';
    } else if (lengthStatus === 'poor' || hasSpecialChars || depth > 4) {
        status = 'warning';
        recommendation = 'URL could be improved - keep it shorter, avoid special characters, and reduce depth';
    } else if (lengthStatus === 'warning' || !isReadable) {
        status = 'needs-improvement';
        recommendation = 'URL is acceptable but could be more concise and readable';
    }

    return {
        url,
        protocol,
        isSecure,
        length,
        lengthStatus,
        isReadable,
        hasKeywords,
        hasSpecialChars,
        depth,
        status,
        recommendation,
    };
};

/**
 * Analyze broken links
 */
const analyzeBrokenLinks = (links) => {
    const allLinks = [...links.internal, ...links.external];
    const brokenLinks = [];
    const suspiciousLinks = [];
    let validCount = 0;

    allLinks.forEach(link => {
        const url = link.url;

        // Check for obviously broken patterns
        if (!url || url === '' || url === '#' || url === 'javascript:void(0)' || url === 'javascript:;') {
            brokenLinks.push({
                url: url || '(empty)',
                text: link.text,
                reason: 'Empty or invalid href'
            });
        } else if (url.startsWith('javascript:')) {
            suspiciousLinks.push({
                url,
                text: link.text,
                reason: 'JavaScript link'
            });
        } else if (url.includes('mailto:') || url.includes('tel:')) {
            // These are valid, just special types
            validCount++;
        } else if (!/^https?:\/\//i.test(url) && !url.startsWith('/') && !url.startsWith('#')) {
            // Relative URLs without proper format
            suspiciousLinks.push({
                url,
                text: link.text,
                reason: 'Unusual format'
            });
        } else {
            validCount++;
        }
    });

    const totalLinks = allLinks.length;
    const brokenCount = brokenLinks.length;
    const suspiciousCount = suspiciousLinks.length;

    let status = 'good';
    let recommendation = 'No broken links detected';

    if (brokenCount > 0) {
        status = 'poor';
        recommendation = `Found ${brokenCount} broken link${brokenCount > 1 ? 's' : ''} - fix immediately`;
    } else if (suspiciousCount > 0) {
        status = 'warning';
        recommendation = `Found ${suspiciousCount} suspicious link${suspiciousCount > 1 ? 's' : ''} - review and verify`;
    }

    return {
        totalLinks,
        brokenCount,
        suspiciousCount,
        validCount,
        brokenLinks,
        suspiciousLinks,
        status,
        recommendation,
    };
};

/**
 * Analyze duplicate content
 */
const analyzeDuplicateContent = (metaTags, canonical, robots, content) => {
    const issues = [];

    // Check canonical tag
    const hasCanonical = canonical.present;
    if (!hasCanonical) {
        issues.push('Missing canonical tag - add to prevent duplicate content issues');
    }

    // Check robots meta
    const hasRobots = robots.present;

    // Check for duplicate meta tags (simplified - would need to compare across pages)
    const duplicateTitles = false; // Would need multi-page analysis
    const duplicateDescriptions = false; // Would need multi-page analysis

    // Check for thin content
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const thinContent = wordCount < 300;

    if (thinContent) {
        issues.push(`Thin content detected (${wordCount} words) - aim for at least 300 words`);
    }

    // Check if title and description are the same
    if (metaTags.title.content && metaTags.description.content) {
        if (metaTags.title.content === metaTags.description.content) {
            issues.push('Title and description are identical - make them unique');
        }
    }

    // Overall status
    let status = 'good';
    let recommendation = 'No duplicate content issues detected';

    if (issues.length >= 3) {
        status = 'poor';
        recommendation = 'Multiple duplicate content issues found - address immediately';
    } else if (issues.length > 0) {
        status = 'warning';
        recommendation = 'Some duplicate content risks detected - review and fix';
    }

    return {
        hasCanonical,
        hasRobots,
        duplicateTitles,
        duplicateDescriptions,
        thinContent,
        issues,
        status,
        recommendation,
    };
};

