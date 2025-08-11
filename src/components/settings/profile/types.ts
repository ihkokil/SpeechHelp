
import { z } from 'zod';

export const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  countryCode: z.string().default('US'),
  // Address fields
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default('US'),
  // Password confirmation for email changes
  currentPassword: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
