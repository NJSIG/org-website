'use client';

import { Button } from '@/primitives/ui/button';
import { cn } from '@/utilities/cn';
import Link from 'next/link';

export type SidebarNavProps = {
  navLabel: string;
  side?: 'left' | 'right';
  links: {
    label: string;
    url: string;
    isActive?: boolean;
  }[];
  overrideStyles?: {
    container?: string;
    nav?: string;
    content?: string;
    link?: string;
    activeLink?: string;
  };
  children: React.ReactNode;
};

export const SidebarNav: React.FC<SidebarNavProps> = ({
  navLabel,
  side = 'left',
  links,
  overrideStyles,
  children,
}) => {
  const isLeft = side === 'left';

  return (
    <div
      className={cn(
        'px-4 pt-8 pb-12 flex flex-col items-center lg:flex-row lg:items-start lg:px-0 gap-6 max-w-7xl mx-auto',
        {
          'lg:flex-row-reverse': !isLeft,
        },
        overrideStyles?.container,
      )}
    >
      <nav
        aria-label={navLabel}
        className={cn(
          'w-full lg:w-1/6 flex flex-col gap-2 rounded-3xl bg-njsig-neutral-tint p-4',
          overrideStyles?.nav,
        )}
      >
        {links.map((link) => (
          <Button
            key={link.url}
            asChild
            variant="button"
            style="ghost"
            color="primary"
            size="medium"
            animation="none"
            className={cn(
              {
                'font-bold bg-njsig-midtone/20 hover:bg-njsig-midtone/30': link.isActive,
              },
              overrideStyles?.link,
              link.isActive && overrideStyles?.activeLink,
            )}
          >
            <Link href={link.url}>
              <span>{link.label}</span>
            </Link>
          </Button>
        ))}
      </nav>
      <div className={cn('w-full lg:w-5/6 flex flex-col gap-4', overrideStyles?.content)}>
        {children}
      </div>
    </div>
  );
};
