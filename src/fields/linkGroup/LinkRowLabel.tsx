'use client';

import { isObject } from '@/utilities/isObject';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';
import { Binoculars, ExternalLink, Globe, Link } from 'lucide-react';
import React from 'react';
import { LinkField } from '../link';

interface LinkRowLabel {
  link: LinkField;
}

const LinkRowLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<LinkRowLabel>();
  const link = data?.link;

  const label =
    (link.label && link.label !== '' ? link.label : undefined) ??
    (link.type === 'reference' && link.reference
      ? `Reference to: ${link.reference?.relationTo} - ${isObject(link.reference?.value) ? link.reference.value.title : link.reference.value}`
      : undefined) ??
    (link.type === 'custom' && link.url ? `Custom URL: ${link.url}` : undefined) ??
    `Link ${rowNumber !== undefined ? rowNumber + 1 : ''}`;

  return (
    <div className="linkRowLabel">
      <span>{label}</span>
      <div className="linkModifiers">
        {link.type === 'reference' && <Link size={16} />}
        {link.type === 'custom' && <Globe size={16} />}
        {link.newTab && <ExternalLink size={16} />}
        {link.type === 'custom' && link.allowReferrer && <Binoculars size={16} />}
      </div>
    </div>
  );
};

export default LinkRowLabel;
