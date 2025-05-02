'use client';

import { mergeFieldStyles } from '@/utilities/mergeFieldStyles';
import { useConfig, useField, useLocale, withCondition } from '@payloadcms/ui';
import { isFieldRTL } from '@payloadcms/ui/fields/shared';
import { useCallback, useMemo } from 'react';
import './index.scss';
import { LucideIconPickerInput } from './Input';
import { LucideIconNames, LucideIconPickerFieldClientComponent } from './types';

const Component: LucideIconPickerFieldClientComponent = (props) => {
  const {
    icons,
    field,
    field: {
      admin: { className, description, placeholder, rtl } = {},
      label,
      localized,
      maxLength,
      minLength,
      required,
    },
    inputRef,
    path,
    readOnly,
    validate,
  } = props;

  const locale = useLocale();

  const {
    config: { localization },
  } = useConfig();

  const memoizedValidate = useCallback(
    (
      value: LucideIconNames | null | undefined,
      // options is typed as any for ease of use
      // payload does not type the options object in their built-in fields.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options: any,
    ) => {
      if (typeof validate === 'function') {
        return validate(value, { ...options, maxLength, minLength, required }) || true;
      }

      return true;
    },
    [validate, maxLength, minLength, required],
  );

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    setValue,
    showError,
    value,
  } = useField({
    path,
    validate: memoizedValidate,
  });

  const renderRTL = isFieldRTL({
    fieldLocalized: Boolean(localized),
    fieldRTL: Boolean(rtl),
    locale,
    localizationConfig: localization || undefined,
  });

  const styles = useMemo(() => mergeFieldStyles(field), [field]);

  return (
    <LucideIconPickerInput
      AfterInput={AfterInput}
      BeforeInput={BeforeInput}
      className={className}
      Description={Description}
      description={description}
      Error={Error}
      inputRef={inputRef}
      Label={Label}
      label={label}
      localized={localized}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      path={path}
      readOnly={readOnly}
      required={required}
      rtl={renderRTL}
      showError={showError}
      style={styles}
      value={(value as string) || ''}
      placeholder={(placeholder as string) || ''}
      icons={icons}
    />
  );
};

export const LucideIconPickerComponent: LucideIconPickerFieldClientComponent =
  withCondition(Component);
