import express from 'express';
import { sql } from '@vercel/postgres';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/* UK PAYE simple calculation helper */
const calcUKPAYE = (grossSalary) => {
    const personalAllowance = 12570;
    const basicRateLimit    = 50270;
    const niLowerLimit      = 12570;
    const niUpperLimit      = 50270;
    const annualGross       = Number(grossSalary) * 12;

    let annualIncomeTax = 0;
    if (annualGross > personalAllowance) {
        const taxable = Math.min(annualGross, basicRateLimit) - personalAllowance;
        annualIncomeTax = taxable * 0.20;
        if (annualGross > basicRateLimit) annualIncomeTax += (annualGross - basicRateLimit) * 0.40;
    }

    let annualNI = 0;
    if (annualGross > niLowerLimit) {
        const niable = Math.min(annualGross, niUpperLimit) - niLowerLimit;
        annualNI = niable * 0.12;
        if (annualGross > niUpperLimit) annualNI += (annualGross - niUpperLimit) * 0.02;
    }

    const monthlyTax = +(annualIncomeTax / 12).toFixed(2);
    const monthlyNI  = +(annualNI / 12).toFixed(2);
    const pension    = +(Number(grossSalary) * 0.05).toFixed(2); // 5% auto-enrolment
    const netPay     = +(Number(grossSalary) - monthlyTax - monthlyNI - pension).toFixed(2);
    return { income_tax: monthlyTax, national_insurance: monthlyNI, pension, net_pay: netPay };
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        const rows = await sql`SELECT * FROM erp_payroll ORDER BY created_at DESC LIMIT 100`;
        const totals = await sql`SELECT COALESCE(SUM(gross_salary),0) AS gross, COALESCE(SUM(net_pay),0) AS net FROM erp_payroll WHERE status='paid'`;
        res.json({ payroll: rows.rows, totals: totals.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch payroll' });
    }
});

/* POST with auto PAYE calc */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { employee_name, role, gross_salary, pay_period = 'monthly', payment_date, status = 'pending' } = req.body;
        if (!employee_name || !gross_salary) return res.status(400).json({ error: 'employee_name and gross_salary required' });
        const { income_tax, national_insurance, pension, net_pay } = calcUKPAYE(gross_salary);
        const result = await sql`
            INSERT INTO erp_payroll (employee_name, role, gross_salary, national_insurance, income_tax, pension, net_pay, pay_period, payment_date, status)
            VALUES (${employee_name}, ${role||null}, ${gross_salary}, ${national_insurance}, ${income_tax}, ${pension}, ${net_pay}, ${pay_period}, ${payment_date||null}, ${status})
            RETURNING id
        `;
        res.status(201).json({ success: true, id: result.rows[0].id, calc: { income_tax, national_insurance, pension, net_pay } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create payroll' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { employee_name, role, gross_salary, pay_period, payment_date, status } = req.body;
        const { income_tax, national_insurance, pension, net_pay } = calcUKPAYE(gross_salary);
        await sql`UPDATE erp_payroll SET employee_name=${employee_name}, role=${role||null}, gross_salary=${gross_salary}, national_insurance=${national_insurance}, income_tax=${income_tax}, pension=${pension}, net_pay=${net_pay}, pay_period=${pay_period||'monthly'}, payment_date=${payment_date||null}, status=${status||'pending'} WHERE id=${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update payroll' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await sql`DELETE FROM erp_payroll WHERE id=${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete payroll record' });
    }
});

export default router;

