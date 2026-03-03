export type TextStateFontSizeConfig = Record<
  '2xs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl',
  {
    label: string;
    css: Record<string, string>;
  }
>;

export const defaultFontSizes: TextStateFontSizeConfig = {
  '2xs': {
    label: '2XS',
    css: {
      fontSize: '0.625rem', // 10px
    },
  },
  xs: {
    label: 'Extra Small',
    css: {
      fontSize: '0.75rem', // 12px
    },
  },
  sm: {
    label: 'Small',
    css: {
      fontSize: '0.875rem', // 14px
    },
  },
  base: {
    label: 'Base',
    css: {
      fontSize: '1rem', // 16px
    },
  },
  lg: {
    label: 'Large',
    css: {
      fontSize: '1.125rem', // 18px
    },
  },
  xl: {
    label: 'XL',
    css: {
      fontSize: '1.25rem', // 20px
    },
  },
  '2xl': {
    label: '2XL',
    css: {
      fontSize: '1.5rem', // 24px
    },
  },
  '3xl': {
    label: '3XL',
    css: {
      fontSize: '1.875rem', // 30px
    },
  },
  '4xl': {
    label: '4XL',
    css: {
      fontSize: '2.25rem', // 36px
    },
  },
  '5xl': {
    label: '5XL',
    css: {
      fontSize: '3rem', // 48px
    },
  },
  '6xl': {
    label: '6XL',
    css: {
      fontSize: '3.75rem', // 60px
    },
  },
};

const DEFAULT_SIZES: Array<keyof typeof defaultFontSizes> = ['sm', 'base', 'lg', 'xl'];

export const availableFontSizes = (
  enabledSizes: Array<keyof typeof defaultFontSizes>,
): TextStateFontSizeConfig => {
  if (!Array.isArray(enabledSizes) || !enabledSizes.every((size) => size in defaultFontSizes)) {
    console.warn(
      `Invalid font sizes provided: ${enabledSizes}. Falling back to default sizes: ${DEFAULT_SIZES.join(', ')}.`,
    );

    enabledSizes = DEFAULT_SIZES;
  }

  return Object.fromEntries(
    Object.entries(defaultFontSizes).filter(([size]) =>
      enabledSizes.includes(size as keyof typeof defaultFontSizes),
    ),
  ) as TextStateFontSizeConfig;
};
