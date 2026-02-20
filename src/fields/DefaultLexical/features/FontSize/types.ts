import { cssVariables } from '@/css-variables';
import { z } from 'zod';

const SIZES = Object.keys(cssVariables.prose) as Array<keyof typeof cssVariables.prose>;

export const FontSizeSchema = z.enum(SIZES);

export const FontSizesSchema = z.array(FontSizeSchema);

export const FontSizeFeatureSchema = z.object({
  enabledSizes: z.array(FontSizeSchema).optional(),
  defaultSize: FontSizeSchema.optional(),
});

export type FontSize = z.infer<typeof FontSizeSchema>;
export type FontSizes = z.infer<typeof FontSizesSchema>;
export type FontSizeFeatureProps = z.infer<typeof FontSizeFeatureSchema>;
