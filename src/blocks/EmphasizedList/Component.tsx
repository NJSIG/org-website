import { EmphasizedListBlock as EmphasizedListBlockProps } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { Triangle } from 'lucide-react';

export const EmphasizedListBlock: React.FC<EmphasizedListBlockProps> = ({
  bullColor,
  listItems,
}) => {
  if (listItems && listItems.length > 0) {
    return (
      <ul className="dark:text-foreground-inverted">
        {listItems.map((item) => (
          <li key={item.id} className="mb-6 last:mb-0">
            <div
              className={cn('flex gap-4 items-center [&>svg]:size-2.5 [&>svg]:lg:size-3.5', {
                '[&>svg]:fill-njsig-midtone [&>svg]:stroke-njsig-midtone': bullColor === 'primary',
                '[&>svg]:fill-njsig-accent-midtone [&>svg]:stroke-njsig-accent-midtone':
                  bullColor === 'accent',
              })}
            >
              <Triangle />
              <h3 className="text-xl lg:text-2xl font-medium">{item.title}</h3>
            </div>
            <p className="my-4 pl-7 lg:pl-10 lg:text-lg">{item.content}</p>
          </li>
        ))}
      </ul>
    );
  }

  return null;
};
