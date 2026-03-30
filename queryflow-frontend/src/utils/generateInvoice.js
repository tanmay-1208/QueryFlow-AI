import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = ({ sale, seller, buyer, invoiceNumber }) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date();

  // ─── HEADER BACKGROUND ───────────────────────────────
  doc.setFillColor(5, 5, 5);
  doc.rect(0, 0, pageWidth, 50, "F");

  // Company Name
  doc.setTextColor(65, 130, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bolditalic");
  doc.text(seller.businessName || "QueryFlow Vault", 14, 20);

  // Invoice label
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", pageWidth - 14, 15, { align: "right" });

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice No: INV-${invoiceNumber}`, pageWidth - 14, 23, { align: "right" });
  doc.text(`Date: ${now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, pageWidth - 14, 30, { align: "right" });
  doc.text(`Vault: ${sale.vaultName || "Main Vault"}`, pageWidth - 14, 37, { align: "right" });

  // Seller address
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  if (seller.address) doc.text(seller.address, 14, 30);
  if (seller.phone) doc.text(`Ph: ${seller.phone}`, 14, 37);
  if (seller.gstin) doc.text(`GSTIN: ${seller.gstin}`, 14, 44);

  // ─── DIVIDER ──────────────────────────────────────────
  doc.setDrawColor(65, 130, 255);
  doc.setLineWidth(0.5);
  doc.line(14, 55, pageWidth - 14, 55);

  // ─── SELLER + BUYER INFO ──────────────────────────────
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("BILL FROM:", 14, 65);
  doc.text("BILL TO:", pageWidth / 2 + 5, 65);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  // Seller details
  doc.text(seller.businessName || "N/A", 14, 73);
  doc.text(seller.address || "N/A", 14, 80);
  doc.text(seller.phone ? `Ph: ${seller.phone}` : "", 14, 87);
  doc.text(seller.gstin ? `GSTIN: ${seller.gstin}` : "", 14, 94);

  // Buyer details
  doc.text(buyer.name || "N/A", pageWidth / 2 + 5, 73);
  doc.text(buyer.address || "N/A", pageWidth / 2 + 5, 80);
  doc.text(buyer.phone ? `Ph: ${buyer.phone}` : "", pageWidth / 2 + 5, 87);
  doc.text(buyer.gstin ? `GSTIN: ${buyer.gstin}` : "", pageWidth / 2 + 5, 94);

  // ─── ITEMS TABLE ──────────────────────────────────────
  const gstRate = 0.18;
  const baseAmount = sale.sellPrice * sale.quantity;
  const gstAmount = baseAmount * gstRate;
  const totalAmount = baseAmount + gstAmount;

  autoTable(doc, {
    startY: 105,
    head: [["#", "Item Description", "HSN/SAC", "Qty", "Unit Price (₹)", "Amount (₹)"]],
    body: [
      [
        "1",
        sale.productName?.toUpperCase() || "Item",
        "N/A",
        sale.quantity?.toString(),
        `₹${sale.sellPrice?.toLocaleString("en-IN")}`,
        `₹${baseAmount?.toLocaleString("en-IN")}`
      ]
    ],
    headStyles: {
      fillColor: [65, 130, 255],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9
    },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10 },
      3: { halign: "center" },
      4: { halign: "right" },
      5: { halign: "right", fontStyle: "bold" }
    },
    margin: { left: 14, right: 14 }
  });

  // ─── TOTALS ───────────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 8;

  autoTable(doc, {
    startY: finalY,
    body: [
      ["", "", "", "", "Subtotal:", `₹${baseAmount.toLocaleString("en-IN")}`],
      ["", "", "", "", `CGST (9%):`, `₹${(gstAmount / 2).toLocaleString("en-IN")}`],
      ["", "", "", "", `SGST (9%):`, `₹${(gstAmount / 2).toLocaleString("en-IN")}`],
      ["", "", "", "", "TOTAL:", `₹${totalAmount.toLocaleString("en-IN")}`],
    ],
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      4: { halign: "right", fontStyle: "bold" },
      5: { halign: "right" }
    },
    didParseCell: (data) => {
      if (data.row.index === 3) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 11;
        data.cell.styles.textColor = [65, 130, 255];
      }
    },
    margin: { left: 14, right: 14 }
  });

  // ─── PROFIT NOTE (internal only) ─────────────────────
  const profitY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");
  doc.text(`Cost Price: ₹${sale.costPrice?.toLocaleString("en-IN")} | Net Profit on this sale: ₹${sale.profit?.toLocaleString("en-IN")}`, 14, profitY);
  doc.text("(Internal record — not visible to buyer)", 14, profitY + 6);

  // ─── BANK / PAYMENT DETAILS ───────────────────────────
  if (seller.bankDetails) {
    const bankY = profitY + 18;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.text("PAYMENT DETAILS:", 14, bankY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(seller.bankDetails, 14, bankY + 7);
  }

  // ─── THANK YOU NOTE ───────────────────────────────────
  const thankY = doc.lastAutoTable.finalY + 50;
  doc.setFillColor(245, 247, 255);
  doc.rect(14, thankY, pageWidth - 28, 16, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(65, 130, 255);
  doc.text("Thank you for your business!", pageWidth / 2, thankY + 10, { align: "center" });

  // ─── FOOTER ───────────────────────────────────────────
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Generated by QueryFlow Vault — This is a computer generated invoice",
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 8,
    { align: "center" }
  );

  // ─── SAVE ─────────────────────────────────────────────
  doc.save(`Invoice_INV-${invoiceNumber}_${sale.productName}.pdf`);
};