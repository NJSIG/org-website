import z from 'zod';

export const PlausibleConfigSchema = z.object({
  domain: z.string(),
  host: z.string(),
  captureOnLocalhost: z.string().transform((value) => value === 'true'),
});

export type PlausibleConfig = z.infer<typeof PlausibleConfigSchema>;
