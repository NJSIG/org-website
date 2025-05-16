import DynamicIcon from '@/components/DynamicIcon';
import { LinkField } from '@/fields/link/types';
import { cn } from '@/utilities/cn';
import { cva } from 'class-variance-authority';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';

type NavLinkType = LinkField & {
  linkIcon?: LinkField['icon'];
  linkTitle?: string | null | undefined;
  linkDescription?: string | null | undefined;
};

interface Props {
  link: NavLinkType;
  sizeVariant?: 'small' | 'medium';
  className?: string;
}

const errorPageUrl = '/404';
const navLinkVariants = cva('', {
  variants: {
    size: {
      small: '[&>div]:gap-1 [&_svg]:size-4 [&_svg]:stroke-1 [&_h3]:text-sm [&>p]:pl-5',
      medium: '[&>div]:gap-2 [_svg]:size-6 [_svg]:stroke-2 [&_h3]:text-base [&>p]:pl-8',
    },
  },
});

export const NavLink: React.FC<Props> = (props) => {
  const {
    link: { reference, linkIcon, linkTitle, linkDescription },
    sizeVariant = 'medium',
    className,
  } = props;

  const iconSize = sizeVariant === 'small' ? 16 : 24;

  return (
    <div className="flex items-start">
      <Link
        href={
          reference
            ? typeof reference?.value === 'object' && reference.value.slug
              ? `${reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''}/${reference.value.slug}`
              : errorPageUrl
            : errorPageUrl
        }
        className={cn(
          'flex items-start gap-2 p-3 transition-all disabled:pointer-events-none [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 focus-visible:ring-4 cursor-pointer outline-offset-4 text-foreground hover:bg-njsig-midtone/10 focus-visible:ring-njsig-midtone/40 dark:text-foreground-inverted group/nav-link rounded-lg w-full',
          className,
        )}
      >
        <div
          className={cn('flex-auto flex-col pr-2 gap-1', navLinkVariants({ size: sizeVariant }))}
        >
          <div className="inline-flex items-center gap-1 h-6">
            {linkIcon && <DynamicIcon name={linkIcon} size={iconSize} />}
            <h3 className="font-semibold">{linkTitle}</h3>
          </div>
          {linkDescription && (
            <p className="text-foreground-muted dark:text-foreground-inverted-muted max-w-64 text-sm">
              {linkDescription}
            </p>
          )}
        </div>
        <ArrowUpRightIcon
          size={iconSize}
          className="opacity-0 group-hover/nav-link:opacity-100 group-hover/nav-link:motion-safe:animate-micro-up-right"
        />
      </Link>
    </div>
  );
};
