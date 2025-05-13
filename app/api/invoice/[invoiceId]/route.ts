import { NextResponse } from "next/server";
import prisma from "@/app/utils/db";
import jsPDF from "jspdf";
import { formatCurrency } from "@/app/utils/formatCurrency";
export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      invoiceName: true,
      invoiceNumber: true,
      currency: true,
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      clientName: true,
      clientAddress: true,
      clientEmail: true,
      date: true,
      dueDate: true,
      invoiceItemDescription: true,
      invoiceItemQuantity: true,
      invoiceItemRate: true,
      total: true,
      note: true,
    },
  });
  if (!data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set the font to Helvetica
  pdf.setFontSize("helvetica");

  // Set the font size to 24
  pdf.setFontSize(24);
  pdf.text(data.invoiceName, 20, 20);

  // Form section
  pdf.setFontSize(12);
  pdf.text("From:", 20, 40);
  pdf.setFontSize(10);
  pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 45);

  // Client section
  pdf.setFontSize(12);
  pdf.text("Bill To:", 20, 70);
  pdf.setFontSize(10);
  pdf.text([data.clientName, data.clientEmail, data.clientAddress], 20, 75);

  // Invoice details
  pdf.setFontSize(12);
  pdf.text(`Invoice Number: #${data.invoiceNumber}`, 120, 40);
  pdf.text(
    `Date: ${new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(data.date)}`,
    120,
    50
  );
  pdf.text(`Due Date: Net ${data.dueDate}`, 120, 60);

  //item table header
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", 20, 100);
  pdf.text("Quantity", 100, 100);
  pdf.text("Rate", 130, 100);
  pdf.text("Total", 160, 100);

  //drw table line
  pdf.line(20, 102, 190, 102);

  //Item details
  pdf.setFont("helvetica");
  pdf.text(data.invoiceItemDescription, 20, 110);
  pdf.text(data.invoiceItemQuantity.toString(), 100, 110);
  pdf.text(
    formatCurrency({
      amount: data.invoiceItemRate,
      currency: data.currency as any,
    }),
    130,
    110
  );
  pdf.text(
    formatCurrency({
      amount: data.total,
      currency: data.currency as any,
    }),
    160,
    110
  );
  
  //total section
  pdf.line(20, 115, 190, 115);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Total (${data.currency})`, 130, 120);
  pdf.text(
    formatCurrency({
      amount: data.total,
      currency: data.currency as any,
    }),
    160,
    120
  );

  //note section
  if (data.note) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Note:", 20, 150);
    pdf.text(data.note, 20, 155);
  }

  //generate pdf as buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  // return pdf as download
  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
