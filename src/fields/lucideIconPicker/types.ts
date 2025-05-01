import {
  FieldClientComponent,
  StaticDescription,
  StaticLabel,
  TextField,
  TextFieldClient,
  TextFieldValidation,
} from 'payload';
import { ChangeEvent } from 'react';
import { MarkOptional } from 'ts-essentials';

export type SharedLucideIconPickerFieldProps = {
  readonly hasMany?: false;
  readonly onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type LucideIconPickerInputProps = {
  readonly AfterInput?: React.ReactNode;
  readonly BeforeInput?: React.ReactNode;
  readonly className?: string;
  readonly Description?: React.ReactNode;
  readonly description?: StaticDescription;
  readonly Error?: React.ReactNode;
  readonly icons?: string[];
  readonly inputRef?: React.RefObject<HTMLInputElement>;
  readonly Label?: React.ReactNode;
  readonly label?: StaticLabel;
  readonly localized?: boolean;
  readonly onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  readonly path: string;
  readonly placeholder?: Record<string, string> | string;
  readonly readOnly?: boolean;
  readonly required?: boolean;
  readonly rtl?: boolean;
  readonly showError?: boolean;
  readonly style?: React.CSSProperties;
  readonly value?: string;
} & SharedLucideIconPickerFieldProps;

type LucideIconPickerFieldClientWithoutType = MarkOptional<TextFieldClient, 'type'>;

type LucideIconPickerFieldBaseClientProps = {
  readonly icons?: string[];
  readonly inputRef?: React.RefObject<HTMLInputElement>;
  readonly onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  readonly path: string;
  readonly validate?: TextFieldValidation;
};

export type LucideIconPickerFieldClientComponent = FieldClientComponent<
  LucideIconPickerFieldClientWithoutType,
  LucideIconPickerFieldBaseClientProps
>;

// TODO: Can we add a custom field type or do we need
// to use an existing one from Payload?
export type LucideIconPickerField = TextField;
