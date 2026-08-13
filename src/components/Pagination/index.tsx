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
import { RefObject, useCallback, useEffect, useState } from 'react';

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

export type PaginationProps = {
  page: number;
  perPage: number;
  totalDocs: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  pageSizes?: number[];
  className?: string;
  scrollToTopTargetRef?: RefObject<HTMLElement | null>;
  scrollToTopOffset?: number;
  isPending?: boolean;
};

/**
 * A fully controlled pagination UI. It holds no page/perPage state of its own (beyond the
 * transient text input), so multiple instances can be rendered independently on the same page
 * without conflicting over shared state such as URL query params.
 */
export const Pagination: React.FC<PaginationProps> = (props) => {
  // Bail out before mounting the inner component (and its hooks) when there's nothing to page through.
  if (props.totalDocs <= 0 || props.totalPages <= 1) {
    return null;
  }

  return <PaginationContent {...props} />;
};

const PaginationContent: React.FC<PaginationProps> = ({
  page,
  perPage,
  totalPages,
  onPageChange,
  onPerPageChange,
  pageSizes,
  className,
  scrollToTopTargetRef,
  scrollToTopOffset = 0,
  isPending = false,
}) => {
  // perPage drives the initial/selected page size, so it must be one of the offered options.
  if (pageSizes && !pageSizes.includes(perPage)) {
    throw new Error('Pagination component requires perPage to be included in pageSizes.');
  }

  const scrollToTopTarget = useCallback(() => {
    const target = scrollToTopTargetRef?.current;

    if (!target || typeof window === 'undefined') {
      return;
    }

    const targetTop = target.getBoundingClientRect().top + window.scrollY - scrollToTopOffset;

    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' });
  }, [scrollToTopOffset, scrollToTopTargetRef]);

  const goToPage = useCallback(
    (nextPage: number) => {
      const clamped = Math.min(Math.max(nextPage, 1), totalPages);

      if (clamped === page) {
        return;
      }

      scrollToTopTarget();
      onPageChange(clamped);
    },
    [onPageChange, page, scrollToTopTarget, totalPages],
  );

  const handlePageSizePick = (size: number) => {
    if (size === perPage) {
      return;
    }

    scrollToTopTarget();
    onPerPageChange?.(size);
  };

  const [userPageInput, setUserPageInput] = useState<string | null>(null);
  const [debouncedUserPageInput, setDebouncedUserPageInput] = useState<number | null>(null);

  // Reset the user input whenever the current page changes (e.g. from a button click).
  useEffect(() => {
    setUserPageInput(null);
    setDebouncedUserPageInput(null);
  }, [page]);

  // Debounce the user input to avoid excessive page changes and
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
  }, [totalPages, userPageInput]);

  // Process the debounced input and trigger the page change if it's valid and different from the current page
  useEffect(() => {
    if (debouncedUserPageInput === null) {
      return;
    }

    goToPage(debouncedUserPageInput);
    setDebouncedUserPageInput(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUserPageInput]);

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
    const half = Math.floor(middleWindowSize / 2);

    // Allowed start range for middle pages is [2 .. totalPages -1]
    const minStart = 2;
    const maxStart = totalPages - middleWindowSize;

    // Calculate the start and end page of the middle window, ensuring that it stays within the allowed range
    const startPage = Math.max(minStart, Math.min(page - half, maxStart));
    const endPage = Math.min(totalPages - 1, startPage + middleWindowSize - 1);

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

  return (
    <div
      className={cn('flex items-center justify-center gap-2', className, {
        'opacity-60': isPending,
      })}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm">Page</span>
        <input
          type="text"
          pattern="[0-9]+"
          value={userPageInput ?? page.toString()}
          onChange={(e) => setUserPageInput(e.target.value)}
          className="h-7 w-7 rounded-lg border border-njsig-neutral-primary bg-transparent px-1 py-1 text-center text-sm text-foreground outline-offset-4 transition-all focus-visible:ring-4 focus-visible:ring-njsig-neutral-primary/40"
        />
        <span className="text-sm">of {totalPages}</span>
      </div>
      {pageSizes && pageSizes.length > 1 && (
        <>
          <span className="text-sm text-foreground-muted"> | </span>
          <Popover>
            <PopoverTrigger
              className={cn(buttonVariants({ animation: 'bounceDown' }), BUTTON_VARIANT)}
            >
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
                      'pointer-events-none border-njsig-neutral-midtone bg-njsig-neutral-tint':
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
        </>
      )}
      <div className="ml-auto flex items-center gap-1.5">
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
                    'pointer-events-none border-njsig-neutral-midtone bg-njsig-neutral-tint':
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
