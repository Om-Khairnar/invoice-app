import prisma from "@/app/utils/db";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/utils/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/app/components/SubmitButton";
import Link from "next/link";
import WarningGif from "@/public/warning-gif.gif";

async function authorizeInvoiceAccess(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });

  if (!data) {
    return redirect("/dashboard/invoices");
  }
}

type Params = { invoiceId: string };

export default async function DeleteInvoicePage({ params }: { params: Params }) {
  const session = await requireUser();
  const { invoiceId } = params;
  await authorizeInvoiceAccess(invoiceId, session.user?.id as string);
  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Delete Invoice</CardTitle>
          <CardDescription>
            Are you sure that you want to delete this invoice?
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Image
            src={WarningGif}
            alt="Warning Gif"
            width={500}
            height={400}
            className="rounded-lg w-full"
            priority
          />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/dashboard/invoices"
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await prisma.invoice.delete({
                where: { id: invoiceId }
              });
              redirect("/dashboard/invoices");
            }}
          >
            <SubmitButton text="Delete Invoice" variant={"destructive"} />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
