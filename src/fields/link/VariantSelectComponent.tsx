'use client';

import { mergeFieldStyles } from '@/utilities/mergeFieldStyles';
import { SelectInput, useField, useWatchForm } from '@payloadcms/ui';
import { OptionObject, TextFieldClient } from 'payload';
import { useEffect, useMemo, useState } from 'react';
import {
  ColorVariantOptions,
  IconPositionVariantOptions,
  SizeVariantOptions,
  StyleVariantOptions,
} from './types';

type BaseProps = {
  path: string;
  field: TextFieldClient;
  variant: 'style' | 'color' | 'size' | 'iconPosition';
  optionOverrides: string[];
};

type StyleSelect = BaseProps & {
  variant: 'style';
  variantOptions: StyleVariantOptions;
};

type ColorSelect = BaseProps & {
  variant: 'color';
  variantOptions: ColorVariantOptions;
};

type SizeSelect = BaseProps & {
  variant: 'size';
  variantOptions: SizeVariantOptions;
};

type IconPositionSelect = BaseProps & {
  variant: 'iconPosition';
  variantOptions: IconPositionVariantOptions;
};

type ComponentProps = StyleSelect | ColorSelect | SizeSelect | IconPositionSelect;

export const VariantSelectComponent: React.FC<ComponentProps> = (props) => {
  const {
    path,
    field,
    field: { admin: { className, description, placeholder } = {}, label, required },
    variant,
    variantOptions,
    optionOverrides,
  } = props;

  const { value, setValue } = useField<string>({ path });
  const { getDataByPath } = useWatchForm();
  const [options, setOptions] = useState<OptionObject[]>([]);

  // We're building the path to the appearance field based on the path of the current field
  const appearance = getDataByPath(`${path.split('.').slice(0, -1).join('.')}.appearance`);

  useEffect(() => {
    if (!appearance) {
      setOptions([]);
      return;
    }

    let optionsToUse: OptionObject[] = [];

    // Set the default options based on variant and the selected appearance
    if (variant === 'style') {
      switch (appearance) {
        case 'button':
          optionsToUse = [variantOptions.flat, variantOptions.outline, variantOptions.ghost];
          break;
        case 'cta':
          optionsToUse = [variantOptions.flat, variantOptions.outline];
          break;
      }
    } else if (variant === 'color') {
      switch (appearance) {
        case 'button':
        case 'cta':
          optionsToUse = [variantOptions.primary, variantOptions.accent];
          break;
        case 'icon':
          optionsToUse = [variantOptions.default];
          break;
      }
    } else if (variant === 'size') {
      switch (appearance) {
        case 'button':
        case 'cta':
        case 'icon':
          optionsToUse = [variantOptions.small, variantOptions.medium];
          break;
      }
    } else if (variant === 'iconPosition') {
      switch (appearance) {
        case 'button':
        case 'cta':
          optionsToUse = [variantOptions.none, variantOptions.before, variantOptions.after];
          break;
      }
    }

    // Filter the default options by the optionOverrides
    if (optionOverrides.length > 0) {
      optionsToUse = optionsToUse.filter((option) => optionOverrides.includes(option.value));
    }

    // Set the options to the filtered options
    setOptions(optionsToUse);
    setValue(optionsToUse[0]?.value || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appearance]);

  const styles = useMemo(() => mergeFieldStyles(field), [field]);

  return (
    <SelectInput
      path={path}
      name={path}
      className={className}
      label={label}
      description={description}
      placeholder={(placeholder as string) || ''}
      required={required}
      options={options}
      value={value}
      onChange={(e) => setValue((e as OptionObject).value)}
      style={styles}
      isClearable={false}
    />
  );
};
