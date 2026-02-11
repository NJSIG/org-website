import { LinkField } from '@/fields/Link/types';
import { Button } from '@/primitives/ui/button';
import { cn } from '@/utilities/cn';
import Link from 'next/link';
import DynamicIcon from '../DynamicIcon';
import { Hyperlink } from '../Hyperlink';

interface Props {
  link: Partial<LinkField>;
  className?: string;
}

const errorPageUrl = '/404';

const ButtonLink: React.FC<Props> = (props) => {
  const {
    link,
    link: {
      type,
      newTab,
      allowReferrer,
      reference,
      url,
      label,
      appearance,
      styleVariant,
      colorVariant,
      sizeVariant,
      iconPosition,
      icon,
      microInteraction,
    },
    className,
  } = props;

  // If appearance is set, return a button
  if (appearance !== false && appearance !== undefined) {
    // Determine Icon Size
    const iconSize = sizeVariant === 'small' ? 16 : 24;

    // Return a styled anchor tag for custom links
    if (type === 'custom') {
      return (
        <Button
          asChild
          variant={appearance}
          style={styleVariant || undefined}
          color={colorVariant || undefined}
          size={sizeVariant || undefined}
          animation={microInteraction || undefined}
          className={cn({ '[&_svg]:-order-1': iconPosition === 'before' }, className)}
        >
          <a
            href={url || errorPageUrl}
            target={newTab ? '_blank' : undefined}
            rel="noopener"
            referrerPolicy={allowReferrer ? 'strict-origin-when-cross-origin' : 'no-referrer'}
          >
            <span>{label}</span>
            {icon && <DynamicIcon name={icon} size={iconSize} />}
          </a>
        </Button>
      );
    }

    // Return a styled link for reference links
    if (type === 'reference') {
      return (
        <Button
          asChild
          variant={appearance}
          style={styleVariant || undefined}
          color={colorVariant || undefined}
          size={sizeVariant || undefined}
          animation={microInteraction || undefined}
          className={cn({ '[&_svg]:-order-1': iconPosition === 'before' }, className)}
        >
          <Link
            href={
              reference
                ? typeof reference?.value === 'object' && reference.value.slug
                  ? `${reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''}/${reference.value.slug}`
                  : errorPageUrl
                : url || errorPageUrl
            }
          >
            <span>{label}</span>
            {icon && <DynamicIcon name={icon} size={iconSize} />}
          </Link>
        </Button>
      );
    }
  }

  // If no appearance is set, return a hyperlink
  return <Hyperlink link={link} className={className} />;
};

export { ButtonLink };
