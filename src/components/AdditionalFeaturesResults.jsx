import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
    FiChevronDown,
    FiChevronUp,
    FiDownload,
    FiUsers,
    FiFileText
} from 'react-icons/fi';

const AdditionalFeaturesResults = ({ data, onCompareCompetitor }) => {
    const { isDark } = useTheme();
    const [expandedSections, setExpandedSections] = useState({
        competitor: false,
        export: true,
    });
    const [competitorUrl, setCompetitorUrl] = useState('');
    const [isComparing, setIsComparing] = useState(false);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const SectionHeader = ({ title, icon: Icon, isExpanded, onClick }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
        >
            <div className="flex items-center gap-3">
                <Icon className={`text-xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                </h3>
            </div>
            {isExpanded ? (
                <FiChevronUp className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            ) : (
                <FiChevronDown className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            )}
        </button>
    );

    const handleCompare = async () => {
        if (!competitorUrl.trim()) {
            alert('Please enter a competitor URL');
            return;
        }

        setIsComparing(true);
        try {
            await onCompareCompetitor(competitorUrl);
        } catch (error) {
            console.error('Comparison error:', error);
            alert('Failed to analyze competitor. Please check the URL and try again.');
        } finally {
            setIsComparing(false);
        }
    };

    const exportToJSON = () => {
        const exportData = {
            url: data.url,
            analyzedAt: data.analyzedAt,
            scores: {
                overall: calculateOverallScore(),
                technical: calculateTechnicalScore(),
                content: calculateContentScore(),
                performance: data.performanceScore?.overall || 0,
                onPage: calculateOnPageScore(),
            },
            technicalSEO: {
                title: {
                    content: data.metaTags?.title?.content,
                    length: data.metaTags?.title?.length,
                    status: data.metaTags?.title?.status,
                },
                description: {
                    content: data.metaTags?.description?.content,
                    length: data.metaTags?.description?.length,
                    status: data.metaTags?.description?.status,
                },
                canonical: data.canonical?.present,
                openGraph: data.openGraph?.present,
                twitterCard: data.twitterCard?.present,
                structuredData: {
                    present: data.structuredData?.present,
                    count: data.structuredData?.count,
                },
                sitemap: data.sitemap?.present,
            },
            content: {
                headings: {
                    h1: data.headingAnalysis?.counts?.h1,
                    h2: data.headingAnalysis?.counts?.h2,
                    h3: data.headingAnalysis?.counts?.h3,
                },
                images: {
                    total: data.imageAnalysis?.total,
                    missingAlt: data.imageAnalysis?.missingAlt,
                    nextGen: data.imagePerformance?.nextGenCount,
                    legacy: data.imagePerformance?.legacyCount,
                },
                wordCount: data.contentMetrics?.wordCount,
                readingTime: data.contentMetrics?.readingTime,
                links: {
                    total: data.linkAnalysis?.total,
                    internal: data.linkAnalysis?.internal,
                    external: data.linkAnalysis?.external,
                },
            },
            performance: {
                loadTime: data.loadTime?.estimatedTime,
                pageSize: data.resources?.totalSize,
                imageWeight: data.imagePerformance?.totalWeight,
                mobileScore: data.mobileFriendly?.score,
            },
            onPageSEO: {
                urlLength: data.urlStructure?.length,
                isSecure: data.urlStructure?.isSecure,
                brokenLinks: data.brokenLinks?.brokenCount,
                duplicateContent: data.duplicateContent?.issues?.length || 0,
            },
            imageOptimization: {
                totalWeight: data.imagePerformance?.totalWeight,
                potentialSavings: data.imagePerformance?.potentialSavings,
                optimizedWeight: data.imagePerformance?.optimizedWeight,
            },
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seo-analysis-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const exportToCSV = () => {
        const scores = {
            overall: calculateOverallScore(),
            technical: calculateTechnicalScore(),
            content: calculateContentScore(),
            performance: data.performanceScore?.overall || 0,
            onPage: calculateOnPageScore(),
        };

        const csvData = [
            ['SEO Analysis Report'],
            ['URL', data.url],
            ['Analyzed At', new Date(data.analyzedAt).toLocaleString()],
            [],
            ['SCORES'],
            ['Overall Score', scores.overall],
            ['Technical SEO', scores.technical],
            ['Content Quality', scores.content],
            ['Performance', scores.performance],
            ['On-Page SEO', scores.onPage],
            [],
            ['TECHNICAL SEO'],
            ['Title Length', data.metaTags?.title?.length || 0],
            ['Description Length', data.metaTags?.description?.length || 0],
            ['Has Canonical', data.canonical?.present ? 'Yes' : 'No'],
            ['Has Open Graph', data.openGraph?.present ? 'Yes' : 'No'],
            ['Has Twitter Card', data.twitterCard?.present ? 'Yes' : 'No'],
            ['Structured Data Count', data.structuredData?.count || 0],
            ['Has Sitemap', data.sitemap?.present ? 'Yes' : 'No'],
            [],
            ['CONTENT'],
            ['H1 Count', data.headingAnalysis?.counts?.h1 || 0],
            ['H2 Count', data.headingAnalysis?.counts?.h2 || 0],
            ['H3 Count', data.headingAnalysis?.counts?.h3 || 0],
            ['Total Images', data.imageAnalysis?.total || 0],
            ['Images Missing Alt', data.imageAnalysis?.missingAlt || 0],
            ['Next-gen Images', data.imagePerformance?.nextGenCount || 0],
            ['Legacy Images', data.imagePerformance?.legacyCount || 0],
            ['Word Count', data.contentMetrics?.wordCount || 0],
            ['Reading Time (min)', data.contentMetrics?.readingTime || 0],
            ['Total Links', data.linkAnalysis?.total || 0],
            ['Internal Links', data.linkAnalysis?.internal || 0],
            ['External Links', data.linkAnalysis?.external || 0],
            [],
            ['PERFORMANCE'],
            ['Load Time (ms)', data.loadTime?.estimatedTime || 0],
            ['Page Size (bytes)', data.resources?.totalSize || 0],
            ['Image Weight (bytes)', data.imagePerformance?.totalWeight || 0],
            ['Mobile Score', data.mobileFriendly?.score || 0],
            [],
            ['ON-PAGE SEO'],
            ['URL Length', data.urlStructure?.length || 0],
            ['Is HTTPS', data.urlStructure?.isSecure ? 'Yes' : 'No'],
            ['Broken Links', data.brokenLinks?.brokenCount || 0],
            ['Duplicate Content Issues', data.duplicateContent?.issues?.length || 0],
            [],
            ['IMAGE OPTIMIZATION'],
            ['Total Image Weight (bytes)', data.imagePerformance?.totalWeight || 0],
            ['Potential Savings (bytes)', data.imagePerformance?.potentialSavings || 0],
            ['Optimized Weight (bytes)', data.imagePerformance?.optimizedWeight || 0],
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seo-analysis-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Score calculation functions (same as VisualReportResults)
    const calculateOverallScore = () => {
        const technical = calculateTechnicalScore();
        const content = calculateContentScore();
        const performance = data.performanceScore?.overall || 0;
        const onPage = calculateOnPageScore();

        return Math.round(
            technical * 0.3 +
            content * 0.25 +
            performance * 0.25 +
            onPage * 0.2
        );
    };

    const calculateTechnicalScore = () => {
        let score = 100;

        if (data.metaTags?.title?.status === 'critical') score -= 20;
        else if (data.metaTags?.title?.status === 'warning') score -= 10;

        if (data.metaTags?.description?.status === 'critical') score -= 20;
        else if (data.metaTags?.description?.status === 'warning') score -= 10;

        if (data.openGraph?.status === 'critical') score -= 15;
        else if (data.openGraph?.status === 'warning') score -= 8;

        if (!data.canonical?.present) score -= 10;
        if (!data.structuredData?.present) score -= 10;
        if (!data.sitemap?.present) score -= 5;

        return Math.max(0, score);
    };

    const calculateContentScore = () => {
        let score = 100;

        if (data.headingAnalysis?.status === 'critical') score -= 20;
        else if (data.headingAnalysis?.status === 'warning') score -= 10;

        if (data.imageAnalysis?.missingAlt > data.imageAnalysis?.total / 2) score -= 20;
        else if (data.imageAnalysis?.missingAlt > 0) score -= 10;

        if (data.contentMetrics?.wordCount < 100) score -= 25;
        else if (data.contentMetrics?.wordCount < 300) score -= 15;

        if (data.linkAnalysis?.internal === 0) score -= 10;

        return Math.max(0, score);
    };

    const calculateOnPageScore = () => {
        let score = 100;

        if (data.titleDescription?.titleStatus === 'poor') score -= 20;
        else if (data.titleDescription?.titleStatus === 'warning') score -= 10;

        if (data.titleDescription?.descriptionStatus === 'poor') score -= 20;
        else if (data.titleDescription?.descriptionStatus === 'warning') score -= 10;

        if (data.urlStructure?.status === 'poor') score -= 15;
        else if (data.urlStructure?.status === 'warning') score -= 8;

        if (data.brokenLinks?.brokenCount > 0) score -= 20;
        else if (data.brokenLinks?.suspiciousCount > 0) score -= 10;

        if (data.duplicateContent?.status === 'poor') score -= 15;
        else if (data.duplicateContent?.status === 'warning') score -= 8;

        return Math.max(0, score);
    };

    return (
        <div className="space-y-4 mt-6">
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Additional Features
            </h2>

            {/* Competitor Comparison */}
            <div>
                <SectionHeader
                    title="Competitor Comparison"
                    icon={FiUsers}
                    isExpanded={expandedSections.competitor}
                    onClick={() => toggleSection('competitor')}
                />
                {expandedSections.competitor && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className={`p-4 rounded-lg mb-4 ${
                            isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                        }`}>
                            <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                💡 Compare your SEO performance against a competitor's website to identify opportunities for improvement.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="competitor-url"
                                    className={`block text-sm font-semibold mb-2 ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                                >
                                    Competitor URL
                                </label>
                                <input
                                    id="competitor-url"
                                    type="text"
                                    value={competitorUrl}
                                    onChange={(e) => setCompetitorUrl(e.target.value)}
                                    placeholder="https://competitor-website.com"
                                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                                        isDark 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                                    disabled={isComparing}
                                />
                            </div>

                            <button
                                onClick={handleCompare}
                                disabled={isComparing}
                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                                    isComparing
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                } text-white shadow-lg flex items-center justify-center gap-2`}
                            >
                                {isComparing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Analyzing Competitor...
                                    </>
                                ) : (
                                    <>
                                        <FiUsers />
                                        Compare with Competitor
                                    </>
                                )}
                            </button>
                        </div>

                        <div className={`mt-4 p-3 rounded border ${
                            isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'
                        }`}>
                            <p className={`text-xs ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`}>
                                ⚠️ Note: This will analyze the competitor's public-facing website using the same SEO checks. The comparison will open in a new analysis view.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Export Results */}
            <div>
                <SectionHeader
                    title="Export Results"
                    icon={FiFileText}
                    isExpanded={expandedSections.export}
                    onClick={() => toggleSection('export')}
                />
                {expandedSections.export && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Export your SEO analysis results in different formats for reporting, sharing, or further analysis.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Export as JSON */}
                            <div className={`p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
                                isDark 
                                    ? 'bg-gray-700/50 border-gray-600 hover:border-blue-500' 
                                    : 'bg-gray-50 border-gray-200 hover:border-blue-500'
                            }`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-lg ${
                                        isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                                    }`}>
                                        <FiFileText className="text-2xl text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            JSON Format
                                        </h4>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Structured data
                                        </p>
                                    </div>
                                </div>

                                <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Export as JSON for programmatic access, APIs, or integration with other tools.
                                </p>

                                <ul className={`text-xs space-y-1 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <li>✓ Machine-readable format</li>
                                    <li>✓ Complete data structure</li>
                                    <li>✓ Easy to parse and process</li>
                                    <li>✓ Perfect for developers</li>
                                </ul>

                                <button
                                    onClick={exportToJSON}
                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                        isDark 
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    } flex items-center justify-center gap-2`}
                                >
                                    <FiDownload size={16} />
                                    Export as JSON
                                </button>
                            </div>

                            {/* Export as CSV */}
                            <div className={`p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
                                isDark 
                                    ? 'bg-gray-700/50 border-gray-600 hover:border-green-500' 
                                    : 'bg-gray-50 border-gray-200 hover:border-green-500'
                            }`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-lg ${
                                        isDark ? 'bg-green-500/20' : 'bg-green-100'
                                    }`}>
                                        <FiFileText className="text-2xl text-green-500" />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            CSV Format
                                        </h4>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Spreadsheet compatible
                                        </p>
                                    </div>
                                </div>

                                <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Export as CSV for Excel, Google Sheets, or data analysis tools.
                                </p>

                                <ul className={`text-xs space-y-1 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <li>✓ Excel/Sheets compatible</li>
                                    <li>✓ Easy to visualize data</li>
                                    <li>✓ Client-friendly format</li>
                                    <li>✓ Simple reporting</li>
                                </ul>

                                <button
                                    onClick={exportToCSV}
                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                        isDark 
                                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    } flex items-center justify-center gap-2`}
                                >
                                    <FiDownload size={16} />
                                    Export as CSV
                                </button>
                            </div>
                        </div>

                        {/* Export Info */}
                        <div className={`mt-6 p-4 rounded-lg ${
                            isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                        }`}>
                            <h5 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                What's Included in Exports:
                            </h5>
                            <div className="grid md:grid-cols-2 gap-2">
                                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <li>• Overall & category scores</li>
                                    <li>• Technical SEO metrics</li>
                                    <li>• Content analysis data</li>
                                    <li>• Performance metrics</li>
                                </ul>
                                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <li>• On-page SEO findings</li>
                                    <li>• Image optimization stats</li>
                                    <li>• Link analysis results</li>
                                    <li>• Timestamp & URL info</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdditionalFeaturesResults;

