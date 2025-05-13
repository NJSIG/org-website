import { SVGProps } from 'react';

export type IconSize = 16 | 24 | 40;

export interface CustomIconProps extends SVGProps<SVGSVGElement> {
  size?: IconSize;
  className?: string;
}

// INFO: Adding custom icons:
// 1. Follow the design guidelines here: https://lucide.dev/guide/design/icon-design-guide
// 2. Tidy up the SVG with https://studio.lucide.dev/edit
//    - NOTE: You must camelCase SVG properties that are kebab-case from the SVG editor
//    - e.g. stroke-width becomes strokeWidth
// 3. Create an icon component in this directory (src/icons)
// 4. Add the icon import to the list below
// 5. Add the icon name with a list of tags in tags.json file in this directory (src/icons/tags.json)

export const customIconImports = {
  'car-crash': () => import('@/icons/CarCrash'),
} as const;
