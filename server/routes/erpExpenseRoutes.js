import express from 'express';
import { sql } from '@vercel/postgres';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const CATEGORIES = ['Software','Marketing','Travel','Office','Hardware','Utilities','Professional Services','Meals','Other'];

/* GET /api/erp/expenses */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { month, category, limit = 100, offset = 0 } = req.query;
        let rows;
        if (month && category) {
            rows = await sql`SELECT e.*, c.name AS client_name FROM erp_expenses e LEFT JOIN erp_clients c ON c.id = e.client_id WHERE TO_CHAR(e.date,'YYYY-MM')=${month} AND e.category=${category} ORDER BY e.date DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
        } else if (month) {
            rows = await sql`SELECT e.*, c.name AS client_name FROM erp_expenses e LEFT JOIN erp_clients c ON c.id = e.client_id WHERE TO_CHAR(e.date,'YYYY-MM')=${month} ORDER BY e.date DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
        } else if (category) {
            rows = await sql`SELECT e.*, c.name AS client_name FROM erp_expenses e LEFT JOIN erp_clients c ON c.id = e.client_id WHERE e.category=${category} ORDER BY e.date DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
        } else {
            rows = await sql`SELECT e.*, c.name AS client_name FROM erp_expenses e LEFT JOIN erp_clients c ON c.id = e.client_id ORDER BY e.date DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
        }

        const summary = await sql`
            SELECT category, COALESCE(SUM(amount),0) AS total, COUNT(*) AS count
            FROM erp_expenses GROUP BY category ORDER BY total DESC
        `;
        const totalRow = await sql`SELECT COALESCE(SUM(amount),0) AS total FROM erp_expenses`;

        res.json({ expenses: rows.rows, summary: summary.rows, total: Number(totalRow.rows[0].total), categories: CATEGORIES });
    } catch (err) {
        console.error('GET expenses:', err);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

/* POST /api/erp/expenses */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { category, description, amount, currency = 'GBP', vat_amount = 0, date, receipt_url, vendor, billable = false, client_id } = req.body;
        if (!amount || !category) return res.status(400).json({ error: 'amount and category are required' });
        const result = await sql`
            INSERT INTO erp_expenses (category, description, amount, currency, vat_amount, date, receipt_url, vendor, billable, client_id)
            VALUES (${category}, ${description || null}, ${amount}, ${currency}, ${vat_amount}, ${date || new Date().toISOString().split('T')[0]}, ${receipt_url || null}, ${vendor || null}, ${billable}, ${client_id || null})
            RETURNING id
        `;
        res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create expense' });
    }
});

/* PUT /api/erp/expenses/:id */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { category, description, amount, currency, vat_amount, date, receipt_url, vendor, billable, client_id } = req.body;
        await sql`UPDATE erp_expenses SET category=${category}, description=${description||null}, amount=${amount}, currency=${currency||'GBP'}, vat_amount=${vat_amount||0}, date=${date}, receipt_url=${receipt_url||null}, vendor=${vendor||null}, billable=${billable||false}, client_id=${client_id||null} WHERE id=${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update expense' });
    }
});

/* DELETE /api/erp/expenses/:id */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await sql`DELETE FROM erp_expenses WHERE id=${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

export default router;

