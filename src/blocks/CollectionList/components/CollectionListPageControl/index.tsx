'use client';

import { Button, buttonVariants } from '@/primitives/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/primitives/ui/popover';
import { cn } from '@/utilities/cn';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const BUTTON_VARIANT = buttonVariants({
  variant: 'button',
  style: 'outline',
  color: 'neutral',
  size: 'small',
});

const ICON_BUTTON_VARIANT = buttonVariants({
  variant: 'icon',
  style: 'outline',
  color: 'neutral',
  size: 'small',
});

export type CollectionListPageControlProps = {
  totalDocs: number;
  pageSizes?: number[];
  className?: string;
};

export const CollectionListPageControl: React.FC<CollectionListPageControlProps> = ({
  totalDocs,
  pageSizes = [10, 25, 50],
  className,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = searchParams?.get('page') ? parseInt(searchParams?.get('page') as string, 10) : 1;
  const perPage = searchParams?.get('perPage')
    ? parseInt(searchParams?.get('perPage') as string, 10)
    : 10;

  const totalPages = Math.ceil(totalDocs / perPage);
  const [userPageInput, setUserPageInput] = useState<string | null>(null);
  const [debouncedUserPageInput, setDebouncedUserPageInput] = useState<number | null>(null);

  // Build page button set based on the current page and total pages, ensuring that the buttons are centered around the current page
  // insert null values to represent ellipses when there are more pages than can be displayed in the button set
  const buildPageButtons = useCallback(() => {
    const buttons: (number | null)[] = [];
    const maxButtons = 5;
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }

      return buttons;
    }

    // Keep first/last pages visible and center a sliding window between them.
    const middleWindowSize = maxButtons - 2;
    let startPage = Math.max(2, page - Math.floor(middleWindowSize / 2));
    let endPage = Math.min(totalPages - 1, startPage + middleWindowSize - 1);

    startPage = Math.max(2, endPage - middleWindowSize + 1);

    buttons.push(1);

    if (startPage > 2) {
      buttons.push(null);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    if (endPage < totalPages - 1) {
      buttons.push(null);
    }

    buttons.push(totalPages);

    return buttons;
  }, [page, totalPages]);

  // Handle the creation of query strings for updating the router with new page or perPage values
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  // Handle the selection of a new page size and update the router accordingly
  const handlePageSizePick = (size: number) => {
    const queryString = createQueryString('perPage', size.toString());
    router.push(`${pathname}?${queryString}`);
  };

  // Reset the user input when the page changes in the router
  useEffect(() => {
    setUserPageInput(null);
    setDebouncedUserPageInput(null);
  }, [page]);

  // Debounce the user input to avoid excessive router pushes and
  // validate the input to ensure it's a number within the valid range
  useEffect(() => {
    if (userPageInput === null) {
      return;
    }

    const timeout = setTimeout(() => {
      const pageNumber = parseInt(userPageInput, 10);

      if (!isNaN(pageNumber)) {
        if (pageNumber < 1) {
          setDebouncedUserPageInput(1);
        }

        if (pageNumber > totalPages) {
          setDebouncedUserPageInput(totalPages);
        }

        if (pageNumber >= 1 && pageNumber <= totalPages) {
          setDebouncedUserPageInput(pageNumber);
        }
      } else {
        console.warn('Invalid page number input:', userPageInput);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [userPageInput]);

  // Process the debounced input and update the router if it's valid and different from the current page
  useEffect(() => {
    if (debouncedUserPageInput === null) {
      return;
    }

    const pageNumber = debouncedUserPageInput;

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== page) {
      const queryString = createQueryString('page', pageNumber.toString());
      router.push(`${pathname}?${queryString}`);
    }

    setDebouncedUserPageInput(null);
  }, [debouncedUserPageInput, totalPages, page, createQueryString, pathname, router]);

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <div className="flex items-center gap-2">
        <span className="text-sm">Page</span>
        <input
          type="text"
          pattern="[0-9]+"
          value={userPageInput || page.toString()}
          onChange={(e) => setUserPageInput(e.target.value)}
          className="transition-all focus-visible:ring-4 outline-offset-4 rounded-lg bg-transparent text-sm h-7 px-1 py-1 text-foreground border border-njsig-neutral-primary focus-visible:ring-njsig-neutral-primary/40 w-7 text-center"
        />
        <span className="text-sm">of {totalPages}</span>
      </div>
      <span className="text-sm text-foreground-muted"> | </span>
      <Popover>
        <PopoverTrigger className={cn(buttonVariants({ animation: 'bounceDown' }), BUTTON_VARIANT)}>
          <span>{perPage} per page</span>
          <ChevronDownIcon size={16} />
        </PopoverTrigger>
        <PopoverContent collisionPadding={16} className="w-14 p-1">
          <div className="flex flex-col gap-2">
            {pageSizes.map((size) => (
              <Button
                type="button"
                style="ghost"
                color="neutral"
                size="small"
                key={`pagesize-${size}`}
                className={cn('border border-transparent', {
                  'border-njsig-neutral-midtone bg-njsig-neutral-tint pointer-events-none':
                    size === perPage,
                })}
                onClick={() => handlePageSizePick(size)}
                aria-label={`${size} per page`}
              >
                {size}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex items-center ml-auto gap-1.5">
        <Button
          className={cn(buttonVariants({ animation: 'bounceLeft' }), ICON_BUTTON_VARIANT)}
          disabled={page <= 1}
          onClick={() => setDebouncedUserPageInput(1)}
          aria-label="First page"
        >
          <ChevronsLeftIcon size={16} />
        </Button>
        <Button
          className={cn(buttonVariants({ animation: 'bounceLeft' }), ICON_BUTTON_VARIANT)}
          disabled={page <= 1}
          onClick={() => setDebouncedUserPageInput(page - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeftIcon size={16} />
        </Button>
        <div className="flex items-center gap-1">
          {buildPageButtons().map((button, index) => {
            if (button === null) {
              return (
                <span
                  key={`page-button-${index}`}
                  className={cn(
                    buttonVariants({
                      variant: 'button',
                      style: 'ghost',
                      color: 'neutral',
                      size: 'small',
                    }),
                    'pointer-events-none',
                  )}
                >
                  &hellip;
                </span>
              );
            }

            return (
              <Button
                key={`page-button-${index}`}
                className={cn(
                  buttonVariants({
                    variant: 'button',
                    style: 'ghost',
                    color: 'neutral',
                    size: 'small',
                  }),
                  {
                    'bg-njsig-neutral-tint border-njsig-neutral-midtone pointer-events-none':
                      button === page && button !== null,
                  },
                )}
                onClick={() => setDebouncedUserPageInput(button)}
                aria-label={`Page ${button}`}
              >
                {button}
              </Button>
            );
          })}
        </div>
        <Button
          className={cn(buttonVariants({ animation: 'bounceRight' }), ICON_BUTTON_VARIANT)}
          disabled={page >= totalPages}
          onClick={() => setDebouncedUserPageInput(page + 1)}
          aria-label="Next Page"
        >
          <ChevronRightIcon size={16} />
        </Button>
        <Button
          className={cn(buttonVariants({ animation: 'bounceRight' }), ICON_BUTTON_VARIANT)}
          disabled={page >= totalPages}
          onClick={() => setDebouncedUserPageInput(totalPages)}
          aria-label="Last page"
        >
          <ChevronsRightIcon size={16} />
        </Button>
      </div>
    </div>
  );
};
