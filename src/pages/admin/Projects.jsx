import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiX, FiCheckCircle,
         FiRefreshCw, FiClock, FiDollarSign, FiCalendar } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminAPI from '../../utils/adminAPI';

const fmt    = (v) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v || 0);
const fmtD   = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtHrs = (h) => h > 0 ? `${Number(h).toFixed(1)}h` : '0h';

const STATUS_OPTS = ['active', 'completed', 'on-hold'];
const STATUS_STYLE = { active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', 'on-hold': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };

const EMPTY_P = { client_id: '', name: '', description: '', status: 'active', budget: '', hourly_rate: '', deadline: '' };

/* ── Project Modal ── */
const ProjectModal = ({ open, project, clients, onClose, onSaved }) => {
    const [form, setForm]   = useState(EMPTY_P);
    const [saving, setSaving] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    useEffect(() => { setForm(project ? { ...EMPTY_P, ...project } : EMPTY_P); }, [project, open]);

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            project?.id ? await adminAPI.updateProject(project.id, form) : await adminAPI.createProject(form);
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
                                <h2 className="font-bold text-gray-900 dark:text-white">{project ? 'Edit Project' : 'New Project'}</h2>
                                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><FiX size={18}/></button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Project Name *</label>
                                        <input required value={form.name} onChange={e => set('name', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="Project name"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Client</label>
                                        <select value={form.client_id} onChange={e => set('client_id', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                                            <option value="">— None —</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Status</label>
                                        <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                                            {STATUS_OPTS.map(s => <option key={s} value={s} className="capitalize">{s.replace('-', ' ')}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Budget (£)</label>
                                        <input type="number" min="0" step="100" value={form.budget} onChange={e => set('budget', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="5000"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Hourly Rate (£)</label>
                                        <input type="number" min="0" step="5" value={form.hourly_rate} onChange={e => set('hourly_rate', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" placeholder="75"/>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Deadline</label>
                                        <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"/>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Description</label>
                                        <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Project brief…"/>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                                    <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">{saving ? 'Saving…' : project ? 'Save' : 'Create Project'}</button>
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
const Projects = () => {
    const [projects,  setProjects]  = useState([]);
    const [clients,   setClients]   = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [statusTab, setStatusTab] = useState('');
    const [modal,     setModal]     = useState(false);
    const [editing,   setEditing]   = useState(null);
    const [deleting,  setDeleting]  = useState(null);
    const [toast,     setToast]     = useState('');

    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [pData, cData] = await Promise.all([
                adminAPI.getProjects(statusTab ? { status: statusTab } : {}),
                adminAPI.getClients(),
            ]);
            setProjects(pData.projects || pData || []);
            setClients(cData.clients || cData || []);
        } catch { setProjects([]); }
        finally { setLoading(false); }
    }, [statusTab]);

    useEffect(() => { load(); }, [load]);

    const openNew  = () => { setEditing(null); setModal(true); };
    const openEdit = (p) => { setEditing(p); setModal(true); };
    const handleDelete = async () => {
        if (!deleting) return;
        await adminAPI.deleteProject(deleting.id);
        setDeleting(null); showToast('Project deleted.'); load();
    };

    const budgetPct = (p) => p.budget > 0 && p.logged_value > 0 ? Math.min(100, (p.logged_value / p.budget) * 100) : 0;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="pl-10 md:pl-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">Projects</h1>
                        <p className="text-xs text-gray-400 mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={openNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-glow-blue">
                        <FiPlus size={15}/> New Project
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-4 flex-1">
                    {/* Status filter */}
                    <div className="flex gap-2">
                        {[{ value: '', label: 'All' }, ...STATUS_OPTS.map(s => ({ value: s, label: s.replace('-',' ') }))].map(t => (
                            <button key={t.value} onClick={() => setStatusTab(t.value)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${statusTab === t.value ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'}`}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20"><FiRefreshCw size={20} className="animate-spin text-primary-500 mr-2"/><span className="text-sm text-gray-500">Loading…</span></div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <FiFolder size={40} className="text-gray-300 dark:text-gray-600 mb-3"/>
                            <p className="text-sm text-gray-500 dark:text-gray-400">No projects yet</p>
                            <button onClick={openNew} className="mt-3 text-xs text-primary-600 dark:text-primary-400 hover:underline">+ Create project</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {projects.map((p, i) => {
                                const pct = budgetPct(p);
                                return (
                                    <motion.div key={p.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.04 }}
                                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-premium dark:hover:shadow-premium-dark transition-all group">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{p.name}</h3>
                                                <p className="text-xs text-gray-400 mt-0.5">{p.client_name || 'No client'}</p>
                                            </div>
                                            <div className="flex items-center gap-1 ml-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[p.status] || STATUS_STYLE.active}`}>{p.status?.replace('-',' ')}</span>
                                                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"><FiEdit2 size={13}/></button>
                                                    <button onClick={() => setDeleting(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={13}/></button>
                                                </div>
                                            </div>
                                        </div>

                                        {p.description && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{p.description}</p>}

                                        {/* Budget progress */}
                                        {p.budget > 0 && (
                                            <div className="mb-3">
                                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    <span>{fmt(p.logged_value)} used</span>
                                                    <span>{fmt(p.budget)} budget</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <motion.div className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-primary-500'}`}
                                                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}/>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 text-center">
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">{fmtHrs(p.logged_hours)}</p>
                                                <p className="text-xs text-gray-400">Logged</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-emerald-600">{p.hourly_rate > 0 ? `£${p.hourly_rate}/hr` : '—'}</p>
                                                <p className="text-xs text-gray-400">Rate</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-amber-500">{p.deadline ? fmtD(p.deadline) : '—'}</p>
                                                <p className="text-xs text-gray-400">Deadline</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {toast && (<motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:20 }} className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2"><FiCheckCircle size={14} className="text-emerald-400"/> {toast}</motion.div>)}
            </AnimatePresence>

            <ProjectModal open={modal} project={editing} clients={clients} onClose={() => setModal(false)} onSaved={() => { load(); showToast(editing ? 'Project updated.' : 'Project created.'); }}/>

            <AnimatePresence>
                {deleting && (<>
                    <motion.div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setDeleting(null)}/>
                    <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4" initial={{ scale:0.9,opacity:0 }} animate={{ scale:1,opacity:1 }} exit={{ scale:0.9,opacity:0 }}>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700 shadow-2xl">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 size={22} className="text-red-500"/></div>
                            <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">Delete Project</h3>
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Delete <span className="font-semibold text-gray-900 dark:text-white">{deleting.name}</span>? Time entries linked to this project will be unlinked.</p>
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

export default Projects;

