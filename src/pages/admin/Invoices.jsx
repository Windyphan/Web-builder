import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import emailjs from '@emailjs/browser';
import {
    FiPlus, FiEdit2, FiTrash2, FiDownload, FiSend, FiCheckCircle,
    FiX, FiSearch, FiFileText, FiMail,
    FiAlertCircle, FiRefreshCw, FiPrinter, FiLoader
} from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminAPI from '../../utils/adminAPI';

/* ─── EmailJS Config (reuse existing project credentials) ─────── */
const EJS_SERVICE  = 'service_4lbrwu9';
const EJS_TEMPLATE = 'template_invoice';   // create this in your EmailJS dashboard
const EJS_PUBLIC   = '_KGvnP1t8dVz7HVoB';

/* ─── Constants ─────────────────────────────────────────────── */

const TABS   = ['all', 'draft', 'sent', 'paid', 'overdue'];
const VAT_RATES = [0, 5, 20];
const RECURRING_OPTS = [
    { value: '',          label: 'None'      },
    { value: 'monthly',   label: 'Monthly'   },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually',  label: 'Annually'  },
];

const EMPTY_ITEM  = { description: '', quantity: 1, unit_price: '' };
const EMPTY_FORM  = {
    client_id: '', issue_date: new Date().toISOString().split('T')[0],
    due_date: '', notes: '', vat_rate: 20, recurring: false,
    recurring_interval: '', status: 'draft', items: [{ ...EMPTY_ITEM }],
};

/* ─── Helpers ────────────────────────────────────────────────── */

