'use client';

import {
  fieldBaseClass,
  FieldError,
  FieldLabel,
  RenderCustomComponent,
  useDebounce,
  useTranslation,
} from '@payloadcms/ui';
import { ChangeEvent, useEffect, useState } from 'react';
import { LucideIconPickerInputProps } from './types';

const baseClass = 'lucide-icon';

export const LucideIconPickerInput: React.FC<LucideIconPickerInputProps> = (props) => {
  const {
    AfterInput,
    BeforeInput,
    className,
    Description,
    description,
    Error,
    inputRef,
    Label,
    label,
    localized,
    onChange,
    onKeyDown,
    path,
    placeholder,
    readOnly,
    required,
    rtl,
    showError,
    style,
    value,
    icons,
  } = props;

  const [fieldIsFocused, setFieldIsFocused] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredIcons, setFilteredIcons] = useState(icons);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const debounceSearch = useDebounce(search, 300);

  const { i18n, t } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };

  useEffect(() => {
    if (!icons) {
      return;
    }

    if (debounceSearch == '') {
      setFilteredIcons(icons);
    } else {
      const foundIcons: LucideIconPickerInputProps['icons'] = [];
      const searchTerm = debounceSearch.toLowerCase();

      icons.map((icon) => {
        if (icon.toLowerCase().includes(searchTerm)) {
          foundIcons.push(icon);
        }
      });

      setFilteredIcons(foundIcons);
    }
  }, [debounceSearch, icons]);

  return (
    <div
      className={[
        fieldBaseClass,
        baseClass,
        className,
        showError && 'error',
        readOnly && 'read-only',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={
          <FieldLabel label={label} localized={localized} path={path} required={required} />
        }
      />

      <div className={`${fieldBaseClass}__wrap`}>
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />

        {BeforeInput}

        <div
          className={`${baseClass}__input-container`}
          onFocus={() => setFieldIsFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setTimeout(() => {
                setFieldIsFocused(false);
                setSearch('');
              }, 200);
            }
          }}
        >
          {!rtl && (
            <div
              className={`${baseClass}__icon-preview`}
              onClick={() => setFieldIsFocused(true)}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};
