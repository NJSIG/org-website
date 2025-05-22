'use client';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import React, { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/Accordion';
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
  const [navSheetOpen, setNavSheetOpen] = useState(false);

  const { navGroups, ctaButtons } = data;

  const darkStyles = 'bg-azure-to-r text-foreground-inverted dark';
  const lightStyles = 'bg-white text-foreground';

  // TODO: Do we really need to set the theme on every route change?
  // const { headerTheme, setHeaderTheme } = useHeaderTheme();
  // const pathname = usePathname();
  // useEffect(() => {
  //   setHeaderTheme(null);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname]);

  //  Set the Header Theme
  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme]);

  // Close the nav sheet when the screen is resized to desktop size
  useEffect(() => {
    // We change nav modes at 768px = @3xl container breakpoint
    const mql = window.matchMedia('(min-width: 768px)');

    const handleScreenResize = (e: MediaQueryListEvent) => {
      if (navSheetOpen && e.matches) {
        setNavSheetOpen(false);
      }
    };

    mql.addEventListener('change', handleScreenResize);

    return () => {
      mql.removeEventListener('change', handleScreenResize);
    };
  }, [navSheetOpen]);

  return (
    <header
      className={cn('w-full h-20 @container/header', theme === 'dark' ? darkStyles : lightStyles)}
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
          <Sheet open={navSheetOpen} onOpenChange={setNavSheetOpen} modal>
            <SheetTrigger
              className={cn(buttonVariants({ variant: 'button', style: 'ghost', size: 'medium' }))}
            >
              Menu
              <PanelRightOpenIcon />
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetHeader>
                <SheetTitle className="invisible h-0">Navigation Menu</SheetTitle>
                <SheetClose
                  className={cn(
                    buttonVariants({ variant: 'button', style: 'ghost', size: 'medium' }),
                    'w-full justify-end',
                  )}
                >
                  Close
                  <PanelRightCloseIcon />
                </SheetClose>
              </SheetHeader>
              {navGroups && (
                <nav className="h-full p-4 overflow-y-auto" aria-label="Main Navigation">
                  <Accordion type="single" collapsible>
                    {navGroups.map((group) => (
                      <AccordionItem key={group.id} value={group.label} className="py-3">
                        <AccordionTrigger>{group.label}</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-4 pt-3 px-1.5">
                            {group.callout && (
                              <div className="flex flex-col gap-4">
                                <h2 className="text-base font-semibold">{group.callout.title}</h2>
                                <p className="text-sm">{group.callout.text}</p>
                                {group.callout.calloutLink && (
                                  <Button
                                    link={{
                                      ...group.callout.calloutLink,
                                      ...calloutLinkAppearance,
                                    }}
                                    className="w-full [&_svg]:ml-auto"
                                  />
                                )}
                              </div>
                            )}
                            {group.callout && group.links && (
                              <span className="w-full h-px bg-divider shrink-0"></span>
                            )}
                            {group.links && (
                              <div className="flex flex-col gap-2">
                                {group.links
                                  .sort((a, b) =>
                                    (a.link.mobileOrder || 1) > (b.link.mobileOrder || 1) ? 1 : -1,
                                  )
                                  .map((item) => (
                                    <NavLink link={item.link} key={item.id} sizeVariant="small" />
                                  ))}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    <AccordionItem value="Search" className="py-3">
                      <AccordionTrigger icon="search" className="[&[data-state=open]>svg]:rotate-0">
                        Search
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>TODO: Implement search functionality</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </nav>
              )}
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
