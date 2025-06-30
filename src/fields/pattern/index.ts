import type { Field, TextField as TextFieldType } from 'payload';
import type { PatternFormatProps } from 'react-number-format';

import { deepMerge } from 'payload';

export interface PatternConfig extends PatternFormatProps {
  readOnly?: boolean;
  required?: boolean;
}

export type Config = {} & PatternConfig;

type Pattern = (overrides: TextFieldType, config: Config) => Field[];

export const patternField: Pattern = (overrides, config) => {
  const patternField = deepMerge<TextFieldType, TextFieldType>(
    {
      name: 'pattern',
      type: 'text',
      admin: {
        components: {
          Field: {
            clientProps: {
              config,
            },
            path: '@/fields/pattern/PatternComponent#PatternComponent',
          },
        },
        readOnly: config.readOnly,
      },
      required: config.required,
    },
    overrides,
  );

  const fields = [patternField];

  return fields;
};
