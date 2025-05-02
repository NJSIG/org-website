'use client';

import dynamicIconImports from 'lucide-react/dynamicIconImports';
import dynamic from 'next/dynamic';
import { memo } from 'react';

type IconNames = keyof typeof dynamicIconImports;
type IconSize = 16 | 24 | 40;
type ReactComponent = React.FC<{ className?: string }>;

const icons = Object.keys(dynamicIconImports) as IconNames[];
const iconComponents = {} as Record<IconNames, ReactComponent>;

for (const name of icons) {
  const NewIcon = dynamic(dynamicIconImports[name], {
    ssr: false,
  }) as ReactComponent;

  iconComponents[name] = NewIcon;
}

type DynamicIconProps = {
  name: string | undefined;
  className?: string;
  size?: IconSize;
};

const DynamicIcon = memo(({ name, ...props }: DynamicIconProps) => {
  const Icon = iconComponents[name as IconNames];

  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
});
DynamicIcon.displayName = 'DynamicIcon';

export default DynamicIcon;
