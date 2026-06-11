import { Contact, ContactPortrait } from '@/payload-types';
import { blurDataToBlurDataURL } from '@/utilities/blurDataToBlurDataURL';
import { cn } from '@/utilities/cn';
import coolifyImageLoader from '@/utilities/coolifyImageLoader';
import { cva } from 'class-variance-authority';
import Image from 'next/image';

export enum ContactPersonPortraitOptions {
  IfAvailable = 'ifAvailable',
  Always = 'always',
  Never = 'never',
}

type ContactPersonProps = {
  contact: Contact;
  size?: 'sm' | 'md';
  showPortrait?: ContactPersonPortraitOptions;
  priority?: boolean;
  className?: string;
};

const portraitVariants = cva(['rounded-full'], {
  variants: {
    size: {
      sm: 'border-2 size-10',
      md: 'border-2 size-14',
    },
    type: {
      njsig: 'border-njsig-primary',
      broker: 'border-(--subfund-contact-ring)',
      trustee: 'border-njsig-accent-primary',
    },
  },
});

export const ContactPerson: React.FC<ContactPersonProps> = ({
  contact,
  size = 'md',
  priority = false,
  showPortrait = ContactPersonPortraitOptions.Always,
  className,
}) => {
  if (!contact) {
    return null;
  }

  const { portrait, type, name, title, organization } = contact;

  let resolvedTitle: string | null = null;

  if (title) {
    resolvedTitle = title;
  } else {
    switch (type) {
      case 'njsig':
        resolvedTitle = 'NJSIG Representative';
        break;
      case 'broker':
        resolvedTitle = 'Broker';
        break;
      case 'trustee':
        resolvedTitle = 'Trustee';
        break;
    }
  }

  return (
    <div
      className={cn(
        'flex items-center',
        { 'gap-2': size === 'sm', 'gap-4 p-2': size === 'md' },
        className,
      )}
    >
      {showPortrait !== ContactPersonPortraitOptions.Never &&
      portrait &&
      typeof portrait === 'object' ? (
        <Image
          alt={`${name} Portrait`}
          width={size === 'sm' ? 40 : 56}
          height={size === 'sm' ? 40 : 56}
          priority={priority}
          quality={90}
          decoding="async"
          src={
            (portrait as ContactPortrait).url
              ? (portrait as ContactPortrait).url!
              : `/assets/placeholders/contact-${size}.webp`
          }
          placeholder="blur"
          blurDataURL={blurDataToBlurDataURL((portrait as ContactPortrait)?.blurData)}
          className={portraitVariants({ size, type })}
          loader={coolifyImageLoader}
        />
      ) : showPortrait === ContactPersonPortraitOptions.Always ? (
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
      ) : null}
      <div className={cn('flex flex-col', { 'gap-0': size === 'sm', 'gap-1': size === 'md' })}>
        <span className={cn('font-bold', { 'text-sm': size === 'sm', 'text-base': size === 'md' })}>
          {name}
        </span>
        {resolvedTitle && <small className="font-medium text-xs">{resolvedTitle}</small>}
        {type !== 'njsig' && organization && <small className="text-xs">{organization}</small>}
      </div>
    </div>
  );
};
