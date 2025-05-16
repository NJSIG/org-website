import { LinkField } from '@/fields/link/types';
import { buttonVariants } from '@/primitives/ui/button-prime';
import { cn } from '@/utilities/cn';
import { cva } from 'class-variance-authority';
import Link from 'next/link';
import DynamicIcon from '../DynamicIcon';
import { Hyperlink } from '../Hyperlink';

interface Props {
  link: Partial<LinkField>;
  className?: string;
}

const errorPageUrl = '/404';

const buttonMicroInteractionVariants = cva('', {
  variants: {
    animation: {
      none: '',
      wiggle: 'hover:motion-safe:[&_svg]:animate-micro-wiggle',
      upRight: 'hover:motion-safe:[&_svg]:animate-micro-up-right',
    },
  },
});

const Button: React.FC<Props> = (props) => {
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

    // Determine the micro interaction
    const desiredMicroInteraction = microInteraction || 'none';

    // Return a styled anchor tag for custom links
    if (type === 'custom') {
      return (
        <a
          href={url || errorPageUrl}
          target={newTab ? '_blank' : undefined}
          rel="noopener"
          referrerPolicy={allowReferrer ? 'strict-origin-when-cross-origin' : 'no-referrer'}
          className={cn(
            buttonVariants({
              variant: appearance,
              style: styleVariant ? styleVariant : undefined,
              color: colorVariant ? colorVariant : undefined,
              size: sizeVariant ? sizeVariant : undefined,
            }),
            buttonMicroInteractionVariants({ animation: desiredMicroInteraction }),
            className,
          )}
        >
          {iconPosition === 'before' && icon && <DynamicIcon name={icon} size={iconSize} />}
          <span>{label}</span>
          {iconPosition === 'after' && icon && <DynamicIcon name={icon} size={iconSize} />}
        </a>
      );
    }

    // Return a styled link for reference links
    if (type === 'reference') {
      return (
        <Link
          href={
            reference
              ? typeof reference?.value === 'object' && reference.value.slug
                ? `${reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''}/${reference.value.slug}`
                : errorPageUrl
              : url || errorPageUrl
          }
          className={cn(
            buttonVariants({
              variant: appearance,
              style: styleVariant ? styleVariant : undefined,
              color: colorVariant ? colorVariant : undefined,
              size: sizeVariant ? sizeVariant : undefined,
            }),
            buttonMicroInteractionVariants({ animation: desiredMicroInteraction }),
            className,
          )}
        >
          {iconPosition === 'before' && icon && <DynamicIcon name={icon} size={iconSize} />}
          <span>{label}</span>
          {iconPosition === 'after' && icon && <DynamicIcon name={icon} size={iconSize} />}
        </Link>
      );
    }
  }

  // If no appearance is set, return a hyperlink
  return <Hyperlink link={link} className={className} />;
};

export { Button, buttonMicroInteractionVariants };
