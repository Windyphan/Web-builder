import { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
    FiCheckCircle,
    FiAlertTriangle,
    FiXCircle,
    FiChevronDown,
    FiChevronUp,
    FiAward,
    FiDownload,
    FiTrendingUp,
    FiImage,
    FiFileText
} from 'react-icons/fi';

const VisualReportResults = ({ data }) => {
    const { isDark } = useTheme();
    const [expandedSections, setExpandedSections] = useState({
        overview: true,
        issues: true,
        recommendations: true,
        imageOptimization: true,
    });
    const reportRef = useRef(null);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Calculate overall SEO score
    const calculateOverallScore = () => {
        const scores = {
            technical: calculateTechnicalScore(),
            content: calculateContentScore(),
            performance: data.performanceScore?.overall || 0,
            onPage: calculateOnPageScore(),
        };

        const weights = {
            technical: 0.3,
            content: 0.25,
            performance: 0.25,
            onPage: 0.2,
        };

        const overall = Math.round(
            scores.technical * weights.technical +
            scores.content * weights.content +
            scores.performance * weights.performance +
            scores.onPage * weights.onPage
        );

        return { overall, ...scores };
    };

    const calculateTechnicalScore = () => {
        let score = 100;

        // Meta tags
        if (data.metaTags?.title?.status === 'critical') score -= 20;
        else if (data.metaTags?.title?.status === 'warning') score -= 10;

        if (data.metaTags?.description?.status === 'critical') score -= 20;
        else if (data.metaTags?.description?.status === 'warning') score -= 10;

        // Open Graph
        if (data.openGraph?.status === 'critical') score -= 15;
        else if (data.openGraph?.status === 'warning') score -= 8;

        // Canonical
        if (!data.canonical?.present) score -= 10;

        // Structured Data
        if (!data.structuredData?.present) score -= 10;

        // Sitemap
        if (!data.sitemap?.present) score -= 5;

        return Math.max(0, score);
    };

    const calculateContentScore = () => {
        let score = 100;

        // Headings
        if (data.headingAnalysis?.status === 'critical') score -= 20;
        else if (data.headingAnalysis?.status === 'warning') score -= 10;

        // Images
        if (data.imageAnalysis?.missingAlt > data.imageAnalysis?.total / 2) score -= 20;
        else if (data.imageAnalysis?.missingAlt > 0) score -= 10;

        // Content metrics
        if (data.contentMetrics?.wordCount < 100) score -= 25;
        else if (data.contentMetrics?.wordCount < 300) score -= 15;

        // Links
        if (data.linkAnalysis?.internal === 0) score -= 10;

        return Math.max(0, score);
    };

    const calculateOnPageScore = () => {
        let score = 100;

        // Title & Description
        if (data.titleDescription?.titleStatus === 'poor') score -= 20;
        else if (data.titleDescription?.titleStatus === 'warning') score -= 10;

        if (data.titleDescription?.descriptionStatus === 'poor') score -= 20;
        else if (data.titleDescription?.descriptionStatus === 'warning') score -= 10;

        // URL Structure
        if (data.urlStructure?.status === 'poor') score -= 15;
        else if (data.urlStructure?.status === 'warning') score -= 8;

        // Broken Links
        if (data.brokenLinks?.brokenCount > 0) score -= 20;
        else if (data.brokenLinks?.suspiciousCount > 0) score -= 10;

        // Duplicate Content
        if (data.duplicateContent?.status === 'poor') score -= 15;
        else if (data.duplicateContent?.status === 'warning') score -= 8;

        return Math.max(0, score);
    };

    // Collect all issues
    const collectIssues = () => {
        const critical = [];
        const warnings = [];
        const passed = [];

        // Technical SEO
        if (data.metaTags?.title?.status === 'critical') {
            critical.push({ category: 'Technical SEO', issue: 'Missing or very short title tag', recommendation: data.metaTags.title.recommendation });
        } else if (data.metaTags?.title?.status === 'warning') {
            warnings.push({ category: 'Technical SEO', issue: 'Title tag needs optimization', recommendation: data.metaTags.title.recommendation });
        } else {
            passed.push({ category: 'Technical SEO', item: 'Title tag is optimized' });
        }

        if (data.metaTags?.description?.status === 'critical') {
            critical.push({ category: 'Technical SEO', issue: 'Missing or very short meta description', recommendation: data.metaTags.description.recommendation });
        } else if (data.metaTags?.description?.status === 'warning') {
            warnings.push({ category: 'Technical SEO', issue: 'Meta description needs optimization', recommendation: data.metaTags.description.recommendation });
        } else {
            passed.push({ category: 'Technical SEO', item: 'Meta description is optimized' });
        }

        if (!data.canonical?.present) {
            warnings.push({ category: 'Technical SEO', issue: 'Missing canonical URL', recommendation: 'Add a canonical URL to prevent duplicate content issues' });
        } else {
            passed.push({ category: 'Technical SEO', item: 'Canonical URL is set' });
        }

        if (!data.structuredData?.present) {
            warnings.push({ category: 'Technical SEO', issue: 'No structured data found', recommendation: 'Add Schema.org markup for rich snippets' });
        } else {
            passed.push({ category: 'Technical SEO', item: `${data.structuredData.count} structured data schema(s) found` });
        }

        // Content Analysis
        if (data.headingAnalysis?.counts?.h1 === 0) {
            critical.push({ category: 'Content', issue: 'Missing H1 tag', recommendation: 'Add a main H1 heading to your page' });
        } else if (data.headingAnalysis?.counts?.h1 > 1) {
            warnings.push({ category: 'Content', issue: `Multiple H1 tags (${data.headingAnalysis.counts.h1})`, recommendation: 'Use only one H1 tag per page' });
        } else {
            passed.push({ category: 'Content', item: 'H1 tag structure is correct' });
        }

        if (data.imageAnalysis?.missingAlt > 0) {
            if (data.imageAnalysis.missingAlt > data.imageAnalysis.total / 2) {
                critical.push({ category: 'Content', issue: `${data.imageAnalysis.missingAlt} images missing alt text`, recommendation: 'Add descriptive alt text to all images for accessibility and SEO' });
            } else {
                warnings.push({ category: 'Content', issue: `${data.imageAnalysis.missingAlt} images missing alt text`, recommendation: 'Add alt text to remaining images' });
            }
        } else if (data.imageAnalysis?.total > 0) {
            passed.push({ category: 'Content', item: 'All images have alt text' });
        }

        if (data.contentMetrics?.wordCount < 300) {
            if (data.contentMetrics.wordCount < 100) {
                critical.push({ category: 'Content', issue: `Very thin content (${data.contentMetrics.wordCount} words)`, recommendation: 'Add substantial content - aim for at least 300 words' });
            } else {
                warnings.push({ category: 'Content', issue: `Thin content (${data.contentMetrics.wordCount} words)`, recommendation: 'Add more content - aim for at least 300 words' });
            }
        } else {
            passed.push({ category: 'Content', item: `Good content length (${data.contentMetrics.wordCount} words)` });
        }

        // Performance
        if (data.imagePerformance?.legacyCount > data.imagePerformance?.nextGenCount) {
            warnings.push({ category: 'Performance', issue: `${data.imagePerformance.legacyCount} images using legacy formats`, recommendation: 'Convert images to WebP or AVIF for better performance' });
        } else if (data.imagePerformance?.nextGenCount > 0) {
            passed.push({ category: 'Performance', item: `${data.imagePerformance.nextGenCount} images using next-gen formats` });
        }

        if (data.loadTime?.estimatedTime > 3000) {
            warnings.push({ category: 'Performance', issue: `Slow page load time (${(data.loadTime.estimatedTime / 1000).toFixed(2)}s)`, recommendation: 'Optimize resources to improve load time' });
        } else {
            passed.push({ category: 'Performance', item: `Good page load time (${(data.loadTime.estimatedTime / 1000).toFixed(2)}s)` });
        }

        // On-Page SEO
        if (data.brokenLinks?.brokenCount > 0) {
            critical.push({ category: 'On-Page SEO', issue: `${data.brokenLinks.brokenCount} broken links found`, recommendation: 'Fix all broken links immediately' });
        } else {
            passed.push({ category: 'On-Page SEO', item: 'No broken links detected' });
        }

        if (!data.urlStructure?.isSecure) {
            critical.push({ category: 'On-Page SEO', issue: 'Site not using HTTPS', recommendation: 'Switch to HTTPS for security and SEO' });
        } else {
            passed.push({ category: 'On-Page SEO', item: 'Site is using HTTPS' });
        }

        if (!data.mobileFriendly?.hasViewport) {
            critical.push({ category: 'Mobile', issue: 'Missing viewport meta tag', recommendation: 'Add viewport meta tag for mobile optimization' });
        } else {
            passed.push({ category: 'Mobile', item: 'Viewport meta tag is present' });
        }

        return { critical, warnings, passed };
    };

    const scores = calculateOverallScore();
    const issues = collectIssues();

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-500';
        if (score >= 70) return 'text-yellow-500';
        if (score >= 50) return 'text-orange-500';
        return 'text-red-500';
    };

    const getScoreLabel = (score) => {
        if (score >= 90) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Needs Improvement';
        return 'Poor';
    };

    const getScoreBgColor = (score) => {
        if (score >= 90) return isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200';
        if (score >= 70) return isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200';
        if (score >= 50) return isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200';
        return isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200';
    };

    const ScoreCircle = ({ score, label, size = 'large' }) => {
        const radius = size === 'large' ? 60 : 40;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (score / 100) * circumference;
        const dimension = size === 'large' ? 140 : 100;

        return (
            <div className="flex flex-col items-center">
                <div className={`relative ${size === 'large' ? 'w-36 h-36' : 'w-24 h-24'}`}>
                    <svg className={`transform -rotate-90 ${size === 'large' ? 'w-36 h-36' : 'w-24 h-24'}`}>
                        <circle
                            cx={dimension / 2}
                            cy={dimension / 2}
                            r={radius}
                            stroke="currentColor"
                            strokeWidth={size === 'large' ? '10' : '8'}
                            fill="transparent"
                            className={isDark ? 'text-gray-700' : 'text-gray-200'}
                        />
                        <circle
                            cx={dimension / 2}
                            cy={dimension / 2}
                            r={radius}
                            stroke="currentColor"
                            strokeWidth={size === 'large' ? '10' : '8'}
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className={`transition-all duration-1000 ${getScoreColor(score)}`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`${size === 'large' ? 'text-4xl' : 'text-2xl'} font-bold ${getScoreColor(score)}`}>
                            {score}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {getScoreLabel(score)}
                        </span>
                    </div>
                </div>
                <span className={`text-sm font-medium mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {label}
                </span>
            </div>
        );
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

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const handleDownloadReport = () => {
        // Create a simple text report
        const report = generateTextReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seo-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const generateTextReport = () => {
        return `
SEO ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}
URL: ${data.url}

════════════════════════════════════════════════════════════

OVERALL SEO SCORE: ${scores.overall}/100 (${getScoreLabel(scores.overall)})

Score Breakdown:
- Technical SEO:    ${scores.technical}/100
- Content Quality:  ${scores.content}/100
- Performance:      ${scores.performance}/100
- On-Page SEO:      ${scores.onPage}/100

════════════════════════════════════════════════════════════

CRITICAL ISSUES (${issues.critical.length})
${issues.critical.map((item, idx) => `
${idx + 1}. [${item.category}] ${item.issue}
   → ${item.recommendation}
`).join('')}

════════════════════════════════════════════════════════════

WARNINGS (${issues.warnings.length})
${issues.warnings.map((item, idx) => `
${idx + 1}. [${item.category}] ${item.issue}
   → ${item.recommendation}
`).join('')}

════════════════════════════════════════════════════════════

PASSED CHECKS (${issues.passed.length})
${issues.passed.map((item, idx) => `
${idx + 1}. [${item.category}] ${item.item}
`).join('')}

════════════════════════════════════════════════════════════

IMAGE OPTIMIZATION REPORT
Total Images: ${data.imageAnalysis?.total || 0}
Using Next-gen Formats: ${data.imagePerformance?.nextGenCount || 0}
Using Legacy Formats: ${data.imagePerformance?.legacyCount || 0}

Current Image Weight: ${formatBytes(data.imagePerformance?.totalWeight || 0)}
Potential Savings: ${formatBytes(data.imagePerformance?.potentialSavings || 0)}
Optimized Weight: ${formatBytes(data.imagePerformance?.optimizedWeight || 0)}

Recommendation:
${data.imagePerformance?.potentialSavings > 50000 ? 
`Converting ${data.imagePerformance.legacyCount} legacy images to WebP format could save approximately ${formatBytes(data.imagePerformance.potentialSavings)} and significantly improve page load time.` : 
'Your images are well optimized!'}

════════════════════════════════════════════════════════════

TOP RECOMMENDATIONS

1. IMMEDIATE ACTIONS (Critical)
${issues.critical.length > 0 ? issues.critical.map((item, idx) => `   ${idx + 1}. ${item.issue} - ${item.recommendation}`).join('\n') : '   None - Great job!'}

2. IMPROVEMENTS (Warnings)
${issues.warnings.length > 0 ? issues.warnings.slice(0, 5).map((item, idx) => `   ${idx + 1}. ${item.issue} - ${item.recommendation}`).join('\n') : '   None - Everything looks good!'}

3. IMAGE OPTIMIZATION
${data.imagePerformance?.legacyCount > 0 ? 
`   - Convert ${data.imagePerformance.legacyCount} images to WebP format
   - Expected savings: ${formatBytes(data.imagePerformance.potentialSavings)}
   - Improved load time: ~${Math.round(data.imagePerformance.potentialSavings / 10000)}% faster` :
'   - Images are already optimized!'}

════════════════════════════════════════════════════════════

End of Report
        `.trim();
    };

    return (
        <div className="space-y-4 mt-6" ref={reportRef}>
            <div className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    SEO Analysis Report
                </h2>
                <button
                    onClick={handleDownloadReport}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isDark 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    <FiDownload size={18} />
                    Download Report
                </button>
            </div>

            {/* Overall Score Dashboard */}
            <div>
                <SectionHeader
                    title="Overall SEO Score"
                    icon={FiAward}
                    isExpanded={expandedSections.overview}
                    onClick={() => toggleSection('overview')}
                />
                {expandedSections.overview && (
                    <div className={`mt-2 p-6 rounded-lg border-2 ${getScoreBgColor(scores.overall)}`}>
                        {/* Main Score */}
                        <div className="flex justify-center mb-8">
                            <ScoreCircle score={scores.overall} label="Overall Score" size="large" />
                        </div>

                        {/* Category Scores */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <ScoreCircle score={scores.technical} label="Technical SEO" size="small" />
                            <ScoreCircle score={scores.content} label="Content Quality" size="small" />
                            <ScoreCircle score={scores.performance} label="Performance" size="small" />
                            <ScoreCircle score={scores.onPage} label="On-Page SEO" size="small" />
                        </div>

                        {/* Summary Stats */}
                        <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}`}>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-red-500">
                                        {issues.critical.length}
                                    </div>
                                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Critical Issues
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-yellow-500">
                                        {issues.warnings.length}
                                    </div>
                                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Warnings
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-green-500">
                                        {issues.passed.length}
                                    </div>
                                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Passed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Color-Coded Issues */}
            <div>
                <SectionHeader
                    title="Issues & Status"
                    icon={FiFileText}
                    isExpanded={expandedSections.issues}
                    onClick={() => toggleSection('issues')}
                />
                {expandedSections.issues && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        {/* Critical Issues */}
                        {issues.critical.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <FiXCircle className="text-red-500 text-xl" />
                                    <h4 className={`font-bold text-lg text-red-500`}>
                                        Critical Issues ({issues.critical.length})
                                    </h4>
                                </div>
                                <div className={`space-y-3 p-4 rounded-lg ${
                                    isDark ? 'bg-red-500/10' : 'bg-red-50'
                                }`}>
                                    {issues.critical.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-3 rounded-lg border ${
                                                isDark ? 'bg-gray-800 border-red-500/30' : 'bg-white border-red-200'
                                            }`}
                                        >
                                            <div className="flex items-start gap-2 mb-2">
                                                <FiXCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <div className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                                                        [{item.category}] {item.issue}
                                                    </div>
                                                    <div className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        💡 {item.recommendation}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Warnings */}
                        {issues.warnings.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <FiAlertTriangle className="text-yellow-500 text-xl" />
                                    <h4 className={`font-bold text-lg text-yellow-500`}>
                                        Warnings ({issues.warnings.length})
                                    </h4>
                                </div>
                                <div className={`space-y-3 p-4 rounded-lg ${
                                    isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'
                                }`}>
                                    {issues.warnings.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-3 rounded-lg border ${
                                                isDark ? 'bg-gray-800 border-yellow-500/30' : 'bg-white border-yellow-200'
                                            }`}
                                        >
                                            <div className="flex items-start gap-2 mb-2">
                                                <FiAlertTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <div className={`font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                                                        [{item.category}] {item.issue}
                                                    </div>
                                                    <div className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        💡 {item.recommendation}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Passed Checks */}
                        {issues.passed.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FiCheckCircle className="text-green-500 text-xl" />
                                    <h4 className={`font-bold text-lg text-green-500`}>
                                        Passed Checks ({issues.passed.length})
                                    </h4>
                                </div>
                                <div className={`p-4 rounded-lg ${
                                    isDark ? 'bg-green-500/10' : 'bg-green-50'
                                }`}>
                                    <div className="grid md:grid-cols-2 gap-2">
                                        {issues.passed.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2"
                                            >
                                                <FiCheckCircle className="text-green-500 flex-shrink-0" size={16} />
                                                <span className={`text-sm ${isDark ? 'text-green-200' : 'text-green-800'}`}>
                                                    [{item.category}] {item.item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* No Issues */}
                        {issues.critical.length === 0 && issues.warnings.length === 0 && (
                            <div className={`text-center py-8 ${
                                isDark ? 'bg-green-500/10' : 'bg-green-50'
                            } rounded-lg`}>
                                <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
                                <h4 className="text-xl font-bold text-green-500 mb-2">
                                    Excellent! No Issues Found
                                </h4>
                                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Your website follows SEO best practices
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actionable Recommendations */}
            <div>
                <SectionHeader
                    title="Top Recommendations"
                    icon={FiTrendingUp}
                    isExpanded={expandedSections.recommendations}
                    onClick={() => toggleSection('recommendations')}
                />
                {expandedSections.recommendations && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <div className="space-y-4">
                            {/* Immediate Actions */}
                            <div>
                                <h4 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    🔴 Immediate Actions (Critical)
                                </h4>
                                {issues.critical.length > 0 ? (
                                    <ol className="space-y-2">
                                        {issues.critical.map((item, idx) => (
                                            <li
                                                key={idx}
                                                className={`p-3 rounded-lg ${
                                                    isDark ? 'bg-red-500/10' : 'bg-red-50'
                                                }`}
                                            >
                                                <div className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                                                    {idx + 1}. {item.issue}
                                                </div>
                                                <div className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    → {item.recommendation}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p className={`text-green-500 font-medium`}>
                                        ✓ No critical issues - Great work!
                                    </p>
                                )}
                            </div>

                            {/* Short-term Improvements */}
                            <div>
                                <h4 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    🟡 Short-term Improvements
                                </h4>
                                {issues.warnings.length > 0 ? (
                                    <ol className="space-y-2">
                                        {issues.warnings.slice(0, 5).map((item, idx) => (
                                            <li
                                                key={idx}
                                                className={`p-3 rounded-lg ${
                                                    isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'
                                                }`}
                                            >
                                                <div className={`font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                                                    {idx + 1}. {item.issue}
                                                </div>
                                                <div className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    → {item.recommendation}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p className={`text-green-500 font-medium`}>
                                        ✓ No warnings - Everything looks good!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Image Optimization Suggestions */}
            <div>
                <SectionHeader
                    title="Image Optimization Report"
                    icon={FiImage}
                    isExpanded={expandedSections.imageOptimization}
                    onClick={() => toggleSection('imageOptimization')}
                />
                {expandedSections.imageOptimization && (
                    <div className={`mt-2 p-4 rounded-lg border ${
                        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        {/* Summary Stats */}
                        <div className={`grid md:grid-cols-2 gap-4 mb-6 p-4 rounded-lg ${
                            isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                        }`}>
                            <div>
                                <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Total Images
                                </div>
                                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {data.imageAnalysis?.total || 0}
                                </div>
                                <div className="flex gap-4 mt-2 text-sm">
                                    <span className="text-green-500">
                                        ✓ {data.imagePerformance?.nextGenCount || 0} Next-gen
                                    </span>
                                    <span className="text-yellow-500">
                                        ⚠ {data.imagePerformance?.legacyCount || 0} Legacy
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Potential Savings
                                </div>
                                <div className="text-2xl font-bold text-green-500">
                                    {formatBytes(data.imagePerformance?.potentialSavings || 0)}
                                </div>
                                <div className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    From {formatBytes(data.imagePerformance?.totalWeight || 0)} to{' '}
                                    {formatBytes(data.imagePerformance?.optimizedWeight || 0)}
                                </div>
                            </div>
                        </div>

                        {/* Optimization Plan */}
                        {data.imagePerformance?.legacyCount > 0 ? (
                            <div className={`p-4 rounded-lg border ${
                                isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'
                            }`}>
                                <h4 className={`font-bold mb-3 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                                    💡 Optimization Plan
                                </h4>
                                <div className={`space-y-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                    <p>
                                        Converting your {data.imagePerformance.legacyCount} legacy format images to WebP could:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-2">
                                        <li>Save approximately <strong>{formatBytes(data.imagePerformance.potentialSavings)}</strong></li>
                                        <li>Reduce total image weight by <strong>{data.imagePerformance.avgReduction}%</strong></li>
                                        <li>Improve page load time by <strong>~{Math.round(data.imagePerformance.potentialSavings / 10000)}%</strong></li>
                                        <li>Enhance user experience on mobile devices</li>
                                        <li>Boost SEO rankings through better performance</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className={`text-center py-6 ${
                                isDark ? 'bg-green-500/10' : 'bg-green-50'
                            } rounded-lg`}>
                                <FiCheckCircle className="text-green-500 text-4xl mx-auto mb-2" />
                                <p className="font-semibold text-green-500">
                                    Your images are already well optimized!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisualReportResults;

