'use client';

import { RefObject, useEffect, useState } from 'react';
import { useScreenSize } from './useScreenSize';

export const useIsTruncated = ({ elementRef }: { elementRef: RefObject<HTMLElement | null> }) => {
  const { screenSize } = useScreenSize();
  const [isTruncated, setIsTruncated] = useState(false);

  const checkTruncation = (ref: RefObject<HTMLElement | null>) => {
    if (!ref.current) {
      setIsTruncated(false);
      return;
    }

    const element = ref.current;
    const isContentTruncated = element.scrollWidth > element.clientWidth;

    setIsTruncated(isContentTruncated);
  };

  useEffect(() => {
    checkTruncation(elementRef);
  }, [screenSize, elementRef]);

  return {
    isTruncated,
    checkTruncation,
  };
};
