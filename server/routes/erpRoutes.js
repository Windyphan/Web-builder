import express from 'express';
import erpDashboardRoute from './erpDashboardRoute.js';
import erpInvoiceRoutes  from './erpInvoiceRoutes.js';
import erpClientRoutes   from './erpClientRoutes.js';
import erpExpenseRoutes  from './erpExpenseRoutes.js';
import erpTimeRoutes     from './erpTimeRoutes.js';
import erpProjectRoutes  from './erpProjectRoutes.js';
import erpPayrollRoutes  from './erpPayrollRoutes.js';
import erpReportRoutes   from './erpReportRoutes.js';

const router = express.Router();

router.use('/',          erpDashboardRoute);
router.use('/invoices',  erpInvoiceRoutes);
router.use('/clients',   erpClientRoutes);
router.use('/expenses',  erpExpenseRoutes);
router.use('/time',      erpTimeRoutes);
router.use('/projects',  erpProjectRoutes);
router.use('/payroll',   erpPayrollRoutes);
router.use('/reports',   erpReportRoutes);

export default router;
