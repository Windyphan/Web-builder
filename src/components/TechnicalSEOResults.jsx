import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
    FiCheckCircle,
    FiAlertTriangle,
    FiXCircle,
    FiChevronDown,
    FiChevronUp,
    FiTag,
    FiShare2,
    FiLink,
    FiCode,
    FiMap
} from 'react-icons/fi';

const TechnicalSEOResults = ({ data }) => {
    const { isDark } = useTheme();
    const [expandedSections, setExpandedSections] = useState({
        metaTags: true,
        openGraph: false,
        twitterCard: false,
        canonical: false,
        robots: false,
        structuredData: false,
        sitemap: false,
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

    return (
        <div className="space-y-4">
            {/* Meta Tags Section */}
            <div>
                <SectionHeader
                    title="Meta Tags"
                    icon={FiTag}
                    status={data.metaTags.title.status}
                    isExpanded={expandedSections.metaTags}
                    onClick={() => toggleSection('metaTags')}
                />
                {expandedSections.metaTags && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        {/* Title */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Title Tag
                                </h4>
                                {getStatusIcon(data.metaTags.title.status)}
                            </div>
                            <p className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {data.metaTags.title.content || 'No title found'}
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    Length: {data.metaTags.title.length} characters
                                </span>
                                <span className={getStatusColor(data.metaTags.title.status)}>
                                    {data.metaTags.title.recommendation}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Meta Description
                                </h4>
                                {getStatusIcon(data.metaTags.description.status)}
                            </div>
                            <p className={`text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {data.metaTags.description.content || 'No description found'}
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    Length: {data.metaTags.description.length} characters
                                </span>
                                <span className={getStatusColor(data.metaTags.description.status)}>
                                    {data.metaTags.description.recommendation}
                                </span>
                            </div>
                        </div>

                        {/* Other Meta Tags */}
                        <div className={`p-3 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <InfoRow
                                label="Keywords"
                                value={data.metaTags.keywords.present ? data.metaTags.keywords.content : 'Not set'}
                            />
                            <InfoRow
                                label="Author"
                                value={data.metaTags.author.content}
                            />
                            <InfoRow
                                label="Viewport"
                                value={data.metaTags.viewport.present ? '✓ Mobile-friendly' : '✗ Not set'}
                                status={data.metaTags.viewport.isMobileFriendly ? 'passed' : 'critical'}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Open Graph Section */}
            <div>
                <SectionHeader
                    title="Open Graph Tags"
                    icon={FiShare2}
                    status={data.openGraph.status}
                    isExpanded={expandedSections.openGraph}
                    onClick={() => toggleSection('openGraph')}
                />
                {expandedSections.openGraph && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.openGraph.status)}
                            <span className={getStatusColor(data.openGraph.status)}>
                                {data.openGraph.recommendation}
                            </span>
                        </div>
                        {data.openGraph.present ? (
                            <div className={`p-3 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                {Object.entries(data.openGraph.tags).map(([key, value]) => (
                                    <InfoRow key={key} label={`og:${key}`} value={value} />
                                ))}
                            </div>
                        ) : (
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                No Open Graph tags found
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Twitter Card Section */}
            <div>
                <SectionHeader
                    title="Twitter Card Tags"
                    icon={FiShare2}
                    status={data.twitterCard.status}
                    isExpanded={expandedSections.twitterCard}
                    onClick={() => toggleSection('twitterCard')}
                />
                {expandedSections.twitterCard && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.twitterCard.status)}
                            <span className={getStatusColor(data.twitterCard.status)}>
                                {data.twitterCard.recommendation}
                            </span>
                        </div>
                        {data.twitterCard.present ? (
                            <div className={`p-3 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                {Object.entries(data.twitterCard.tags).map(([key, value]) => (
                                    <InfoRow key={key} label={`twitter:${key}`} value={value} />
                                ))}
                            </div>
                        ) : (
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                No Twitter Card tags found
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Canonical URL Section */}
            <div>
                <SectionHeader
                    title="Canonical URL"
                    icon={FiLink}
                    status={data.canonical.status}
                    isExpanded={expandedSections.canonical}
                    onClick={() => toggleSection('canonical')}
                />
                {expandedSections.canonical && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.canonical.status)}
                            <span className={getStatusColor(data.canonical.status)}>
                                {data.canonical.recommendation}
                            </span>
                        </div>
                        {data.canonical.present && (
                            <div className={`p-3 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                <InfoRow label="Canonical URL" value={data.canonical.url} />
                                <InfoRow
                                    label="Matches Current URL"
                                    value={data.canonical.isCorrect ? '✓ Yes' : '✗ No'}
                                    status={data.canonical.isCorrect ? 'passed' : 'warning'}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Robots Meta Section */}
            <div>
                <SectionHeader
                    title="Robots Meta Tag"
                    icon={FiCode}
                    status={data.robots.status}
                    isExpanded={expandedSections.robots}
                    onClick={() => toggleSection('robots')}
                />
                {expandedSections.robots && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.robots.status)}
                            <span className={getStatusColor(data.robots.status)}>
                                {data.robots.recommendation}
                            </span>
                        </div>
                        <div className={`p-3 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <InfoRow
                                label="Content"
                                value={data.robots.content || 'Not set (default: index, follow)'}
                            />
                            <InfoRow
                                label="Indexable"
                                value={data.robots.isIndexable ? '✓ Yes' : '✗ No'}
                                status={data.robots.isIndexable ? 'passed' : 'warning'}
                            />
                            <InfoRow
                                label="Followable"
                                value={data.robots.isFollowable ? '✓ Yes' : '✗ No'}
                                status={data.robots.isFollowable ? 'passed' : 'warning'}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Structured Data Section */}
            <div>
                <SectionHeader
                    title="Structured Data (Schema.org)"
                    icon={FiCode}
                    status={data.structuredData.status}
                    isExpanded={expandedSections.structuredData}
                    onClick={() => toggleSection('structuredData')}
                />
                {expandedSections.structuredData && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.structuredData.status)}
                            <span className={getStatusColor(data.structuredData.status)}>
                                {data.structuredData.recommendation}
                            </span>
                        </div>
                        {data.structuredData.present ? (
                            <div className={`p-3 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                <InfoRow
                                    label="Schemas Found"
                                    value={data.structuredData.count.toString()}
                                />
                                <InfoRow
                                    label="Schema Types"
                                    value={data.structuredData.types.join(', ') || 'N/A'}
                                />
                                <div className="mt-3">
                                    <details className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <summary className="cursor-pointer font-medium mb-2">
                                            View Raw Schema Data
                                        </summary>
                                        <pre className={`p-3 rounded overflow-x-auto text-xs ${
                                            isDark ? 'bg-gray-900' : 'bg-gray-100'
                                        }`}>
                                            {JSON.stringify(data.structuredData.schemas, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            </div>
                        ) : (
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                No structured data found
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Sitemap Section */}
            {data.sitemap && (
                <div>
                    <SectionHeader
                        title="XML Sitemap"
                        icon={FiMap}
                        status={data.sitemap.present ? 'passed' : 'warning'}
                        isExpanded={expandedSections.sitemap}
                        onClick={() => toggleSection('sitemap')}
                    />
                    {expandedSections.sitemap && (
                        <div className={`mt-2 p-4 rounded-lg border ${
                            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                            {data.sitemap.present ? (
                                <div className={`p-3 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                    <InfoRow
                                        label="Sitemap Found"
                                        value="✓ Yes"
                                        status="passed"
                                    />
                                    <InfoRow
                                        label="URL"
                                        value={data.sitemap.url}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {getStatusIcon('warning')}
                                    <span className="text-yellow-500">
                                        No sitemap found. Consider adding one for better SEO.
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TechnicalSEOResults;

