import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FiEye, FiChevronDown, FiChevronUp, FiExternalLink, FiCamera, FiRefreshCw } from 'react-icons/fi';
import html2canvas from 'html2canvas';

const PagePreviewResults = ({ data }) => {
    const { isDark } = useTheme();
    const [expandedSections, setExpandedSections] = useState({
        screenshot: true,
        elements: false,
    });
    const [screenshot, setScreenshot] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [captureError, setCaptureError] = useState(null);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Capture screenshot when iframe loads
    useEffect(() => {
        if (iframeLoaded && !screenshot) {
            captureScreenshot();
        }
    }, [iframeLoaded]);

    const captureScreenshot = async () => {
        setIsCapturing(true);
        setCaptureError(null);

        try {
            // Create an iframe to load the page
            const iframe = document.getElementById('preview-iframe');

            if (!iframe || !iframe.contentWindow) {
                throw new Error('Unable to access page content');
            }

            // Wait a bit for content to render
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Capture screenshot using html2canvas
            const canvas = await html2canvas(iframe.contentWindow.document.body, {
                allowTaint: true,
                useCORS: true,
                scrollY: 0,
                scrollX: 0,
                width: iframe.contentWindow.document.body.scrollWidth,
                height: Math.min(iframe.contentWindow.document.body.scrollHeight, 4000),
                windowWidth: 1200,
                windowHeight: 800,
            });

            // Convert to data URL
            const screenshotData = canvas.toDataURL('image/png');
            setScreenshot(screenshotData);
        } catch (error) {
            console.error('Screenshot capture error:', error);
            setCaptureError(error.message || 'Failed to capture screenshot');
        } finally {
            setIsCapturing(false);
        }
    };

    const handleIframeLoad = () => {
        setIframeLoaded(true);
    };

    const retryCapture = () => {
        setScreenshot(null);
        setCaptureError(null);
        setIframeLoaded(false);
        // Reload iframe by changing src slightly
        const iframe = document.getElementById('preview-iframe');
        if (iframe) {
            const currentSrc = iframe.src;
            iframe.src = currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'refresh=' + Date.now();
        }
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
                            {screenshot ? (
                                // Show captured screenshot
                                <div className="relative">
                                    <img
                                        src={screenshot}
                                        alt={`Screenshot of ${data.url}`}
                                        className="w-full h-auto"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={retryCapture}
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
                            ) : captureError ? (
                                // Show error with retry
                                <div className={`p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <FiCamera className={`text-5xl mx-auto mb-4 ${isDark ? 'text-red-500' : 'text-red-600'}`} />
                                    <p className={`mb-2 font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                        Screenshot capture failed
                                    </p>
                                    <p className={`mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {captureError}
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={retryCapture}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                                isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                                            } text-white transition-colors`}
                                        >
                                            <FiRefreshCw size={16} />
                                            Retry Capture
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
                            ) : isCapturing ? (
                                // Show loading state
                                <div className={`p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
                                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Capturing Screenshot...
                                    </p>
                                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        This may take a few seconds
                                    </p>
                                </div>
                            ) : (
                                // Show iframe preview while loading
                                <div className="relative" style={{ height: '600px' }}>
                                    <iframe
                                        id="preview-iframe"
                                        src={data.url}
                                        onLoad={handleIframeLoad}
                                        className="w-full h-full border-0"
                                        title={`Preview of ${data.url}`}
                                        sandbox="allow-same-origin allow-scripts"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <a
                                            href={data.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                                isDark ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-900'
                                            } shadow-lg hover:scale-105 transition-transform`}
                                        >
                                            <FiExternalLink size={16} />
                                            <span className="text-sm font-medium">Visit Page</span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={`mt-4 p-3 rounded text-xs ${
                            isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                            <p>
                                ℹ️ Screenshot is captured directly from the live page. {screenshot ? 'Click "Refresh" to update the screenshot.' : 'The page is loading...'}
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

