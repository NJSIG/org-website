'use client';

import { Button, FieldLabel, TextInput, useField, useForm, useFormFields } from '@payloadcms/ui';
import { Lock, Unlock } from 'lucide-react';
import { TextFieldClientProps } from 'payload';
import React, { useCallback, useEffect } from 'react';
import { formatSlug } from './formatSlug';
import './index.scss';

type SlugComponentProps = {
  fieldToUse: string;
  checkboxFieldPath: string;
} & TextFieldClientProps;

export const SlugComponent: React.FC<SlugComponentProps> = ({
  field,
  fieldToUse,
  checkboxFieldPath: checkboxFieldPathFromProps,
  path,
  readOnly: readOnlyFromProps,
}) => {
  const { label } = field;
  const { value, setValue } = useField<string>({ path: path || field.name });
  const { dispatchFields } = useForm();

  const checkboxFieldPath = path?.includes('.')
    ? `${path}.${checkboxFieldPathFromProps}`
    : checkboxFieldPathFromProps;

  // We're using separate useFormFields to minimize re-renders
  // The value of the checkbox field
  const checkboxValue = useFormFields(([fields]) => {
    return fields[checkboxFieldPath]?.value as string;
  });

  // The value of the field we're listening to for the slug
  const targetFieldValue = useFormFields(([fields]) => {
    return fields[fieldToUse]?.value as string;
  });

  const readOnly = readOnlyFromProps || checkboxValue;

  const handleLock = useCallback(
    (e: React.MouseEvent<Element>) => {
      e.preventDefault();

      dispatchFields({
        type: 'UPDATE',
        path: checkboxFieldPath,
        value: !checkboxValue,
      });
    },
    [checkboxValue, checkboxFieldPath, dispatchFields],
  );

  useEffect(() => {
    if (checkboxValue) {
      if (targetFieldValue) {
        const formattedSlug = formatSlug(targetFieldValue);

        if (value !== formattedSlug) {
          setValue(formattedSlug);
        }
      } else {
        if (value !== '') {
          setValue('');
        }
      }
    }
  }, [targetFieldValue, checkboxValue, setValue, value]);

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel htmlFor={`field-${path}`} label={label} />
        <Button className="lock-button" buttonStyle="none" onClick={handleLock}>
          {checkboxValue ? <Lock size={16} /> : <Unlock size={16} />}
        </Button>
      </div>

      <TextInput
        value={value}
        onChange={setValue}
        path={path || field.name}
        readOnly={Boolean(readOnly)}
      />
    </div>
  );
};
