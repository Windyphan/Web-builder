import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogAdmin from './pages/BlogAdmin';
import Sitemap from './pages/Sitemap';

// Debug component to log routing
const RouteDebugger = () => {
    const location = useLocation();

    useEffect(() => {
        console.log('Current route:', location.pathname);
        console.log('Search params:', location.search);
        console.log('Hash:', location.hash);
    }, [location]);

    return null;
};

// Error Boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Route Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Error: {this.state.error?.message || 'Unknown error'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// 404 Not Found component
const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
            <a href="/" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                Go Home
            </a>
        </div>
    </div>
);

function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <Router>
                    <RouteDebugger />
                    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/portfolio" element={<Portfolio />} />
                            <Route path="/pricing" element={<Pricing />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:slug" element={<BlogPost />} />
                            <Route path="/admin/blog" element={<BlogAdmin />} />
                            <Route path="/sitemap.xml" element={<Sitemap />} />
                            {/* Catch-all route for 404 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </Router>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;