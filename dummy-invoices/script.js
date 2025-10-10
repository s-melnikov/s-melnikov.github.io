const statusEl = document.querySelector('[data-role="status"]');
const rowsEl = document.querySelector('[data-role="invoice-rows"]');
const wrapperEl = document.querySelector('[data-role="invoice-wrapper"]');
const refreshBtn = document.querySelector('[data-role="refresh"]');
const downloadAllBtn = document.querySelector('[data-role="download-all"]');

const state = {
  invoices: [],
  company: {}
};

if (refreshBtn) {
  refreshBtn.addEventListener('click', () => {
    loadInvoices({ force: true });
  });
}

if (downloadAllBtn) {
  downloadAllBtn.addEventListener('click', handleBulkDownload);
}

loadInvoices();

async function loadInvoices({ force = false } = {}) {
  setStatus('Loading invoices…');

  try {
    const response = await fetch('DATA.json', {
      cache: force ? 'reload' : 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to load DATA.json (${response.status})`);
    }

    const payload = await response.json();
    const { company, invoices } = normalizePayload(payload);

    state.company = company;
    state.invoices = invoices;

    if (!state.invoices.length) {
      rowsEl.innerHTML = '';
      setStatus('No invoices found in DATA.json.');
      return;
    }

    renderTable(state.invoices);
    setStatus(`${state.invoices.length} invoice${state.invoices.length > 1 ? 's' : ''} ready.`);
  } catch (error) {
    console.error('[dummy-invoices] Unable to load invoices', error);
    setStatus('Unable to load invoices. Check the console for details.', true);
  }
}

function normalizePayload(payload) {
  let company = {};
  let invoiceCandidates = [];

  if (Array.isArray(payload)) {
    invoiceCandidates = payload;
  } else if (payload && typeof payload === 'object') {
    company = payload.company ?? {};

    if (Array.isArray(payload.invoices)) {
      invoiceCandidates = payload.invoices;
    } else if (payload.invoices && typeof payload.invoices === 'object') {
      const { outgoing = [], incoming = [], other = [] } = payload.invoices;
      invoiceCandidates = [
        ...ensureArray(outgoing),
        ...ensureArray(incoming),
        ...ensureArray(other)
      ];
    } else if (Array.isArray(payload.entries)) {
      invoiceCandidates = payload.entries;
    } else if (Array.isArray(payload.data)) {
      invoiceCandidates = payload.data;
    }
  }

  const normalized = invoiceCandidates
    .map((entry, index) => {
      const raw = entry?.invoice ?? entry;
      return normalizeInvoice(raw, index, company);
    })
    .filter(Boolean);

  return { company, invoices: normalized };
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function renderTable(invoices) {
  rowsEl.innerHTML = '';

  invoices.forEach((invoice) => {
    const tr = document.createElement('tr');

    tr.appendChild(createCell(invoice.id || '—'));
    tr.appendChild(createCell(formatDate(invoice.date)));
    tr.appendChild(createCell(invoice.to?.name || invoice.from?.name || '—'));
    tr.appendChild(createCell(formatCurrency(invoice.totals.total, invoice.currency)));

    const actionsCell = createCell('');
    actionsCell.classList.add('actions-cell');

    const downloadButton = document.createElement('button');
    downloadButton.type = 'button';
    downloadButton.textContent = 'Download PDF';
    downloadButton.addEventListener('click', () => handleDownload(invoice));

    actionsCell.appendChild(downloadButton);
    tr.appendChild(actionsCell);
    rowsEl.appendChild(tr);
  });
}

function createCell(content) {
  const td = document.createElement('td');
  td.textContent = content;
  return td;
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.dataset.state = isError ? 'error' : 'success';
}

function normalizeInvoice(invoice, index, fallbackCompany = {}) {
  if (!invoice || typeof invoice !== 'object') {
    console.warn(`[dummy-invoices] Skipping invoice at index ${index}: invalid structure`);
    return null;
  }

  const items = Array.isArray(invoice.items)
    ? invoice.items.map((item, itemIndex) => normalizeItem(item, itemIndex))
    : [];

  const totals = calculateTotals(items);

  return {
    id: invoice.id ?? `INV-AUTO-${index + 1}`,
    date: invoice.date ?? new Date().toISOString().slice(0, 10),
    dueDate: invoice.dueDate ?? invoice.date ?? new Date().toISOString().slice(0, 10),
    currency: invoice.currency ?? 'EUR',
    from: invoice.from ? { ...invoice.from } : { ...fallbackCompany },
    to: invoice.to ? { ...invoice.to } : { ...fallbackCompany },
    items,
    totals
  };
}

function normalizeItem(item, index) {
  return {
    description: (item && item.description) ? String(item.description) : `Item ${index + 1}`,
    quantity: coerceNumber(item?.quantity, 0),
    unitPrice: coerceNumber(item?.unitPrice, 0),
    taxRate: coerceNumber(item?.taxRate, 0)
  };
}

function coerceNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function calculateTotals(items) {
  return items.reduce((accumulator, item) => {
    const net = item.quantity * item.unitPrice;
    const tax = net * (item.taxRate / 100);
    accumulator.net += net;
    accumulator.tax += tax;
    accumulator.total += net + tax;
    return accumulator;
  }, { net: 0, tax: 0, total: 0 });
}

async function handleDownload(invoice) {
  if (!ensurePdfLibrary()) {
    return;
  }

  const filename = getInvoiceFilename(invoice);

  try {
    setStatus(`Exporting invoice ${invoice.id}…`);
    const blob = await generatePdfBlob(invoice);
    downloadBlob(blob, filename);
    setStatus(`Invoice ${invoice.id} exported.`);
  } catch (error) {
    console.error('[dummy-invoices] Failed to export invoice', error);
    setStatus(`Failed to export invoice ${invoice.id}.`, true);
  }
}

async function handleBulkDownload() {
  if (!state.invoices.length) {
    setStatus('No invoices available for export.', true);
    return;
  }

  if (!ensurePdfLibrary() || !ensureZipLibrary()) {
    return;
  }

  try {
    const zip = new JSZip();
    const total = state.invoices.length;

    for (let index = 0; index < total; index += 1) {
      const invoice = state.invoices[index];
      const humanIndex = index + 1;
      setStatus(`Rendering invoice ${humanIndex} of ${total}…`);
      const blob = await generatePdfBlob(invoice);
      zip.file(getInvoiceFilename(invoice), blob);
    }

    setStatus('Packaging ZIP archive…');
    const archive = await zip.generateAsync({ type: 'blob' });
    const archiveName = `invoices-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.zip`;
    downloadBlob(archive, archiveName);
    setStatus(`Downloaded ${total} invoice${total > 1 ? 's' : ''} as ZIP.`);
  } catch (error) {
    console.error('[dummy-invoices] Failed to export ZIP archive', error);
    setStatus('Failed to export ZIP archive. Check the console for details.', true);
  }
}

function buildInvoiceDocument(invoice) {
  const node = document.createElement('article');
  node.className = 'invoice-document';

  node.innerHTML = `
    <header>
      <div>
        <p class="section-title">From</p>
        <div class="company-block" data-role="from"></div>
        <p class="section-title">Bill To</p>
        <div class="company-block" data-role="to"></div>
      </div>
      <div class="invoice-metadata">
        <h2>INVOICE</h2>
        <span><strong>Invoice #:</strong> ${escapeHtml(invoice.id)}</span>
        <span><strong>Date:</strong> ${escapeHtml(formatDate(invoice.date))}</span>
        <span><strong>Due Date:</strong> ${escapeHtml(formatDate(invoice.dueDate))}</span>
        <span><strong>Currency:</strong> ${escapeHtml(invoice.currency)}</span>
      </div>
    </header>
    <table class="invoice-items">
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Tax</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody data-role="items"></tbody>
    </table>
    <section class="invoice-totals">
      <dl>
        <div>
          <dt>Subtotal</dt>
          <dd data-role="subtotal"></dd>
        </div>
        <div>
          <dt>Tax</dt>
          <dd data-role="tax"></dd>
        </div>
        <div>
          <dt>Total Due</dt>
          <dd data-role="grand-total"></dd>
        </div>
      </dl>
    </section>
  `;

  const fromBlock = node.querySelector('[data-role="from"]');
  const toBlock = node.querySelector('[data-role="to"]');
  const itemsBody = node.querySelector('[data-role="items"]');

  fromBlock.innerHTML = formatCompanyBlock(invoice.from);
  toBlock.innerHTML = formatCompanyBlock(invoice.to);

  invoice.items.forEach((item) => {
    const tr = document.createElement('tr');
    const net = item.quantity * item.unitPrice;
    const tax = net * (item.taxRate / 100);
    const total = net + tax;

    tr.innerHTML = `
      <td>${escapeHtml(item.description)}</td>
      <td>${escapeHtml(formatNumber(item.quantity))}</td>
      <td>${escapeHtml(formatCurrency(item.unitPrice, invoice.currency))}</td>
      <td>${escapeHtml(formatCurrency(tax, invoice.currency))}</td>
      <td>${escapeHtml(formatCurrency(total, invoice.currency))}</td>
    `;

    itemsBody.appendChild(tr);
  });

  node.querySelector('[data-role="subtotal"]').textContent = formatCurrency(invoice.totals.net, invoice.currency);
  node.querySelector('[data-role="tax"]').textContent = formatCurrency(invoice.totals.tax, invoice.currency);
  node.querySelector('[data-role="grand-total"]').textContent = formatCurrency(invoice.totals.total, invoice.currency);

  return node;
}

function formatCompanyBlock(company = {}) {
  const lines = [
    company?.name,
    company?.address,
    company?.phone ? `Phone: ${company.phone}` : null,
    company?.email ? `Email: ${company.email}` : null,
    company?.vatId ? `VAT ID: ${company.vatId}` : null
  ].filter(Boolean);

  if (!lines.length) {
    return '<p>—</p>';
  }

  const [heading, ...rest] = lines;
  return `<h3>${escapeHtml(heading)}</h3><p>${rest.map(escapeHtml).join('<br>')}</p>`;
}

function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value ?? '—');
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function formatNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return '0';
  }
  return number.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function formatCurrency(value, currency = 'EUR') {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return `${currency} 0.00`;
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  } catch (error) {
    return `${currency} ${number.toFixed(2)}`;
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensurePdfLibrary() {
  if (typeof html2pdf !== 'function') {
    console.error('[dummy-invoices] html2pdf.js is not available.');
    setStatus('Missing PDF generator library (html2pdf.js).', true);
    return false;
  }
  return true;
}

function ensureZipLibrary() {
  if (typeof JSZip !== 'function') {
    console.error('[dummy-invoices] JSZip library is not available.');
    setStatus('Missing ZIP library (JSZip).', true);
    return false;
  }
  return true;
}

function getInvoiceFilename(invoice) {
  const base = sanitizeFileName(invoice?.id || 'invoice');
  return `${base}.pdf`;
}

function sanitizeFileName(name) {
  const cleaned = String(name).trim().replace(/[\\/:*?"<>|]+/g, '-');
  return cleaned || 'invoice';
}

function getPdfOptions(filename) {
  return {
    filename,
    image: { type: 'jpeg', quality: 0.98 }
  };
}

function generatePdfBlob(invoice) {
  return new Promise((resolve, reject) => {
    const filename = getInvoiceFilename(invoice);
    const documentNode = buildInvoiceDocument(invoice);

    wrapperEl.innerHTML = '';
    wrapperEl.appendChild(documentNode);

    html2pdf()
      .set(getPdfOptions(filename))
      .from(documentNode)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        try {
          const blob = pdf.output('blob');
          resolve(blob);
        } catch (error) {
          reject(error);
        }
      })
      .catch(reject);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
