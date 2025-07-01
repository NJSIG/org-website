'use client';

import { mergeFieldStyles } from '@/utilities/mergeFieldStyles';
import {
  fieldBaseClass,
  FieldDescription,
  FieldError,
  FieldLabel,
  RenderCustomComponent,
  useField,
} from '@payloadcms/ui';
import { NumberFieldClientProps, TextFieldClientProps } from 'payload';
import { useCallback, useMemo } from 'react';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

type Props = {
  pattern: PatternFormatProps;
} & (NumberFieldClientProps | TextFieldClientProps);

export const PatternComponent: React.FC<Props> = (props) => {
  const {
    path,
    field,
    field: {
      type,
      admin: { className, description, placeholder, readOnly: adminReadOnly } = {},
      label,
      required,
    },
    readOnly,
    pattern,
    validate,
  } = props;

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
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
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
      const prefix = pattern.prefix;

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
    [type, pattern.prefix],
  );

  const isReadOnly = readOnly || adminReadOnly;

  return (
    <div
      className={[fieldBaseClass, type, className, showError && 'error', readOnly && 'read-only']
        .filter(Boolean)
        .join(' ')}
      style={styles}
    >
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={<FieldLabel label={label} path={path} required={required} />}
      />

      <div className={`${fieldBaseClass}__wrap`}>
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />

        {BeforeInput}

        <PatternFormat
          className="field-pattern"
          id={`field-${path.replace(/\./g, '__')}`}
          name={path}
          onChange={(e) => {
            setValue(formatValue(e.target.value));
          }}
          placeholder={typeof placeholder === 'string' ? placeholder : ''}
          readOnly={isReadOnly}
          required={required}
          value={value}
          {...pattern}
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
