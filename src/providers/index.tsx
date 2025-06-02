import { HeaderThemeProvider } from './HeaderTheme';
import { SubfundThemeProvider } from './SubfundTheme';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <HeaderThemeProvider>
      <SubfundThemeProvider>{children}</SubfundThemeProvider>
    </HeaderThemeProvider>
  );
};
