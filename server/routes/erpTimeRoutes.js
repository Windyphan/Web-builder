import express from 'express';
import { sql } from '@vercel/postgres';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/* GET /api/erp/time */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { unbilled, client_id, project_id } = req.query;
        let rows;
        if (unbilled === 'true') {
            rows = await sql`SELECT t.*, c.name AS client_name, p.name AS project_name FROM erp_time_entries t LEFT JOIN erp_clients c ON c.id=t.client_id LEFT JOIN erp_projects p ON p.id=t.project_id WHERE t.billable=true AND t.invoiced=false ORDER BY t.date DESC`;
        } else {
            rows = await sql`SELECT t.*, c.name AS client_name, p.name AS project_name FROM erp_time_entries t LEFT JOIN erp_clients c ON c.id=t.client_id LEFT JOIN erp_projects p ON p.id=t.project_id ORDER BY t.date DESC LIMIT 200`;
        }
        const totals = await sql`SELECT COALESCE(SUM(hours),0) AS total_hours, COALESCE(SUM(hours*hourly_rate),0) AS total_value FROM erp_time_entries WHERE billable=true AND invoiced=false`;
        res.json({ entries: rows.rows, unbilledHours: Number(totals.rows[0].total_hours), unbilledValue: Number(totals.rows[0].total_value) });
    } catch (err) {
        console.error('GET time:', err);
        res.status(500).json({ error: 'Failed to fetch time entries' });
    }
});

/* POST /api/erp/time */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { client_id, project_id, description, hours, hourly_rate = 0, billable = true, date } = req.body;
        if (!hours) return res.status(400).json({ error: 'hours is required' });
        const result = await sql`
            INSERT INTO erp_time_entries (client_id, project_id, description, hours, hourly_rate, billable, date)
            VALUES (${client_id||null}, ${project_id||null}, ${description||null}, ${hours}, ${hourly_rate}, ${billable}, ${date||new Date().toISOString().split('T')[0]})
            RETURNING id
        `;
        res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create time entry' });
    }
});

/* PUT /api/erp/time/:id */
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { client_id, project_id, description, hours, hourly_rate, billable, date } = req.body;
        await sql`UPDATE erp_time_entries SET client_id=${client_id||null}, project_id=${project_id||null}, description=${description||null}, hours=${hours}, hourly_rate=${hourly_rate||0}, billable=${billable||false}, date=${date} WHERE id=${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update time entry' });
    }
});

/* DELETE /api/erp/time/:id */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await sql`DELETE FROM erp_time_entries WHERE id=${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete time entry' });
    }
});

/* POST /api/erp/time/bill — mark entries as invoiced */
router.post('/bill', authenticateToken, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids?.length) return res.status(400).json({ error: 'ids required' });
        await sql`UPDATE erp_time_entries SET invoiced=true WHERE id = ANY(${ids})`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to bill entries' });
    }
});

export default router;

