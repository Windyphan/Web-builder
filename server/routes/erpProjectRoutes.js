import express from 'express';
import { sql } from '@vercel/postgres';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const { status } = req.query;
        const rows = status
            ? await sql`SELECT p.*, c.name AS client_name, COALESCE(SUM(t.hours),0) AS logged_hours, COALESCE(SUM(t.hours*t.hourly_rate),0) AS logged_value FROM erp_projects p LEFT JOIN erp_clients c ON c.id=p.client_id LEFT JOIN erp_time_entries t ON t.project_id=p.id WHERE p.status=${status} GROUP BY p.id,c.name ORDER BY p.created_at DESC`
            : await sql`SELECT p.*, c.name AS client_name, COALESCE(SUM(t.hours),0) AS logged_hours, COALESCE(SUM(t.hours*t.hourly_rate),0) AS logged_value FROM erp_projects p LEFT JOIN erp_clients c ON c.id=p.client_id LEFT JOIN erp_time_entries t ON t.project_id=p.id GROUP BY p.id,c.name ORDER BY p.created_at DESC`;
        res.json({ projects: rows.rows });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const p = await sql`SELECT p.*, c.name AS client_name FROM erp_projects p LEFT JOIN erp_clients c ON c.id=p.client_id WHERE p.id=${req.params.id}`;
        if (!p.rows.length) return res.status(404).json({ error: 'Not found' });
        const times = await sql`SELECT * FROM erp_time_entries WHERE project_id=${req.params.id} ORDER BY date DESC LIMIT 20`;
        res.json({ ...p.rows[0], time_entries: times.rows });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { client_id, name, description, status = 'active', budget, hourly_rate, deadline } = req.body;
        if (!name) return res.status(400).json({ error: 'name required' });
        const r = await sql`INSERT INTO erp_projects (client_id,name,description,status,budget,hourly_rate,deadline) VALUES (${client_id||null},${name},${description||null},${status},${budget||null},${hourly_rate||null},${deadline||null}) RETURNING id`;
        res.status(201).json({ success: true, id: r.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { client_id, name, description, status, budget, hourly_rate, deadline } = req.body;
        await sql`UPDATE erp_projects SET client_id=${client_id||null},name=${name},description=${description||null},status=${status||'active'},budget=${budget||null},hourly_rate=${hourly_rate||null},deadline=${deadline||null} WHERE id=${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update project' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await sql`DELETE FROM erp_projects WHERE id=${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

export default router;

