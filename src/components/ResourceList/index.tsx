import { Event } from '@/payload-types';
import { cn } from '@/utilities/cn';
import ResourceItem from '../ResourceItem';

type ResourceListProps = {
  resources: Event['resources'];
  nested?: boolean;
  className?: string;
};

const ResourceList: React.FC<ResourceListProps> = ({ resources, nested = false, className }) => {
  if (resources && resources.length > 0) {
    return (
      <ul className={cn('grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 w-full', className)}>
        {resources.map((item, index) =>
          item ? (
            <li key={item.id || `resource-${index}`}>
              <ResourceItem item={item} nested={nested} />
            </li>
          ) : null,
        )}
      </ul>
    );
  }

  return null;
};

export default ResourceList;
