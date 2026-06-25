import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FiGrid, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle,
    FiFileText, FiDollarSign, FiClock, FiBarChart2, FiCheckCircle,
} from 'react-icons/fi';
import adminAPI from '../../utils/adminAPI';

const FEATURES = [
    { icon: FiFileText,   title: 'Invoicing & Billing',    desc: 'Create branded invoices and accept online payments.' },
    { icon: FiDollarSign, title: 'Expense Tracking',       desc: 'Categorise expenses and connect your bank automatically.' },
    { icon: FiClock,      title: 'Time Tracking',          desc: 'Log billable hours and pull them straight into invoices.' },
    { icon: FiBarChart2,  title: 'Reports & Tax',          desc: 'P&L, VAT returns and MTD-compliant financial reports.' },
];

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail]     = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw]   = useState(false);
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        adminAPI.verifyToken()
            .then(() => navigate('/admin', { replace: true }))
            .catch(() => localStorage.removeItem('authToken'));
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await adminAPI.login(email, password);
            navigate('/admin', { replace: true });
        } catch {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">

            {/* ── Left: Branded Panel (hidden on mobile) ── */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-gradient-to-br from-gray-900 via-navy-800 to-gray-900 flex-col justify-between p-12">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 -right-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl" />
                    {/* Grid lines */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                </div>

                {/* Logo */}
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow-blue">
                        <FiGrid className="text-white" size={18} />
                    </div>
                    <span className="text-white font-display font-bold text-xl tracking-tight">FlowERP</span>
                </motion.div>

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="relative z-10"
                >
                    <h2 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-4">
                        Run your business<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                            smarter, faster.
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                        The all-in-one ERP platform built for UK freelancers and small businesses. MTD-ready, HMRC-compliant.
                    </p>

                    {/* Feature list */}
                    <div className="mt-10 space-y-5">
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.25 + i * 0.08 }}
                                className="flex items-start gap-4"
                            >
                                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <f.icon size={16} className="text-primary-400" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{f.title}</p>
                                    <p className="text-gray-400 text-sm mt-0.5">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative z-10 flex items-center gap-2 text-gray-500 text-sm"
                >
                    <FiCheckCircle size={14} className="text-emerald-500" />
                    HMRC Making Tax Digital compliant · UK &amp; GBP native
                </motion.div>
            </div>

            {/* ── Right: Login Form ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">

                    {/* Mobile logo (visible only on mobile) */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex lg:hidden flex-col items-center mb-8"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-glow-blue mb-3">
                            <FiGrid className="text-white" size={22} />
                        </div>
                        <h1 className="text-xl font-display font-bold text-gray-900 dark:text-white">FlowERP</h1>
                    </motion.div>

                    {/* Heading */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
                        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Welcome back</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your admin panel</p>
                    </motion.div>

                    {/* Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-premium dark:shadow-premium-dark p-8"
                    >
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"
                            >
                                <FiAlertCircle size={15} className="flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                                    Email address
                                </label>
                                <div className="relative">
                                    <FiMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <FiLock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors shadow-glow-blue mt-1"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Signing in…
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </form>
                    </motion.div>

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6"
                    >
                        © {new Date().getFullYear()} FlowERP · Secure admin access
                    </motion.p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

