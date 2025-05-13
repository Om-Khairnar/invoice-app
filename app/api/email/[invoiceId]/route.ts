import { requireUser } from "@/app/utils/hooks";
import { NextResponse } from "next/server";
import { emailClient } from "@/app/utils/mailtrap";
import { formatCurrency } from "@/app/utils/formatCurrency";
import prisma from "@/app/utils/db";

const sender = {
  email: "hello@demomailtrap.co",
  name: "Om Khairnar",
};

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await requireUser();
    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    try {
      await emailClient.send({
        from: sender,
        to: [{ email: "om.khairnar175@gmail.com" }],
        template_uuid: "4ce1cf3e-25f5-47bc-93c5-eaf20acdee51",
        template_variables: {
          first_name: invoiceData.clientName,
          company_info_name: "Invoice",
          company_info_address: "17,Neharu housing society near Gov. ITI Dhule",
          company_info_city: "Dhule",
          company_info_zip_code: "424002",
          company_info_country: "India",
        },
      });
      return NextResponse.json({ message: "Email sent successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
