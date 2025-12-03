import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to dynamically set canonical URL for SEO
 * Ensures all pages redirect to www.theinnovationcurve.com
 */
export const CanonicalURL = () => {
    const location = useLocation();

    useEffect(() => {
        // Get or create canonical link element
        let canonicalLink = document.querySelector('link[rel="canonical"]');

        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }

        // Set canonical URL to www version
        const canonicalUrl = `https://www.theinnovationcurve.com${location.pathname}${location.search}`;
        canonicalLink.setAttribute('href', canonicalUrl);

        // Also update og:url if it exists
        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
            ogUrl.setAttribute('content', canonicalUrl);
        }
    }, [location]);

    return null;
};

export default CanonicalURL;

