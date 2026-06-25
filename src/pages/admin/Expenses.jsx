import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheckCircle,
         FiRefreshCw, FiDollarSign, FiFilter } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminAPI from '../../utils/adminAPI';

const fmt    = (v) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(v || 0);
const fmtD   = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const MONTHS = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - i);
    return { value: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`, label: d.toLocaleDateString('en-GB',{month:'long',year:'numeric'}) };
});

const CATS = ['Software','Marketing','Travel','Office','Hardware','Utilities','Professional Services','Meals','Other'];
const CAT_COLORS = { Software:'bg-blue-100 text-blue-700', Marketing:'bg-purple-100 text-purple-700', Travel:'bg-amber-100 text-amber-700', Office:'bg-gray-100 text-gray-600', Hardware:'bg-cyan-100 text-cyan-700', Utilities:'bg-green-100 text-green-700', 'Professional Services':'bg-indigo-100 text-indigo-700', Meals:'bg-orange-100 text-orange-700', Other:'bg-gray-100 text-gray-500' };

const EMPTY_E = { category: 'Software', description: '', amount: '', currency: 'GBP', vat_amount: '', date: new Date().toISOString().split('T')[0], vendor: '', billable: false };

/* ── Expense Modal ── */
const ExpenseModal = ({ open, expense, onClose, onSaved }) => {
    const [form, setForm] = useState(EMPTY_E);
    const [saving, setSaving] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    useEffect(() => { setForm(expense ? { ...EMPTY_E, ...expense } : EMPTY_E); }, [expense, open]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            expense?.id ? await adminAPI.updateExpense(expense.id, form) : await adminAPI.createExpense(form);
            onSaved(); onClose();
        } catch (err) { alert(err.message); }
        finally { setSaving(false); }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose} />
                    <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4" initial={{ scale:0.95,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0.95,opacity:0 }}>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="font-bold text-gray-900 dark:text-white">{expense ? 'Edit Expense' : 'Add Expense'}</h2>
                                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><FiX size={18}/></button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Category *</label>
                                        <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                                            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Amount (£) *</label>
                                        <input required type="number" min="0" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="0.00"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">VAT Amount (£)</label>
                                        <input type="number" min="0" step="0.01" value={form.vat_amount} onChange={e => set('vat_amount', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="0.00"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Date *</label>
                                        <input required type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Vendor</label>
                                        <input value={form.vendor} onChange={e => set('vendor', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="Vendor name"/>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Description</label>
                                        <input value={form.description} onChange={e => set('description', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="What was this for?"/>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={form.billable} onChange={e => set('billable', e.target.checked)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Billable to client</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                                    <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">{saving ? 'Saving…' : expense ? 'Save' : 'Add Expense'}</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

/* ── Main Page ── */
const Expenses = () => {
    const [expenses,  setExpenses]  = useState([]);
    const [summary,   setSummary]   = useState([]);
    const [totalAmt,  setTotalAmt]  = useState(0);
    const [loading,   setLoading]   = useState(true);
    const [month,     setMonth]     = useState(MONTHS[0].value);
    const [catFilter, setCat]       = useState('');
    const [modal,     setModal]     = useState(false);
    const [editing,   setEditing]   = useState(null);
    const [deleting,  setDeleting]  = useState(null);
    const [toast,     setToast]     = useState('');

    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const d = await adminAPI.getExpenses({ month, ...(catFilter ? { category: catFilter } : {}) });
            setExpenses(d.expenses || []);
            setSummary(d.summary || []);
            setTotalAmt(d.total || 0);
        } catch { setExpenses([]); }
        finally { setLoading(false); }
    }, [month, catFilter]);

    useEffect(() => { load(); }, [load]);

    const openNew  = () => { setEditing(null); setModal(true); };
    const openEdit = (e) => { setEditing(e); setModal(true); };
    const handleDelete = async () => {
        if (!deleting) return;
        await adminAPI.deleteExpense(deleting.id);
        setDeleting(null); showToast('Expense deleted.'); load();
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Top bar */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="pl-10 md:pl-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">Expenses</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Total this year: <span className="font-semibold text-gray-700 dark:text-gray-300">{fmt(totalAmt)}</span></p>
                    </div>
                    <button onClick={openNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-glow-blue">
                        <FiPlus size={15} /> Add Expense
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-4 flex-1">
                    {/* Category summary pills */}
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={() => setCat('')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${!catFilter ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'}`}>
                            All {summary.length > 0 && `(${fmt(totalAmt)})`}
                        </button>
                        {summary.map(s => (
                            <button key={s.category} onClick={() => setCat(s.category === catFilter ? '' : s.category)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${catFilter === s.category ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'}`}>
                                {s.category} · {fmt(s.total)}
                            </button>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 items-center">
                        <select value={month} onChange={e => setMonth(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500">
                            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-16"><FiRefreshCw size={20} className="animate-spin text-primary-500 mr-2"/><span className="text-sm text-gray-500">Loading…</span></div>
                        ) : expenses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <FiDollarSign size={36} className="text-gray-300 dark:text-gray-600 mb-3"/>
                                <p className="text-sm text-gray-500 dark:text-gray-400">No expenses for this period</p>
                                <button onClick={openNew} className="mt-3 text-xs text-primary-600 dark:text-primary-400 hover:underline">+ Add expense</button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                                            {['Date','Category','Description','Vendor','Amount','VAT','Actions'].map(h => (
                                                <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {expenses.map(e => (
                                            <motion.tr key={e.id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                                <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{fmtD(e.date)}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CAT_COLORS[e.category] || 'bg-gray-100 text-gray-600'}`}>{e.category}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 max-w-xs truncate">{e.description || '—'}</td>
                                                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{e.vendor || '—'}</td>
                                                <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-white">{fmt(e.amount)}</td>
                                                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{e.vat_amount > 0 ? fmt(e.vat_amount) : '—'}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"><FiEdit2 size={14}/></button>
                                                        <button onClick={() => setDeleting(e)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={14}/></button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                            <td colSpan={4} className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Total</td>
                                            <td className="px-5 py-3 font-bold text-gray-900 dark:text-white">{fmt(expenses.reduce((s,e) => s + Number(e.amount), 0))}</td>
                                            <td className="px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">{fmt(expenses.reduce((s,e) => s + Number(e.vat_amount||0), 0))}</td>
                                            <td/>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }} className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
                        <FiCheckCircle size={14} className="text-emerald-400"/> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <ExpenseModal open={modal} expense={editing} onClose={() => setModal(false)} onSaved={() => { load(); showToast(editing ? 'Expense updated.' : 'Expense added.'); }}/>

            <AnimatePresence>
                {deleting && (
                    <>
                        <motion.div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setDeleting(null)}/>
                        <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4" initial={{ scale:0.9,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0.9,opacity:0 }}>
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700 shadow-2xl">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 size={22} className="text-red-500"/></div>
                                <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">Delete Expense</h3>
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Delete <span className="font-semibold text-gray-900 dark:text-white">{fmt(deleting.amount)} · {deleting.category}</span>? This cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setDeleting(null)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                                    <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors">Delete</button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Expenses;

