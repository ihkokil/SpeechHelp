
import * as z from 'zod';

export const paymentMethodSchema = z.object({
  cardType: z.string().optional(),
  cardNumber: z.string()
    .min(15, "Card number must be at least 15 digits")
    .max(19, "Card number is too long")
    .refine(val => /^\d+$/.test(val), { message: "Card number must contain only digits" }),
  cardHolder: z.string().min(2, "Card holder name is required"),
  expiryMonth: z.string().min(1, "Expiry month is required").max(2, "Invalid month"),
  expiryYear: z.string().min(2, "Expiry year is required").max(4, "Invalid year"),
  cvv: z.string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV can be up to 4 digits")
    .refine(val => /^\d+$/.test(val), { message: "CVV must contain only digits" }),
  isDefault: z.boolean().default(false),
  billingStreet: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZip: z.string().optional(),
  billingCountry: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentMethodSchema>;
