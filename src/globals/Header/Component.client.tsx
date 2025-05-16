'use client';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { LinkAppearanceHelper } from '@/fields/link/types';
import type { Header } from '@/payload-types';
import { Theme } from '@/providers/Theme/types';
import { cn } from '@/utilities/cn';
import Link from 'next/link';
import { NavLink } from './components/nav-link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationSearchTrigger,
} from './components/navigation-menu';

interface HeaderClientProps {
  data: Header;
}

// We limit the options the user can set for the CTA buttons in the CMS
// so we're adding setting the missing options here
const ctaButtonAppearance: LinkAppearanceHelper<'cta'> = {
  styleVariant: 'flat',
  sizeVariant: 'medium',
};

// We don't allow users to set the appearance of the Callout Link in the CMS
// so we're using a default appearance
const calloutLinkAppearance: LinkAppearanceHelper<'button'> = {
  appearance: 'button',
  styleVariant: 'flat',
  colorVariant: 'primary',
  sizeVariant: 'medium',
  iconPosition: 'after',
  icon: 'arrow-up-right',
  microInteraction: 'upRight',
};

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const { headerTheme } = useHeaderTheme();
  const [theme, setTheme] = useState<Theme | null>('dark');

  const { navGroups, ctaButtons } = data;

  const baseStyles = 'w-full h-20';
  const darkStyles = 'bg-azure-to-r text-foreground-inverted dark';
  const lightStyles = 'bg-white text-foreground';

  // TODO: Do we really need to set the theme on every route change?
  // const { headerTheme, setHeaderTheme } = useHeaderTheme();
  // const pathname = usePathname();
  // useEffect(() => {
  //   setHeaderTheme(null);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname]);

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme]);

  return (
    <header
      className={cn(baseStyles, theme === 'dark' ? darkStyles : lightStyles)}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 xl:px-0">
        <Link href="/">
          <Logo style="wordmark" theme={theme} width={150} />
        </Link>
        <div className="flex items-center gap-4">
          {navGroups && (
            <NavigationMenu aria-label="Main Navigation">
              <NavigationMenuList>
                {navGroups.map((group) => (
                  <React.Fragment key={group.id}>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>{group.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="flex gap-6 justify-center items-start">
                          {group.callout && (
                            <div className="flex flex-col gap-6 min-w-80 max-w-lg w-min">
                              <div className="flex flex-col gap-3">
                                <h2 className="text-2xl font-medium">{group.callout.title}</h2>
                                <p>{group.callout.text}</p>
                              </div>
                              {group.callout.calloutLink && (
                                <Button
                                  link={{
                                    ...group.callout.calloutLink,
                                    ...calloutLinkAppearance,
                                  }}
                                  className="w-max"
                                />
                              )}
                            </div>
                          )}
                          {group.callout && group.links && (
                            <span className="w-px self-stretch bg-divider shrink-0"></span>
                          )}
                          {group.links && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-max">
                              {group.links.map((item) => (
                                <NavLink key={item.id} link={item.link} />
                              ))}
                            </div>
                          )}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <span className="h-7 w-px mx-0.5 bg-foreground-inverted opacity-40"></span>
                  </React.Fragment>
                ))}
                <NavigationMenuItem>
                  <NavigationSearchTrigger>Search</NavigationSearchTrigger>
                  <NavigationMenuContent>
                    <p>TODO: Implement search functionality</p>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
          {ctaButtons &&
            ctaButtons.map(
              (ctaButton) =>
                ctaButton.link && (
                  <Button link={{ ...ctaButton.link, ...ctaButtonAppearance }} key={ctaButton.id} />
                ),
            )}
        </div>
      </div>
    </header>
  );
};
