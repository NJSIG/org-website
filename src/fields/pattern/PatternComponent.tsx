'use client';

import { mergeFieldStyles } from '@/utilities/mergeFieldStyles';
import {
  FieldError as Error,
  fieldBaseClass,
  FieldDescription,
  FieldLabel,
  RenderCustomComponent,
  useField,
} from '@payloadcms/ui';
import type { NumberFieldClientProps, TextFieldClientProps } from 'payload';
import React, { useCallback, useMemo } from 'react';
import { PatternFormat } from 'react-number-format';
import type { Config } from './index.js';

type Props = {
  className?: string;
  config: Config;
  path: string;
  placeholder?: string;
  readOnly?: boolean;
} & (NumberFieldClientProps | TextFieldClientProps);

export const PatternComponent: React.FC<Props> = (props) => {
  const { config, field, path, readOnly, validate } = props;

  const {
    type,
    admin: { className, description, placeholder, readOnly: adminReadOnly } = {},
    label,
    required,
  } = field;

  const memoizedValidate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: null | (number[] & string) | undefined, options: any) => {
      if (typeof validate === 'function') {
        return validate(value, { ...options, required });
      }
    },
    [validate, required],
  );

  const styles = useMemo(() => mergeFieldStyles(field), [field]);

  const {
    customComponents: { AfterInput, BeforeInput, Description, Label } = {},
    errorMessage,
    setValue,
    showError,
    value,
  } = useField<string>({
    path,
    // @ts-expect-error - memoizedValidate is not typed
    validate: memoizedValidate,
  });

  const formatValue = useCallback(
    (value: string) => {
      const prefix = config.prefix;

      if (type === 'number') {
        let cleanValue: number | string = value;

        if (prefix) {
          cleanValue = cleanValue.replaceAll(prefix, '');
        }

        cleanValue = parseFloat(cleanValue);

        return cleanValue;
      } else {
        return value;
      }
    },
    [type, config.prefix],
  );

  const isReadonly = readOnly || adminReadOnly;

  return (
    <div
      className={[fieldBaseClass, 'text', className, showError && 'error', readOnly && 'read-only']
        .filter(Boolean)
        .join(' ')}
      style={styles}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={<FieldLabel label={label} path={path} required={required} />}
      />

      <div className={`${fieldBaseClass}__wrap`}>
        <Error message={errorMessage ?? ''} showError={showError} />

        {BeforeInput}

        <PatternFormat
          className="field-pattern"
          id={`field-${path.replace(/\./g, '__')}`}
          name={path}
          onChange={(e) => {
            setValue(formatValue(e.target.value));
          }}
          placeholder={typeof placeholder === 'string' ? placeholder : ''}
          readOnly={isReadonly}
          required={config.required}
          value={value}
          {...config}
        />

        {AfterInput}

        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={
            <FieldDescription
              className={`field-description-${path.replace(/\./g, '__')}`}
              description={description ?? ''}
              path={path}
            />
          }
        />
      </div>
    </div>
  );
};
