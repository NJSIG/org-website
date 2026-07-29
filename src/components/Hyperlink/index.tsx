import { LinkField } from '@/fields/Link/types';
import { cn } from '@/utilities/cn';
import { getPagePath } from '@/utilities/getPagePath';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';

// TODO: default url to not found page

interface Props {
  link: Partial<LinkField>;
  newTabIndicator?: boolean;
  newTabIndicatorSize?: number;
  className?: string;
  children?: React.ReactNode;
}

const errorPageUrl = '/404';

export const Hyperlink = (props: Props) => {
  const { link, newTabIndicator, newTabIndicatorSize, className, children } = props;
  const classes = cn(
    'text-foreground-link inline-flex gap-1 items-center hover:underline underline-offset-2 transition-all',
    {
      'hover:motion-safe:[&_svg]:animate-icon-external-link': newTabIndicator && link.newTab,
    },
    className,
  );

  if (link.type === 'reference') {
    return (
      <Link
        href={
          link.reference
            ? typeof link.reference?.value === 'object'
              ? link.reference.relationTo === 'pages'
                ? (getPagePath(link.reference.value) ?? errorPageUrl)
                : `/${link.reference.relationTo}/${link.reference.value.slug}`
              : errorPageUrl
            : link.url || errorPageUrl
        }
        target={link.newTab ? '_blank' : undefined}
        className={classes}
      >
        <span>{children}</span>
        {newTabIndicator && link.newTab && <ExternalLinkIcon size={newTabIndicatorSize || 16} />}
      </Link>
    );
  }

  return (
    <a
      href={link.url || errorPageUrl}
      target={link.newTab ? '_blank' : undefined}
      rel="noopener"
      referrerPolicy={link.allowReferrer ? 'strict-origin-when-cross-origin' : 'no-referrer'}
      className={classes}
    >
      <span>{children}</span>
      {newTabIndicator && link.newTab && <ExternalLinkIcon size={newTabIndicatorSize || 16} />}
    </a>
  );
};
