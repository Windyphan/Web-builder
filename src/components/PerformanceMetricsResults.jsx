import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
    FiCheckCircle,
    FiAlertTriangle,
    FiXCircle,
    FiChevronDown,
    FiChevronUp,
    FiZap,
    FiSmartphone,
    FiFileText,
    FiImage
} from 'react-icons/fi';

const PerformanceMetricsResults = ({ data }) => {
    const { isDark } = useTheme();
    const [expandedSections, setExpandedSections] = useState({
        loadTime: true,
        resources: false,
        images: false,
        mobile: false,
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

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatTime = (ms) => {
        if (ms < 1000) return `${Math.round(ms)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    const getPerformanceScore = (score) => {
        if (score >= 90) return 'good';
        if (score >= 50) return 'needs-improvement';
        return 'poor';
    };

    const ProgressBar = ({ value, max, status }) => {
        const percentage = Math.min((value / max) * 100, 100);
        return (
            <div className={`w-full h-2 rounded-full overflow-hidden ${
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
        );
    };

    const ScoreCircle = ({ score, label }) => {
        const status = getPerformanceScore(score);
        const circumference = 2 * Math.PI * 40;
        const strokeDashoffset = circumference - (score / 100) * circumference;

        return (
            <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                    <svg className="transform -rotate-90 w-24 h-24">
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className={isDark ? 'text-gray-700' : 'text-gray-200'}
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className={`transition-all duration-1000 ${
                                status === 'good' ? 'text-green-500' :
                                status === 'needs-improvement' ? 'text-yellow-500' :
                                'text-red-500'
                            }`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getStatusColor(status)}`}>
                            {score}
                        </span>
                    </div>
                </div>
                <span className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {label}
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-4 mt-6">
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Performance Metrics
            </h2>

            {/* Overall Performance Score */}
            {data.performanceScore && (
                <div className={`p-6 rounded-lg border-2 ${
                    getStatusBgColor(getPerformanceScore(data.performanceScore.overall))
                }`}>
                    <h3 className={`text-xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Performance Score
                    </h3>
                    <div className="flex justify-center gap-8 flex-wrap">
                        <ScoreCircle score={data.performanceScore.overall} label="Overall" />
                        <ScoreCircle score={data.performanceScore.speed} label="Speed" />
                        <ScoreCircle score={data.performanceScore.optimization} label="Optimization" />
                    </div>
                </div>
            )}

            {/* Page Load Time Section */}
            <div>
                <SectionHeader
                    title="Page Load Time"
                    icon={FiZap}
                    status={data.loadTime.status}
                    isExpanded={expandedSections.loadTime}
                    onClick={() => toggleSection('loadTime')}
                />
                {expandedSections.loadTime && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.loadTime.status)}
                            <span className={getStatusColor(data.loadTime.status)}>
                                {data.loadTime.recommendation}
                            </span>
                        </div>

                        <div className={`p-3 rounded mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Estimated Load Time
                                        </span>
                                        <span className={`font-bold text-lg ${getStatusColor(data.loadTime.status)}`}>
                                            {formatTime(data.loadTime.estimatedTime)}
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={data.loadTime.estimatedTime}
                                        max={5000}
                                        status={data.loadTime.status}
                                    />
                                    <div className="flex justify-between text-xs mt-1">
                                        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>0s</span>
                                        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Fast (&lt;2s)</span>
                                        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Slow (&gt;5s)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className={`p-3 rounded ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Performance Breakdown
                            </h4>
                            <InfoRow
                                label="DOM Content Load"
                                value={formatTime(data.loadTime.domContentLoaded)}
                                status={data.loadTime.domContentLoaded < 1500 ? 'good' : 'needs-improvement'}
                            />
                            <InfoRow
                                label="First Paint"
                                value={formatTime(data.loadTime.firstPaint)}
                                status={data.loadTime.firstPaint < 1000 ? 'good' : 'needs-improvement'}
                            />
                            <InfoRow
                                label="Time to Interactive"
                                value={formatTime(data.loadTime.timeToInteractive)}
                                status={data.loadTime.timeToInteractive < 3000 ? 'good' : 'needs-improvement'}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Resource Sizes Section */}
            <div>
                <SectionHeader
                    title="Resource Sizes (HTML, CSS, JS)"
                    icon={FiFileText}
                    status={data.resources.status}
                    isExpanded={expandedSections.resources}
                    onClick={() => toggleSection('resources')}
                />
                {expandedSections.resources && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.resources.status)}
                            <span className={getStatusColor(data.resources.status)}>
                                {data.resources.recommendation}
                            </span>
                        </div>

                        {/* Total Size */}
                        <div className={`p-4 rounded mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className="text-center mb-4">
                                <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Total Page Size
                                </div>
                                <div className={`text-3xl font-bold ${getStatusColor(data.resources.status)}`}>
                                    {formatBytes(data.resources.totalSize)}
                                </div>
                            </div>

                            <ProgressBar
                                value={data.resources.totalSize}
                                max={3000000}
                                status={data.resources.status}
                            />
                            <div className="flex justify-between text-xs mt-1">
                                <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>0 MB</span>
                                <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Good (&lt;1MB)</span>
                                <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Large (&gt;3MB)</span>
                            </div>
                        </div>

                        {/* Resource Breakdown */}
                        <div className={`p-3 rounded ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                            <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Resource Breakdown
                            </h4>

                            {/* HTML */}
                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        HTML
                                    </span>
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {formatBytes(data.resources.html)}
                                    </span>
                                </div>
                                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{ width: `${Math.min((data.resources.html / data.resources.totalSize) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* CSS */}
                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        CSS
                                    </span>
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {formatBytes(data.resources.css)}
                                    </span>
                                </div>
                                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                                    <div
                                        className="h-full bg-purple-500"
                                        style={{ width: `${Math.min((data.resources.css / data.resources.totalSize) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* JavaScript */}
                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        JavaScript
                                    </span>
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {formatBytes(data.resources.javascript)}
                                    </span>
                                </div>
                                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                                    <div
                                        className="h-full bg-yellow-500"
                                        style={{ width: `${Math.min((data.resources.javascript / data.resources.totalSize) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Fonts */}
                            {data.resources.fonts > 0 && (
                                <div className="mb-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Fonts
                                        </span>
                                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {formatBytes(data.resources.fonts)}
                                        </span>
                                    </div>
                                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                                        <div
                                            className="h-full bg-pink-500"
                                            style={{ width: `${Math.min((data.resources.fonts / data.resources.totalSize) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Other */}
                            {data.resources.other > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Other
                                        </span>
                                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {formatBytes(data.resources.other)}
                                        </span>
                                    </div>
                                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                                        <div
                                            className="h-full bg-gray-500"
                                            style={{ width: `${Math.min((data.resources.other / data.resources.totalSize) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Performance Section */}
            <div>
                <SectionHeader
                    title="Image Performance & Optimization"
                    icon={FiImage}
                    status={data.imagePerformance.status}
                    isExpanded={expandedSections.images}
                    onClick={() => toggleSection('images')}
                />
                {expandedSections.images && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.imagePerformance.status)}
                            <span className={getStatusColor(data.imagePerformance.status)}>
                                {data.imagePerformance.recommendation}
                            </span>
                        </div>

                        {/* Total Image Weight */}
                        <div className={`p-4 rounded mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Current Total
                                    </div>
                                    <div className={`text-2xl font-bold ${getStatusColor(data.imagePerformance.status)}`}>
                                        {formatBytes(data.imagePerformance.totalWeight)}
                                    </div>
                                </div>
                                <div>
                                    <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Potential Savings
                                    </div>
                                    <div className="text-2xl font-bold text-green-500">
                                        {formatBytes(data.imagePerformance.potentialSavings)}
                                    </div>
                                </div>
                            </div>

                            <ProgressBar
                                value={data.imagePerformance.totalWeight}
                                max={2000000}
                                status={data.imagePerformance.status}
                            />
                        </div>

                        {/* Optimization Details */}
                        <div className={`p-3 rounded ${isDark ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Optimization Opportunities
                            </h4>
                            <InfoRow
                                label="Images Using Next-gen Formats"
                                value={`${data.imagePerformance.nextGenCount} / ${data.imagePerformance.totalImages}`}
                                status={data.imagePerformance.nextGenCount > 0 ? 'good' : 'poor'}
                            />
                            <InfoRow
                                label="Images Needing Conversion"
                                value={data.imagePerformance.legacyCount.toString()}
                                status={data.imagePerformance.legacyCount === 0 ? 'good' : 'warning'}
                            />
                            <InfoRow
                                label="Avg. Size Reduction"
                                value={`${data.imagePerformance.avgReduction}%`}
                                status="good"
                            />
                            <InfoRow
                                label="Optimized Weight (Est.)"
                                value={formatBytes(data.imagePerformance.optimizedWeight)}
                                status="good"
                            />
                        </div>

                        {/* Recommendations */}
                        {data.imagePerformance.potentialSavings > 50000 && (
                            <div className={`mt-3 p-3 rounded border ${
                                isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'
                            }`}>
                                <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-yellow-300' : 'text-yellow-900'}`}>
                                    💡 Optimization Tip
                                </p>
                                <p className={`text-sm ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`}>
                                    Converting your images to WebP format could save approximately{' '}
                                    <strong>{formatBytes(data.imagePerformance.potentialSavings)}</strong> and improve page load time significantly.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile-Friendliness Section */}
            <div>
                <SectionHeader
                    title="Mobile-Friendliness"
                    icon={FiSmartphone}
                    status={data.mobileFriendly.status}
                    isExpanded={expandedSections.mobile}
                    onClick={() => toggleSection('mobile')}
                />
                {expandedSections.mobile && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="flex items-center gap-2 mb-3">
                            {getStatusIcon(data.mobileFriendly.status)}
                            <span className={getStatusColor(data.mobileFriendly.status)}>
                                {data.mobileFriendly.recommendation}
                            </span>
                        </div>

                        <div className={`p-3 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <InfoRow
                                label="Viewport Meta Tag"
                                value={data.mobileFriendly.hasViewport ? '✓ Present' : '✗ Missing'}
                                status={data.mobileFriendly.hasViewport ? 'good' : 'poor'}
                            />
                            <InfoRow
                                label="Responsive Design"
                                value={data.mobileFriendly.isResponsive ? '✓ Detected' : '⚠ Not detected'}
                                status={data.mobileFriendly.isResponsive ? 'good' : 'warning'}
                            />
                            <InfoRow
                                label="Touch Target Size"
                                value={data.mobileFriendly.touchTargets}
                            />
                            <InfoRow
                                label="Text Readability"
                                value={data.mobileFriendly.textReadable ? '✓ Good' : '⚠ Needs improvement'}
                                status={data.mobileFriendly.textReadable ? 'good' : 'warning'}
                            />
                            <InfoRow
                                label="Horizontal Scrolling"
                                value={data.mobileFriendly.noHorizontalScroll ? '✓ None' : '⚠ Present'}
                                status={data.mobileFriendly.noHorizontalScroll ? 'good' : 'warning'}
                            />
                        </div>

                        {/* Mobile Score */}
                        <div className="mt-4 text-center">
                            <div className={`inline-block p-4 rounded-lg ${
                                isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                            }`}>
                                <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Mobile Usability Score
                                </div>
                                <div className={`text-4xl font-bold ${getStatusColor(data.mobileFriendly.status)}`}>
                                    {data.mobileFriendly.score}/100
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerformanceMetricsResults;

