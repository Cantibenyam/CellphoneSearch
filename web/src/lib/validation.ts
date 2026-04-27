import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).optional(),
    password: z.string().min(8).optional(),
  })
  .refine(
    (d) => d.name !== undefined || d.password !== undefined,
    'Provide name or password to update',
  );

export const favoriteToggleSchema = z.object({
  listing_id: z.number().int().positive(),
});

export const listingCreateSchema = z.object({
  model_id: z.number().int().positive(),
  seller_id: z.number().int().positive(),
  price: z.number().positive().max(99_999_999.99),
});

export const listingUpdateSchema = z.object({
  price: z.number().positive().max(99_999_999.99),
});
