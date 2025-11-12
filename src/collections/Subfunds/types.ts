type Options = { label: string; value: string };

export type SubfundTheme =
  | 'bacceic'
  | 'caip'
  | 'ericnorth'
  | 'ericsouth'
  | 'ericwest'
  | 'mocssif'
  | 'njeif';

export type SubfundThemeOptions = Record<SubfundTheme, Options>;
