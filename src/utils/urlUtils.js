/**
 * Utility to ensure all traffic goes to www.theinnovationcurve.com
 * This handles client-side redirects in case server-side redirects fail
 */
export const ensureWWWRedirect = () => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const currentHost = window.location.hostname;
    const currentProtocol = window.location.protocol;
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;

    // If we're on localhost or already on www, do nothing
    if (currentHost === 'localhost' ||
        currentHost.startsWith('127.0.0.1') ||
        currentHost.startsWith('www.')) {
        return;
    }

    // If we're on theinnovationcurve.com (without www), redirect to www
    if (currentHost === 'theinnovationcurve.com') {
        const newUrl = `${currentProtocol}//www.${currentHost}${currentPath}${currentSearch}${currentHash}`;
        window.location.replace(newUrl);
    }
};

/**
 * Get the canonical URL for the current page
 */
export const getCanonicalUrl = () => {
    if (typeof window === 'undefined') return 'https://www.theinnovationcurve.com/';

    const path = window.location.pathname;
    const search = window.location.search;
    return `https://www.theinnovationcurve.com${path}${search}`;
};

export default { ensureWWWRedirect, getCanonicalUrl };

