import { FieldHook } from 'payload';

export const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-') // Replace spaces with hyphens
    .replace(/\//g, '-') // Replace slashes with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
    .replace(/[^\w-]+/g, '') // Remove non-word characters except hyphens
    .toLowerCase();

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value, originalDoc, siblingData }) => {
    // Only format if value is explicitly provided (user typed in slug field)
    if (typeof value === 'string' && value !== originalDoc?.slug) {
      return formatSlug(value);
    }

    // On create, generate from fallback field
    if (operation === 'create') {
      const fallbackData = data?.[fallback];

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData);
      }
    }

    return value;
  };
