import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Prevent browser's scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Force immediate scroll to top with multiple methods
        const scrollToTopImmediately = () => {
            // Method 1: Standard window scroll
            window.scrollTo(0, 0);

            // Method 2: Document element scroll
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            // Method 3: Force scroll using scrollIntoView on body
            document.body.scrollIntoView({
                behavior: 'auto',
                block: 'start',
                inline: 'start'
            });
        };

        // Execute immediately
        scrollToTopImmediately();

        // Execute in next frame
        requestAnimationFrame(() => {
            scrollToTopImmediately();
        });

        // Execute after short delays to handle React rendering
        const timeoutId1 = setTimeout(() => {
            scrollToTopImmediately();
        }, 0);

        const timeoutId2 = setTimeout(() => {
            scrollToTopImmediately();
        }, 50);

        const timeoutId3 = setTimeout(() => {
            scrollToTopImmediately();
        }, 100);

        // Cleanup timeouts
        return () => {
            clearTimeout(timeoutId1);
            clearTimeout(timeoutId2);
            clearTimeout(timeoutId3);
        };

    }, [pathname]);

    return null;
};

export default ScrollToTop;
