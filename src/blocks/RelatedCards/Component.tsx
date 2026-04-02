import { Hyperlink } from '@/components/Hyperlink';
import { RelatedCardsBlock as RelatedCardsBlockProps } from '@/payload-types';
import { ArrowUpRightIcon } from 'lucide-react';

export const RelatedCardsBlock: React.FC<RelatedCardsBlockProps> = ({ cards }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
      {cards?.map(({ id, title, description, link }, index) => (
        <Hyperlink
          key={id ?? `related-card-${index}`}
          link={link}
          className="flex flex-col lg:grow lg:shrink lg:basis-0 gap-4 hover:motion-safe:[&_svg]:animate-micro-up-right"
        >
          <h5 className="flex justify-between">
            <span>{title}</span>
            <ArrowUpRightIcon size={24}></ArrowUpRightIcon>
          </h5>
          <p>{description}</p>
        </Hyperlink>
      ))}
    </div>
  );
};
