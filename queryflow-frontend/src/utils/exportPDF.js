import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportVaultReport = ({ items, sellHistory, grossVal, net, tax, costVal, userId }) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });

  // ─── HEADER ───────────────────────────────────────────
  doc.setFillColor(5, 5, 5);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(65, 130, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bolditalic");
  doc.text("VAULT.V5 — FINANCIAL REPORT", 14, 18);

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${dateStr}`, 14, 28);
  doc.text(`Node: 0x${userId?.slice(0, 8)}`, 14, 34);

  // ─── FINANCIAL SUMMARY ────────────────────────────────
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("FINANCIAL SUMMARY", 14, 52);

  doc.setDrawColor(65, 130, 255);
  doc.setLineWidth(0.5);
  doc.line(14, 54, pageWidth - 14, 54);

  autoTable(doc, {
    startY: 58,
    head: [["Metric", "Value"]],
    body: [
      ["Gross Valuation (Market Value)", `$${grossVal.toLocaleString()}`],
      ["Total Cost Value", `$${costVal.toLocaleString()}`],
      ["Tax Provision (18% GST)", `-$${tax.toLocaleString()}`],
      ["Net Efficiency (Profit)", `$${net.toLocaleString()}`],
      ["Total Items", items.length.toString()],
      ["Total Units Held", items.reduce((a, i) => a + (i.stock || 0), 0).toString()],
    ],
    headStyles: { fillColor: [65, 130, 255], textColor: 255, fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  // ─── INVENTORY TABLE ──────────────────────────────────
  const inventoryY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("INVENTORY HOLDINGS", 14, inventoryY);

  doc.setDrawColor(65, 130, 255);
  doc.line(14, inventoryY + 2, pageWidth - 14, inventoryY + 2);

  autoTable(doc, {
    startY: inventoryY + 6,
    head: [["Item", "Category", "Buy Price", "Sell Price", "Stock", "Margin %", "Total Value"]],
    body: items.map(item => {
      const cost = item.cost_price || item.costPrice || 0;
      const margin = cost > 0 ? (((item.price - cost) / cost) * 100).toFixed(1) : "N/A";
      const totalVal = (item.price * item.stock).toLocaleString();
      return [
        item.name?.toUpperCase() || "-",
        item.category || "Uncategorized",
        `$${cost.toLocaleString()}`,
        `$${item.price?.toLocaleString()}`,
        item.stock?.toString(),
        margin !== "N/A" ? `${margin}%` : "N/A",
        `$${totalVal}`
      ];
    }),
    headStyles: { fillColor: [65, 130, 255], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "center" },
      5: { halign: "center" },
      6: { halign: "right", fontStyle: "bold" }
    },
    margin: { left: 14, right: 14 },
  });

  // ─── TOP HOLDINGS ─────────────────────────────────────
  const topHoldingsY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("TOP HOLDINGS", 14, topHoldingsY);

  doc.setDrawColor(65, 130, 255);
  doc.line(14, topHoldingsY + 2, pageWidth - 14, topHoldingsY + 2);

  const topFive = [...items]
    .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
    .slice(0, 5);

  autoTable(doc, {
    startY: topHoldingsY + 6,
    head: [["Rank", "Item", "Category", "Total Value"]],
    body: topFive.map((item, i) => [
      `#${i + 1}`,
      item.name?.toUpperCase(),
      item.category || "Uncategorized",
      `$${(item.price * item.stock).toLocaleString()}`
    ]),
    headStyles: { fillColor: [65, 130, 255], textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    columnStyles: { 3: { halign: "right", fontStyle: "bold" } },
    margin: { left: 14, right: 14 },
  });

  // ─── SELL HISTORY ─────────────────────────────────────
  if (sellHistory.length > 0) {
    const sellY = doc.lastAutoTable.finalY + 12;

    // Check if we need a new page
    if (sellY > 240) doc.addPage();
    const actualSellY = sellY > 240 ? 20 : sellY;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("SELL HISTORY", 14, actualSellY);

    doc.setDrawColor(65, 130, 255);
    doc.line(14, actualSellY + 2, pageWidth - 14, actualSellY + 2);

    autoTable(doc, {
      startY: actualSellY + 6,
      head: [["Date", "Item", "Qty", "Sell Price", "Cost Price", "Profit"]],
      body: sellHistory.slice(0, 20).map(sale => [
        new Date(sale.soldAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric"
        }),
        sale.productName?.toUpperCase(),
        sale.quantity?.toString(),
        `$${sale.sellPrice?.toLocaleString()}`,
        `$${sale.costPrice?.toLocaleString()}`,
        `$${sale.profit?.toFixed(2)}`
      ]),
      headStyles: { fillColor: [65, 130, 255], textColor: 255, fontStyle: "bold", fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 247, 255] },
      columnStyles: {
        2: { halign: "center" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right", fontStyle: "bold", textColor: [0, 180, 100] }
      },
      margin: { left: 14, right: 14 },
    });

    // ─── SALES SUMMARY ──────────────────────────────────
    const totalProfit = sellHistory.reduce((acc, s) => acc + (s.profit || 0), 0);
    const totalUnits = sellHistory.reduce((acc, s) => acc + (s.quantity || 0), 0);
    const bestItem = Object.entries(
      sellHistory.reduce((acc, s) => {
        acc[s.productName] = (acc[s.productName] || 0) + s.profit;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0];

    const summaryY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("SALES SUMMARY", 14, summaryY);
    doc.setDrawColor(65, 130, 255);
    doc.line(14, summaryY + 2, pageWidth - 14, summaryY + 2);

    autoTable(doc, {
      startY: summaryY + 6,
      head: [["Metric", "Value"]],
      body: [
        ["Total Sales Transactions", sellHistory.length.toString()],
        ["Total Units Sold", totalUnits.toString()],
        ["Total Profit Earned", `$${totalProfit.toFixed(2)}`],
        ["Best Performing Item", bestItem ? `${bestItem[0]} ($${bestItem[1].toFixed(2)})` : "N/A"],
      ],
      headStyles: { fillColor: [65, 130, 255], textColor: 255, fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 247, 255] },
      columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
      margin: { left: 14, right: 14 },
    });
  }

  // ─── FOOTER ───────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text(
      `QueryFlow Vault.v5 — Confidential Financial Report — Page ${i} of ${pageCount}`,
      pageWidth / 2, doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  // ─── SAVE ─────────────────────────────────────────────
  doc.save(`VaultReport_${now.toISOString().slice(0, 10)}.pdf`);
};