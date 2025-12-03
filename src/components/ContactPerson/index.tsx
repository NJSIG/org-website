import { Contact, ContactPortrait } from '@/payload-types';
import { blurDataToBlurDataURL } from '@/utilities/blurDataToBlurDataURL';
import { cn } from '@/utilities/cn';
import coolifyImageLoader from '@/utilities/coolifyImageLoader';
import { cva } from 'class-variance-authority';
import Image from 'next/image';

type ContactPersonProps = {
  contact: Contact;
  size?: 'sm' | 'md';
  title?: string;
  priority?: boolean;
  className?: string;
};

// Default Placeholder Blur Data URL
const defaultPlaceholder =
  'data:image/webp;base64,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';

const portraitVariants = cva(['rounded-full'], {
  variants: {
    size: {
      sm: 'border-2 size-10',
      md: 'border-2 size-14',
    },
    type: {
      njsig: 'border-njsig-primary',
      broker: 'border-(--subfund-contact-ring)',
    },
  },
});

export const ContactPerson: React.FC<ContactPersonProps> = ({
  contact,
  size = 'md',
  title: titleFromProps,
  priority = false,
  className,
}) => {
  if (!contact) {
    return null;
  }

  const { portrait, type, name, title } = contact;

  return (
    <div
      className={cn(
        'flex items-center',
        { 'gap-2': size === 'sm', 'gap-4 p-2': size === 'md' },
        className,
      )}
    >
      {portrait && typeof portrait === 'object' ? (
        <Image
          alt={`${name} Portrait`}
          width={size === 'sm' ? 40 : 56}
          height={size === 'sm' ? 40 : 56}
          priority={priority}
          quality={90}
          decoding="async"
          src={(portrait as ContactPortrait).url!}
          placeholder="blur"
          blurDataURL={
            blurDataToBlurDataURL((portrait as ContactPortrait)?.blurData) || defaultPlaceholder
          }
          className={portraitVariants({ size, type })}
          loader={coolifyImageLoader}
        />
      ) : (
        <Image
          alt={`${name} Placeholder`}
          width={size === 'sm' ? 40 : 56}
          height={size === 'sm' ? 40 : 56}
          priority={priority}
          decoding="async"
          quality={90}
          src={`/assets/placeholders/contact-${size}.webp`}
          className={portraitVariants({ size, type })}
          unoptimized
          loader={coolifyImageLoader}
        />
      )}
      <div className={cn('flex flex-col', { 'gap-0': size === 'sm', 'gap-1': size === 'md' })}>
        <span className={cn('font-bold', { 'text-sm': size === 'sm', 'text-base': size === 'md' })}>
          {name}
        </span>
        <small className="font-medium text-xs">
          {titleFromProps
            ? titleFromProps
            : title
              ? title
              : type === 'njsig'
                ? 'NJSIG Representative'
                : 'Broker'}
        </small>
      </div>
    </div>
  );
};
