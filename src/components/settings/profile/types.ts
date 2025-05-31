
import * as z from 'zod';

export const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().optional(),
  phone: z.string().optional(),
  countryCode: z.string().default('US'),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
