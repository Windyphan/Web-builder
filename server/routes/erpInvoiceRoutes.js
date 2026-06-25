import express from 'express';
import { sql } from '@vercel/postgres';
import nodemailer from 'nodemailer';
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
        const { to_email, to_name, custom_message } = req.body;

        /* Fetch invoice + items */
        const invRes = await sql`
            SELECT i.*, c.name AS client_name, c.email AS client_email,
                   c.company AS client_company, c.address AS client_address,
                   c.vat_number AS client_vat
            FROM   erp_invoices i
            LEFT JOIN erp_clients c ON c.id = i.client_id
            WHERE  i.id = ${req.params.id}
        `;
        if (!invRes.rows.length) return res.status(404).json({ error: 'Invoice not found' });

        const inv = invRes.rows[0];
        const itemsRes = await sql`
            SELECT * FROM erp_invoice_items WHERE invoice_id = ${req.params.id} ORDER BY id
        `;
        const items = itemsRes.rows;

        const recipientEmail = to_email || inv.client_email;
        if (!recipientEmail) return res.status(400).json({ error: 'No recipient email address provided.' });

        /* Format helpers */
        const fmtGBP  = (v) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(v || 0);
        const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

        /* Build HTML items rows */
        const itemRows = items.map(it => `
            <tr>
                <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;color:#374151;">${it.description}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:center;color:#374151;">${it.quantity}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:right;color:#374151;">${fmtGBP(it.unit_price)}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:600;color:#111827;">${fmtGBP(Number(it.quantity) * Number(it.unit_price))}</td>
            </tr>`).join('');

        const personalNote = custom_message
            ? `<p style="margin:0 0 20px;color:#374151;line-height:1.7;">${custom_message.replace(/\n/g, '<br/>')}</p>`
            : '';

        const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#0284c7,#0ea5e9);padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td><h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">The Innovation Curve</h1>
                  <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">theinnovationcurve.com</p></td>
              <td align="right">
                <p style="margin:0;color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Invoice</p>
                <p style="margin:4px 0 0;color:#fff;font-size:20px;font-weight:700;">${inv.invoice_number}</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Dates bar -->
        <tr><td style="background:#f0f9ff;padding:16px 40px;border-bottom:1px solid #e0f2fe;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#0369a1;font-size:12px;"><strong>Issued:</strong> ${fmtDate(inv.issue_date)}</td>
              <td align="center" style="color:#0369a1;font-size:12px;"><strong>Due:</strong> ${fmtDate(inv.due_date)}</td>
              <td align="right" style="color:#0369a1;font-size:12px;"><strong>Status:</strong> ${inv.status?.toUpperCase()}</td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">

          ${personalNote}

          <!-- Bill To -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="background:#f9fafb;border-radius:8px;padding:16px 20px;">
              <p style="margin:0 0 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Bill To</p>
              <p style="margin:0;font-weight:700;color:#111827;font-size:15px;">${inv.client_name || to_name || '—'}</p>
              ${inv.client_company ? `<p style="margin:2px 0 0;color:#6b7280;font-size:13px;">${inv.client_company}</p>` : ''}
              ${inv.client_address ? `<p style="margin:2px 0 0;color:#6b7280;font-size:13px;white-space:pre-line;">${inv.client_address}</p>` : ''}
              ${inv.client_vat ? `<p style="margin:2px 0 0;color:#6b7280;font-size:13px;">VAT: ${inv.client_vat}</p>` : ''}
            </td></tr>
          </table>

          <!-- Line Items -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
            <thead>
              <tr style="background:#f9fafb;">
                <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;">Description</th>
                <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;">Qty</th>
                <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;">Unit Price</th>
                <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;">Amount</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <!-- Totals -->
          <table cellpadding="0" cellspacing="0" align="right" style="margin-bottom:24px;min-width:220px;">
            <tr><td style="padding:5px 0;color:#6b7280;font-size:13px;">Subtotal</td><td style="padding:5px 0 5px 32px;text-align:right;color:#374151;font-size:13px;">${fmtGBP(inv.subtotal)}</td></tr>
            <tr><td style="padding:5px 0;color:#6b7280;font-size:13px;">VAT (${inv.vat_rate || 20}%)</td><td style="padding:5px 0 5px 32px;text-align:right;color:#374151;font-size:13px;">${fmtGBP(inv.vat_amount)}</td></tr>
            <tr><td colspan="2"><div style="border-top:2px solid #111827;margin:8px 0;"></div></td></tr>
            <tr><td style="font-weight:700;font-size:16px;color:#111827;">Total</td><td style="font-weight:700;font-size:18px;color:#0284c7;text-align:right;padding-left:32px;">${fmtGBP(inv.total)}</td></tr>
          </table>

          ${inv.notes ? `<div style="background:#f0f9ff;border-left:4px solid #0ea5e9;border-radius:4px;padding:12px 16px;margin-bottom:24px;"><p style="margin:0;font-size:11px;font-weight:600;color:#0369a1;text-transform:uppercase;letter-spacing:0.5px;">Notes</p><p style="margin:4px 0 0;font-size:13px;color:#374151;">${inv.notes}</p></div>` : ''}

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">Questions? <a href="mailto:info@theinnovationcurve.com" style="color:#0284c7;text-decoration:none;">info@theinnovationcurve.com</a></p>
          <p style="margin:6px 0 0;color:#d1d5db;font-size:11px;">The Innovation Curve · theinnovationcurve.com</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

        /* Nodemailer transporter */
        const transporter = nodemailer.createTransport({
            host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
            port:   Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from:    `"The Innovation Curve" <${process.env.SMTP_USER}>`,
            to:      recipientEmail,
            subject: `Invoice ${inv.invoice_number} from The Innovation Curve – ${fmtGBP(inv.total)} due ${fmtDate(inv.due_date)}`,
            html:    htmlBody,
        });

        /* Mark invoice as sent */
        await sql`
            UPDATE erp_invoices
            SET    status = 'sent', sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
            WHERE  id = ${req.params.id} AND status != 'paid'
        `;

        res.json({ success: true, message: 'Invoice sent successfully.' });
    } catch (err) {
        console.error('Send invoice email error:', err);
        res.status(500).json({ error: err.message || 'Failed to send invoice email.' });
    }
});

export default router;



