import { totalmem } from "os";
import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(2, "Address is required"),
});

export const invoiceSchema = z.object({
    invoiceName: z.string().min(1, "Inoice name is required"),
    total: z.string().min(1, "1 $ is minimum"),
    status: z.enum(["PAID", "PENDING"]).default("PENDING"),
    date: z.string().min(1, "Due date is required"),
    dueDate: z.number().min(1, "Due date is required"),
    fromName: z.string().min(1, "Your name is required"),
    fromEmail: z.string().email("Email is required"),
    fromAddress: z.string().min(1, "Address is required"),
    clientName: z.string().min(1, "Client name is required"),
    clientEmail: z.string().email("Invalid email address"),
    clientAddress: z.string().min(1, "Client address is required"),
    currency: z.string().min(1, "Currency is required"),
    invoiceNumber: z.number().min(1, " Minimum Invoice number of 1"),
    note: z.string().optional(),
    invoiceItemDescription: z.string().min(1, "Item description is required"),
    invoiceItemQuantity: z.number().min(1, "quantity minimum is 1"),
    invoiceItemRate: z.number().min(1, "Rate minimum is 1"),
    
})