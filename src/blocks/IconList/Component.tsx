import DynamicIcon from '@/components/DynamicIcon';
import { IconListBlock as IconListBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';

export const IconListBlock: React.FC<IconListBlockProps> = ({ columns, items }) => {
  return (
    <div
      className={cn('max-w-section dark:text-foreground-inverted grid gap-8', {
        'grid-cols-1': columns === 'one',
        'grid-cols-1 md:grid-cols-2': columns === 'two',
      })}
    >
      {items?.map(({ id, icon, title, text }) => (
        <div key={id} className="flex items-center gap-4">
          <DynamicIcon name={icon} size={64} />
          <div>
            {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
            {text && <p>{text}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
