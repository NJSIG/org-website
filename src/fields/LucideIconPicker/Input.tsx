'use client';

import DynamicIcon from '@/components/DynamicIcon';
import CustomTags from '@/icons/tags.json';
import {
  fieldBaseClass,
  FieldDescription,
  FieldError,
  FieldLabel,
  RenderCustomComponent,
  useDebounce,
} from '@payloadcms/ui';
import LucideTags from 'lucide-static/tags.json';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { LucideIconPickerInputProps } from './types';

const baseClass = 'lucide-icon';
const iconsPerPage = 100;

export const LucideIconPickerInput: React.FC<LucideIconPickerInputProps> = (props) => {
  const {
    AfterInput,
    BeforeInput,
    className,
    Description,
    description,
    Error,
    Label,
    label,
    localized,
    onChange,
    path,
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
  const [filteredIcons, setFilteredIcons] = useState(icons || []);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(value || null);
  const [currentPage, setCurrentPage] = useState(1);

  // Search for icons based on the search term
  // filter based on name and tags
  // debounce the search term to avoid too many re-renders
  const debounceSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!icons) {
      return;
    }

    if (debounceSearch == '') {
      setFilteredIcons(icons);
    } else {
      const searchTerm = debounceSearch.toLowerCase();
      const foundIcons: LucideIconPickerInputProps['icons'] = icons.filter((icon) => {
        // Check for icon name match
        if (icon.toLowerCase().includes(searchTerm)) {
          return true;
        }

        // Check for tag match
        const lucideTags = LucideTags[icon as keyof typeof LucideTags] || [];
        const customTags = CustomTags[icon as keyof typeof CustomTags] || [];

        return (
          lucideTags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
          customTags.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      });

      setFilteredIcons(foundIcons);
    }
  }, [debounceSearch, icons]);

  // Close the picker when the user presses the escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFieldIsFocused(false);
        setCurrentPage(1);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Close the picker when the user clicks outside of it
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setFieldIsFocused(false);
        setCurrentPage(1);
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  // Icon infinite scroll
  const iconContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: document.querySelector(`.${baseClass}__icon-picker-modal`),
      rootMargin: '50px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (entry.isIntersecting && filteredIcons.length > currentPage * iconsPerPage) {
        setCurrentPage((prev) => prev + 1);
      }
    }, options);

    const target = iconContainerRef.current;

    if (target && fieldIsFocused) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [filteredIcons.length, currentPage, fieldIsFocused]);

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
      ref={ref}
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

        <div className={`${baseClass}__input-container`} onFocus={() => setFieldIsFocused(true)}>
          <div className={`${baseClass}__icon-preview`} onClick={() => setFieldIsFocused(true)}>
            <DynamicIcon name={value} size={24} />
          </div>
          <input
            type="text"
            className={`${baseClass}__icon-name`}
            value={displayName || ''}
            placeholder={hoveredIcon || `Search ${icons?.length || 0} icons...`}
            onFocus={() => setDisplayName(null)}
            onBlur={() => setDisplayName(value || null)}
            onChange={(e) => {
              setCurrentPage(1);
              setHoveredIcon(null);
              setDisplayName(e.target.value);
              setSearch(e.target.value);
            }}
          />

          {fieldIsFocused && (
            <div
              className={`${baseClass}__icon-picker-modal ${rtl ? `${baseClass}__icon-picker-modal--rtl` : ''}`}
            >
              <span className={`${baseClass}__icon-picker-modal__pagination-meta`}>
                Showing {Math.min(currentPage * iconsPerPage, filteredIcons.length)} of{' '}
                {filteredIcons.length} icons
              </span>
              <div className={`${baseClass}__icon-picker-modal__icon-container`}>
                <div className={`${baseClass}__icon-picker-modal__icon-container__icon-list`}>
                  {filteredIcons.length > 0 &&
                    filteredIcons.slice(0, currentPage * iconsPerPage).map((icon) => (
                      <div
                        className={`${baseClass}__icon-picker-modal__icon-option ${value === icon ? `${baseClass}__icon-picker-modal__icon-option-active` : ''}`}
                        key={icon}
                        title={icon}
                        onMouseOver={() => setHoveredIcon(icon)}
                        onClick={() => {
                          onChange?.({
                            target: {
                              name: path,
                              value: icon,
                            },
                          } as ChangeEvent<HTMLInputElement>);
                          setDisplayName(icon);
                          setSearch('');
                          setHoveredIcon(null);
                          setFieldIsFocused(false);
                          setFilteredIcons(icons || []);
                          setCurrentPage(1);
                        }}
                      >
                        <DynamicIcon name={icon} size={24} />
                      </div>
                    ))}
                </div>

                <div
                  ref={iconContainerRef}
                  style={{ height: '20px', width: '100%', visibility: 'hidden' }}
                  aria-hidden="true"
                />

                {filteredIcons.length > currentPage * iconsPerPage && (
                  <div className={`${baseClass}__icon-picker-modal__loading`}>
                    <DynamicIcon
                      name="loader"
                      size={24}
                      className={`${baseClass}__icon-picker-modal__loading-icon`}
                    />
                  </div>
                )}

                {filteredIcons.length === 0 && <span>No icons found</span>}
              </div>
            </div>
          )}
        </div>

        {AfterInput}

        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </div>
    </div>
  );
};
