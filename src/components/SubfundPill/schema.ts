import { z } from 'zod';

/**
 * SubfundPillSchema defines the structure and validation rules for a subfund pill object.
 * The type definition is derived from the schema used in the EventCategories collection,
 * only fields required for the SubfundPill component are included here.
 */
export const SubfundPillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
});
