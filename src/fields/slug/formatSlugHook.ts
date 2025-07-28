import { FieldHook } from 'payload';

export const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/[^\w-]+/g, '') // Remove non-word characters except hyphens
    .toLowerCase();

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string') {
      return formatSlug(value);
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback];

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData);
      }
    }

    return value;
  };
