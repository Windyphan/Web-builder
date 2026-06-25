const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const headers = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handle = async (res) => {
    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return res.json();
};

const get  = (path, params = {}) => {
    const qs = Object.keys(params).length ? '?' + new URLSearchParams(params) : '';
    return fetch(`${BASE}${path}${qs}`, { headers: headers() }).then(handle);
};
const post = (path, body) =>
    fetch(`${BASE}${path}`, { method: 'POST',   headers: headers(), body: JSON.stringify(body) }).then(handle);
const put  = (path, body) =>
    fetch(`${BASE}${path}`, { method: 'PUT',    headers: headers(), body: JSON.stringify(body) }).then(handle);
const del  = (path)       =>
    fetch(`${BASE}${path}`, { method: 'DELETE', headers: headers() }).then(handle);

const adminAPI = {
    /* ── Auth ──────────────────────────────────────────────────── */
    login: async (email, password) => {
        const data = await post('/auth/login', { email, password });
        if (data.token) localStorage.setItem('authToken', data.token);
        return data;
    },
    logout: () => localStorage.removeItem('authToken'),
    verifyToken: () => get('/auth/verify'),

    /* ── Dashboard ─────────────────────────────────────────────── */
    getDashboard: () => get('/erp/dashboard'),

    /* ── Clients ───────────────────────────────────────────────── */
    getClients:    (params)    => get('/erp/clients', params),
    getClient:     (id)        => get(`/erp/clients/${id}`),
    createClient:  (body)      => post('/erp/clients', body),
    updateClient:  (id, body)  => put(`/erp/clients/${id}`, body),
    deleteClient:  (id)        => del(`/erp/clients/${id}`),

    /* ── Invoices ──────────────────────────────────────────────── */
    getInvoices:   (params)    => get('/erp/invoices', params),
    getInvoice:    (id)        => get(`/erp/invoices/${id}`),
    createInvoice: (body)      => post('/erp/invoices', body),
    updateInvoice: (id, body)  => put(`/erp/invoices/${id}`, body),
    deleteInvoice: (id)        => del(`/erp/invoices/${id}`),
    sendInvoice:   (id)        => post(`/erp/invoices/${id}/send`, {}),
    markPaid:      (id)        => put(`/erp/invoices/${id}/paid`, {}),

    /* ── Expenses ──────────────────────────────────────────────── */
    getExpenses:   (params)    => get('/erp/expenses', params),
    createExpense: (body)      => post('/erp/expenses', body),
    updateExpense: (id, body)  => put(`/erp/expenses/${id}`, body),
    deleteExpense: (id)        => del(`/erp/expenses/${id}`),

    /* ── Time Entries ──────────────────────────────────────────── */
    getTimeEntries:   (params)   => get('/erp/time', params),
    createTimeEntry:  (body)     => post('/erp/time', body),
    updateTimeEntry:  (id, body) => put(`/erp/time/${id}`, body),
    deleteTimeEntry:  (id)       => del(`/erp/time/${id}`),
    billTimeEntries:  (ids)      => post('/erp/time/bill', { ids }),   // pull into invoice

    /* ── Projects ──────────────────────────────────────────────── */
    getProjects:   (params)    => get('/erp/projects', params),
    getProject:    (id)        => get(`/erp/projects/${id}`),
    createProject: (body)      => post('/erp/projects', body),
    updateProject: (id, body)  => put(`/erp/projects/${id}`, body),
    deleteProject: (id)        => del(`/erp/projects/${id}`),

    /* ── Payroll ───────────────────────────────────────────────── */
    getPayroll:    (params)    => get('/erp/payroll', params),
    createPayroll: (body)      => post('/erp/payroll', body),
    updatePayroll: (id, body)  => put(`/erp/payroll/${id}`, body),
    deletePayroll: (id)        => del(`/erp/payroll/${id}`),

    /* ── Reports ───────────────────────────────────────────────── */
    getPnL:          (params)  => get('/erp/reports/pnl',           params),
    getVAT:          (params)  => get('/erp/reports/vat',           params),
    getBalanceSheet: (params)  => get('/erp/reports/balance-sheet', params),
};

export default adminAPI;

