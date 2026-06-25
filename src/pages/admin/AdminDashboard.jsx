import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiDollarSign, FiFileText, FiTrendingUp, FiTrendingDown,
    FiPlus, FiClock, FiAlertCircle, FiCheckCircle, FiArrowRight,
    FiActivity, FiUsers, FiRefreshCw, FiAlertTriangle
} from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminAPI from '../../utils/adminAPI';

/* ─── Helpers ─────────────────────────────────────────────────────────── */

const fmt = (v) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v || 0);

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const STATUS_STYLES = {
    paid:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    sent:    'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400',
    draft:   'bg-gray-100   text-gray-600   dark:bg-gray-700      dark:text-gray-400',
    overdue: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
};

const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[status] || STATUS_STYLES.draft}`}>
        {status}
    </span>
);

/* ─── Custom Bar Chart (no extra dependency) ──────────────────────────── */

const BarChart = ({ data }) => {
    const ref  = useRef(null);
    const inView = useInView(ref, { once: true });
    const max  = Math.max(...data.flatMap(d => [d.revenue, d.expenses]), 1);
    const ySteps = 5;

    return (
        <div ref={ref} className="relative">
            {/* Y-axis grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                {Array.from({ length: ySteps + 1 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 w-full">
                        <span className="text-xs text-gray-400 dark:text-gray-500 w-10 text-right flex-shrink-0">
                            {fmt((max / ySteps) * (ySteps - i)).replace('£', '£').replace(',000', 'k')}
                        </span>
                        <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
                    </div>
                ))}
            </div>

            {/* Bars */}
            <div className="flex items-end gap-2 pl-14 pb-6" style={{ height: 180 }}>
                {data.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex gap-0.5 items-end" style={{ height: 140 }}>
                            {/* Revenue bar */}
                            <motion.div
                                className="flex-1 bg-primary-500 rounded-t-md cursor-pointer relative group"
                                initial={{ height: 0 }}
                                animate={inView ? { height: `${(d.revenue / max) * 100}%` } : { height: 0 }}
                                transition={{ delay: i * 0.07, duration: 0.55, ease: 'easeOut' }}
                                style={{ minHeight: d.revenue > 0 ? 4 : 0 }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {fmt(d.revenue)}
                                </div>
                            </motion.div>
                            {/* Expenses bar */}
                            <motion.div
                                className="flex-1 bg-accent-400 rounded-t-md cursor-pointer relative group"
                                initial={{ height: 0 }}
                                animate={inView ? { height: `${(d.expenses / max) * 100}%` } : { height: 0 }}
                                transition={{ delay: i * 0.07 + 0.1, duration: 0.55, ease: 'easeOut' }}
                                style={{ minHeight: d.expenses > 0 ? 4 : 0 }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {fmt(d.expenses)}
                                </div>
                            </motion.div>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">{d.month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─── KPI Card ────────────────────────────────────────────────────────── */

const KPICard = ({ label, value, subLabel, icon: Icon, change, bgLight, iconColor, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-premium dark:hover:shadow-premium-dark transition-all duration-300 group"
    >
        <div className="flex items-start justify-between mb-4">
            <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                {subLabel && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subLabel}</p>}
            </div>
            <div className={`w-10 h-10 rounded-xl ${bgLight} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon size={18} className={iconColor} />
            </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white font-display tracking-tight">{value}</p>
        {change !== null && change !== undefined && (
            <p className={`text-xs mt-1.5 font-semibold flex items-center gap-1 ${Number(change) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                {Number(change) >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                {Math.abs(change)}% vs last month
            </p>
        )}
    </motion.div>
);

/* ─── Mock data (used when API not ready) ─────────────────────────────── */

const MOCK = {
    kpis: {
        totalRevenue: 48250, unpaidInvoices: 8600, unpaidCount: 4,
        totalExpenses: 12340, netProfit: 35910,
        revenueChange: 18.4, expensesChange: -3.2,
    },
    recentInvoices: [
        { id: 1, invoice_number: 'INV-2026-001', client_name: 'Acme Corp',      total: 3200, status: 'paid',    due_date: '2026-06-10' },
        { id: 2, invoice_number: 'INV-2026-002', client_name: 'BlueSky Ltd',    total: 1850, status: 'sent',    due_date: '2026-07-01' },
        { id: 3, invoice_number: 'INV-2026-003', client_name: 'Momentum Co',    total: 4800, status: 'overdue', due_date: '2026-06-15' },
        { id: 4, invoice_number: 'INV-2026-004', client_name: 'Vertex Media',   total: 950,  status: 'draft',   due_date: '2026-07-10' },
        { id: 5, invoice_number: 'INV-2026-005', client_name: 'Orbit Solutions',total: 2200, status: 'paid',    due_date: '2026-06-20' },
    ],
    chartData: [
        { month: 'Jan', revenue: 5200,  expenses: 1800 },
        { month: 'Feb', revenue: 6800,  expenses: 2100 },
        { month: 'Mar', revenue: 7400,  expenses: 2600 },
        { month: 'Apr', revenue: 6100,  expenses: 1900 },
        { month: 'May', revenue: 9800,  expenses: 2900 },
        { month: 'Jun', revenue: 12950, expenses: 1940 },
    ],
    upcomingDue: [
        { id: 2, client_name: 'BlueSky Ltd',  total: 1850, due_date: '2026-07-01', days_left: 7 },
        { id: 6, client_name: 'Nova Digital',  total: 3400, due_date: '2026-07-04', days_left: 10 },
    ],
    recentActivity: [
        { type: 'paid',    message: 'INV-2026-005 paid by Orbit Solutions', time: '1 hour ago' },
        { type: 'sent',    message: 'INV-2026-002 sent to BlueSky Ltd',     time: '3 hours ago' },
        { type: 'expense', message: 'Expense £420 added — Software Tools',  time: 'Yesterday' },
        { type: 'client',  message: 'New client: Nova Digital added',       time: '2 days ago' },
    ],
};

/* ─── Main Component ──────────────────────────────────────────────────── */

const AdminDashboard = () => {
    const navigate   = useNavigate();
    const [loading,  setLoading]  = useState(true);
    const [data,     setData]     = useState(null);
    const [authError, setAuthError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const load = async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) { setAuthError(true); setLoading(false); return; }
            const d = await adminAPI.getDashboard();
            setData(d);
        } catch (err) {
            console.error('Dashboard error:', err);
            // Show mock data so the UI is always usable during dev
            setData(MOCK);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { load(); }, []);

    /* Auth wall */
    if (authError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-premium border border-gray-200 dark:border-gray-700 max-w-sm w-full mx-4">
                    <FiAlertTriangle size={40} className="mx-auto mb-4 text-amber-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Not Authenticated</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Please log in to access the admin panel.</p>
                    <button
                        onClick={() => navigate('/admin/blog')}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl font-medium transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    /* Loading skeleton */
    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard…</p>
                    </div>
                </div>
            </div>
        );
    }

    const d = data || MOCK;

    const kpiCards = [
        {
            label: 'Total Revenue',
            value: fmt(d.kpis.totalRevenue),
            icon: FiTrendingUp,
            change: d.kpis.revenueChange,
            bgLight: 'bg-primary-50 dark:bg-primary-900/20',
            iconColor: 'text-primary-600 dark:text-primary-400',
        },
        {
            label: 'Unpaid Invoices',
            value: fmt(d.kpis.unpaidInvoices),
            subLabel: `${d.kpis.unpaidCount || 0} invoices outstanding`,
            icon: FiFileText,
            change: null,
            bgLight: 'bg-amber-50 dark:bg-amber-900/20',
            iconColor: 'text-amber-600 dark:text-amber-400',
        },
        {
            label: 'Total Expenses',
            value: fmt(d.kpis.totalExpenses),
            icon: FiTrendingDown,
            change: d.kpis.expensesChange,
            bgLight: 'bg-red-50 dark:bg-red-900/20',
            iconColor: 'text-red-500 dark:text-red-400',
        },
        {
            label: 'Net Profit',
            value: fmt(d.kpis.netProfit),
            icon: FiDollarSign,
            change: null,
            bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
    ];

    const overdue = (d.recentInvoices || []).filter(i => i.status === 'overdue').length;
    const paid    = (d.recentInvoices || []).filter(i => i.status === 'paid').length;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
            <AdminSidebar />

            {/* ── Main content ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

                {/* Top bar */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
                    <div className="pl-10 md:pl-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">Dashboard</h1>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => load(true)}
                            disabled={refreshing}
                            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Refresh"
                        >
                            <FiRefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                        </button>
                        <Link
                            to="/admin/invoices"
                            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-glow-blue"
                        >
                            <FiPlus size={15} />
                            <span className="hidden sm:inline">New Invoice</span>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 space-y-5 flex-1">

                    {/* ── KPI Cards ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {kpiCards.map((card, i) => (
                            <KPICard key={card.label} {...card} index={i} />
                        ))}
                    </div>

                    {/* ── Chart + Due Soon ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Bar Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.4 }}
                            className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">Revenue vs Expenses</h2>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">Last 6 months · GBP</p>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1.5">
                                        <span className="inline-block w-3 h-3 rounded-sm bg-primary-500" />
                                        Revenue
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="inline-block w-3 h-3 rounded-sm bg-accent-400" />
                                        Expenses
                                    </span>
                                </div>
                            </div>
                            <BarChart data={d.chartData || []} />
                        </motion.div>

                        {/* Due Soon */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.42, duration: 0.4 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col"
                        >
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiAlertCircle size={15} className="text-amber-500" /> Due Soon
                            </h2>

                            {(d.upcomingDue || []).length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                                    <FiCheckCircle size={28} className="text-emerald-500 mb-2" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">All clear!</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">No upcoming due dates</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5 flex-1">
                                    {(d.upcomingDue || []).map(item => (
                                        <div
                                            key={item.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl border ${
                                                item.days_left <= 3
                                                    ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                                                    : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30'
                                            }`}
                                        >
                                            <FiAlertCircle
                                                size={15}
                                                className={item.days_left <= 3 ? 'text-red-500 flex-shrink-0' : 'text-amber-500 flex-shrink-0'}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.client_name}</p>
                                                <p className={`text-xs ${item.days_left <= 3 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                                    {item.days_left} day{item.days_left !== 1 ? 's' : ''} left
                                                </p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{fmt(item.total)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Mini stats */}
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2">
                                <div className="text-center p-2.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{paid}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Paid</p>
                                </div>
                                <div className="text-center p-2.5 bg-red-50 dark:bg-red-900/10 rounded-xl">
                                    <p className="text-xl font-bold text-red-500">{overdue}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── Recent Invoices + Actions + Activity ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Recent Invoices table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                            className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recent Invoices</h2>
                                <Link
                                    to="/admin/invoices"
                                    className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                                >
                                    View all <FiArrowRight size={12} />
                                </Link>
                            </div>

                            {(d.recentInvoices || []).length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                                    <FiFileText size={36} className="text-gray-300 dark:text-gray-600 mb-3" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No invoices yet</p>
                                    <Link
                                        to="/admin/invoices"
                                        className="mt-3 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                                    >
                                        Create your first invoice →
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                                                {['Invoice', 'Client', 'Amount', 'Due', 'Status'].map(h => (
                                                    <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                            {(d.recentInvoices || []).map(inv => (
                                                <tr
                                                    key={inv.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                                    onClick={() => navigate(`/admin/invoices?id=${inv.id}`)}
                                                >
                                                    <td className="px-5 py-3 font-mono text-xs text-primary-600 dark:text-primary-400 font-medium">
                                                        {inv.invoice_number}
                                                    </td>
                                                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{inv.client_name}</td>
                                                    <td className="px-5 py-3 font-bold text-gray-900 dark:text-white">{fmt(inv.total)}</td>
                                                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">{fmtDate(inv.due_date)}</td>
                                                    <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>

                        {/* Right column: Quick Actions + Activity */}
                        <div className="flex flex-col gap-4">

                            {/* Quick Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55, duration: 0.4 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm"
                            >
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: 'New Invoice',  icon: FiFileText,    to: '/admin/invoices', cls: 'bg-primary-600 hover:bg-primary-700' },
                                        { label: 'Log Time',     icon: FiClock,       to: '/admin/time',     cls: 'bg-accent-500  hover:bg-accent-600' },
                                        { label: 'Add Expense',  icon: FiDollarSign,  to: '/admin/expenses', cls: 'bg-emerald-600 hover:bg-emerald-700' },
                                        { label: 'Add Client',   icon: FiUsers,       to: '/admin/clients',  cls: 'bg-purple-600  hover:bg-purple-700' },
                                    ].map(action => (
                                        <Link
                                            key={action.label}
                                            to={action.to}
                                            className={`flex flex-col items-center gap-1.5 px-3 py-3 ${action.cls} text-white rounded-xl text-xs font-semibold transition-colors text-center`}
                                        >
                                            <action.icon size={17} />
                                            {action.label}
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Activity Feed */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.4 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex-1"
                            >
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FiActivity size={14} className="text-primary-500" /> Recent Activity
                                </h2>
                                <div className="space-y-3">
                                    {(d.recentActivity || []).map((item, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                                                item.type === 'paid'    ? 'bg-emerald-500' :
                                                item.type === 'sent'    ? 'bg-primary-500' :
                                                item.type === 'expense' ? 'bg-accent-500' :
                                                'bg-purple-500'
                                            }`} />
                                            <div>
                                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">{item.message}</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(d.recentActivity || []).length === 0 && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">No recent activity</p>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;



