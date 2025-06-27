import TitleTheme from '@/components/TitleTheme';
import { SectionTitleBlock as SectionTitleBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';

export const SectionTitleBlock: React.FC<SectionTitleBlockProps> = ({
  theme,
  title,
  viewOptions,
  bottomMargin,
}) => {
  return (
    <div
      className={cn('section-title flex flex-col gap-2 items-start w-full', {
        'mb-10': bottomMargin,
      })}
    >
      {(viewOptions === 'themeOnly' || viewOptions === 'titleAndTheme') && (
        <TitleTheme size="responsive" animated={true}>
          {theme}
        </TitleTheme>
      )}
      {(viewOptions === 'titleOnly' || viewOptions === 'titleAndTheme') && (
        <h2 className="text-2xl lg:text-5xl font-medium dark:text-foreground-inverted">{title}</h2>
      )}
    </div>
  );
};
