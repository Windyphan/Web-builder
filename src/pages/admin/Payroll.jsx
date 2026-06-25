import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase, FiX,
         FiCheckCircle, FiRefreshCw, FiInfo } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminAPI from '../../utils/adminAPI';

const fmt = (v) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v || 0);
const fmtD = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const STATUS_STYLE = { paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };

/* simple UK PAYE preview in frontend */
const calcPreview = (gross) => {
    const g = Number(gross) || 0;
    const annualG  = g * 12;
    const PA = 12570, BRL = 50270, NIL = 12570, NIU = 50270;
    let tax = 0;
    if (annualG > PA) { tax = Math.min(annualG, BRL) - PA; if (annualG > BRL) tax += (annualG - BRL) * 2; }
    tax = (tax * 0.20) / 12;
    let ni = 0;
    if (annualG > NIL) { ni = (Math.min(annualG, NIU) - NIL) * 0.12 + (annualG > NIU ? (annualG - NIU) * 0.02 : 0); }
    ni /= 12;
    const pension = g * 0.05;
    return { tax: +tax.toFixed(2), ni: +ni.toFixed(2), pension: +pension.toFixed(2), net: +(g - tax - ni - pension).toFixed(2) };
};

const EMPTY_P = { employee_name: '', role: '', gross_salary: '', pay_period: 'monthly', payment_date: '', status: 'pending' };

/* ── Payroll Modal ── */
const PayrollModal = ({ open, record, onClose, onSaved }) => {
    const [form, setForm]   = useState(EMPTY_P);
    const [saving, setSaving] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    useEffect(() => { setForm(record ? { ...EMPTY_P, ...record } : EMPTY_P); }, [record, open]);

    const preview = calcPreview(form.gross_salary);

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            record?.id ? await adminAPI.updatePayroll(record.id, form) : await adminAPI.createPayroll(form);
            onSaved(); onClose();
        } catch (err) { alert(err.message); }
        finally { setSaving(false); }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}/>
                    <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4" initial={{ scale:0.95,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0.95,opacity:0 }}>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="font-bold text-gray-900 dark:text-white">{record ? 'Edit Payroll' : 'Add Payroll Record'}</h2>
                                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><FiX size={18}/></button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Employee Name *</label>
                                        <input required value={form.employee_name} onChange={e => set('employee_name', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="Full name"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Role / Title</label>
                                        <input value={form.role} onChange={e => set('role', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="Developer"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Gross Monthly (£) *</label>
                                        <input required type="number" min="0" step="100" value={form.gross_salary} onChange={e => set('gross_salary', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="3000"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Pay Period</label>
                                        <select value={form.pay_period} onChange={e => set('pay_period', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                                            <option value="monthly">Monthly</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Payment Date</label>
                                        <input type="date" value={form.payment_date} onChange={e => set('payment_date', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Status</label>
                                        <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </div>
                                </div>

                                {/* PAYE preview */}
                                {form.gross_salary > 0 && (
                                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-3 space-y-1.5 text-xs">
                                        <p className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5"><FiInfo size={12}/> UK PAYE Estimate</p>
                                        {[
                                            { l: 'Income Tax (PAYE)',      v: fmt(preview.tax)     },
                                            { l: 'National Insurance',     v: fmt(preview.ni)      },
                                            { l: 'Pension (5% auto)',      v: fmt(preview.pension) },
                                            { l: 'Net Take-Home Pay',      v: fmt(preview.net), bold: true },
                                        ].map(r => (
                                            <div key={r.l} className={`flex justify-between ${r.bold ? 'font-bold text-blue-800 dark:text-blue-200 border-t border-blue-200 dark:border-blue-700 pt-1 mt-1' : 'text-blue-700 dark:text-blue-300'}`}>
                                                <span>{r.l}</span><span>{r.v}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                                    <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">{saving ? 'Saving…' : record ? 'Save' : 'Add Record'}</button>
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
const Payroll = () => {
    const [records,  setRecords]  = useState([]);
    const [totals,   setTotals]   = useState({ gross: 0, net: 0 });
    const [loading,  setLoading]  = useState(true);
    const [modal,    setModal]    = useState(false);
    const [editing,  setEditing]  = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [toast,    setToast]    = useState('');

    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const d = await adminAPI.getPayroll();
            setRecords(d.payroll || []);
            setTotals(d.totals || { gross: 0, net: 0 });
        } catch { setRecords([]); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const openNew  = () => { setEditing(null); setModal(true); };
    const openEdit = (r) => { setEditing(r); setModal(true); };
    const handleDelete = async () => {
        if (!deleting) return;
        await adminAPI.deletePayroll(deleting.id);
        setDeleting(null); showToast('Record deleted.'); load();
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="pl-10 md:pl-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">Payroll</h1>
                        <p className="text-xs text-gray-400 mt-0.5">UK PAYE · Auto NI & tax calculation</p>
                    </div>
                    <button onClick={openNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-glow-blue">
                        <FiPlus size={15}/> Add Record
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-4 flex-1">
                    {/* Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Gross Paid</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(totals.gross)}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-4 shadow-sm">
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">Total Net Paid</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(totals.net)}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-16"><FiRefreshCw size={20} className="animate-spin text-primary-500 mr-2"/><span className="text-sm text-gray-500">Loading…</span></div>
                        ) : records.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <FiBriefcase size={36} className="text-gray-300 dark:text-gray-600 mb-3"/>
                                <p className="text-sm text-gray-500 dark:text-gray-400">No payroll records</p>
                                <button onClick={openNew} className="mt-3 text-xs text-primary-600 dark:text-primary-400 hover:underline">+ Add first record</button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                                            {['Employee','Role','Gross','Income Tax','NI','Pension','Net Pay','Date','Status','Actions'].map(h => (
                                                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {records.map(r => (
                                            <motion.tr key={r.id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{r.employee_name}</td>
                                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{r.role || '—'}</td>
                                                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{fmt(r.gross_salary)}</td>
                                                <td className="px-4 py-3 text-red-500">{fmt(r.income_tax)}</td>
                                                <td className="px-4 py-3 text-red-500">{fmt(r.national_insurance)}</td>
                                                <td className="px-4 py-3 text-amber-600 dark:text-amber-400">{fmt(r.pension)}</td>
                                                <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">{fmt(r.net_pay)}</td>
                                                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{fmtD(r.payment_date)}</td>
                                                <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[r.status] || STATUS_STYLE.pending}`}>{r.status}</span></td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"><FiEdit2 size={14}/></button>
                                                        <button onClick={() => setDeleting(r)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={14}/></button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {toast && (<motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:20 }} className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2"><FiCheckCircle size={14} className="text-emerald-400"/> {toast}</motion.div>)}
            </AnimatePresence>

            <PayrollModal open={modal} record={editing} onClose={() => setModal(false)} onSaved={() => { load(); showToast(editing ? 'Record updated.' : 'Record added.'); }}/>

            <AnimatePresence>
                {deleting && (<>
                    <motion.div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setDeleting(null)}/>
                    <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4" initial={{ scale:0.9,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0.9,opacity:0 }}>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700 shadow-2xl">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 size={22} className="text-red-500"/></div>
                            <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">Delete Payroll Record</h3>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Delete payroll record for <span className="font-semibold text-gray-900 dark:text-white">{deleting.employee_name}</span>?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleting(null)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                                <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors">Delete</button>
                            </div>
                        </div>
                    </motion.div>
                </>)}
            </AnimatePresence>
        </div>
    );
};

export default Payroll;

