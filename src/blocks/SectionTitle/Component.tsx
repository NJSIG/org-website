import TitleTheme from '@/components/TitleTheme';
import { SectionTitleBlock as SectionTitleBlockProps } from '@/payload-types';

export const SectionTitleBlock: React.FC<SectionTitleBlockProps> = ({
  theme,
  title,
  viewOptions,
}) => {
  return (
    <div className="flex flex-col gap-2 items-start">
      {(viewOptions === 'themeOnly' || viewOptions === 'titleAndTheme') && (
        <TitleTheme size="medium">{theme}</TitleTheme>
      )}
      {(viewOptions === 'titleOnly' || viewOptions === 'titleAndTheme') && (
        <h2 className="text-5xl font-medium dark:text-foreground-inverted">{title}</h2>
      )}
    </div>
  );
};
