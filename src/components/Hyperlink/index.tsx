import { LinkField } from '@/fields/link';
import { cn } from '@/utilities/cn';
import Link from 'next/link';

// TODO: default url to not found page

interface Props {
  link: Partial<LinkField>;
  className?: string;
  children?: React.ReactNode;
}

const errorPageUrl = '/404';

export const Hyperlink = (props: Props) => {
  const { link, className, children } = props;
  const defaultStyle = 'text-foreground-link hover:underline underline-offset-2 transition-all';

  const styles = cn(defaultStyle, className);

  if (link.type === 'reference') {
    return (
      <Link
        href={
          link.reference
            ? typeof link.reference?.value === 'object'
              ? (link.reference.value.slug as string)
              : errorPageUrl
            : link.url || errorPageUrl
        }
        className={styles}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={link.url || errorPageUrl}
      target={link.newTab ? '_blank' : undefined}
      rel="noopener"
      referrerPolicy={link.allowReferrer ? 'strict-origin-when-cross-origin' : 'no-referrer'}
      className={styles}
    >
      {children}
    </a>
  );
};
