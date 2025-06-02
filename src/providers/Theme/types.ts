export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  setTheme: (theme: Theme | null) => void;
  theme?: Theme | null;
}

export type SubfundTheme =
  | 'bacceic'
  | 'caip'
  | 'ericnorth'
  | 'ericsouth'
  | 'ericwest'
  | 'mocssif'
  | 'njeif';

export interface SubfundThemeContextType {
  setSubfundTheme: (subfundTheme: SubfundTheme | null) => void;
  subfundTheme?: SubfundTheme | null;
}
