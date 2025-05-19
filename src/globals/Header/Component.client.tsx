'use client';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { LinkAppearanceHelper } from '@/fields/link/types';
import type { Header } from '@/payload-types';
import { buttonVariants } from '@/primitives/ui/button-prime';
import { Theme } from '@/providers/Theme/types';
import { cn } from '@/utilities/cn';
import { PanelRightCloseIcon, PanelRightOpenIcon } from 'lucide-react';
import Link from 'next/link';
import { NavLink } from './components/nav-link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationSearchTrigger,
} from './components/navigation-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './components/sheet';

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
      className={cn(baseStyles, theme === 'dark' ? darkStyles : lightStyles, '@container/header')}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 xl:px-0">
        <Link href="/">
          <Logo style="wordmark" theme={theme} width={150} />
        </Link>

        {/* Full Navigation */}
        <div className="items-center gap-4 zm-80 @5xl/header:zm-normal hidden @3xl/header:flex">
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
                                <NavigationMenuLink asChild>
                                  <Button
                                    link={{
                                      ...group.callout.calloutLink,
                                      ...calloutLinkAppearance,
                                    }}
                                    className="w-max"
                                  />
                                </NavigationMenuLink>
                              )}
                            </div>
                          )}
                          {group.callout && group.links && (
                            <span className="w-px self-stretch bg-divider shrink-0"></span>
                          )}
                          {group.links && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-max">
                              {group.links.map((item) => (
                                <div className="flex items-start" key={item.id}>
                                  <NavigationMenuLink asChild>
                                    <NavLink link={item.link} />
                                  </NavigationMenuLink>
                                </div>
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
                  <NavigationSearchTrigger aria-label="Search">
                    <span className="hidden @5xl/header:inline">Search</span>
                  </NavigationSearchTrigger>
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

        {/* Mobile Navigation */}
        <div className="@3xl/header:hidden">
          <Sheet>
            <SheetTrigger
              className={cn(buttonVariants({ variant: 'button', style: 'ghost', size: 'medium' }))}
            >
              Menu
              <PanelRightOpenIcon />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="invisible h-0">Navigation Menu</SheetTitle>
                <SheetClose
                  className={cn(
                    buttonVariants({ variant: 'button', style: 'ghost', size: 'medium' }),
                    'self-end',
                  )}
                >
                  Close
                  <PanelRightCloseIcon />
                </SheetClose>
              </SheetHeader>
              <SheetFooter>
                {ctaButtons && (
                  <div className="flex flex-col gap-2">
                    {ctaButtons.map(
                      (ctaButton) =>
                        ctaButton.link && (
                          <Button
                            link={{ ...ctaButton.link, ...ctaButtonAppearance }}
                            key={ctaButton.id}
                          />
                        ),
                    )}
                  </div>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
