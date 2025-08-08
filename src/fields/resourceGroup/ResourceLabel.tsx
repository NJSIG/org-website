'use client';

import { isObject } from '@/utilities/isObject';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';
import {
  AudioLinesIcon,
  Binoculars,
  ExternalLink,
  FileTextIcon,
  Globe,
  Link,
  VideoIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { LinkField } from '../link/types';
import { ResourceTypes } from '../resource/types';

interface ResourceLabel {
  resource?: {
    type?: ResourceTypes;
    document?: string;
    audioVideo?: string;
    link?: LinkField;
  };
}

interface RelationData {
  id: string;
  title: string;
  mimeType?: string;
}

const ResourceLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<ResourceLabel>();
  const { type, document, audioVideo, link } = data.resource || {};

  const [relationData, setRelationData] = useState<RelationData | null>(null);

  useEffect(() => {
    if (document !== undefined && document !== relationData?.id) {
      fetchRelationData('documents', document).then((data) => {
        setRelationData(data as RelationData);
      });
    } else if (audioVideo !== undefined && audioVideo !== relationData?.id) {
      fetchRelationData('media', audioVideo).then((data) => {
        setRelationData(data as RelationData);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document, audioVideo]);

  let label = `Resource ${rowNumber !== undefined ? rowNumber + 1 : ''}`;

  switch (type) {
    case 'document':
      label = `${relationData?.title || 'Untitled Document'}`;
      break;
    case 'audioVideo':
      label = `${relationData?.title || 'Untitled Audio/Video'}`;
      break;
    case 'link':
      if (link?.type === 'reference' && link?.reference) {
        label = `Reference to: ${link.reference?.relationTo} - ${isObject(link.reference?.value) ? link.reference.value.title : link.reference.value}`;
      } else if (link?.type === 'custom' && link?.url) {
        label = `Custom URL: ${link.url}`;
      }
      break;
  }

  if (type === 'link') {
    return (
      <div className="njsig__link-row-label">
        <span>{label}</span>
        <div className="njsig__link-row-label__link-modifiers">
          {link?.type === 'reference' && <Link size={16} />}
          {link?.type === 'custom' && <Globe size={16} />}
          {link?.newTab && <ExternalLink size={16} />}
          {link?.type === 'custom' && link?.allowReferrer && <Binoculars size={16} />}
        </div>
      </div>
    );
  }

  return (
    <div className="njsig__link-row-label">
      <span>{label}</span>
      <div className="njsig__link-row-label__link-modifiers">
        {type === 'document' && <FileTextIcon size={16} />}
        {type === 'audioVideo' && relationData?.mimeType?.includes('video') && (
          <VideoIcon size={16} />
        )}
        {type === 'audioVideo' && relationData?.mimeType?.includes('audio') && (
          <AudioLinesIcon size={16} />
        )}
      </div>
    </div>
  );
};

async function fetchRelationData(collectionSlug: string, itemID: string): Promise<unknown> {
  try {
    const response = await fetch(`/api/${collectionSlug}/${itemID}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching relation data:', error);
  }

  return {};
}

export default ResourceLabel;
