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
  finishOddGrid = true,
  finisherPattern = true,
  className,
}) => {
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
          <li className="rounded-3xl bg-(--resource-finisher)/30">
            {finisherPattern ? (
              <div className="rounded-3xl fibers fiber-strength-10 h-full w-full" />
            ) : null}
          </li>
        )}
      </ul>
    );
  }

  return null;
};

export default ResourceList;
