'use client';

import { getLinkReferenceLabel } from '@/utilities/getLinkReferenceLabel';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';
import { Binoculars, ExternalLink, Globe, Link } from 'lucide-react';
import React from 'react';
import { LinkField } from '../Link/types';

interface LinkLabel {
  link: LinkField;
}

const LinkLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<LinkLabel>();
  const link = data?.link;
  const label =
    (link?.label && link?.label !== '' ? link.label : undefined) ??
    (link?.type === 'reference' && link?.reference
      ? `Reference to: ${link.reference?.relationTo} - ${getLinkReferenceLabel(link)}`
      : undefined) ??
    (link?.type === 'custom' && link?.url ? `Custom URL: ${link.url}` : undefined) ??
    `Link ${rowNumber !== undefined ? rowNumber + 1 : ''}`;

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
};

export default LinkLabel;
