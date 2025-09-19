import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Disable browser scroll restoration completely
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // ULTRA AGGRESSIVE scroll-to-top function
        const forceScrollToTop = () => {
            // Method 1: Instant scroll with behavior override
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

            // Method 2: Direct DOM manipulation
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            // Method 3: CSS override
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, 0);

            // Method 4: Force pageYOffset (if possible)
            try {
                if (window.pageYOffset !== 0) {
                    window.pageYOffset = 0;
                }
            } catch (e) {
                // Ignore if read-only
            }

            // Method 5: ScrollIntoView fallback
            try {
                document.body.scrollIntoView({
                    behavior: 'instant',
                    block: 'start',
                    inline: 'start'
                });
            } catch (e) {
                // Fallback to regular scrollTo
                window.scrollTo(0, 0);
            }

            // Method 6: Force all scroll containers to top
            const scrollableElements = document.querySelectorAll('*');
            scrollableElements.forEach(el => {
                if (el.scrollTop > 0) {
                    el.scrollTop = 0;
                }
            });
        };

        // Execute IMMEDIATELY when route changes
        forceScrollToTop();

        // Execute multiple times to catch any async rendering delays
        setTimeout(forceScrollToTop, 0);
        setTimeout(forceScrollToTop, 1);
        setTimeout(forceScrollToTop, 5);
        setTimeout(forceScrollToTop, 10);
        setTimeout(forceScrollToTop, 25);
        setTimeout(forceScrollToTop, 50);
        setTimeout(forceScrollToTop, 100);
        setTimeout(forceScrollToTop, 200);
        setTimeout(forceScrollToTop, 300);

        // Use requestAnimationFrame for better timing
        requestAnimationFrame(() => {
            forceScrollToTop();
            setTimeout(forceScrollToTop, 0);
        });

        // Double RAF for React 18 concurrent features
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                forceScrollToTop();
            });
        });

        // Cleanup function
        return () => {
            // Reset scroll behavior to normal
            document.documentElement.style.scrollBehavior = 'smooth';
        };

    }, [pathname]);

    return null;
};

export default ScrollToTop;
