export const generateEventLink = (event: {
  slug?: string | null;
  startDate: string;
  [k: string]: unknown;
}): string => {
  const { slug, startDate } = event;
  const date = new Date(startDate);

  return `/events/${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate()}/${slug}`;
};
