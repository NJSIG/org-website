import { HiddenTitleBlock as HiddenTitleBlockProps } from '@/payload-types';

export const HiddenTitleBlock: React.FC<HiddenTitleBlockProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  return <h1 className="sr-only">{title}</h1>;
};
