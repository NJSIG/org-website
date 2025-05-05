'use client';

import { customIconImports, IconSize } from '@/icons';
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

// Load Lucide Icons
for (const name of Object.keys(dynamicIconImports) as LucideIconNames[]) {
  iconComponents[name] = dynamic(dynamicIconImports[name], {
    ssr: false,
  }) as ReactComponent;
}

// Load Custom Icons
for (const name of Object.keys(customIconImports) as CustomIconNames[]) {
  iconComponents[name] = dynamic(customIconImports[name], {
    ssr: false,
  }) as ReactComponent;
}

// Dynamic Icon Component
type DynamicIconProps = {
  name: IconNames | undefined;
  className?: string;
  size?: IconSize;
};

const DynamicIcon = memo(({ name, ...props }: DynamicIconProps) => {
  if (!name || !(name in iconComponents)) {
    return null;
  }

  const Icon = iconComponents[name];

  return <Icon {...props} />;
});

DynamicIcon.displayName = 'DynamicIcon';

export default DynamicIcon;
