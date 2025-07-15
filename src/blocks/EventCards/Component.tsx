import { EventCardsBlock as EventCardsBlockProps } from '@/payload-types';

export const EventCardsBlock: React.FC<EventCardsBlockProps> = (props) => {
  console.log('EventCardsBlock props:', props);

  return <p>Event Cards Block works!</p>;
};
