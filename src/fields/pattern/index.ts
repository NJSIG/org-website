import { deepMerge, Field } from 'payload';
import { PatternFormatProps } from 'react-number-format';
import { PatternField } from './types';

type PatternFieldType = (options: {
  overrides?: Partial<PatternField>;
  pattern: PatternFormatProps;
}) => Field;

export const patternField: PatternFieldType = ({ overrides = {}, pattern }) => {
  const field = {
    name: 'pattern',
    type: 'text',
    admin: {
      components: {
        Field: {
          clientProps: {
            pattern,
          },
          path: '@/fields/pattern/PatternComponent#PatternComponent',
        },
      },
    },
  };

  return deepMerge(field, overrides);
};
