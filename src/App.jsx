import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
    return (
        <ThemeProvider>
            <Router>
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
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;