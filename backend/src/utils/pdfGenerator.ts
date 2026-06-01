import PDFDocument from "pdfkit";
import { Response } from "express";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatDate = (dateInput?: Date | string | null): string => {
  if (!dateInput) return "N/A";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (value?: number | null): string => {
  const amount = Number(value || 0);
  return `Rs. ${amount.toLocaleString("en-PK")}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export const generateLoanPdf = (
  loan: any,
  payments: any[],
  res: Response,
) => {
  const doc = new PDFDocument({
    margin: 0,           // We handle all margins manually for precision
    size: "A4",
    info: {
      Title: `Loan Statement – ${loan.description || "Loan Detail"}`,
      Author: "LoanTracker",
      Subject: "Loan Payment Statement",
    },
  });

  doc.pipe(res);

  // ── Design tokens ──────────────────────────────────────────────────────────
  const C = {
    primary:      "#f36f56",
    primaryDark:  "#d95441",
    success:      "#1b7d62",
    background:   "#fffaf4",
    bgSoft:       "#fff7ef",
    white:        "#ffffff",
    text:         "#25212b",
    muted:        "#6f6577",
    mutedLight:   "#a89cb0",
    border:       "#e8ddd5",
    headerBg:     "#2c2433",
    accentStripe: "#f36f56",
  };

  const F = {
    regular: "Helvetica",
    bold:    "Helvetica-Bold",
    italic:  "Helvetica-Oblique",
  };

  // Safe inner margins
  const MARGIN   = 44;
  const PAGE_W   = doc.page.width;           // 595.28
  const INNER_W  = PAGE_W - MARGIN * 2;      // ~507
  const RIGHT    = PAGE_W - MARGIN;
  const BOTTOM   = doc.page.height - 54;     // footer threshold

  // ── Derived loan data ──────────────────────────────────────────────────────
  const principalAmt  = Number(loan.amount || 0);

  // ─────────────────────────────────────────────────────────────────────────
  // HEADER
  // Solid dark bar across the top; coral accent stripe below it
  // ─────────────────────────────────────────────────────────────────────────
  const drawHeader = () => {
    const BAR_H   = 64;
    const STRIP_H = 4;

    // Dark header background
    doc.fillColor(C.headerBg).rect(0, 0, PAGE_W, BAR_H).fill();

    // Coral accent stripe under the header
    doc.fillColor(C.accentStripe).rect(0, BAR_H, PAGE_W, STRIP_H).fill();

    // Brand name
    doc
      .fillColor(C.white)
      .font(F.bold)
      .fontSize(20)
      .text("LoanTracker", MARGIN, 18);

    // Tagline
    doc
      .fillColor(C.mutedLight)
      .font(F.regular)
      .fontSize(7)
      .text("RECLAIMING BILATERAL TRUST", MARGIN + 1, 43, { characterSpacing: 1.4 });

    // Document type — right-aligned
    doc
      .fillColor(C.white)
      .font(F.bold)
      .fontSize(11)
      .text("LOAN STATEMENT", MARGIN, 18, { width: INNER_W, align: "right" });

    // Generated date
    doc
      .fillColor(C.mutedLight)
      .font(F.regular)
      .fontSize(8)
      .text(`Generated: ${formatDate(new Date())}`, MARGIN, 38, {
        width: INNER_W,
        align: "right",
      });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // FOOTER
  // ─────────────────────────────────────────────────────────────────────────
  const drawFooter = () => {
    const FOOTER_Y = doc.page.height - 38;

    doc.fillColor(C.border).rect(0, FOOTER_Y - 1, PAGE_W, 0.6).fill();

    doc
      .fillColor(C.mutedLight)
      .font(F.regular)
      .fontSize(7)
      .text(
        "This statement is generated from LoanTracker records for personal loan tracking and settlement reference.",
        MARGIN,
        FOOTER_Y + 7,
        { width: INNER_W, align: "center" },
      );

    // Coral dot separator · brand
    doc
      .fillColor(C.primaryDark)
      .font(F.bold)
      .fontSize(7)
      .text("LoanTracker · Reclaiming Bilateral Trust", MARGIN, FOOTER_Y + 19, {
        width: INNER_W,
        align: "center",
      });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // DIVIDER
  // ─────────────────────────────────────────────────────────────────────────
  const drawDivider = (y: number, color = C.border, weight = 0.6) => {
    doc.strokeColor(color).lineWidth(weight).moveTo(MARGIN, y).lineTo(RIGHT, y).stroke();
  };

  // ─────────────────────────────────────────────────────────────────────────
  // TABLE HEADER ROW
  // ─────────────────────────────────────────────────────────────────────────

  // Column x-positions
  // All right-aligned columns are clamped 6px inside RIGHT to avoid PDFKit edge clipping.
  const PAD_R    = 6;                          // inner right padding
  const REM_W    = 82;
  const AMT_W    = 86;
  const REM_X    = RIGHT - REM_W - PAD_R;     // text block ends at RIGHT - PAD_R
  const AMT_X    = REM_X - AMT_W - 6;         // 6px gap between the two right columns

  const TC = {
    date:      MARGIN,
    type:      MARGIN + 108,
    method:    MARGIN + 220,
    amount:    AMT_X,
    remaining: REM_X,
  };

  const drawTableHead = (y: number): number => {
    const H = 24;

    doc.fillColor(C.headerBg).rect(0, y, PAGE_W, H).fill();

    // Coral left accent strip on header
    doc.fillColor(C.primary).rect(0, y, 3, H).fill();

    doc.fillColor(C.white).font(F.bold).fontSize(8);

    doc.text("Date",        TC.date    + 8, y + 8);
    doc.text("Transaction", TC.type    + 4, y + 8);
    doc.text("Method",      TC.method  + 4, y + 8);
    doc.text("Paid Amount", TC.amount,      y + 8, { width: AMT_W, align: "right" });
    doc.text("Remaining",   TC.remaining,   y + 8, { width: REM_W, align: "right" });

    return y + H;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // NEW PAGE  (with continued header + table header)
  // ─────────────────────────────────────────────────────────────────────────
  const newPage = (): number => {
    doc.addPage();
    drawHeader();

    let y = 92;

    // Compact continuation label
    doc
      .fillColor(C.text)
      .font(F.bold)
      .fontSize(11)
      .text("Payment History  ", MARGIN, y);

    doc
      .fillColor(C.muted)
      .font(F.italic)
      .fontSize(8)
      .text("(continued)", MARGIN + 130, y + 2);

    y += 22;
    drawDivider(y, C.border, 0.6);
    y += 10;

    return drawTableHead(y);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // PAYMENT TABLE
  // ─────────────────────────────────────────────────────────────────────────
  const drawPaymentTable = (startY: number): number => {
    let y = startY;

    // Section label with coral left-bar accent
    doc.fillColor(C.primary).rect(MARGIN, y, 3, 30).fill();
    doc.fillColor(C.text).font(F.bold).fontSize(11).text("Payment History Ledger", MARGIN + 12, y);
    doc.fillColor(C.muted).font(F.regular).fontSize(8).text("Chronological settlement record with running balance", MARGIN + 12, y + 15);
    y += 44;

    y = drawTableHead(y);

    const sorted = [...(payments || [])].sort(
      (a, b) =>
        new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
    );

    // ── Empty state ──
    if (sorted.length === 0) {
      doc
        .fillColor(C.bgSoft)
        .rect(MARGIN, y, INNER_W, 52)
        .fill();

      doc
        .fillColor(C.muted)
        .font(F.italic)
        .fontSize(9)
        .text(
          "No payment records have been added for this loan yet.",
          MARGIN,
          y + 20,
          { width: INNER_W, align: "center" },
        );

      return y + 72;
    }

    // ── Rows ──
    let cumulativePaid = 0;
    const ROW_H = 26;

    sorted.forEach((payment, index) => {
      if (y + ROW_H > BOTTOM) {
        drawFooter();
        y = newPage();
      }

      // Alternating background
      if (index % 2 === 0) {
        doc.fillColor(C.white).rect(0, y, PAGE_W, ROW_H).fill();
      } else {
        doc.fillColor(C.background).rect(0, y, PAGE_W, ROW_H).fill();
      }

      cumulativePaid += Number(payment.amount || 0);
      const remaining  = Math.max(principalAmt - cumulativePaid, 0);
      const typeLabel  = payment.type === "RECEIVED" ? "Received Back" : "Paid Back";

      // ── Date
      doc
        .fillColor(C.text)
        .font(F.regular)
        .fontSize(8.5)
        .text(formatDate(payment.paymentDate), TC.date + 8, y + 9, { width: 95 });

      // ── Transaction type
      doc
        .fillColor(C.text)
        .font(F.regular)
        .fontSize(8.5)
        .text(typeLabel, TC.type + 4, y + 9, { width: 114 });

      // ── Method
      doc
        .fillColor(C.muted)
        .font(F.regular)
        .fontSize(8.5)
        .text(payment.method || "N/A", TC.method + 4, y + 9, {
          width: 100,
          ellipsis: true,
        });

      // ── Paid amount (coral/success)
      doc
        .fillColor(C.success)
        .font(F.bold)
        .fontSize(8.5)
        .text(formatCurrency(payment.amount), TC.amount, y + 9, {
          width: AMT_W,
          align: "right",
        });

      // ── Remaining (green if zero, dark if positive)
      const remColor = remaining === 0 ? C.success : C.text;
      doc
        .fillColor(remColor)
        .font(F.bold)
        .fontSize(8.5)
        .text(formatCurrency(remaining), TC.remaining, y + 9, {
          width: REM_W,
          align: "right",
        });

      y += ROW_H;

      // Row separator
      doc
        .strokeColor(C.border)
        .lineWidth(0.35)
        .moveTo(0, y)
        .lineTo(PAGE_W, y)
        .stroke();
    });

    return y + 20;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // COMPOSE THE DOCUMENT
  // ─────────────────────────────────────────────────────────────────────────
  drawHeader();

  let y = 92;   // below header (64) + accent stripe (4) + breathing room (24)

  y = drawPaymentTable(y);

  drawFooter();

  doc.end();
};