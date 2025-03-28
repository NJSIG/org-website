'use client';

import { Page } from '@/payload-types';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';
import { Binoculars, ExternalLink, Link } from 'lucide-react';
import React from 'react';

interface LinkRowLabel {
  link: {
    type?: 'reference' | 'custom';
    newTab?: boolean;
    allowReferrer?: boolean;
    reference?: {
      relationTo: string;
      value: string | Page;
    };
    url?: string;
    label?: string;
  };
}

const LinkRowLabel: React.FC<RowLabelProps> = () => {
  const { rowNumber, data } = useRowLabel<LinkRowLabel>();
  const link = data?.link;

  const label =
    (link.label && link.label !== '' ? link.label : undefined) ??
    (link.type === 'reference' && link.reference
      ? `Reference to: ${link.reference?.relationTo} - ${link.reference?.value}`
      : undefined) ??
    (link.type === 'custom' && link.url ? `Custom URL: ${link.url}` : undefined) ??
    `Link ${rowNumber !== undefined ? rowNumber + 1 : ''}`;

  return (
    <div className="linkRowLabel">
      <span>{label}</span>
      <div className="linkModifiers">
        {link.type === 'custom' && <Link size={16} />}
        {link.newTab && <ExternalLink size={16} />}
        {link.allowReferrer && <Binoculars size={16} />}
      </div>
    </div>
  );
};

export default LinkRowLabel;
