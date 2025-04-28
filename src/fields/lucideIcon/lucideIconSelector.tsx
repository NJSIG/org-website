'use client';

import { SelectInput, useField } from '@payloadcms/ui';
import { icons } from 'lucide-react';
import { OptionObject } from 'payload';

type LucideIconSelectorProps = {
  path: string;
};

const lucideIconOptions = () => {
  const options: OptionObject[] = [];

  Object.keys(icons).forEach((icon) => {
    options.push({
      label: icon,
      value: icon,
    });
  });

  return options;
};

export const LucideIconSelector: React.FC<LucideIconSelectorProps> = ({ path }) => {
  const { value, setValue } = useField<string>({ path });

  let icon = 'squirrel'; // Default icon

  if (value) {
    icon = value;
  }

  return (
    <div>
      <SelectInput
        path={path}
        name={path}
        value={value}
        required={true}
        label={'Icon'}
        hasMany={false}
        options={lucideIconOptions()}
        onChange={(e) => setValue(e)}
      />
    </div>
  );
};
