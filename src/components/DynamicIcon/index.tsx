'use client';

import { customIconImports, IconSize } from '@/icons';
import { cn } from '@/utilities/cn';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import dynamic from 'next/dynamic';
import { memo } from 'react';

// Types
type LucideIconNames = keyof typeof dynamicIconImports;
type CustomIconNames = keyof typeof customIconImports;
type IconNames = LucideIconNames | CustomIconNames;
type ReactComponent = React.FC<{ className?: string; size?: IconSize }>;

// Initialize dynamic components
const iconComponents = {} as Record<IconNames, ReactComponent>;

// Load Lucide Icons with a loading skeleton to avoid jarring pop-in
for (const name of Object.keys(dynamicIconImports) as LucideIconNames[]) {
  iconComponents[name] = dynamic(dynamicIconImports[name], {
    ssr: false,
  }) as ReactComponent;
}

// Load Custom Icons with a loading skeleton to avoid jarring pop-in
for (const name of Object.keys(customIconImports) as CustomIconNames[]) {
  iconComponents[name] = dynamic(customIconImports[name], {
    ssr: false,
  }) as ReactComponent;
}

// Dynamic Icon Component
type DynamicIconProps = {
  name: IconNames | string | undefined;
  className?: string;
  size?: IconSize;
};

const DynamicIcon = memo(({ name, size, ...rest }: DynamicIconProps) => {
  if (!name || !(name in iconComponents)) return null;

  const Icon = iconComponents[name as IconNames];

  return (
    <span
      className={cn(
        'inline-block empty:rounded-sm empty:bg-njsig-neutral-primary/8 empty:animate-pulse',
        {
          'size-4': size === 16,
          'size-6': size === 24,
          'size-10': size === 40,
        },
      )}
    >
      <Icon size={size} {...rest} />
    </span>
  );
});

DynamicIcon.displayName = 'DynamicIcon';

export default DynamicIcon;
