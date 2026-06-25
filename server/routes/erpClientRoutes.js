import express from 'express';
import { sql } from '@vercel/postgres';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/* GET /api/erp/clients */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { search } = req.query;
        const rows = search
            ? await sql`SELECT * FROM erp_clients WHERE name ILIKE ${'%' + search + '%'} OR email ILIKE ${'%' + search + '%'} OR company ILIKE ${'%' + search + '%'} ORDER BY name`
            : await sql`SELECT * FROM erp_clients ORDER BY name`;

        const totals = await sql`
            SELECT c.id,
                   COUNT(DISTINCT i.id)                       AS invoice_count,
                   COALESCE(SUM(i.total) FILTER (WHERE i.status='paid'), 0)  AS total_paid,
                   COALESCE(SUM(i.total) FILTER (WHERE i.status IN ('sent','overdue')), 0) AS total_outstanding
            FROM erp_clients c
            LEFT JOIN erp_invoices i ON i.client_id = c.id
            GROUP BY c.id
        `;
        const totalsMap = Object.fromEntries(totals.rows.map(r => [r.id, r]));

        res.json({
            clients: rows.rows.map(c => ({ ...c, ...(totalsMap[c.id] || {}) })),
        });
    } catch (err) {
        console.error('GET clients:', err);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
});

/* GET /api/erp/clients/:id */
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const client = await sql`SELECT * FROM erp_clients WHERE id = ${req.params.id}`;
        if (!client.rows.length) return res.status(404).json({ error: 'Client not found' });
        const invoices = await sql`
            SELECT id, invoice_number, total, status, due_date
            FROM erp_invoices WHERE client_id = ${req.params.id}
            ORDER BY created_at DESC LIMIT 10
        `;
        res.json({ ...client.rows[0], invoices: invoices.rows });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch client' });
    }
});

/* POST /api/erp/clients */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, email, company, phone, address, vat_number, currency = 'GBP' } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const result = await sql`
            INSERT INTO erp_clients (name, email, company, phone, address, vat_number, currency)
            VALUES (${name}, ${email || null}, ${company || null}, ${phone || null},
                    ${address || null}, ${vat_number || null}, ${currency})
            RETURNING id
        `;
        res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create client' });
    }
});

/* PUT /api/erp/clients/:id */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { name, email, company, phone, address, vat_number, currency } = req.body;
        await sql`
            UPDATE erp_clients SET
                name = ${name}, email = ${email || null}, company = ${company || null},
                phone = ${phone || null}, address = ${address || null},
                vat_number = ${vat_number || null}, currency = ${currency || 'GBP'}
            WHERE id = ${req.params.id}
        `;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update client' });
    }
});

/* DELETE /api/erp/clients/:id */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await sql`DELETE FROM erp_clients WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete client' });
    }
});

export default router;

