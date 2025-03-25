'use client';

import { useField, useForm, useFormFields } from '@payloadcms/ui';
import { TextFieldClientProps } from 'payload';
import React from 'react';

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

  const checkboxFieldPath = path?.includes('.')
    ? `${path}.${checkboxFieldPathFromProps}`
    : checkboxFieldPathFromProps;

  const { value, setValue } = useField<string>({ path: path || field.name });
  const { dispatchFields } = useForm();

  // We're using separate useFormFields to minimize re-renders
  // The value of the checkbox field
  const checkboxValue = useFormFields(([fields]) => {
    return fields[checkboxFieldPath]?.value as string;
  });

  // The value of the field we're listening to for the slug
  const targetFieldValue = useFormFields(([fields]) => {
    return fields[fieldToUse]?.value as string;
  });
};
