import { z } from 'zod';

const HOSTNAME_REGEX = /^(?=.{1,253}$)(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,63}$/i;

export const PlausibleConfigSchema = z.object({
  domain: z
    .string()
    .trim()
    .refine((val) => HOSTNAME_REGEX.test(val), {
      message: 'Domain must be a hostname only (no protocol, path, or port).',
    }),
  host: z.url({ protocol: /^https$/ }),
  captureOnLocalhost: z
    .undefined()
    .transform(() => false)
    .or(z.string().transform((val) => val === 'true')),
});

export type PlausibleConfig = z.infer<typeof PlausibleConfigSchema>;
