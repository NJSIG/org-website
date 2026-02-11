import z from 'zod';

export const PlausibleConfigSchema = z.object({
  domain: z.string(),
  host: z.string(),
  captureOnLocalhost: z
    .undefined()
    .transform(() => false)
    .or(z.string().transform((val) => val === 'true')),
});

export type PlausibleConfig = z.infer<typeof PlausibleConfigSchema>;
