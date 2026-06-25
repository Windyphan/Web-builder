import express from 'express';
import { sql } from '@vercel/postgres';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/* ──────────────────────────────────────────────────────────────
   GET /api/erp/dashboard
   Returns KPIs, chart data, recent invoices, upcoming due dates,
   and recent activity.
────────────────────────────────────────────────────────────── */
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const now      = new Date();
        const year     = now.getFullYear();
        const month    = String(now.getMonth() + 1).padStart(2, '0');
        const thisMonth = `${year}-${month}`;

        const prevDate  = new Date(year, now.getMonth() - 1, 1);
        const lastMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

        /* ── KPIs ── */
        const [revYear, revThis, revLast] = await Promise.all([
            sql`SELECT COALESCE(SUM(total),0) AS val FROM erp_invoices WHERE status='paid' AND TO_CHAR(issue_date,'YYYY')=${String(year)}`,
            sql`SELECT COALESCE(SUM(total),0) AS val FROM erp_invoices WHERE status='paid' AND TO_CHAR(issue_date,'YYYY-MM')=${thisMonth}`,
            sql`SELECT COALESCE(SUM(total),0) AS val FROM erp_invoices WHERE status='paid' AND TO_CHAR(issue_date,'YYYY-MM')=${lastMonth}`,
        ]);

        const [unpaid] = await Promise.all([
            sql`SELECT COALESCE(SUM(total),0) AS val, COUNT(*) AS cnt FROM erp_invoices WHERE status IN ('sent','overdue')`,
        ]);

        const [expYear, expThis, expLast] = await Promise.all([
            sql`SELECT COALESCE(SUM(amount),0) AS val FROM erp_expenses WHERE TO_CHAR(date,'YYYY')=${String(year)}`,
            sql`SELECT COALESCE(SUM(amount),0) AS val FROM erp_expenses WHERE TO_CHAR(date,'YYYY-MM')=${thisMonth}`,
            sql`SELECT COALESCE(SUM(amount),0) AS val FROM erp_expenses WHERE TO_CHAR(date,'YYYY-MM')=${lastMonth}`,
        ]);

        const totalRevenue  = Number(revYear.rows[0].val);
        const totalExpenses = Number(expYear.rows[0].val);
        const unpaidTotal   = Number(unpaid.rows[0].val);
        const unpaidCount   = Number(unpaid.rows[0].cnt);
        const netProfit     = totalRevenue - totalExpenses;

        const revThisN  = Number(revThis.rows[0].val);
        const revLastN  = Number(revLast.rows[0].val);
        const expThisN  = Number(expThis.rows[0].val);
        const expLastN  = Number(expLast.rows[0].val);

        const revenueChange  = revLastN  > 0 ? +((revThisN  - revLastN)  / revLastN  * 100).toFixed(1) : 0;
        const expensesChange = expLastN  > 0 ? +((expThisN  - expLastN)  / expLastN  * 100).toFixed(1) : 0;

        /* ── Chart: last 6 months ── */
        const chartData = [];
        for (let m = 5; m >= 0; m--) {
            const d   = new Date(year, now.getMonth() - m, 1);
            const mon = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const lbl = d.toLocaleDateString('en-GB', { month: 'short' });

            const [rv, ex] = await Promise.all([
                sql`SELECT COALESCE(SUM(total),0) AS val FROM erp_invoices WHERE status='paid' AND TO_CHAR(issue_date,'YYYY-MM')=${mon}`,
                sql`SELECT COALESCE(SUM(amount),0) AS val FROM erp_expenses WHERE TO_CHAR(date,'YYYY-MM')=${mon}`,
            ]);
            chartData.push({ month: lbl, revenue: Number(rv.rows[0].val), expenses: Number(ex.rows[0].val) });
        }

        /* ── Recent invoices (last 5) ── */
        const recentRes = await sql`
            SELECT i.id, i.invoice_number, c.name AS client_name,
                   i.total, i.status, i.due_date
            FROM   erp_invoices i
            LEFT JOIN erp_clients c ON c.id = i.client_id
            ORDER  BY i.created_at DESC
            LIMIT  5
        `;

        /* ── Due in next 7 days ── */
        const dueRes = await sql`
            SELECT i.id, c.name AS client_name, i.total,
                   i.due_date,
                   (i.due_date::date - CURRENT_DATE) AS days_left
            FROM   erp_invoices i
            LEFT JOIN erp_clients c ON c.id = i.client_id
            WHERE  i.status = 'sent'
              AND  i.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
            ORDER  BY i.due_date ASC
        `;

        /* ── Recent activity (invoices + expenses combined) ── */
        const actRes = await sql`
            SELECT 'invoice' AS type,
                   CASE status
                       WHEN 'paid'    THEN 'Invoice ' || invoice_number || ' marked as paid'
                       WHEN 'sent'    THEN 'Invoice ' || invoice_number || ' sent to client'
                       WHEN 'overdue' THEN 'Invoice ' || invoice_number || ' is overdue'
                       ELSE                'Invoice ' || invoice_number || ' created'
                   END AS message,
                   created_at AS ts
            FROM   erp_invoices
            UNION ALL
            SELECT 'expense'  AS type,
                   'Expense £' || ROUND(amount::numeric,2) || ' added — ' || category AS message,
                   created_at AS ts
            FROM   erp_expenses
            ORDER  BY ts DESC
            LIMIT  8
        `;

        const recentActivity = actRes.rows.map(r => ({
            ...r,
            time: new Date(r.ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        }));

        res.json({
            kpis: {
                totalRevenue, unpaidInvoices: unpaidTotal, unpaidCount,
                totalExpenses, netProfit, revenueChange, expensesChange,
            },
            recentInvoices: recentRes.rows,
            chartData,
            upcomingDue:   dueRes.rows,
            recentActivity,
        });
    } catch (err) {
        console.error('ERP dashboard error:', err);
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
});

export default router;

