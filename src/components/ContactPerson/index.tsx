import { Contact, ContactPortrait } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { cva } from 'class-variance-authority';
import Image from 'next/image';

type ContactPersonProps = {
  contact: Contact;
  size?: 'sm' | 'md';
  title?: string;
  priority?: boolean;
  className?: string;
};

const portraitVariants = cva(['rounded-full'], {
  variants: {
    size: {
      sm: 'border',
      md: 'border-2',
    },
    type: {
      njsig: 'border-njsig-primary',
      broker: 'border-[var(--subfund-contact-ring)]',
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

  // const src =
  //   size === 'sm'
  //     ? (portrait as ContactPortrait)?.sizes?.sm?.url || '/assets/placeholder/contact-sm.webp'
  //     : (portrait as ContactPortrait)?.sizes?.md?.url || '/assets/placeholder/contact-md.webp';

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
          decoding="async"
          src={(portrait as ContactPortrait).url!}
          className={portraitVariants({ size, type })}
        />
      ) : (
        <Image
          alt={`${name} Placeholder`}
          width={size === 'sm' ? 40 : 56}
          height={size === 'sm' ? 40 : 56}
          priority={priority}
          decoding="async"
          src={`/assets/placeholder/contact-${size}.webp`}
          className={portraitVariants({ size, type })}
          unoptimized
        />
      )}
      <div className={cn('flex flex-col', { 'gap-1': size === 'sm', 'gap-2': size === 'md' })}>
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
