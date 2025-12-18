import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FiEye, FiChevronDown, FiChevronUp, FiExternalLink, FiCamera, FiRefreshCw } from 'react-icons/fi';

const PagePreviewResults = ({ data }) => {
    const { isDark } = useTheme();
    const [expandedSections, setExpandedSections] = useState({
        screenshot: true,
        elements: false,
    });
    const [screenshotError, setScreenshotError] = useState(false);
    const [screenshotKey, setScreenshotKey] = useState(Date.now());

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Generate screenshot URL using external API service
    const getScreenshotUrl = () => {
        // Using multiple free screenshot services (no API key required)
        // These are completely free and don't require registration

        // Option 1: Thum.io (free, reliable, no API key)
        return `https://image.thum.io/get/width/1200/crop/900/noanimate/${encodeURIComponent(data.url)}?t=${screenshotKey}`;

        // Alternative options if above fails:
        // Option 2: ApiFlash alternative
        // return `https://shot.screenshotapi.net/screenshot?url=${encodeURIComponent(data.url)}&width=1200&height=800&fresh=true`;

        // Option 3: PagePeeker (backup)
        // return `https://api.pagepeeker.com/v2/thumbs.php?size=l&url=${encodeURIComponent(data.url)}&refresh=${screenshotKey}`;
    };

    const handleRefreshScreenshot = () => {
        setScreenshotError(false);
        setScreenshotKey(Date.now()); // Force reload with new timestamp
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

    const createElementIndicators = () => {
        const indicators = [];

        // Title found
        if (data.metaTags?.title?.content) {
            indicators.push({
                type: 'Title Tag',
                status: data.metaTags.title.status,
                value: data.metaTags.title.content,
                length: `${data.metaTags.title.length} characters`,
                location: 'HTML <head> section',
                icon: '📄'
            });
        }

        // Description found
        if (data.metaTags?.description?.content) {
            indicators.push({
                type: 'Meta Description',
                status: data.metaTags.description.status,
                value: data.metaTags.description.content,
                length: `${data.metaTags.description.length} characters`,
                location: 'HTML <head> section',
                icon: '📝'
            });
        }

        // H1 headings
        if (data.headingAnalysis?.counts?.h1 > 0) {
            indicators.push({
                type: 'H1 Heading',
                status: data.headingAnalysis.counts.h1 === 1 ? 'passed' : 'warning',
                value: data.headingAnalysis.hierarchy.find(h => h.level === 1)?.text || 'Found',
                count: `${data.headingAnalysis.counts.h1} H1 tag${data.headingAnalysis.counts.h1 > 1 ? 's' : ''}`,
                location: 'Page body',
                icon: '📌'
            });
        }

        // Images
        if (data.imageAnalysis?.total > 0) {
            indicators.push({
                type: 'Images',
                status: data.imageAnalysis.missingAlt > 0 ? 'warning' : 'passed',
                value: `${data.imageAnalysis.total} images found`,
                details: `${data.imageAnalysis.missingAlt} missing alt text, ${data.imagePerformance?.nextGenCount || 0} next-gen format`,
                location: 'Throughout page',
                icon: '🖼️'
            });
        }

        // Links
        if (data.linkAnalysis?.total > 0) {
            indicators.push({
                type: 'Links',
                status: data.brokenLinks?.brokenCount > 0 ? 'critical' : 'passed',
                value: `${data.linkAnalysis.total} links found`,
                details: `${data.linkAnalysis.internal} internal, ${data.linkAnalysis.external} external`,
                location: 'Throughout page',
                icon: '🔗'
            });
        }

        // Canonical URL
        if (data.canonical?.present) {
            indicators.push({
                type: 'Canonical URL',
                status: 'passed',
                value: data.canonical.url,
                location: 'HTML <head> section',
                icon: '🔖'
            });
        }

        // Structured Data
        if (data.structuredData?.present) {
            indicators.push({
                type: 'Structured Data',
                status: 'passed',
                value: `${data.structuredData.count} schema(s) found`,
                details: data.structuredData.types.join(', '),
                location: 'HTML <head> or <body>',
                icon: '📊'
            });
        }

        return indicators;
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'passed':
            case 'good':
                return isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200';
            case 'warning':
            case 'needs-improvement':
                return isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200';
            case 'critical':
            case 'poor':
                return isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200';
            default:
                return isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200';
        }
    };

    const indicators = createElementIndicators();

    return (
        <div className="space-y-4 mt-6">
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Page Preview & Visual Analysis
            </h2>

            {/* Page Screenshot */}
            <div>
                <SectionHeader
                    title="Page Screenshot"
                    icon={FiCamera}
                    isExpanded={expandedSections.screenshot}
                    onClick={() => toggleSection('screenshot')}
                />
                {expandedSections.screenshot && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className={`mb-4 p-3 rounded ${
                            isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                        }`}>
                            <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                📸 This is how your page looks to visitors and search engines. The analysis below shows what elements were detected.
                            </p>
                        </div>

                        <div className={`rounded-lg border-2 overflow-hidden ${
                            isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-gray-100'
                        }`}>
                            {!screenshotError ? (
                                <div className="relative">
                                    <img
                                        src={getScreenshotUrl()}
                                        alt={`Screenshot of ${data.url}`}
                                        className="w-full h-auto"
                                        onError={() => setScreenshotError(true)}
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={handleRefreshScreenshot}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                                isDark ? 'bg-gray-900/90 text-white hover:bg-gray-800' : 'bg-white/90 text-gray-900 hover:bg-gray-100'
                                            } shadow-lg transition-colors`}
                                        >
                                            <FiRefreshCw size={16} />
                                            <span className="text-sm font-medium">Refresh</span>
                                        </button>
                                        <a
                                            href={data.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                                isDark ? 'bg-blue-600/90 text-white hover:bg-blue-700' : 'bg-blue-600/90 text-white hover:bg-blue-700'
                                            } shadow-lg transition-colors`}
                                        >
                                            <FiExternalLink size={16} />
                                            <span className="text-sm font-medium">Visit Page</span>
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className={`p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <FiCamera className={`text-5xl mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                                    <p className={`mb-2 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Screenshot Preview Unavailable
                                    </p>
                                    <p className={`mb-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Some websites may block screenshot services. You can visit the page directly to view it.
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={handleRefreshScreenshot}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                                isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                                            } text-white transition-colors`}
                                        >
                                            <FiRefreshCw size={16} />
                                            Try Again
                                        </button>
                                        <a
                                            href={data.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                                isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'
                                            } text-white transition-colors`}
                                        >
                                            <FiExternalLink size={16} />
                                            View Live Page
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={`mt-4 p-3 rounded text-xs ${
                            isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                            <p>
                                ℹ️ Screenshot is generated using an external service. Some websites may block screenshot services or take a moment to load. Click "Refresh" to reload the screenshot.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Detected Elements */}
            <div>
                <SectionHeader
                    title="Detected Page Elements"
                    icon={FiEye}
                    isExpanded={expandedSections.elements}
                    onClick={() => toggleSection('elements')}
                />
                {expandedSections.elements && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            These are the actual elements found during the SEO analysis. Each shows where it was detected and its current status.
                        </p>

                        <div className="space-y-3">
                            {indicators.map((indicator, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg border ${getStatusBgColor(indicator.status)}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{indicator.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {indicator.type}
                                                </h4>
                                                <span className={`text-xs px-2 py-1 rounded font-semibold ${
                                                    indicator.status === 'passed' || indicator.status === 'good'
                                                        ? 'bg-green-500/20 text-green-600'
                                                        : indicator.status === 'warning' || indicator.status === 'needs-improvement'
                                                        ? 'bg-yellow-500/20 text-yellow-600'
                                                        : 'bg-red-500/20 text-red-600'
                                                }`}>
                                                    {indicator.status === 'passed' || indicator.status === 'good' ? '✓ FOUND' : '⚠ ISSUE'}
                                                </span>
                                            </div>

                                            <div className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                <p className="font-medium">{indicator.value}</p>
                                                {indicator.length && (
                                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Length: {indicator.length}
                                                    </p>
                                                )}
                                                {indicator.count && (
                                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {indicator.count}
                                                    </p>
                                                )}
                                                {indicator.details && (
                                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Details: {indicator.details}
                                                    </p>
                                                )}
                                                <p className={`text-xs italic ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    📍 Location: {indicator.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {indicators.length === 0 && (
                            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <p>No elements detected for preview.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PagePreviewResults;

