import { Event } from '@/payload-types';
import { cn } from '@/utilities/cn';
import { convertBytesToHumanReadable } from '@/utilities/convertBytesToHumanReadable';
import {
  ArrowUpRightIcon,
  AudioLinesIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
  Link2Icon,
  LinkIcon,
  PaperclipIcon,
  PodcastIcon,
  PresentationIcon,
  VideoIcon,
} from 'lucide-react';
import Link from 'next/link';

type ResourceItemProps = {
  item: NonNullable<Event['resources']>[number];
  nested?: boolean;
};

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
            <ResourceItem key={item.id || `resource-${index}`} item={item} nested={nested} />
          ) : null,
        )}
      </ul>
    );
  }

  return null;
};

const ResourceItem: React.FC<ResourceItemProps> = ({ item, nested = false }) => {
  const { href, target, rel, referrerPolicy } = getLinkProps(item.resource);

  return (
    <li>
      <Link
        href={href!}
        target={target}
        rel={rel}
        referrerPolicy={referrerPolicy}
        className={cn('group/resource-item flex items-center p-4 gap-4', {
          'rounded-3xl bg-njsig-neutral-tint': !nested,
          'rounded-lg bg-njsig-neutral-background': nested,
        })}
      >
        <ResourceIcon icon={item.resource.icon} />
        <ResourceDetails resource={item.resource} />
        <ResourceAction resource={item.resource} />
      </Link>
    </li>
  );
};

const ResourceIcon: React.FC<{ icon: ResourceItemProps['item']['resource']['icon'] }> = ({
  icon,
}) => {
  const iconClass = 'stroke-[var(--resource-theme)]';

  switch (icon) {
    case 'file-text':
      return <FileTextIcon size={24} className={iconClass} />;
    case 'presentation':
      return <PresentationIcon size={24} className={iconClass} />;
    case 'video':
      return <VideoIcon size={24} className={iconClass} />;
    case 'audio-lines':
      return <AudioLinesIcon size={24} className={iconClass} />;
    case 'podcast':
      return <PodcastIcon size={24} className={iconClass} />;
    case 'link':
      return <LinkIcon size={24} className={iconClass} />;
    default:
      return <PaperclipIcon size={24} className={iconClass} />;
  }
};

const ResourceDetails: React.FC<{ resource: ResourceItemProps['item']['resource'] }> = ({
  resource,
}) => {
  const { type, document, audioVideo, link } = resource;

  let resourceName = 'Unknown Resource';
  let resourceMeta = null;

  switch (type) {
    case 'document':
      if (document && typeof document === 'object') {
        resourceName = document.title || 'Untitled Document';
        resourceMeta = convertBytesToHumanReadable(document.filesize) || 'Unknown Size';
      }
      break;
    case 'audioVideo':
      if (audioVideo && typeof audioVideo === 'object') {
        resourceName = audioVideo.title || 'Untitled Audio/Video';
        resourceMeta = convertBytesToHumanReadable(audioVideo.filesize) || 'Unknown Size';
      }
      break;
    case 'link':
      resourceName = link?.label || 'Untitled Link';
      resourceMeta = link?.url || null;
      break;
  }

  return (
    <div className="grow overflow-hidden flex flex-col">
      <p className="font-bold text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
        {resourceName}
      </p>
      {resourceMeta && <small className="text-sm text-foreground-muted">{resourceMeta}</small>}
    </div>
  );
};

const ResourceAction: React.FC<{ resource: ResourceItemProps['item']['resource'] }> = ({
  resource,
}) => {
  const { type, link } = resource;
  const iconClass = 'stroke-[var(--resource-theme)]';

  switch (type) {
    case 'document':
    case 'audioVideo':
      return (
        <DownloadIcon
          size={24}
          className={cn(iconClass, 'group-hover/resource-item:motion-safe:animate-icon-download')}
        />
      );
    case 'link':
      if (link?.type === 'reference') {
        return (
          <ArrowUpRightIcon
            size={24}
            className={cn(
              iconClass,
              'group-hover/resource-item:motion-safe:animate-micro-up-right',
            )}
          />
        );
      } else {
        return (
          <ExternalLinkIcon
            size={24}
            className={cn(
              iconClass,
              'group-hover/resource-item:motion-safe:animate-icon-external-link',
            )}
          />
        );
      }
    default:
      return (
        <Link2Icon
          size={24}
          className={cn(iconClass, 'group-hover/resource-item:motion-safe:animate-micro-wiggle')}
        />
      );
  }
};

const getLinkProps = (
  resource: ResourceItemProps['item']['resource'],
): Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>> => {
  const { type, document, audioVideo, link } = resource;
  const errorPageUrl = '/404';

  const props: Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>> = {};

  switch (type) {
    case 'document':
      props.href = document && typeof document === 'object' ? document?.url || '#' : '#';
      props.target = '_blank';
      props.rel = undefined;
      break;
    case 'audioVideo':
      props.href = audioVideo && typeof audioVideo === 'object' ? audioVideo?.url || '#' : '#';
      props.target = '_blank';
      props.rel = undefined;
      break;
    case 'link':
      switch (link?.type) {
        case 'reference':
          props.href = link.reference
            ? typeof link.reference?.value === 'object'
              ? link.reference.value.slug || '#'
              : errorPageUrl
            : link.url || errorPageUrl;
          props.target = link?.newTab ? '_blank' : '_self';
          props.rel = undefined;
          props.referrerPolicy = 'strict-origin-when-cross-origin';
          break;
        default:
          props.href = link?.url || '#';
          props.target = link?.newTab ? '_blank' : '_self';
          props.rel = 'noopener';
          props.referrerPolicy = link?.allowReferrer
            ? 'strict-origin-when-cross-origin'
            : 'no-referrer';
          break;
      }
  }

  return props;
};

export default ResourceList;
