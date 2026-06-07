import { existsSync } from "fs";
import { join, resolve } from "path";
import PDFDocument from "pdfkit";
import type { Response } from "express";

type PdfDoc = InstanceType<typeof PDFDocument>;

type PdfFontSet = {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
  italic: string;
};

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

const humanizeValue = (value?: string | null): string => {
  if (!value) return "N/A";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const resolveInterFont = (relativePath: string): string | undefined => {
  const roots = [
    resolve(process.cwd(), "../mobile/node_modules/@expo-google-fonts/inter"),
    resolve(process.cwd(), "mobile/node_modules/@expo-google-fonts/inter"),
    resolve(__dirname, "../../../mobile/node_modules/@expo-google-fonts/inter"),
    resolve(__dirname, "../../../../mobile/node_modules/@expo-google-fonts/inter"),
  ];

  return roots
    .map((root) => join(root, relativePath))
    .find((fontPath) => existsSync(fontPath));
};

const registerFonts = (doc: PdfDoc): PdfFontSet => {
  const fontFiles = {
    regular: resolveInterFont("400Regular/Inter_400Regular.ttf"),
    medium: resolveInterFont("500Medium/Inter_500Medium.ttf"),
    semiBold: resolveInterFont("600SemiBold/Inter_600SemiBold.ttf"),
    bold: resolveInterFont("700Bold/Inter_700Bold.ttf"),
    italic: resolveInterFont("400Regular_Italic/Inter_400Regular_Italic.ttf"),
  };

  if (Object.values(fontFiles).every(Boolean)) {
    try {
      doc.registerFont("Inter-Regular", fontFiles.regular!);
      doc.registerFont("Inter-Medium", fontFiles.medium!);
      doc.registerFont("Inter-SemiBold", fontFiles.semiBold!);
      doc.registerFont("Inter-Bold", fontFiles.bold!);
      doc.registerFont("Inter-Italic", fontFiles.italic!);

      return {
        regular: "Inter-Regular",
        medium: "Inter-Medium",
        semiBold: "Inter-SemiBold",
        bold: "Inter-Bold",
        italic: "Inter-Italic",
      };
    } catch {
      // Fall through to built-in PDF fonts if local Inter cannot be registered.
    }
  }

  return {
    regular: "Helvetica",
    medium: "Helvetica",
    semiBold: "Helvetica-Bold",
    bold: "Helvetica-Bold",
    italic: "Helvetica-Oblique",
  };
};

export const generateLoanPdf = (
  loan: any,
  payments: any[],
  res: Response,
) => {
  const doc = new PDFDocument({
    margin: 0,
    size: "A4",
    info: {
      Title: `Loan Statement - ${loan.description || "Loan Detail"}`,
      Author: "LoanTracker",
      Subject: "Loan Payment Statement",
    },
  });

  doc.pipe(res);

  const C = {
    primary: "#635BFF",
    bgPage: "#FFFFFF",
    bgSurface: "#F6F9FC",
    bgHero: "#0A2540",
    bgHeroEnd: "#1A3A5C",
    bgCard: "#FFFFFF",
    text: "#0A2540",
    textSecondary: "#425466",
    textOnHero: "#FFFFFF",
    textOnHeroMuted: "#C7D2E1",
    border: "#E3E8EE",
    borderSoft: "#EEF2F7",
    success: "#30B130",
    danger: "#DF1B41",
    shadow: "#E8EEF7",
  };

  const F = registerFonts(doc);

  const MARGIN = 44;
  const PAGE_W = doc.page.width;
  const PAGE_H = doc.page.height;
  const INNER_W = PAGE_W - MARGIN * 2;
  const RIGHT = PAGE_W - MARGIN;
  const BOTTOM = PAGE_H - 60;

  const principalAmt = Number(loan.amount || 0);

  const drawPageBackground = () => {
    doc.fillColor(C.bgPage).rect(0, 0, PAGE_W, PAGE_H).fill();
  };

  const drawSoftCard = (x: number, y: number, width: number, height: number, radius = 8) => {
    doc.fillColor(C.shadow).roundedRect(x + 1.5, y + 2, width, height, radius).fill();
    doc.fillColor(C.bgCard).roundedRect(x, y, width, height, radius).fill();
    doc.strokeColor(C.border).lineWidth(0.8).roundedRect(x, y, width, height, radius).stroke();
  };

  const drawHeader = () => {
    const headerHeight = 78;
    drawPageBackground();

    const gradient = doc.linearGradient(0, 0, PAGE_W, headerHeight);
    gradient.stop(0, C.bgHero).stop(1, C.bgHeroEnd);
    doc.rect(0, 0, PAGE_W, headerHeight).fill(gradient);
    doc.fillColor(C.primary).rect(0, headerHeight - 3, PAGE_W, 3).fill();

    doc.fillColor(C.primary).roundedRect(MARGIN, 20, 36, 36, 8).fill();
    doc.fillColor(C.textOnHero).font(F.bold).fontSize(13).text("LT", MARGIN, 31, {
      width: 36,
      align: "center",
    });

    doc.fillColor(C.textOnHero).font(F.bold).fontSize(18).text("LoanTracker", MARGIN + 48, 19);
    doc
      .fillColor(C.textOnHeroMuted)
      .font(F.medium)
      .fontSize(8)
      .text("Personal loan ledger", MARGIN + 49, 43, { characterSpacing: 0.8 });

    doc
      .fillColor(C.textOnHero)
      .font(F.bold)
      .fontSize(10.5)
      .text("LOAN STATEMENT", MARGIN, 21, { width: INNER_W, align: "right" });

    doc
      .fillColor(C.textOnHeroMuted)
      .font(F.regular)
      .fontSize(8)
      .text(`Generated ${formatDate(new Date())}`, MARGIN, 41, {
        width: INNER_W,
        align: "right",
      });
  };

  const drawFooter = () => {
    const footerY = PAGE_H - 40;

    doc.strokeColor(C.border).lineWidth(0.7).moveTo(MARGIN, footerY - 1).lineTo(RIGHT, footerY - 1).stroke();
    doc
      .fillColor(C.textSecondary)
      .font(F.regular)
      .fontSize(7.5)
      .text(
        "This statement is generated from LoanTracker records for personal loan tracking and settlement reference.",
        MARGIN,
        footerY + 7,
        { width: INNER_W, align: "center" },
      );

    doc
      .fillColor(C.primary)
      .font(F.semiBold)
      .fontSize(7.5)
      .text("LoanTracker - Personal Loan Ledger", MARGIN, footerY + 20, {
        width: INNER_W,
        align: "center",
      });
  };

  const drawDivider = (y: number, color = C.border, weight = 0.7) => {
    doc.strokeColor(color).lineWidth(weight).moveTo(MARGIN, y).lineTo(RIGHT, y).stroke();
  };

  const PAD_R = 10;
  const REM_W = 82;
  const AMT_W = 86;
  const REM_X = RIGHT - REM_W - PAD_R;
  const AMT_X = REM_X - AMT_W - 6;

  const TC = {
    date: MARGIN + 10,
    type: MARGIN + 116,
    method: MARGIN + 226,
    amount: AMT_X,
    remaining: REM_X,
  };

  const drawTableHead = (y: number): number => {
    const h = 28;

    doc.fillColor(C.bgSurface).roundedRect(MARGIN, y, INNER_W, h, 8).fill();
    doc.strokeColor(C.border).lineWidth(0.8).roundedRect(MARGIN, y, INNER_W, h, 8).stroke();
    doc.fillColor(C.primary).roundedRect(MARGIN, y, 4, h, 2).fill();

    doc.fillColor(C.textSecondary).font(F.semiBold).fontSize(8);
    doc.text("Date", TC.date, y + 10);
    doc.text("Transaction", TC.type, y + 10);
    doc.text("Method", TC.method, y + 10);
    doc.text("Paid Amount", TC.amount, y + 10, { width: AMT_W, align: "right" });
    doc.text("Remaining", TC.remaining, y + 10, { width: REM_W, align: "right" });

    return y + h + 4;
  };

  const newPage = (): number => {
    doc.addPage();
    drawHeader();

    let y = 104;
    doc.fillColor(C.text).font(F.bold).fontSize(13).text("Payment History", MARGIN, y);
    doc.fillColor(C.textSecondary).font(F.italic).fontSize(8.5).text("(continued)", MARGIN + 118, y + 3);

    y += 23;
    drawDivider(y);
    y += 12;

    return drawTableHead(y);
  };

  const drawPaymentTable = (startY: number): number => {
    let y = startY;

    doc.fillColor(C.primary).roundedRect(MARGIN, y + 1, 4, 31, 2).fill();
    doc.fillColor(C.text).font(F.bold).fontSize(13).text("Payment History Ledger", MARGIN + 14, y);
    doc
      .fillColor(C.textSecondary)
      .font(F.regular)
      .fontSize(8.5)
      .text("Chronological settlement record with running balance", MARGIN + 14, y + 17);
    y += 42;

    y = drawTableHead(y);

    const sorted = [...(payments || [])].sort(
      (a, b) =>
        new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
    );

    if (sorted.length === 0) {
      drawSoftCard(MARGIN, y + 4, INNER_W, 58);
      doc
        .fillColor(C.textSecondary)
        .font(F.italic)
        .fontSize(9)
        .text("No payment records have been added for this loan yet.", MARGIN, y + 28, {
          width: INNER_W,
          align: "center",
        });

      return y + 78;
    }

    let cumulativePaid = 0;
    const rowH = 30;

    sorted.forEach((payment, index) => {
      if (y + rowH > BOTTOM) {
        drawFooter();
        y = newPage();
      }

      const rowBg = index % 2 === 0 ? C.bgCard : C.bgSurface;
      doc.fillColor(rowBg).rect(MARGIN, y, INNER_W, rowH).fill();

      cumulativePaid += Number(payment.amount || 0);
      const remaining = Math.max(principalAmt - cumulativePaid, 0);
      const typeLabel = payment.type === "RECEIVED" ? "Received Back" : "Paid Back";
      const amountColor = payment.type === "RECEIVED" ? C.success : C.danger;

      doc
        .fillColor(C.text)
        .font(F.regular)
        .fontSize(8.5)
        .text(formatDate(payment.paymentDate), TC.date, y + 10, { width: 95 });

      doc
        .fillColor(C.text)
        .font(F.medium)
        .fontSize(8.5)
        .text(typeLabel, TC.type, y + 10, { width: 108 });

      doc
        .fillColor(C.textSecondary)
        .font(F.regular)
        .fontSize(8.5)
        .text(payment.method ? humanizeValue(payment.method) : "N/A", TC.method, y + 10, {
          width: 98,
          ellipsis: true,
        });

      doc
        .fillColor(amountColor)
        .font(F.bold)
        .fontSize(8.5)
        .text(formatCurrency(payment.amount), TC.amount, y + 10, {
          width: AMT_W,
          align: "right",
        });

      doc
        .fillColor(remaining === 0 ? C.success : C.text)
        .font(F.bold)
        .fontSize(8.5)
        .text(formatCurrency(remaining), TC.remaining, y + 10, {
          width: REM_W,
          align: "right",
        });

      y += rowH;
      doc.strokeColor(C.border).lineWidth(0.45).moveTo(MARGIN, y).lineTo(RIGHT, y).stroke();
    });

    return y + 20;
  };

  drawHeader();

  let y = 112;
  y = drawPaymentTable(y);

  drawFooter();
  doc.end();
};
