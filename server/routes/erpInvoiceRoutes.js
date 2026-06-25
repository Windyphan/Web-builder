import express from 'express';
import { sql } from '@vercel/postgres';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/* ── helpers ── */
const pad = (n) => String(n).padStart(2, '0');

/* generate next invoice number: INV-YYYY-NNN */
async function nextInvoiceNumber() {
    const year  = new Date().getFullYear();
    const res   = await sql`
        SELECT COUNT(*) AS cnt
        FROM   erp_invoices
        WHERE  invoice_number LIKE ${'INV-' + year + '-%'}
    `;
    const seq   = Number(res.rows[0].cnt) + 1;
    return `INV-${year}-${String(seq).padStart(3, '0')}`;
}

/* recalculate totals from items array */
function calcTotals(items, vatRate) {
    const subtotal   = items.reduce((s, it) => s + Number(it.quantity) * Number(it.unit_price), 0);
    const vat_amount = +(subtotal * (vatRate / 100)).toFixed(2);
    const total      = +(subtotal + vat_amount).toFixed(2);
    return { subtotal: +subtotal.toFixed(2), vat_amount, total };
}

/* ── GET /api/erp/invoices ─────────────────────────────────── */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { status, client_id, search, limit = 50, offset = 0 } = req.query;

        let rows;
        if (status && status !== 'all') {
            rows = await sql`
                SELECT i.*, c.name AS client_name, c.email AS client_email
                FROM   erp_invoices i
                LEFT JOIN erp_clients c ON c.id = i.client_id
                WHERE  i.status = ${status}
                ORDER  BY i.created_at DESC
                LIMIT  ${Number(limit)} OFFSET ${Number(offset)}
            `;
        } else {
            rows = await sql`
                SELECT i.*, c.name AS client_name, c.email AS client_email
                FROM   erp_invoices i
                LEFT JOIN erp_clients c ON c.id = i.client_id
                ORDER  BY i.created_at DESC
                LIMIT  ${Number(limit)} OFFSET ${Number(offset)}
            `;
        }

        /* counts per status */
        const counts = await sql`
            SELECT status, COUNT(*) AS cnt
            FROM   erp_invoices
            GROUP  BY status
        `;
        const summary = { all: 0, draft: 0, sent: 0, paid: 0, overdue: 0 };
        counts.rows.forEach(r => {
            summary[r.status] = Number(r.cnt);
            summary.all += Number(r.cnt);
        });

        res.json({ invoices: rows.rows, summary });
    } catch (err) {
        console.error('GET invoices error:', err);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

/* ── GET /api/erp/invoices/:id ─────────────────────────────── */
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const inv = await sql`
            SELECT i.*, c.name AS client_name, c.email AS client_email,
                   c.address AS client_address, c.vat_number AS client_vat
            FROM   erp_invoices i
            LEFT JOIN erp_clients c ON c.id = i.client_id
            WHERE  i.id = ${req.params.id}
        `;
        if (!inv.rows.length) return res.status(404).json({ error: 'Invoice not found' });

        const items = await sql`
            SELECT * FROM erp_invoice_items
            WHERE  invoice_id = ${req.params.id}
            ORDER  BY id
        `;

        res.json({ ...inv.rows[0], items: items.rows });
    } catch (err) {
        console.error('GET invoice error:', err);
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
});

/* ── POST /api/erp/invoices ────────────────────────────────── */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            client_id, issue_date, due_date, notes,
            vat_rate = 20, recurring = false, recurring_interval,
            items = [], status = 'draft',
        } = req.body;

        if (!due_date) return res.status(400).json({ error: 'due_date is required' });
        if (!items.length) return res.status(400).json({ error: 'At least one line item is required' });

        const invoice_number = await nextInvoiceNumber();
        const { subtotal, vat_amount, total } = calcTotals(items, vat_rate);

        const invRes = await sql`
            INSERT INTO erp_invoices
                (invoice_number, client_id, status, issue_date, due_date,
                 subtotal, vat_rate, vat_amount, total, notes,
                 recurring, recurring_interval)
            VALUES
                (${invoice_number}, ${client_id || null}, ${status},
                 ${issue_date || new Date().toISOString().split('T')[0]}, ${due_date},
                 ${subtotal}, ${vat_rate}, ${vat_amount}, ${total}, ${notes || null},
                 ${recurring}, ${recurring_interval || null})
            RETURNING id
        `;
        const invoice_id = invRes.rows[0].id;

        for (const it of items) {
            const amount = +(Number(it.quantity) * Number(it.unit_price)).toFixed(2);
            await sql`
                INSERT INTO erp_invoice_items (invoice_id, description, quantity, unit_price, amount)
                VALUES (${invoice_id}, ${it.description}, ${it.quantity}, ${it.unit_price}, ${amount})
            `;
        }

        res.status(201).json({ success: true, id: invoice_id, invoice_number });
    } catch (err) {
        console.error('POST invoice error:', err);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});

/* ── PUT /api/erp/invoices/:id ─────────────────────────────── */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const {
            client_id, issue_date, due_date, notes,
            vat_rate = 20, recurring = false, recurring_interval,
            items = [], status,
        } = req.body;

        const { subtotal, vat_amount, total } = calcTotals(items, vat_rate);

        await sql`
            UPDATE erp_invoices SET
                client_id          = ${client_id || null},
                issue_date         = ${issue_date},
                due_date           = ${due_date},
                subtotal           = ${subtotal},
                vat_rate           = ${vat_rate},
                vat_amount         = ${vat_amount},
                total              = ${total},
                notes              = ${notes || null},
                recurring          = ${recurring},
                recurring_interval = ${recurring_interval || null},
                status             = ${status},
                updated_at         = CURRENT_TIMESTAMP
            WHERE id = ${req.params.id}
        `;

        /* replace items */
        await sql`DELETE FROM erp_invoice_items WHERE invoice_id = ${req.params.id}`;
        for (const it of items) {
            const amount = +(Number(it.quantity) * Number(it.unit_price)).toFixed(2);
            await sql`
                INSERT INTO erp_invoice_items (invoice_id, description, quantity, unit_price, amount)
                VALUES (${req.params.id}, ${it.description}, ${it.quantity}, ${it.unit_price}, ${amount})
            `;
        }

        res.json({ success: true });
    } catch (err) {
        console.error('PUT invoice error:', err);
        res.status(500).json({ error: 'Failed to update invoice' });
    }
});

/* ── DELETE /api/erp/invoices/:id ──────────────────────────── */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await sql`DELETE FROM erp_invoices WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE invoice error:', err);
        res.status(500).json({ error: 'Failed to delete invoice' });
    }
});

/* ── PUT /api/erp/invoices/:id/paid ───────────────────────── */
router.put('/:id/paid', authenticateToken, async (req, res) => {
    try {
        await sql`
            UPDATE erp_invoices
            SET    status = 'paid', paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE  id = ${req.params.id}
        `;
        res.json({ success: true });
    } catch (err) {
        console.error('Mark paid error:', err);
        res.status(500).json({ error: 'Failed to mark invoice as paid' });
    }
});

/* ── POST /api/erp/invoices/:id/send ──────────────────────── */
router.post('/:id/send', authenticateToken, async (req, res) => {
    try {
        await sql`
            UPDATE erp_invoices
            SET    status = 'sent', sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE  id = ${req.params.id} AND status = 'draft'
        `;
        res.json({ success: true, message: 'Invoice marked as sent' });
    } catch (err) {
        console.error('Send invoice error:', err);
        res.status(500).json({ error: 'Failed to send invoice' });
    }
});

export default router;

