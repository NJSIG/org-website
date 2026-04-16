import { LinkField } from '@/fields/Link/types';
import { Event, Page, Subfund } from '@/payload-types';
import { isObject } from '@/utilities/isObject';

export const getLinkReferenceLabel = (link: LinkField): string => {
  if (isObject(link.reference?.value)) {
    const value: unknown = link.reference.value;
    switch (link.reference.relationTo) {
      case 'pages':
        return (value as Page).title;
      case 'events':
        return (value as Event).title;
      case 'subfunds':
        return (value as Subfund).shortName;
      default:
        return 'Unknown Reference';
    }
  }

  return link.reference?.value ?? 'Unknown Reference';
};
