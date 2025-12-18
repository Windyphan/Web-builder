import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
    FiCheckCircle,
    FiAlertTriangle,
    FiXCircle,
    FiChevronDown,
    FiChevronUp,
    FiType,
    FiImage,
    FiFileText,
    FiLink2,
    FiHash
} from 'react-icons/fi';

const ContentAnalysisResults = ({ data }) => {
    const { isDark } = useTheme();
    const [expandedSections, setExpandedSections] = useState({
        headings: true,
        images: false,
        content: false,
        links: false,
        keywords: false,
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'passed':
                return 'text-green-500';
            case 'warning':
                return 'text-yellow-500';
            case 'critical':
                return 'text-red-500';
            default:
                return isDark ? 'text-gray-400' : 'text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed':
                return <FiCheckCircle className="text-green-500" />;
            case 'warning':
                return <FiAlertTriangle className="text-yellow-500" />;
            case 'critical':
                return <FiXCircle className="text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'passed':
                return isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200';
            case 'warning':
                return isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200';
            case 'critical':
                return isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200';
            default:
                return isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200';
        }
    };

    const SectionHeader = ({ title, icon: Icon, status, isExpanded, onClick }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                getStatusBgColor(status)
            } hover:shadow-md`}
        >
            <div className="flex items-center gap-3">
                <Icon className={`text-xl ${getStatusColor(status)}`} />
                <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                </h3>
                {getStatusIcon(status)}
            </div>
            {isExpanded ? (
                <FiChevronUp className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            ) : (
                <FiChevronDown className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            )}
        </button>
    );

    const InfoRow = ({ label, value, status }) => (
        <div className="flex justify-between items-start py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {label}:
            </span>
            <span className={`text-right ml-4 ${getStatusColor(status) || (isDark ? 'text-gray-400' : 'text-gray-600')}`}>
                {value || 'Not set'}
            </span>
        </div>
    );

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4 mt-6">
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Content Analysis
            </h2>

            {/* Headings Structure Section */}
            <div>
                <SectionHeader
                    title="Heading Structure (H1-H6)"
                    icon={FiType}
                    status={data.headingAnalysis.status}
                    isExpanded={expandedSections.headings}
                    onClick={() => toggleSection('headings')}
                />
                {expandedSections.headings && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.headingAnalysis.status)}
                            <span className={getStatusColor(data.headingAnalysis.status)}>
                                {data.headingAnalysis.recommendation}
                            </span>
                        </div>

                        {/* Heading counts */}
                        <div className={`p-3 rounded mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {Object.entries(data.headingAnalysis.counts).map(([tag, count]) => (
                                    <div key={tag} className="flex items-center justify-between">
                                        <span className={`font-semibold uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {tag}:
                                        </span>
                                        <span className={`font-bold ${
                                            tag === 'h1' 
                                                ? count === 1 ? 'text-green-500' : count === 0 ? 'text-red-500' : 'text-yellow-500'
                                                : isDark ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Heading hierarchy */}
                        <div>
                            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Heading Hierarchy
                            </h4>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {data.headingAnalysis.hierarchy.map((heading, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 rounded ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'}`}
                                        style={{ marginLeft: `${(parseInt(heading.level) - 1) * 16}px` }}
                                    >
                                        <div className="flex items-start gap-2">
                                            <span className={`font-bold text-xs uppercase ${
                                                heading.level === 1 ? 'text-blue-500' : 
                                                heading.level === 2 ? 'text-green-500' :
                                                heading.level === 3 ? 'text-yellow-500' :
                                                isDark ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                                H{heading.level}
                                            </span>
                                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {heading.text}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Images Analysis Section */}
            <div>
                <SectionHeader
                    title="Image Optimization"
                    icon={FiImage}
                    status={data.imageAnalysis.status}
                    isExpanded={expandedSections.images}
                    onClick={() => toggleSection('images')}
                />
                {expandedSections.images && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.imageAnalysis.status)}
                            <span className={getStatusColor(data.imageAnalysis.status)}>
                                {data.imageAnalysis.recommendation}
                            </span>
                        </div>

                        {/* Summary Stats */}
                        <div className={`p-3 rounded mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                <InfoRow label="Total Images" value={data.imageAnalysis.total.toString()} />
                                <InfoRow
                                    label="Missing Alt Text"
                                    value={data.imageAnalysis.missingAlt.toString()}
                                    status={data.imageAnalysis.missingAlt > 0 ? 'warning' : 'passed'}
                                />
                                <InfoRow
                                    label="Next-gen Format"
                                    value={data.imageAnalysis.nextGenFormat.toString()}
                                    status="passed"
                                />
                                <InfoRow
                                    label="Legacy Format"
                                    value={data.imageAnalysis.legacyFormat.toString()}
                                    status={data.imageAnalysis.legacyFormat > 0 ? 'warning' : 'passed'}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <InfoRow
                                    label="Lazy Loading"
                                    value={data.imageAnalysis.lazyLoaded.toString()}
                                />
                                <InfoRow
                                    label="Responsive (srcset)"
                                    value={data.imageAnalysis.responsive.toString()}
                                />
                            </div>
                        </div>

                        {/* Format Breakdown */}
                        <div className="mb-4">
                            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Image Formats
                            </h4>
                            <div className={`p-3 rounded ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                                {Object.entries(data.imageAnalysis.formatBreakdown).map(([format, count]) => (
                                    <div key={format} className="flex justify-between items-center py-1">
                                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {format.toUpperCase()}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                                {count} image{count !== 1 ? 's' : ''}
                                            </span>
                                            {(format === 'webp' || format === 'avif') && (
                                                <span className="text-green-500 text-xs">✓ Next-gen</span>
                                            )}
                                            {(format === 'jpg' || format === 'jpeg' || format === 'png' || format === 'gif') && (
                                                <span className="text-yellow-500 text-xs">⚠ Legacy</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Individual Images */}
                        {data.imageAnalysis.images.length > 0 && (
                            <details className="mt-3">
                                <summary className={`cursor-pointer font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    View All Images ({data.imageAnalysis.images.length})
                                </summary>
                                <div className="space-y-2 max-h-96 overflow-y-auto mt-2">
                                    {data.imageAnalysis.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-3 rounded border ${
                                                isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {img.src && (
                                                    <img
                                                        src={img.src}
                                                        alt={img.alt || 'No alt text'}
                                                        className="w-16 h-16 object-cover rounded"
                                                        loading="lazy"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs font-semibold uppercase ${
                                                            img.isNextGen ? 'text-green-500' : 'text-yellow-500'
                                                        }`}>
                                                            {img.format}
                                                        </span>
                                                        {img.hasAlt ? (
                                                            <span className="text-green-500 text-xs">✓ Alt text</span>
                                                        ) : (
                                                            <span className="text-red-500 text-xs">✗ No alt text</span>
                                                        )}
                                                        {img.isLazyLoaded && (
                                                            <span className="text-blue-500 text-xs">⚡ Lazy</span>
                                                        )}
                                                        {img.hasResponsive && (
                                                            <span className="text-purple-500 text-xs">📱 Responsive</span>
                                                        )}
                                                    </div>
                                                    <p className={`text-xs truncate mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {img.src}
                                                    </p>
                                                    {img.alt && (
                                                        <p className={`text-xs italic ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                            Alt: "{img.alt}"
                                                        </p>
                                                    )}
                                                    {img.estimatedSize && (
                                                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                            Est. size: {formatBytes(img.estimatedSize)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        )}
                    </div>
                )}
            </div>

            {/* Content Analysis Section */}
            <div>
                <SectionHeader
                    title="Content Metrics"
                    icon={FiFileText}
                    status={data.contentMetrics.status}
                    isExpanded={expandedSections.content}
                    onClick={() => toggleSection('content')}
                />
                {expandedSections.content && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.contentMetrics.status)}
                            <span className={getStatusColor(data.contentMetrics.status)}>
                                {data.contentMetrics.recommendation}
                            </span>
                        </div>

                        <div className={`p-3 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <InfoRow label="Word Count" value={data.contentMetrics.wordCount.toString()} />
                            <InfoRow label="Character Count" value={data.contentMetrics.charCount.toString()} />
                            <InfoRow label="Paragraph Count" value={data.contentMetrics.paragraphCount.toString()} />
                            <InfoRow
                                label="Reading Time"
                                value={`${data.contentMetrics.readingTime} min`}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Links Analysis Section */}
            <div>
                <SectionHeader
                    title="Link Analysis"
                    icon={FiLink2}
                    status={data.linkAnalysis.status}
                    isExpanded={expandedSections.links}
                    onClick={() => toggleSection('links')}
                />
                {expandedSections.links && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.linkAnalysis.status)}
                            <span className={getStatusColor(data.linkAnalysis.status)}>
                                {data.linkAnalysis.recommendation}
                            </span>
                        </div>

                        <div className={`p-3 rounded mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <InfoRow label="Total Links" value={data.linkAnalysis.total.toString()} />
                            <InfoRow
                                label="Internal Links"
                                value={data.linkAnalysis.internal.toString()}
                                status="passed"
                            />
                            <InfoRow
                                label="External Links"
                                value={data.linkAnalysis.external.toString()}
                            />
                            <InfoRow
                                label="Broken Links"
                                value={data.linkAnalysis.broken.toString()}
                                status={data.linkAnalysis.broken > 0 ? 'critical' : 'passed'}
                            />
                        </div>

                        {/* Internal Links */}
                        {data.linkAnalysis.internalLinks.length > 0 && (
                            <details className="mb-3">
                                <summary className={`cursor-pointer font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Internal Links ({data.linkAnalysis.internalLinks.length})
                                </summary>
                                <div className={`space-y-1 max-h-48 overflow-y-auto mt-2 p-2 rounded ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                                    {data.linkAnalysis.internalLinks.slice(0, 20).map((link, idx) => (
                                        <div key={idx} className="text-sm">
                                            <a
                                                href={link.url}
                                                className="text-blue-500 hover:underline truncate block"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.text || link.url}
                                            </a>
                                        </div>
                                    ))}
                                    {data.linkAnalysis.internalLinks.length > 20 && (
                                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                            ... and {data.linkAnalysis.internalLinks.length - 20} more
                                        </p>
                                    )}
                                </div>
                            </details>
                        )}

                        {/* External Links */}
                        {data.linkAnalysis.externalLinks.length > 0 && (
                            <details>
                                <summary className={`cursor-pointer font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    External Links ({data.linkAnalysis.externalLinks.length})
                                </summary>
                                <div className={`space-y-1 max-h-48 overflow-y-auto mt-2 p-2 rounded ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                                    {data.linkAnalysis.externalLinks.slice(0, 20).map((link, idx) => (
                                        <div key={idx} className="text-sm">
                                            <a
                                                href={link.url}
                                                className="text-blue-500 hover:underline truncate block"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.text || link.url}
                                            </a>
                                            {link.rel && (
                                                <span className={`text-xs ml-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    [{link.rel}]
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {data.linkAnalysis.externalLinks.length > 20 && (
                                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                            ... and {data.linkAnalysis.externalLinks.length - 20} more
                                        </p>
                                    )}
                                </div>
                            </details>
                        )}
                    </div>
                )}
            </div>

            {/* Keyword Density Section */}
            <div>
                <SectionHeader
                    title="Keyword Density"
                    icon={FiHash}
                    status={data.keywordDensity.status}
                    isExpanded={expandedSections.keywords}
                    onClick={() => toggleSection('keywords')}
                />
                {expandedSections.keywords && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.keywordDensity.status)}
                            <span className={getStatusColor(data.keywordDensity.status)}>
                                {data.keywordDensity.recommendation}
                            </span>
                        </div>

                        <div>
                            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Top Keywords (Single Words)
                            </h4>
                            <div className={`space-y-2 mb-4 ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'} p-3 rounded`}>
                                {data.keywordDensity.topKeywords.slice(0, 10).map((kw, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {idx + 1}. {kw.word}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                                {kw.count} times
                                            </span>
                                            <span className="text-blue-500 font-semibold">
                                                {kw.density}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Top Phrases (2-3 Words)
                            </h4>
                            <div className={`space-y-2 ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'} p-3 rounded`}>
                                {data.keywordDensity.topPhrases.slice(0, 10).map((phrase, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {idx + 1}. {phrase.phrase}
                                        </span>
                                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                            {phrase.count} times
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentAnalysisResults;

