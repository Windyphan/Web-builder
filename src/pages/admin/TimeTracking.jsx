import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiSquare, FiPlus, FiEdit2, FiTrash2, FiClock,
         FiCheckCircle, FiRefreshCw, FiX, FiDollarSign } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminAPI from '../../utils/adminAPI';

const fmt  = (v) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(v || 0);
const fmtD = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtHrs = (h) => `${Math.floor(h)}h ${Math.round((h % 1) * 60)}m`;

const hms = (s) => `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

const EMPTY_T = { client_id:'', project_id:'', description:'', hours:'', hourly_rate:'', billable:true, date: new Date().toISOString().split('T')[0] };

/* ── Time Entry Modal ── */
const TimeModal = ({ open, entry, clients, projects, onClose, onSaved }) => {
    const [form, setForm]   = useState(EMPTY_T);
    const [saving, setSaving] = useState(false);
    const set = (k,v) => setForm(f => ({ ...f, [k]: v }));

    useEffect(() => { setForm(entry ? { ...EMPTY_T, ...entry } : EMPTY_T); }, [entry, open]);

    const clientProjects = projects.filter(p => !form.client_id || String(p.client_id) === String(form.client_id));

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            entry?.id ? await adminAPI.updateTimeEntry(entry.id, form) : await adminAPI.createTimeEntry(form);
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
                                <h2 className="font-bold text-gray-900 dark:text-white">{entry ? 'Edit Entry' : 'Log Time'}</h2>
                                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><FiX size={18}/></button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Description *</label>
                                        <input required value={form.description} onChange={e => set('description', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="What did you work on?"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Client</label>
                                        <select value={form.client_id} onChange={e => set('client_id', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                                            <option value="">— None —</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Project</label>
                                        <select value={form.project_id} onChange={e => set('project_id', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                                            <option value="">— None —</option>
                                            {clientProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Hours *</label>
                                        <input required type="number" min="0.25" step="0.25" value={form.hours} onChange={e => set('hours', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="1.5"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Rate (£/hr)</label>
                                        <input type="number" min="0" step="5" value={form.hourly_rate} onChange={e => set('hourly_rate', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="75"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Date *</label>
                                        <input required type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"/>
                                    </div>
                                    <div className="flex items-center col-span-1 mt-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={form.billable} onChange={e => set('billable', e.target.checked)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Billable</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                                    <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">{saving ? 'Saving…' : 'Save Entry'}</button>
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
const TimeTracking = () => {
    const [entries,      setEntries]      = useState([]);
    const [clients,      setClients]      = useState([]);
    const [projects,     setProjects]     = useState([]);
    const [unbilledHrs,  setUnbilledHrs]  = useState(0);
    const [unbilledVal,  setUnbilledVal]  = useState(0);
    const [loading,      setLoading]      = useState(true);
    const [modal,        setModal]        = useState(false);
    const [editing,      setEditing]      = useState(null);
    const [deleting,     setDeleting]     = useState(null);
    const [toast,        setToast]        = useState('');
    /* live stopwatch */
    const [running,      setRunning]      = useState(false);
    const [elapsed,      setElapsed]      = useState(0);
    const [timerDesc,    setTimerDesc]    = useState('');
    const intervalRef = useRef(null);

    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [tData, cData, pData] = await Promise.all([
                adminAPI.getTimeEntries(),
                adminAPI.getClients(),
                adminAPI.getProjects(),
            ]);
            setEntries(tData.entries || []);
            setUnbilledHrs(tData.unbilledHours || 0);
            setUnbilledVal(tData.unbilledValue || 0);
            setClients(cData.clients || cData || []);
            setProjects(pData.projects || pData || []);
        } catch { setEntries([]); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    /* stopwatch logic */
    const startTimer  = () => { setRunning(true);  intervalRef.current = setInterval(() => setElapsed(s => s+1), 1000); };
    const stopTimer   = async () => {
        clearInterval(intervalRef.current); setRunning(false);
        if (elapsed > 0 && timerDesc.trim()) {
            const hours = +(elapsed / 3600).toFixed(2);
            await adminAPI.createTimeEntry({ description: timerDesc, hours, billable: true, date: new Date().toISOString().split('T')[0] });
            load(); showToast(`Logged ${fmtHrs(hours)}`);
        }
        setElapsed(0); setTimerDesc('');
    };
    useEffect(() => () => clearInterval(intervalRef.current), []);

    const openNew  = () => { setEditing(null); setModal(true); };
    const openEdit = (e) => { setEditing(e); setModal(true); };
    const handleDelete = async () => {
        if (!deleting) return;
        await adminAPI.deleteTimeEntry(deleting.id);
        setDeleting(null); showToast('Entry deleted.'); load();
    };

    const totalHrs = entries.reduce((s, e) => s + Number(e.hours), 0);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Top bar */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="pl-10 md:pl-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">Time Tracking</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Total: {fmtHrs(totalHrs)} logged</p>
                    </div>
                    <button onClick={openNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-glow-blue">
                        <FiPlus size={15}/> Log Time
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-4 flex-1">
                    {/* KPI cards + Stopwatch */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Stopwatch */}
                        <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Live Timer</p>
                            <div className="flex items-center gap-4">
                                <div className={`text-4xl font-mono font-bold ${running ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                                    {hms(elapsed)}
                                </div>
                                {running
                                    ? <button onClick={stopTimer} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"><FiSquare size={15}/> Stop & Save</button>
                                    : <button onClick={startTimer} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"><FiPlay size={15}/> Start</button>
                                }
                            </div>
                            {running && (
                                <input value={timerDesc} onChange={e => setTimerDesc(e.target.value)} className="mt-3 w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="What are you working on?"/>
                            )}
                        </div>

                        {/* Unbilled summary */}
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-5 shadow-sm">
                            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-3">Unbilled</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{fmtHrs(unbilledHrs)}</p>
                            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 font-semibold">{fmt(unbilledVal)} value</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ready to invoice</p>
                        </div>
                    </div>

                    {/* Entries table */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-16"><FiRefreshCw size={20} className="animate-spin text-primary-500 mr-2"/><span className="text-sm text-gray-500">Loading…</span></div>
                        ) : entries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <FiClock size={36} className="text-gray-300 dark:text-gray-600 mb-3"/>
                                <p className="text-sm text-gray-500 dark:text-gray-400">No time entries yet</p>
                                <button onClick={openNew} className="mt-3 text-xs text-primary-600 dark:text-primary-400 hover:underline">+ Log time</button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                                            {['Date','Description','Client','Project','Hours','Rate','Value','Billable','Actions'].map(h => (
                                                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {entries.map(e => (
                                            <motion.tr key={e.id} initial={{ opacity:0 }} animate={{ opacity:1 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{fmtD(e.date)}</td>
                                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">{e.description || '—'}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{e.client_name || '—'}</td>
                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{e.project_name || '—'}</td>
                                                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{fmtHrs(e.hours)}</td>
                                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{e.hourly_rate > 0 ? `£${e.hourly_rate}/hr` : '—'}</td>
                                                <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{e.hourly_rate > 0 ? fmt(e.hours * e.hourly_rate) : '—'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${e.billable ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                        {e.billable ? (e.invoiced ? 'Invoiced' : 'Billable') : 'Non-billable'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"><FiEdit2 size={14}/></button>
                                                        <button onClick={() => setDeleting(e)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={14}/></button>
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
                {toast && (
                    <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:20 }} className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
                        <FiCheckCircle size={14} className="text-emerald-400"/> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <TimeModal open={modal} entry={editing} clients={clients} projects={projects} onClose={() => setModal(false)} onSaved={() => { load(); showToast(editing ? 'Entry updated.' : 'Time logged.'); }}/>

            <AnimatePresence>
                {deleting && (
                    <>
                        <motion.div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setDeleting(null)}/>
                        <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4" initial={{ scale:0.9,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0.9,opacity:0 }}>
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700 shadow-2xl">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 size={22} className="text-red-500"/></div>
                                <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">Delete Entry</h3>
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Delete <span className="font-semibold text-gray-900 dark:text-white">{fmtHrs(deleting.hours)} — {deleting.description}</span>?</p>
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

export default TimeTracking;