const fmt = (v) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(v || 0);

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const STATUS_STYLE = {
    paid:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    sent:    'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400',
    draft:   'bg-gray-100   text-gray-600   dark:bg-gray-700      dark:text-gray-400',
    overdue: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
};
const StatusBadge = ({ s }) => (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[s] || STATUS_STYLE.draft}`}>{s}</span>
);

/* ─── Invoice Preview (used for PDF too) ─────────────────────── */

const InvoicePreview = React.forwardRef(({ form, clients }, ref) => {
    const client  = clients.find(c => String(c.id) === String(form.client_id));
    const items   = form.items || [];
    const subtotal = items.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.unit_price || 0), 0);
    const vatAmt  = subtotal * (Number(form.vat_rate) / 100);
    const total   = subtotal + vatAmt;

    return (
        <div ref={ref} className="bg-white text-gray-900 p-8 rounded-xl text-sm" style={{ minWidth: 560 }}>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">INVOICE</h1>
                    <p className="text-gray-500 text-xs mt-1">The Innovation Curve Ltd</p>
                    <p className="text-gray-500 text-xs">theinnovationcurve.com</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">Invoice No.</p>
                    <p className="font-bold text-base text-primary-700">{form.invoice_number || 'DRAFT'}</p>
                    <p className="text-xs text-gray-500 mt-2">Issued: {fmtDate(form.issue_date)}</p>
                    <p className="text-xs text-gray-500">Due: {fmtDate(form.due_date)}</p>
                </div>
            </div>

            {/* Bill To */}
            <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Bill To</p>
                {client ? (
                    <>
                        <p className="font-semibold text-gray-900">{client.name}</p>
                        {client.company && <p className="text-gray-600 text-xs">{client.company}</p>}
                        {client.address && <p className="text-gray-500 text-xs whitespace-pre-line">{client.address}</p>}
                        {client.vat_number && <p className="text-gray-500 text-xs">VAT: {client.vat_number}</p>}
                    </>
                ) : (
                    <p className="text-gray-400 italic text-xs">— No client selected —</p>
                )}
            </div>

            {/* Line Items */}
            <table className="w-full mb-6 text-sm">
                <thead>
                    <tr className="border-b-2 border-gray-200 text-left">
                        <th className="pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                        <th className="pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right w-16">Qty</th>
                        <th className="pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right w-24">Unit Price</th>
                        <th className="pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right w-24">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((it, i) => (
                        <tr key={i} className="border-b border-gray-100">
                            <td className="py-2 text-gray-700">{it.description || <span className="italic text-gray-300">—</span>}</td>
                            <td className="py-2 text-right text-gray-600">{it.quantity}</td>
                            <td className="py-2 text-right text-gray-600">{fmt(it.unit_price)}</td>
                            <td className="py-2 text-right font-medium">{fmt(Number(it.quantity || 0) * Number(it.unit_price || 0))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-52 space-y-1.5">
                    <div className="flex justify-between text-gray-600 text-xs"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                    <div className="flex justify-between text-gray-600 text-xs"><span>VAT ({form.vat_rate}%)</span><span>{fmt(vatAmt)}</span></div>
                    <div className="flex justify-between font-bold text-base border-t-2 border-gray-900 pt-2 mt-2">
                        <span>Total</span><span className="text-primary-700">{fmt(total)}</span>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {form.notes && (
                <div className="mt-6 p-3 bg-gray-50 rounded-lg border-l-4 border-primary-400">
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Notes</p>
                    <p className="text-xs text-gray-600">{form.notes}</p>
                </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">Thank you for your business · Payment terms: {fmtDate(form.due_date)}</p>
                <p className="text-xs text-gray-400">Questions? hello@theinnovationcurve.com</p>
            </div>
        </div>
    );
});
InvoicePreview.displayName = 'InvoicePreview';

/* ─── Send Invoice Email Modal ───────────────────────────────── */

const SendInvoiceModal = ({ open, invoiceData, onClose, onSent }) => {
    const [toEmail,  setToEmail]  = useState('');
    const [message,  setMessage]  = useState('');
    const [sending,  setSending]  = useState(false);
    const [result,   setResult]   = useState(null); // 'success' | 'error'
    const [errMsg,   setErrMsg]   = useState('');

    /* Pre-fill email from client whenever modal opens with new invoice */
    useEffect(() => {
        if (open && invoiceData) {
            setToEmail(invoiceData.client_email || '');
            setResult(null);
            setErrMsg('');
            setMessage(`Hi ${invoiceData.client_name || 'there'},\n\nPlease find your invoice ${invoiceData.invoice_number} attached for ${fmt(invoiceData.total)}, due on ${fmtDate(invoiceData.due_date)}.\n\nPlease don't hesitate to reach out if you have any questions.\n\nKind regards,\nThe Innovation Curve`);
        }
    }, [open, invoiceData]);

    if (!invoiceData) return null;

    /* Build a plain-text line-items summary for the email body */
    const itemsSummary = (invoiceData.items || [])
        .map(it => `  • ${it.description}  x${it.quantity}  @ ${fmt(it.unit_price)}  = ${fmt(Number(it.quantity) * Number(it.unit_price))}`)
        .join('\n');

    const handleSend = async (e) => {
        e.preventDefault();
        if (!toEmail.trim()) return;
        setSending(true);
        setResult(null);
        try {
            /* Send via EmailJS */
            await emailjs.send(
                EJS_SERVICE,
                EJS_TEMPLATE,
                {
                    to_email:       toEmail.trim(),
                    to_name:        invoiceData.client_name || toEmail,
                    from_name:      'The Innovation Curve',
                    reply_to:       'info@theinnovationcurve.com',
                    invoice_number: invoiceData.invoice_number,
                    invoice_date:   fmtDate(invoiceData.issue_date),
                    due_date:       fmtDate(invoiceData.due_date),
                    items_list:     itemsSummary,
                    subtotal:       fmt(invoiceData.subtotal),
                    vat_rate:       `${invoiceData.vat_rate || 20}%`,
                    vat_amount:     fmt(invoiceData.vat_amount),
                    total_amount:   fmt(invoiceData.total),
                    custom_message: message,
                    notes:          invoiceData.notes || '',
                },
                EJS_PUBLIC
            );

            /* Mark invoice as sent in the backend */
            await adminAPI.sendInvoice(invoiceData.id);

            setResult('success');
            if (onSent) onSent(toEmail);
        } catch (err) {
            console.error('Email send error:', err);
            setErrMsg(err?.text || err?.message || 'Failed to send. Check your EmailJS template ID.');
            setResult('error');
        } finally {
            setSending(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={result === 'success' ? onClose : undefined}
                    />
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                                        <FiMail size={16} className="text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900 dark:text-white text-sm">Send Invoice</h2>
                                        <p className="text-xs text-gray-400">{invoiceData.invoice_number}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                                    <FiX size={18} />
                                </button>
                            </div>

                            {/* Invoice summary bar */}
                            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 text-xs">
                                <div>
                                    <span className="text-gray-400">Client </span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{invoiceData.client_name || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Amount </span>
                                    <span className="font-bold text-primary-600 dark:text-primary-400">{fmt(invoiceData.total)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Due </span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{fmtDate(invoiceData.due_date)}</span>
                                </div>
                            </div>

                            {/* Success state */}
                            {result === 'success' ? (
                                <div className="p-8 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <FiCheckCircle size={32} className="text-emerald-500" />
                                    </motion.div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Invoice Sent!</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                        {invoiceData.invoice_number} was emailed to <span className="font-semibold text-gray-700 dark:text-gray-300">{toEmail}</span>
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors"
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSend} className="p-6 space-y-4">
                                    {/* Error banner */}
                                    {result === 'error' && (
                                        <div className="flex items-start gap-2.5 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl">
                                            <FiAlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-semibold text-red-700 dark:text-red-400">Failed to send email</p>
                                                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{errMsg}</p>
                                                <p className="text-xs text-red-500 mt-1">Make sure <code className="bg-red-100 dark:bg-red-900/30 px-1 rounded">template_invoice</code> exists in your EmailJS dashboard.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* To email */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                                            Send To <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            value={toEmail}
                                            onChange={e => setToEmail(e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                            placeholder="client@example.com"
                                        />
                                        {!invoiceData.client_email && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                                                <FiAlertCircle size={11} /> No email saved for this client. You can enter one above.
                                            </p>
                                        )}
                                    </div>

                                    {/* Line items preview */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Invoice Items</label>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-1 text-xs">
                                            {(invoiceData.items || []).map((it, i) => (
                                                <div key={i} className="flex justify-between text-gray-600 dark:text-gray-400">
                                                    <span className="truncate mr-2">{it.description} × {it.quantity}</span>
                                                    <span className="font-medium flex-shrink-0">{fmt(Number(it.quantity) * Number(it.unit_price))}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-1 mt-1">
                                                <span>Total (inc. {invoiceData.vat_rate}% VAT)</span>
                                                <span className="text-primary-600 dark:text-primary-400">{fmt(invoiceData.total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Email Message</label>
                                        <textarea
                                            rows={6}
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none font-mono text-xs"
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-1">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={sending || !toEmail.trim()}
                                            className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-glow-blue disabled:opacity-60"
                                        >
                                            {sending ? (
                                                <><FiRefreshCw size={14} className="animate-spin" /> Sending…</>
                                            ) : (
                                                <><FiSend size={14} /> Send Invoice</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

/* ─── Invoice Form Drawer ────────────────────────────────────── */

const InvoiceDrawer = ({ open, onClose, invoice, clients, onSaved, onSendEmail }) => {
    const [form, setForm]         = useState(EMPTY_FORM);
    const [saving, setSaving]     = useState(false);
    const [showPrev, setShowPrev] = useState(false);
    const [dlLoading, setDlLoading] = useState(false);
    const previewRef = useRef(null);

    useEffect(() => {
        if (invoice) {
            setForm({
                ...invoice,
                items: invoice.items?.length ? invoice.items : [{ ...EMPTY_ITEM }],
            });
        } else {
            setForm({ ...EMPTY_FORM, items: [{ ...EMPTY_ITEM }] });
        }
    }, [invoice, open]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const setItem = (i, k, v) =>
        setForm(f => {
            const items = [...f.items];
            items[i] = { ...items[i], [k]: v };
            return { ...f, items };
        });

    const addItem    = () => setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));
    const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

    const subtotal = form.items.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.unit_price || 0), 0);
    const vatAmt   = +(subtotal * (Number(form.vat_rate) / 100)).toFixed(2);
    const total    = +(subtotal + vatAmt).toFixed(2);

    const handleSave = async (statusOverride) => {
        setSaving(true);
        try {
            let savedId   = invoice?.id;
            let savedNum  = invoice?.invoice_number;

            if (invoice?.id) {
                await adminAPI.updateInvoice(invoice.id, { ...form, status: statusOverride || form.status });
            } else {
                const res = await adminAPI.createInvoice({ ...form, status: 'draft' });
                savedId  = res.id;
                savedNum = res.invoice_number;
            }

            if (statusOverride === 'sent' && onSendEmail) {
                /* Pass full invoice data to the email modal */
                const client = clients.find(c => String(c.id) === String(form.client_id));
                onSendEmail({
                    id:             savedId,
                    invoice_number: savedNum,
                    client_name:    client?.name  || '',
                    client_email:   client?.email || '',
                    issue_date:     form.issue_date,
                    due_date:       form.due_date,
                    items:          form.items,
                    subtotal,
                    vat_rate:       form.vat_rate,
                    vat_amount:     vatAmt,
                    total,
                    notes:          form.notes,
                });
                onSaved();
                onClose();
            } else {
                onSaved();
                onClose();
            }
        } catch (e) {
            alert('Error: ' + e.message);
        } finally {
            setSaving(false);
        }
    };

    const downloadPDF = async () => {
        if (!previewRef.current) return;
        setDlLoading(true);
        try {
            const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true });
            const link   = document.createElement('a');
            link.download = `${form.invoice_number || 'invoice'}.png`;
            link.href     = canvas.toDataURL('image/png');
            link.click();
        } finally {
            setDlLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700"
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">
                                {invoice ? `Edit ${invoice.invoice_number}` : 'New Invoice'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowPrev(p => !p)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FiPrinter size={13} /> Preview
                                </button>
                                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                                    <FiX size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">

                            {/* Preview pane */}
                            <AnimatePresence>
                                {showPrev && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 mb-2">
                                            <InvoicePreview
                                                ref={previewRef}
                                                form={{ ...form, invoice_number: invoice?.invoice_number || 'DRAFT' }}
                                                clients={clients}
                                            />
                                        </div>
                                        <button
                                            onClick={downloadPDF}
                                            disabled={dlLoading}
                                            className="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                                        >
                                            <FiDownload size={13} />
                                            {dlLoading ? 'Generating…' : 'Download PNG'}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Client */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Client *</label>
                                <select
                                    value={form.client_id}
                                    onChange={e => set('client_id', e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                                >
                                    <option value="">— Select client —</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Issue Date</label>
                                    <input type="date" value={form.issue_date} onChange={e => set('issue_date', e.target.value)}
                                        className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Due Date *</label>
                                    <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)}
                                        className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white" />
                                </div>
                            </div>

                            {/* Line Items */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Line Items</label>
                                    <button onClick={addItem} className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline">
                                        <FiPlus size={12} /> Add item
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {/* Header row */}
                                    <div className="grid grid-cols-12 gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide px-1">
                                        <span className="col-span-5">Description</span>
                                        <span className="col-span-2 text-right">Qty</span>
                                        <span className="col-span-3 text-right">Unit Price</span>
                                        <span className="col-span-1 text-right">Amt</span>
                                        <span className="col-span-1" />
                                    </div>

                                    {form.items.map((it, i) => {
                                        const amt = Number(it.quantity || 0) * Number(it.unit_price || 0);
                                        return (
                                            <div key={i} className="grid grid-cols-12 gap-1.5 items-center">
                                                <input
                                                    className="col-span-5 px-2.5 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                                                    placeholder="Description…"
                                                    value={it.description}
                                                    onChange={e => setItem(i, 'description', e.target.value)}
                                                />
                                                <input
                                                    type="number" min="0" step="0.5"
                                                    className="col-span-2 px-2 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-right text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                                                    value={it.quantity}
                                                    onChange={e => setItem(i, 'quantity', e.target.value)}
                                                />
                                                <input
                                                    type="number" min="0" step="0.01"
                                                    className="col-span-3 px-2 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-right text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                                                    placeholder="0.00"
                                                    value={it.unit_price}
                                                    onChange={e => setItem(i, 'unit_price', e.target.value)}
                                                />
                                                <span className="col-span-1 text-xs text-right text-gray-600 dark:text-gray-400 font-medium">
                                                    {fmt(amt)}
                                                </span>
                                                <button
                                                    onClick={() => removeItem(i)}
                                                    disabled={form.items.length === 1}
                                                    className="col-span-1 flex justify-center text-gray-300 hover:text-red-500 disabled:opacity-30 transition-colors"
                                                >
                                                    <FiX size={14} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Totals summary */}
                                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-1 text-sm">
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                        <span>Subtotal</span><span>{fmt(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 dark:text-gray-400 items-center">
                                        <span>VAT</span>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={form.vat_rate}
                                                onChange={e => set('vat_rate', Number(e.target.value))}
                                                className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-1.5 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                            >
                                                {VAT_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                                            </select>
                                            <span>{fmt(vatAmt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600 pt-1 mt-1">
                                        <span>Total</span><span className="text-primary-600 dark:text-primary-400">{fmt(total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Notes (optional)</label>
                                <textarea
                                    rows={3}
                                    value={form.notes || ''}
                                    onChange={e => set('notes', e.target.value)}
                                    placeholder="Payment instructions, bank details, etc."
                                    className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 resize-none text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Recurring */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.recurring}
                                        onChange={e => set('recurring', e.target.checked)}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Recurring billing</span>
                                </label>
                                {form.recurring && (
                                    <select
                                        value={form.recurring_interval || ''}
                                        onChange={e => set('recurring_interval', e.target.value)}
                                        className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        {RECURRING_OPTS.filter(o => o.value).map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
                            <button
                                onClick={() => handleSave('draft')}
                                disabled={saving}
                                className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
                            >
                                Save Draft
                            </button>
                            <button
                                onClick={() => handleSave('sent')}
                                disabled={saving || !form.client_id || !form.due_date}
                                className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-glow-blue disabled:opacity-60"
                            >
                                <FiSend size={14} />
                                {saving ? 'Saving…' : 'Save & Send'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

/* ─── Delete Confirm Modal ────────────────────────────────────── */

const DeleteModal = ({ invoice, onConfirm, onCancel }) => (
    <AnimatePresence>
        {invoice && (
            <>
                <motion.div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} />
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                >
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiTrash2 size={22} className="text-red-500" />
                        </div>
                        <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">Delete Invoice</h3>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Delete <span className="font-semibold text-gray-900 dark:text-white">{invoice.invoice_number}</span>? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                            <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors">Delete</button>
                        </div>
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

/* ─── Main Invoices Page ─────────────────────────────────────── */

const Invoices = () => {
    const [invoices, setInvoices]     = useState([]);
    const [clients,  setClients]      = useState([]);
    const [summary,  setSummary]      = useState({ all: 0, draft: 0, sent: 0, paid: 0, overdue: 0 });
    const [tab,      setTab]          = useState('all');
    const [search,   setSearch]       = useState('');
    const [loading,  setLoading]      = useState(true);
    const [drawerOpen, setDrawer]     = useState(false);
    const [editing,  setEditing]      = useState(null);
    const [deleting, setDeleting]     = useState(null);
    const [toastMsg, setToast]        = useState('');
    const [sendModal,  setSendModal]  = useState(false);
    const [sendingInv, setSendingInv] = useState(null);

    const toast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [invData, clientData] = await Promise.all([
                adminAPI.getInvoices({ status: tab }),
                adminAPI.getClients(),
            ]);
            setInvoices(invData.invoices || []);
            setSummary(invData.summary  || {});
            setClients(clientData.clients || clientData || []);
        } catch (e) {
            console.error(e);
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    }, [tab]);

    useEffect(() => { load(); }, [load]);

    const openNew  = () => { setEditing(null); setDrawer(true); };
    const openEdit = async (inv) => {
        try {
            const full = await adminAPI.getInvoice(inv.id);
            setEditing(full);
            setDrawer(true);
        } catch { setEditing(inv); setDrawer(true); }
    };

    /* Open email modal directly from table row */
    const openSendEmail = async (inv) => {
        try {
            const full    = await adminAPI.getInvoice(inv.id);
            const client  = clients.find(c => String(c.id) === String(full.client_id));
            const items   = full.items || [];
            const subtotal = items.reduce((s, it) => s + Number(it.quantity) * Number(it.unit_price), 0);
            const vatAmt  = +(subtotal * ((full.vat_rate || 20) / 100)).toFixed(2);
            setSendingInv({
                id:             full.id,
                invoice_number: full.invoice_number,
                client_name:    client?.name  || full.client_name || '',
                client_email:   client?.email || full.client_email || '',
                issue_date:     full.issue_date,
                due_date:       full.due_date,
                items,
                subtotal:       +subtotal.toFixed(2),
                vat_rate:       full.vat_rate || 20,
                vat_amount:     vatAmt,
                total:          full.total,
                notes:          full.notes,
            });
            setSendModal(true);
        } catch (e) {
            toast('Could not load invoice: ' + e.message);
        }
    };

    const handleDelete = async () => {
        if (!deleting) return;
        await adminAPI.deleteInvoice(deleting.id);
        setDeleting(null);
        toast('Invoice deleted.');
        load();
    };

    const markPaid = async (inv) => {
        await adminAPI.markPaid(inv.id);
        toast(`${inv.invoice_number} marked as paid ✓`);
        load();
    };

    const filtered = invoices.filter(inv =>
        !search ||
        inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
        inv.client_name?.toLowerCase().includes(search.toLowerCase())
    );

    const TAB_LABELS = { all: 'All', draft: 'Draft', sent: 'Sent', paid: 'Paid', overdue: 'Overdue' };
    const TAB_COLORS = { all: 'text-gray-700', draft: 'text-gray-500', sent: 'text-blue-600', paid: 'text-emerald-600', overdue: 'text-red-600' };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Top bar */}
                <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="pl-10 md:pl-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">Invoices</h1>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Manage billing & track payments</p>
                    </div>
                    <button
                        onClick={openNew}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-glow-blue"
                    >
                        <FiPlus size={15} /> New Invoice
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-4 flex-1">
                    {/* Summary cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { key: 'sent',    label: 'Awaiting Payment', color: 'text-blue-600   dark:text-blue-400',    bg: 'bg-blue-50   dark:bg-blue-900/10'   },
                            { key: 'overdue', label: 'Overdue',          color: 'text-red-600    dark:text-red-400',     bg: 'bg-red-50    dark:bg-red-900/10'    },
                            { key: 'paid',    label: 'Paid',             color: 'text-emerald-600 dark:text-emerald-400',bg: 'bg-emerald-50 dark:bg-emerald-900/10'},
                            { key: 'draft',   label: 'Drafts',           color: 'text-gray-600   dark:text-gray-400',    bg: 'bg-gray-100  dark:bg-gray-800'      },
                        ].map(s => (
                            <motion.div
                                key={s.key}
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                className={`${s.bg} rounded-xl p-4 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all`}
                                onClick={() => setTab(s.key)}
                            >
                                <p className={`text-2xl font-bold ${s.color}`}>{summary[s.key] || 0}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Filter bar */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        {/* Tabs */}
                        <div className="flex gap-1 flex-wrap">
                            {TABS.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                        tab === t
                                            ? 'bg-primary-600 text-white shadow-glow-blue'
                                            : `${TAB_COLORS[t] || 'text-gray-500'} hover:bg-gray-100 dark:hover:bg-gray-800`
                                    }`}
                                >
                                    {TAB_LABELS[t]}
                                    {summary[t] > 0 && (
                                        <span className={`ml-1.5 ${tab === t ? 'text-primary-200' : 'text-gray-400'}`}>
                                            {summary[t]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative ml-auto w-full sm:w-56">
                            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search invoices…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <FiRefreshCw size={20} className="animate-spin text-primary-500 mr-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">Loading invoices…</span>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                                <FiFileText size={36} className="text-gray-300 dark:text-gray-600 mb-3" />
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No invoices found</p>
                                <button onClick={openNew} className="mt-4 text-xs text-primary-600 dark:text-primary-400 hover:underline">
                                    + Create your first invoice
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                                            {['#', 'Client', 'Amount', 'Issue Date', 'Due Date', 'Status', 'Actions'].map(h => (
                                                <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {filtered.map(inv => (
                                            <motion.tr
                                                key={inv.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                            >
                                                <td className="px-5 py-3.5 font-mono text-xs text-primary-600 dark:text-primary-400 font-medium">
                                                    {inv.invoice_number}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <p className="font-medium text-gray-900 dark:text-white">{inv.client_name || '—'}</p>
                                                    {inv.client_email && <p className="text-xs text-gray-400">{inv.client_email}</p>}
                                                </td>
                                                <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-white">{fmt(inv.total)}</td>
                                                <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">{fmtDate(inv.issue_date)}</td>
                                                <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">{fmtDate(inv.due_date)}</td>
                                                <td className="px-5 py-3.5"><StatusBadge s={inv.status} /></td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => openEdit(inv)}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FiEdit2 size={14} />
                                                        </button>
                                                        {inv.status !== 'paid' && (
                                                            <button
                                                                onClick={() => openSendEmail(inv)}
                                                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                                title="Send invoice by email"
                                                            >
                                                                <FiMail size={14} />
                                                            </button>
                                                        )}
                                                        {inv.status !== 'paid' && (
                                                            <button
                                                                onClick={() => markPaid(inv)}
                                                                className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                                                title="Mark as paid"
                                                            >
                                                                <FiCheckCircle size={14} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setDeleting(inv)}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
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

            {/* Toast */}
            <AnimatePresence>
                {toastMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2"
                    >
                        <FiCheckCircle size={14} className="text-emerald-400" /> {toastMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Drawer */}
            <InvoiceDrawer
                open={drawerOpen}
                onClose={() => setDrawer(false)}
                invoice={editing}
                clients={clients}
                onSaved={() => { load(); toast(editing ? 'Invoice updated.' : 'Invoice created.'); }}
                onSendEmail={(invData) => { setSendingInv(invData); setSendModal(true); }}
            />

            {/* Delete confirm */}
            <DeleteModal invoice={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />

            {/* Send Invoice Email Modal */}
            <SendInvoiceModal
                open={sendModal}
                invoiceData={sendingInv}
                onClose={() => { setSendModal(false); setSendingInv(null); }}
                onSent={(email) => {
                    setSendModal(false);
                    setSendingInv(null);
                    load();
                    toast(`Invoice emailed to ${email} ✓`);
                }}
            />
        </div>
    );
};

export default Invoices;









