import { Event } from '@/payload-types';
import { cn } from '@/utilities/cn';
import ResourceItem from '../ResourceItem';

type ResourceListProps = {
  resources: Event['resources'];
  nested?: boolean;
  finishOddGrid?: boolean;
  finisherPattern?: boolean;
  className?: string;
};

const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  nested = false,
  finishOddGrid,
  finisherPattern = true,
  className,
}) => {
  // Default to finishing the odd grid if this is a top-level list (not nested)
  if (finishOddGrid === undefined && !nested) {
    finishOddGrid = true;
  }

  if (resources && resources.length > 0) {
    return (
      <ul className={cn('grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 w-full', className)}>
        {resources.map((item, index) =>
          item ? (
            <li key={item.id || `resource-${index}`}>
              <ResourceItem item={item} nested={nested} />
            </li>
          ) : null,
        )}
        {finishOddGrid && resources.length % 2 !== 0 && (
          <li
            className={cn('bg-(--resource-finisher)/30', {
              'rounded-3xl': !nested,
              'rounded-lg': nested,
            })}
          >
            {finisherPattern ? (
              <div
                className={cn('fibers fiber-strength-10 h-full w-full', {
                  'rounded-3xl': !nested,
                  'rounded-lg': nested,
                })}
              />
            ) : null}
          </li>
        )}
      </ul>
    );
  }

  return null;
};

export default ResourceList;
