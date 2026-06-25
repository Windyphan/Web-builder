import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiDownload, FiRefreshCw, FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminAPI from '../../utils/adminAPI';

const fmt = (v) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v || 0);
const YEARS = [2026, 2025, 2024];

/* ── Simple Bar (reused from dashboard) ── */
const Bar = ({ value, max, color }) => (
    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }} transition={{ duration: 0.5 }}/>
    </div>
);

const Reports = () => {
    const [year,      setYear]      = useState(2026);
    const [tab,       setTab]       = useState('pnl');
    const [pnl,       setPnl]       = useState(null);
    const [vat,       setVat]       = useState(null);
    const [balance,   setBalance]   = useState(null);
    const [loading,   setLoading]   = useState(true);

    useEffect(() => { load(); }, [year, tab]);

    const load = async () => {
        setLoading(true);
        try {
            if (tab === 'pnl')     { const d = await adminAPI.getPnL({ year });          setPnl(d); }
            if (tab === 'vat')     { const d = await adminAPI.getVAT({ year });           setVat(d); }
            if (tab === 'balance') { const d = await adminAPI.getBalanceSheet({ year });  setBalance(d); }
        } catch { /* show empty */ }
        finally { setLoading(false); }
    };

    const exportCSV = () => {
        if (tab === 'pnl' && pnl) {
            const rows = [['Month','Revenue','Expenses','Profit'], ...pnl.monthly.map(m => [m.month, m.revenue, m.expenses, m.profit])];
            const csv  = rows.map(r => r.join(',')).join('\n');
            const link = document.createElement('a'); link.href = 'data:text/csv,' + encodeURIComponent(csv); link.download = `pnl-${year}.csv`; link.click();
        }
        if (tab === 'vat' && vat) {
            const rows = [['Quarter','Output VAT','Input VAT','VAT Due'], ...vat.quarters.map(q => [q.quarter, q.outputVAT, q.inputVAT, q.vatDue])];
            const csv  = rows.map(r => r.join(',')).join('\n');
            const link = document.createElement('a'); link.href = 'data:text/csv,' + encodeURIComponent(csv); link.download = `vat-${year}.csv`; link.click();
        }
    };

    const TABS = [{ key:'pnl', label:'Profit & Loss' }, { key:'vat', label:'VAT Summary (MTD)' }, { key:'balance', label:'Balance Sheet' }];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="pl-10 md:pl-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">Reports</h1>
                        <p className="text-xs text-gray-400 mt-0.5">HMRC-compliant · Making Tax Digital ready</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select value={year} onChange={e => setYear(Number(e.target.value))} className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500">
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <button onClick={exportCSV} className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <FiDownload size={14}/> Export CSV
                        </button>
                    </div>
                </div>

                <div className="p-4 md:p-6 space-y-4 flex-1">
                    {/* Tab bar */}
                    <div className="flex gap-2 flex-wrap">
                        {TABS.map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === t.key ? 'bg-primary-600 text-white shadow-glow-blue' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'}`}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20"><FiRefreshCw size={20} className="animate-spin text-primary-500 mr-2"/><span className="text-sm text-gray-500">Generating report…</span></div>
                    ) : (
                        <>
                            {/* ── P&L ── */}
                            {tab === 'pnl' && pnl && (
                                <div className="space-y-4">
                                    {/* Totals */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label:'Total Revenue',  value: pnl.totals.revenue,  icon: FiTrendingUp,   color:'text-primary-600 dark:text-primary-400',   bg:'bg-primary-50 dark:bg-primary-900/20' },
                                            { label:'Total Expenses', value: pnl.totals.expenses, icon: FiTrendingDown, color:'text-red-500 dark:text-red-400',           bg:'bg-red-50 dark:bg-red-900/10' },
                                            { label:'Net Profit',     value: pnl.totals.profit,   icon: FiDollarSign,   color:'text-emerald-600 dark:text-emerald-400',   bg:'bg-emerald-50 dark:bg-emerald-900/10' },
                                        ].map(c => (
                                            <motion.div key={c.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className={`${c.bg} rounded-2xl p-5 border border-gray-200 dark:border-gray-700`}>
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{c.label}</p>
                                                <p className={`text-2xl font-bold ${c.color}`}>{fmt(c.value)}</p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Monthly table */}
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Monthly Breakdown — {year}</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                                                        {['Month','Revenue','Expenses','Net Profit','Margin'].map(h => (
                                                            <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                                    {pnl.monthly.map(m => {
                                                        const margin = m.revenue > 0 ? ((m.profit / m.revenue) * 100).toFixed(1) : 0;
                                                        return (
                                                            <tr key={m.month} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                                <td className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300">{m.month}</td>
                                                                <td className="px-5 py-3 font-semibold text-primary-600 dark:text-primary-400">{fmt(m.revenue)}</td>
                                                                <td className="px-5 py-3 text-red-500">{fmt(m.expenses)}</td>
                                                                <td className={`px-5 py-3 font-bold ${m.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{fmt(m.profit)}</td>
                                                                <td className="px-5 py-3 text-gray-500">{m.revenue > 0 ? `${margin}%` : '—'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 font-bold">
                                                        <td className="px-5 py-3 text-gray-700 dark:text-gray-300">Total</td>
                                                        <td className="px-5 py-3 text-primary-600 dark:text-primary-400">{fmt(pnl.totals.revenue)}</td>
                                                        <td className="px-5 py-3 text-red-500">{fmt(pnl.totals.expenses)}</td>
                                                        <td className={`px-5 py-3 ${pnl.totals.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{fmt(pnl.totals.profit)}</td>
                                                        <td className="px-5 py-3 text-gray-500">{pnl.totals.revenue > 0 ? `${((pnl.totals.profit/pnl.totals.revenue)*100).toFixed(1)}%` : '—'}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── VAT ── */}
                            {tab === 'vat' && vat && (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-2xl p-4 flex items-start gap-3">
                                        <FiBarChart2 size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"/>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">This report is designed for <strong>Making Tax Digital (MTD)</strong> VAT submissions to HMRC. Export as CSV to submit via your MTD-compatible software or the HMRC portal.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {vat.quarters.map((q, i) => (
                                            <motion.div key={q.quarter} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}
                                                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">{q.quarter}</h3>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Output VAT (sales)</p>
                                                            <p className="font-bold text-gray-900 dark:text-white">{fmt(q.outputVAT)}</p>
                                                        </div>
                                                        <Bar value={q.outputVAT} max={Math.max(q.outputVAT, q.inputVAT)} color="bg-primary-500"/>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Input VAT (expenses)</p>
                                                            <p className="font-bold text-gray-900 dark:text-white">{fmt(q.inputVAT)}</p>
                                                        </div>
                                                        <Bar value={q.inputVAT} max={Math.max(q.outputVAT, q.inputVAT)} color="bg-accent-400"/>
                                                    </div>
                                                    <div className={`flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700 ${q.vatDue >= 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                        <p className="text-sm font-bold">{q.vatDue >= 0 ? 'VAT Due to HMRC' : 'VAT Refund'}</p>
                                                        <p className="text-lg font-black">{fmt(Math.abs(q.vatDue))}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Balance Sheet ── */}
                            {tab === 'balance' && balance && (
                                <div className="max-w-2xl space-y-4">
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Balance Sheet — All Time</h3>
                                        </div>
                                        <div className="p-5 space-y-3 text-sm">
                                            {[
                                                { label: 'Total Revenue Received (Paid Invoices)', value: balance.revenue,     positive: true },
                                                { label: 'Accounts Receivable (Outstanding)',      value: balance.receivables, positive: true },
                                                { label: 'Total Expenses',                         value: balance.expenses,    positive: false },
                                            ].map(r => (
                                                <div key={r.label} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                                                    <span className="text-gray-600 dark:text-gray-400">{r.label}</span>
                                                    <span className={`font-bold ${r.positive ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}>
                                                        {r.positive ? '' : '−'}{fmt(r.value)}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200 dark:border-gray-700">
                                                <span className="font-bold text-gray-900 dark:text-white text-base">Net Assets</span>
                                                <span className={`text-2xl font-black ${balance.netAssets >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
                                                    {fmt(balance.netAssets)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;

