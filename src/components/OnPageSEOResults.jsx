import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
    FiCheckCircle,
    FiAlertTriangle,
    FiXCircle,
    FiChevronDown,
    FiChevronUp,
    FiFileText,
    FiLink,
    FiAlertCircle,
    FiCopy
} from 'react-icons/fi';

const OnPageSEOResults = ({ data }) => {
    const { isDark } = useTheme();
    const [expandedSections, setExpandedSections] = useState({
        titleDescription: true,
        urlStructure: false,
        brokenLinks: false,
        duplicateContent: false,
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
            case 'good':
                return 'text-green-500';
            case 'warning':
            case 'needs-improvement':
                return 'text-yellow-500';
            case 'critical':
            case 'poor':
                return 'text-red-500';
            default:
                return isDark ? 'text-gray-400' : 'text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed':
            case 'good':
                return <FiCheckCircle className="text-green-500" />;
            case 'warning':
            case 'needs-improvement':
                return <FiAlertTriangle className="text-yellow-500" />;
            case 'critical':
            case 'poor':
                return <FiXCircle className="text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'passed':
            case 'good':
                return isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200';
            case 'warning':
            case 'needs-improvement':
                return isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200';
            case 'critical':
            case 'poor':
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
                {value || 'N/A'}
            </span>
        </div>
    );

    const LengthIndicator = ({ current, min, max, optimal }) => {
        const getBarStatus = () => {
            if (current >= optimal.min && current <= optimal.max) return 'good';
            if (current >= min && current <= max) return 'needs-improvement';
            return 'poor';
        };

        const status = getBarStatus();
        const percentage = Math.min((current / max) * 100, 100);

        return (
            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                        Min: {min}
                    </span>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Optimal: {optimal.min}-{optimal.max}
                    </span>
                    <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                        Max: {max}
                    </span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                    <div
                        className={`h-full transition-all duration-300 ${
                            status === 'good' ? 'bg-green-500' :
                            status === 'needs-improvement' ? 'bg-yellow-500' :
                            'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Current: {current} characters
                    </span>
                    {getStatusIcon(status)}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4 mt-6">
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                On-Page SEO
            </h2>

            {/* Title & Meta Description Section */}
            <div>
                <SectionHeader
                    title="Title & Meta Description"
                    icon={FiFileText}
                    status={data.titleDescription.status}
                    isExpanded={expandedSections.titleDescription}
                    onClick={() => toggleSection('titleDescription')}
                />
                {expandedSections.titleDescription && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        {/* Title Analysis */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Title Tag
                                </h4>
                                {getStatusIcon(data.titleDescription.titleStatus)}
                            </div>

                            <div className={`p-3 rounded mb-3 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {data.titleDescription.title || 'No title found'}
                                </p>
                                <LengthIndicator
                                    current={data.titleDescription.titleLength}
                                    min={30}
                                    max={70}
                                    optimal={{ min: 50, max: 60 }}
                                />
                            </div>

                            <div className={`p-3 rounded ${
                                isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                            }`}>
                                <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                    💡 {data.titleDescription.titleRecommendation}
                                </p>
                            </div>
                        </div>

                        {/* Meta Description Analysis */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Meta Description
                                </h4>
                                {getStatusIcon(data.titleDescription.descriptionStatus)}
                            </div>

                            <div className={`p-3 rounded mb-3 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {data.titleDescription.description || 'No meta description found'}
                                </p>
                                <LengthIndicator
                                    current={data.titleDescription.descriptionLength}
                                    min={120}
                                    max={160}
                                    optimal={{ min: 150, max: 160 }}
                                />
                            </div>

                            <div className={`p-3 rounded ${
                                isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                            }`}>
                                <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                    💡 {data.titleDescription.descriptionRecommendation}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* URL Structure Section */}
            <div>
                <SectionHeader
                    title="URL Structure"
                    icon={FiLink}
                    status={data.urlStructure.status}
                    isExpanded={expandedSections.urlStructure}
                    onClick={() => toggleSection('urlStructure')}
                />
                {expandedSections.urlStructure && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.urlStructure.status)}
                            <span className={getStatusColor(data.urlStructure.status)}>
                                {data.urlStructure.recommendation}
                            </span>
                        </div>

                        {/* URL Display */}
                        <div className={`p-3 rounded mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Current URL
                                </span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(data.urlStructure.url)}
                                    className={`text-xs flex items-center gap-1 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                >
                                    <FiCopy size={12} />
                                    Copy
                                </button>
                            </div>
                            <p className={`text-sm break-all ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {data.urlStructure.url}
                            </p>
                        </div>

                        {/* URL Analysis */}
                        <div className={`p-3 rounded ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                            <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                URL Quality Checks
                            </h4>
                            <InfoRow
                                label="Protocol"
                                value={data.urlStructure.protocol}
                                status={data.urlStructure.isSecure ? 'good' : 'poor'}
                            />
                            <InfoRow
                                label="Length"
                                value={`${data.urlStructure.length} characters`}
                                status={data.urlStructure.lengthStatus}
                            />
                            <InfoRow
                                label="Readable"
                                value={data.urlStructure.isReadable ? '✓ Yes' : '✗ No'}
                                status={data.urlStructure.isReadable ? 'good' : 'warning'}
                            />
                            <InfoRow
                                label="Contains Keywords"
                                value={data.urlStructure.hasKeywords ? '✓ Likely' : '⚠ Not detected'}
                                status={data.urlStructure.hasKeywords ? 'good' : 'warning'}
                            />
                            <InfoRow
                                label="Special Characters"
                                value={data.urlStructure.hasSpecialChars ? '⚠ Found' : '✓ None'}
                                status={data.urlStructure.hasSpecialChars ? 'warning' : 'good'}
                            />
                            <InfoRow
                                label="Subdirectories"
                                value={data.urlStructure.depth.toString()}
                                status={data.urlStructure.depth <= 3 ? 'good' : 'warning'}
                            />
                        </div>

                        {/* Best Practices */}
                        <div className={`mt-4 p-3 rounded border ${
                            isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'
                        }`}>
                            <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-green-300' : 'text-green-900'}`}>
                                ✓ Best Practices
                            </p>
                            <ul className={`text-xs space-y-1 ${isDark ? 'text-green-200' : 'text-green-800'}`}>
                                <li>• Use HTTPS for security</li>
                                <li>• Keep URLs under 75 characters</li>
                                <li>• Use hyphens (-) instead of underscores (_)</li>
                                <li>• Include target keywords when relevant</li>
                                <li>• Avoid special characters and parameters</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Broken Links Section */}
            <div>
                <SectionHeader
                    title="Broken Links Detection"
                    icon={FiAlertCircle}
                    status={data.brokenLinks.status}
                    isExpanded={expandedSections.brokenLinks}
                    onClick={() => toggleSection('brokenLinks')}
                />
                {expandedSections.brokenLinks && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.brokenLinks.status)}
                            <span className={getStatusColor(data.brokenLinks.status)}>
                                {data.brokenLinks.recommendation}
                            </span>
                        </div>

                        {/* Summary Stats */}
                        <div className={`p-4 rounded mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {data.brokenLinks.totalLinks}
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Total Links
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${data.brokenLinks.brokenCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {data.brokenLinks.brokenCount}
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Broken
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${data.brokenLinks.suspiciousCount > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                                        {data.brokenLinks.suspiciousCount}
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Suspicious
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className={`text-2xl font-bold text-green-500`}>
                                        {data.brokenLinks.validCount}
                                    </div>
                                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Valid
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Broken Links List */}
                        {data.brokenLinks.brokenLinks.length > 0 && (
                            <div className="mb-4">
                                <h4 className={`font-semibold mb-2 text-red-500`}>
                                    🔴 Broken Links ({data.brokenLinks.brokenLinks.length})
                                </h4>
                                <div className={`space-y-2 max-h-64 overflow-y-auto p-3 rounded ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                                    {data.brokenLinks.brokenLinks.map((link, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-2 rounded ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-medium truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {link.text || 'No anchor text'}
                                                    </p>
                                                    <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                        {link.url}
                                                    </p>
                                                </div>
                                                <span className={`text-xs font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                                    {link.reason}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suspicious Links List */}
                        {data.brokenLinks.suspiciousLinks.length > 0 && (
                            <div>
                                <h4 className={`font-semibold mb-2 text-yellow-500`}>
                                    ⚠️ Suspicious Links ({data.brokenLinks.suspiciousLinks.length})
                                </h4>
                                <div className={`space-y-2 max-h-48 overflow-y-auto p-3 rounded ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                                    {data.brokenLinks.suspiciousLinks.map((link, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-2 rounded ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-medium truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {link.text || 'No anchor text'}
                                                    </p>
                                                    <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                        {link.url}
                                                    </p>
                                                </div>
                                                <span className={`text-xs font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                                    {link.reason}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Note about limitations */}
                        <div className={`mt-4 p-3 rounded border ${
                            isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'
                        }`}>
                            <p className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                ℹ️ Note: This is a preliminary check based on URL patterns. Some links may require actual HTTP requests to verify. Empty hrefs, javascript:, and malformed URLs are flagged.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Duplicate Content Section */}
            <div>
                <SectionHeader
                    title="Duplicate Content Warnings"
                    icon={FiCopy}
                    status={data.duplicateContent.status}
                    isExpanded={expandedSections.duplicateContent}
                    onClick={() => toggleSection('duplicateContent')}
                />
                {expandedSections.duplicateContent && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.duplicateContent.status)}
                            <span className={getStatusColor(data.duplicateContent.status)}>
                                {data.duplicateContent.recommendation}
                            </span>
                        </div>

                        {/* Checks Summary */}
                        <div className={`p-3 rounded mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Duplicate Content Checks
                            </h4>
                            <InfoRow
                                label="Canonical Tag"
                                value={data.duplicateContent.hasCanonical ? '✓ Present' : '✗ Missing'}
                                status={data.duplicateContent.hasCanonical ? 'good' : 'warning'}
                            />
                            <InfoRow
                                label="Meta Robots"
                                value={data.duplicateContent.hasRobots ? '✓ Present' : 'Not set'}
                                status={data.duplicateContent.hasRobots ? 'good' : 'warning'}
                            />
                            <InfoRow
                                label="Duplicate Titles"
                                value={data.duplicateContent.duplicateTitles ? '⚠ Detected' : '✓ None'}
                                status={data.duplicateContent.duplicateTitles ? 'warning' : 'good'}
                            />
                            <InfoRow
                                label="Duplicate Descriptions"
                                value={data.duplicateContent.duplicateDescriptions ? '⚠ Detected' : '✓ None'}
                                status={data.duplicateContent.duplicateDescriptions ? 'warning' : 'good'}
                            />
                            <InfoRow
                                label="Thin Content"
                                value={data.duplicateContent.thinContent ? '⚠ Yes' : '✓ No'}
                                status={data.duplicateContent.thinContent ? 'warning' : 'good'}
                            />
                        </div>

                        {/* Issues Found */}
                        {data.duplicateContent.issues.length > 0 && (
                            <div className="mb-4">
                                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Issues Found
                                </h4>
                                <div className={`space-y-2 p-3 rounded ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                                    {data.duplicateContent.issues.map((issue, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-2"
                                        >
                                            <FiAlertTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" size={14} />
                                            <p className={`text-sm ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`}>
                                                {issue}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Prevention Tips */}
                        <div className={`p-3 rounded border ${
                            isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'
                        }`}>
                            <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-green-300' : 'text-green-900'}`}>
                                💡 Duplicate Content Prevention
                            </p>
                            <ul className={`text-xs space-y-1 ${isDark ? 'text-green-200' : 'text-green-800'}`}>
                                <li>• Always use canonical tags to specify the preferred URL version</li>
                                <li>• Ensure each page has unique title and meta description</li>
                                <li>• Use 301 redirects for duplicate pages</li>
                                <li>• Add substantial, unique content (300+ words recommended)</li>
                                <li>• Use noindex for pages with unavoidable duplicate content</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnPageSEOResults;

