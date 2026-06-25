import express from 'express';
import { sql } from '@vercel/postgres';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/* GET /api/erp/reports/pnl?year=2026 */
router.get('/pnl', authenticateToken, async (req, res) => {
    try {
        const year = req.query.year || new Date().getFullYear();
        const monthly = [];
        for (let m = 1; m <= 12; m++) {
            const mon = `${year}-${String(m).padStart(2,'0')}`;
            const lbl = new Date(year, m-1, 1).toLocaleDateString('en-GB', { month: 'short' });
            const [rev, exp] = await Promise.all([
                sql`SELECT COALESCE(SUM(total),0) AS val FROM erp_invoices WHERE status='paid' AND TO_CHAR(issue_date,'YYYY-MM')=${mon}`,
                sql`SELECT COALESCE(SUM(amount),0) AS val FROM erp_expenses WHERE TO_CHAR(date,'YYYY-MM')=${mon}`,
            ]);
            const revenue  = Number(rev.rows[0].val);
            const expenses = Number(exp.rows[0].val);
            monthly.push({ month: lbl, revenue, expenses, profit: revenue - expenses });
        }
        const totRev = monthly.reduce((s,m) => s + m.revenue,  0);
        const totExp = monthly.reduce((s,m) => s + m.expenses, 0);
        res.json({ monthly, totals: { revenue: totRev, expenses: totExp, profit: totRev - totExp } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate P&L' });
    }
});

/* GET /api/erp/reports/vat?year=2026 */
router.get('/vat', authenticateToken, async (req, res) => {
    try {
        const year = req.query.year || new Date().getFullYear();
        const quarters = [];
        for (let q = 1; q <= 4; q++) {
            const months = [(q-1)*3+1, (q-1)*3+2, (q-1)*3+3].map(m => `${year}-${String(m).padStart(2,'0')}`);
            const [outVAT, inVAT] = await Promise.all([
                sql`SELECT COALESCE(SUM(vat_amount),0) AS val FROM erp_invoices WHERE status IN ('paid','sent') AND TO_CHAR(issue_date,'YYYY-MM') = ANY(${months})`,
                sql`SELECT COALESCE(SUM(vat_amount),0) AS val FROM erp_expenses WHERE TO_CHAR(date,'YYYY-MM') = ANY(${months})`,
            ]);
            const outputVAT = Number(outVAT.rows[0].val);
            const inputVAT  = Number(inVAT.rows[0].val);
            quarters.push({ quarter: `Q${q} ${year}`, outputVAT, inputVAT, vatDue: outputVAT - inputVAT });
        }
        res.json({ quarters });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate VAT report' });
    }
});

/* GET /api/erp/reports/balance-sheet */
router.get('/balance-sheet', authenticateToken, async (req, res) => {
    try {
        const [totalPaid, totalUnpaid, totalExpenses] = await Promise.all([
            sql`SELECT COALESCE(SUM(total),0) AS val FROM erp_invoices WHERE status='paid'`,
            sql`SELECT COALESCE(SUM(total),0) AS val FROM erp_invoices WHERE status IN ('sent','overdue')`,
            sql`SELECT COALESCE(SUM(amount),0) AS val FROM erp_expenses`,
        ]);
        const revenue     = Number(totalPaid.rows[0].val);
        const receivables = Number(totalUnpaid.rows[0].val);
        const expenses    = Number(totalExpenses.rows[0].val);
        const netAssets   = revenue + receivables - expenses;
        res.json({ revenue, receivables, expenses, netAssets });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate balance sheet' });
    }
});

export default router;

