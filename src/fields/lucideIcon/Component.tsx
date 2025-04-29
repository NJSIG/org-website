'use client';

import { fieldBaseClass, FieldLabel, RenderCustomComponent, useField } from '@payloadcms/ui';
import { TextFieldClientProps } from 'payload';
import { useCallback } from 'react';
import { LucideIconFieldConfig } from '.';
import './styles.scss';

type Props = LucideIconFieldConfig & TextFieldClientProps;

const baseClass = 'icon-field';

export const IconPickerComponent: React.FC<Props> = (props) => {
  const {
    field: { admin: { description, className } = {}, label, required },
    inputRef,
    path,
    readOnly,
    validate,
    showPreview,
    icons,
  } = props;

  const memoizedValidate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: string, options: any) => {
      if (typeof validate === 'function') {
        return validate(value, { ...options, required });
      }
    },
    [validate, required],
  );

  const isReadOnly = Boolean(readOnly);

  const {
    customComponents: { AfterInput, BeforeInput, Description, Label } = {},
    setValue,
    value,
  } = useField<string>({
    path,
    // @ts-expect-error - memoizedValidate is not typed
    validate: memoizedValidate,
  });

  return (
    <div className={[fieldBaseClass, baseClass].join(' ')}>
      <RenderCustomComponent
        CustomComponent={Label}
        Fallback={<FieldLabel label={label} path={path} required={required} />}
      />

      {BeforeInput}
    </div>
  );
};
