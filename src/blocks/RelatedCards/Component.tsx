import { Hyperlink } from '@/components/Hyperlink';
import { RelatedCardsBlock as RelatedCardsBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { ArrowUpRightIcon } from 'lucide-react';

export const RelatedCardsBlock: React.FC<RelatedCardsBlockProps> = ({ cards }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
      {cards?.map(({ id, title, description, link }, index) => (
        <Hyperlink
          key={id ?? `related-card-${index}`}
          link={link}
          className={cn(
            'flex flex-col lg:grow lg:shrink lg:basis-0 gap-4 p-6',
            'hover:motion-safe:[&_svg]:animate-micro-up-right hover:no-underline',
            'text-foreground-inverted bg-linear-to-b lg:bg-linear-to-r',
            'first:rounded-tl-3xl first:rounded-tr-3xl lg:first:rounded-tr-none lg:first:rounded-bl-3xl',
            'last:rounded-br-3xl last:rounded-bl-3xl lg:last:rounded-bl-none lg:last:rounded-tr-3xl',
            {
              'from-azure-900 to-azure-500': cards.length === 1,
              'first:from-azure-900 first:to-azure-700 last:from-azure-700 last:to-azure-500':
                cards.length === 2,
              'first:from-azure-900 first:to-azure-800 nth-2:from-azure-800 nth-2:to-azure-600 last:from-azure-600 last:to-azure-500':
                cards.length === 3,
              'first:from-azure-900 first:to-azure-800 nth-2:from-azure-800 nth-2:to-azure-700 nth-3:from-azure-700 nth-3:to-azure-600 last:from-azure-600 last:to-azure-500':
                cards.length === 4,
            },
          )}
        >
          <h5 className="flex justify-between text-lg font-bold">
            <span>{title}</span>
            <ArrowUpRightIcon size={24}></ArrowUpRightIcon>
          </h5>
          <p>{description}</p>
        </Hyperlink>
      ))}
    </div>
  );
};
