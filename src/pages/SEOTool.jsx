import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PagePreviewResults from '../components/PagePreviewResults';
import VisualReportResults from '../components/VisualReportResults';
import TechnicalSEOResults from '../components/TechnicalSEOResults';
import ContentAnalysisResults from '../components/ContentAnalysisResults';
import PerformanceMetricsResults from '../components/PerformanceMetricsResults';
import OnPageSEOResults from '../components/OnPageSEOResults';
import AdditionalFeaturesResults from '../components/AdditionalFeaturesResults';
import { analyzePage, checkSitemap } from '../utils/seoCrawler';
import { FiSearch, FiLock } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function SEOTool() {
    const { isDark } = useTheme();
    const [url, setUrl] = useState('');
    const [crawlDepth, setCrawlDepth] = useState('0');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);
    const [analysisProgress, setAnalysisProgress] = useState('');

    const depthOptions = [
        {
            value: '0',
            label: 'Single Page Analysis',
            description: 'Analyze only this specific URL',
            time: 'Instant',
            pages: '1 page',
            free: true
        },
        {
            value: '1',
            label: 'Quick Scan',
            description: 'Analyze this page + all directly linked pages',
            time: '~30 seconds',
            pages: '5-20 pages',
            free: true
        },
        {
            value: '2',
            label: 'Full Audit',
            description: 'Deep crawl of your entire website',
            time: '1-5 minutes',
            pages: 'All pages',
            free: false
        }
    ];

    const validateUrl = (urlString) => {
        try {
            const urlObj = new URL(urlString);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
        setError('');
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();

        // Validation
        if (!url.trim()) {
            setError('Please enter a URL to analyze');
            return;
        }

        if (!validateUrl(url)) {
            setError('Please enter a valid URL (include http:// or https://)');
            return;
        }

        // Check if locked feature
        if (crawlDepth === '2') {
            setError('Full Audit is a premium feature. Please upgrade to unlock.');
            return;
        }

        setError('');
        setIsAnalyzing(true);
        setResults(null);
        setAnalysisProgress('Initializing analysis...');

        try {
            // Analyze the page
            setAnalysisProgress('Fetching and parsing page...');
            const pageData = await analyzePage(url);

            // Check for sitemap
            setAnalysisProgress('Checking for sitemap...');
            const sitemapData = await checkSitemap(url);

            // Combine results
            const analysisResults = {
                ...pageData,
                sitemap: sitemapData,
            };

            setResults(analysisResults);
            setAnalysisProgress('Analysis complete!');

            // Scroll to results
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);

        } catch (err) {
            console.error('Analysis error:', err);
            // Use the detailed error message from the crawler
            setError(err.message || 'Failed to analyze page. Please try again.');
        } finally {
            setIsAnalyzing(false);
            setAnalysisProgress('');
        }
    };

    const handleCompareCompetitor = async (competitorUrl) => {
        // Open a new window/tab with the competitor analysis
        const competitorAnalysisUrl = `/seo-tool?url=${encodeURIComponent(competitorUrl)}&compare=true`;
        window.open(competitorAnalysisUrl, '_blank');
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDark 
                ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
                : 'bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900'
        }`}>
            <Header />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                            SEO Analyzer Tool
                        </h1>
                        <p className={`text-lg md:text-xl ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Analyze your website's SEO performance and get actionable insights
                        </p>
                    </div>

                    {/* URL Input Form */}
                    <div className={`rounded-2xl shadow-2xl p-8 mb-8 ${
                        isDark 
                            ? 'bg-gray-800 border border-gray-700' 
                            : 'bg-white border border-gray-200'
                    }`}>
                        <form onSubmit={handleAnalyze}>
                            {/* URL Input */}
                            <div className="mb-6">
                                <label
                                    htmlFor="url-input"
                                    className={`block text-sm font-semibold mb-3 ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                                >
                                    Enter Website URL
                                </label>
                                <div className="relative">
                                    <input
                                        id="url-input"
                                        type="text"
                                        value={url}
                                        onChange={handleUrlChange}
                                        placeholder="https://example.com"
                                        className={`w-full px-4 py-4 pr-12 rounded-lg border-2 transition-all duration-200 ${
                                            isDark 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-600' 
                                                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                        disabled={isAnalyzing}
                                    />
                                    <FiSearch className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-xl ${
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`} />
                                </div>
                                {error && (
                                    <div className={`mt-3 p-4 rounded-lg border ${
                                        isDark 
                                            ? 'bg-red-500/10 border-red-500/30' 
                                            : 'bg-red-50 border-red-200'
                                    }`}>
                                        <p className={`text-sm font-semibold mb-2 ${
                                            isDark ? 'text-red-400' : 'text-red-700'
                                        }`}>
                                            ⚠️ Analysis Failed
                                        </p>
                                        <p className={`text-sm whitespace-pre-line ${
                                            isDark ? 'text-red-300' : 'text-red-600'
                                        }`}>
                                            {error}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Crawl Depth Options */}
                            <div className="mb-6">
                                <label className={`block text-sm font-semibold mb-3 ${
                                    isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}>
                                    Analysis Depth
                                </label>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {depthOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => !isAnalyzing && setCrawlDepth(option.value)}
                                            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                                                crawlDepth === option.value
                                                    ? isDark
                                                        ? 'border-blue-500 bg-blue-500/10'
                                                        : 'border-blue-600 bg-blue-50'
                                                    : isDark
                                                        ? 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                                                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                                            } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {!option.free && (
                                                <div className="absolute top-2 right-2">
                                                    <FiLock className="text-yellow-500" />
                                                </div>
                                            )}

                                            <div className="mb-2">
                                                <h3 className={`font-bold text-base mb-1 ${
                                                    isDark ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {option.label}
                                                </h3>
                                                {!option.free && (
                                                    <span className="text-xs font-semibold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                                                        PREMIUM
                                                    </span>
                                                )}
                                            </div>

                                            <p className={`text-xs mb-3 ${
                                                isDark ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                                {option.description}
                                            </p>

                                            <div className={`flex justify-between text-xs ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                <span>⏱️ {option.time}</span>
                                                <span>📄 {option.pages}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Analyze Button */}
                            <button
                                type="submit"
                                disabled={isAnalyzing}
                                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                                    isAnalyzing
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
                                } text-white shadow-lg flex items-center justify-center gap-2`}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                                        {analysisProgress || 'Analyzing...'}
                                    </>
                                ) : (
                                    <>
                                        <FiSearch className="text-xl" />
                                        Start SEO Analysis
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Info Section */}
                    <div className={`rounded-lg p-6 ${
                        isDark 
                            ? 'bg-blue-500/10 border border-blue-500/20' 
                            : 'bg-blue-50 border border-blue-200'
                    }`}>
                        <h3 className={`font-semibold mb-2 ${
                            isDark ? 'text-blue-300' : 'text-blue-900'
                        }`}>
                            What will be analyzed?
                        </h3>
                        <ul className={`space-y-1 text-sm ${
                            isDark ? 'text-blue-200' : 'text-blue-800'
                        }`}>
                            <li>✓ Meta tags and descriptions</li>
                            <li>✓ Heading structure (H1-H6)</li>
                            <li>✓ Image optimization and next-gen formats</li>
                            <li>✓ Page performance metrics</li>
                            <li>✓ Mobile-friendliness</li>
                            <li>✓ And much more...</li>
                        </ul>
                    </div>

                    {/* CORS Information */}
                    <div className={`rounded-lg p-6 ${
                        isDark 
                            ? 'bg-yellow-500/10 border border-yellow-500/20' 
                            : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                        <h3 className={`font-semibold mb-2 ${
                            isDark ? 'text-yellow-300' : 'text-yellow-900'
                        }`}>
                            ℹ️ About CORS Restrictions
                        </h3>
                        <p className={`text-sm mb-2 ${
                            isDark ? 'text-yellow-200' : 'text-yellow-800'
                        }`}>
                            Some websites may block analysis due to security policies. This tool uses multiple proxy services to bypass CORS restrictions.
                        </p>
                        <p className={`text-xs ${
                            isDark ? 'text-yellow-300/70' : 'text-yellow-700'
                        }`}>
                            <strong>Best results:</strong> Analyzing your own websites or public pages. Some sites with strict security may still be inaccessible.
                        </p>
                    </div>

                    {/* Results Section */}
                    {results && (
                        <div id="results-section" className="mt-8">
                            <div className="mb-6">
                                <h2 className={`text-3xl font-bold mb-2 ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                    Analysis Results
                                </h2>
                                <p className={`text-sm ${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    Analyzed: {results.url}
                                </p>
                                <p className={`text-xs ${
                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                    {new Date(results.analyzedAt).toLocaleString()}
                                </p>
                            </div>

                            <PagePreviewResults data={results} />

                            <VisualReportResults data={results} />

                            <TechnicalSEOResults data={results} />

                            <ContentAnalysisResults data={results} />

                            <PerformanceMetricsResults data={results} />

                            <OnPageSEOResults data={results} />

                            <AdditionalFeaturesResults
                                data={results}
                                onCompareCompetitor={handleCompareCompetitor}
                            />
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default SEOTool;

