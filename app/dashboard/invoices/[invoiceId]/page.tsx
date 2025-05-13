import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { notFound } from "next/navigation";
import { EditInvoice } from "@/app/components/EditInvoice";
async function getdata(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });
  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{
  invoiceId: string;
}>;

export default async function EditInvoiceRoute({ params }: { params: Params }) {
  const { invoiceId } = await params;
  const session = await requireUser();
  const data = await getdata(invoiceId, session.user?.id as string);
  return (
    <div>
      <EditInvoice data={data} />
    </div>
  );
}
