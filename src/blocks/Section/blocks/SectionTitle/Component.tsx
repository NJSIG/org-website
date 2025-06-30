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
      {viewOptions !== 'titleOnly' && (
        <TitleTheme size="responsive" animated={true}>
          {theme}
        </TitleTheme>
      )}
      <h2
        className={cn('text-2xl lg:text-5xl font-medium dark:text-foreground-inverted', {
          'sr-only': viewOptions === 'themeOnly',
        })}
      >
        {title}
      </h2>
    </div>
  );
};
