import {
  FieldClientComponent,
  StaticDescription,
  StaticLabel,
  TextField,
  TextFieldClient,
  TextFieldValidation,
} from 'payload';
import React, { ChangeEvent } from 'react';
import { MarkOptional } from 'ts-essentials';

export type PatternFieldInputProps = {
  readonly AfterInput?: React.ReactNode;
  readonly BeforeInput?: React.ReactNode;
  readonly className?: string;
  readonly Description?: React.ReactNode;
  readonly description?: StaticDescription;
  readonly Error?: React.ReactNode;
  readonly inputRef?: React.RefObject<HTMLInputElement>;
  readonly Label?: React.ReactNode;
  readonly label?: StaticLabel;
  readonly localized?: boolean;
  readonly onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  readonly path: string;
  readonly placeholder?: Record<string, string> | string;
  readonly readOnly?: boolean;
  readonly required?: boolean;
  readonly showError?: boolean;
  readonly style?: React.CSSProperties;
  readonly onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

type PatternFieldClientWithoutType = MarkOptional<TextFieldClient, 'type'>;

type PatternFieldBaseClientProps = {
  readonly inputRef?: React.RefObject<HTMLInputElement>;
  readonly onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  readonly path: string;
  readonly validate?: TextFieldValidation;
};

export type PatternFieldClientComponent = FieldClientComponent<
  PatternFieldClientWithoutType,
  PatternFieldBaseClientProps
>;

export type PatternField = TextField;
