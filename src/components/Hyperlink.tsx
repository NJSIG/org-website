import { ILinkField } from '@/fields/link';
import { cn } from '@/utilities/cn';
import Link from 'next/link';

// TODO: default url to not found page

interface Props {
  link: ILinkField;
  className?: string;
}

const errorPageUrl = '/404';

export const Hyperlink = (props: Props) => {
  const { link, className } = props;
  const defaultStyle = 'text-foreground-link hover:underline underline-offset-8';

  if (link.type === 'reference') {
    return (
      <Link
        href={
          typeof link.reference?.value === 'object'
            ? (link.reference.value.slug as string)
            : errorPageUrl
        }
        className={cn(defaultStyle, className)}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <a
      href={link.url || errorPageUrl}
      target={link.newTab ? '_blank' : undefined}
      rel="noopener"
      referrerPolicy={link.allowReferrer ? 'strict-origin-when-cross-origin' : 'no-referrer'}
      className={cn(defaultStyle, className)}
    >
      {link.label}
    </a>
  );
};
