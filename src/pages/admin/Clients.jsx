import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUsers, FiMail,
         FiPhone, FiX, FiCheckCircle, FiRefreshCw, FiFileText } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminAPI from '../../utils/adminAPI';

const fmt = (v) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v || 0);

const EMPTY = { name: '', email: '', company: '', phone: '', address: '', vat_number: '', currency: 'GBP' };

/* ── Client Form Modal ── */
const ClientModal = ({ open, client, onClose, onSaved }) => {
    const [form, setForm]   = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => { setForm(client ? { ...EMPTY, ...client } : EMPTY); }, [client, open]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setSaving(true);
        try {
            client?.id ? await adminAPI.updateClient(client.id, form) : await adminAPI.createClient(form);
            onSaved();
            onClose();
        } catch (err) { alert(err.message); }
        finally { setSaving(false); }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
                    <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="font-bold text-gray-900 dark:text-white">{client ? 'Edit Client' : 'New Client'}</h2>
                                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><FiX size={18} /></button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Name *</label>
                                        <input required value={form.name} onChange={e => set('name', e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                            placeholder="Full name" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Email</label>
                                        <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                            placeholder="email@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Phone</label>
                                        <input value={form.phone} onChange={e => set('phone', e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                            placeholder="+44 7700 000000" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Company</label>
                                        <input value={form.company} onChange={e => set('company', e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                            placeholder="Company Ltd" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Address</label>
                                        <textarea rows={2} value={form.address} onChange={e => set('address', e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
                                            placeholder="Street, City, Postcode" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">VAT Number</label>
                                        <input value={form.vat_number} onChange={e => set('vat_number', e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                            placeholder="GB123456789" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Currency</label>
                                        <select value={form.currency} onChange={e => set('currency', e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500">
                                            {['GBP','EUR','USD'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={onClose}
                                        className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={saving}
                                        className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-glow-blue disabled:opacity-60">
                                        {saving ? 'Saving…' : client ? 'Save Changes' : 'Add Client'}
                                    </button>
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
const Clients = () => {
    const [clients,  setClients]  = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [search,   setSearch]   = useState('');
    const [modal,    setModal]    = useState(false);
    const [editing,  setEditing]  = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [toast,    setToast]    = useState('');

    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const d = await adminAPI.getClients(search ? { search } : {});
            setClients(d.clients || d || []);
        } catch { setClients([]); }
        finally { setLoading(false); }
    }, [search]);

    useEffect(() => {
        const t = setTimeout(load, 300);
        return () => clearTimeout(t);
    }, [load]);

    const openNew  = () => { setEditing(null); setModal(true); };
    const openEdit = (c) => { setEditing(c); setModal(true); };

    const handleDelete = async () => {
        if (!deleting) return;
        await adminAPI.deleteClient(deleting.id);
        setDeleting(null);
        showToast('Client deleted.');
        load();
    };

    const initials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
    const COLORS   = ['bg-primary-500','bg-accent-500','bg-purple-500','bg-emerald-500','bg-pink-500'];
    const colorFor = (id) => COLORS[id % COLORS.length];

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Top bar */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="pl-10 md:pl-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">Clients</h1>
                        <p className="text-xs text-gray-400 mt-0.5">{clients.length} client{clients.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={openNew}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-glow-blue">
                        <FiPlus size={15} /> New Client
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-4 flex-1">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search clients…" value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500" />
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <FiRefreshCw size={20} className="animate-spin text-primary-500 mr-2" />
                            <span className="text-sm text-gray-500">Loading…</span>
                        </div>
                    ) : clients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <FiUsers size={40} className="text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No clients yet</p>
                            <button onClick={openNew} className="mt-3 text-xs text-primary-600 dark:text-primary-400 hover:underline">
                                + Add your first client
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {clients.map((c, i) => (
                                <motion.div key={c.id}
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-premium dark:hover:shadow-premium-dark transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl ${colorFor(c.id)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                                {initials(c.name)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{c.name}</p>
                                                {c.company && <p className="text-xs text-gray-400 truncate">{c.company}</p>}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(c)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                                                <FiEdit2 size={14} />
                                            </button>
                                            <button onClick={() => setDeleting(c)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 mb-4">
                                        {c.email && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <FiMail size={12} className="flex-shrink-0" />
                                                <span className="truncate">{c.email}</span>
                                            </div>
                                        )}
                                        {c.phone && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <FiPhone size={12} className="flex-shrink-0" />
                                                <span>{c.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 text-center">
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">{c.invoice_count || 0}</p>
                                            <p className="text-xs text-gray-400">Invoices</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-emerald-600">{fmt(c.total_paid)}</p>
                                            <p className="text-xs text-gray-400">Paid</p>
                                        </div>
                                        <div>
                                            <p className={`text-xs font-bold ${Number(c.total_outstanding) > 0 ? 'text-amber-500' : 'text-gray-400'}`}>
                                                {fmt(c.total_outstanding)}
                                            </p>
                                            <p className="text-xs text-gray-400">Due</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
                        <FiCheckCircle size={14} className="text-emerald-400" /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <ClientModal open={modal} client={editing} onClose={() => setModal(false)}
                onSaved={() => { load(); showToast(editing ? 'Client updated.' : 'Client added.'); }} />

            {/* Delete confirm */}
            <AnimatePresence>
                {deleting && (
                    <>
                        <motion.div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleting(null)} />
                        <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4"
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700 shadow-2xl">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiTrash2 size={22} className="text-red-500" />
                                </div>
                                <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">Delete Client</h3>
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Delete <span className="font-semibold text-gray-900 dark:text-white">{deleting.name}</span>? All their invoices will remain but will be unlinked.
                                </p>
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

export default Clients;

