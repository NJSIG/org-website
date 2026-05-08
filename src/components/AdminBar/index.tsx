'use client';

import { cn } from '@/utilities/cn';
import { getClientSideUrl } from '@/utilities/getClientSideUrl';
import { PayloadAdminBar, PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';
import { useCallback, useState } from 'react';
import './index.scss';

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
  events: {
    plural: 'Events',
    singular: 'Event',
  },
};

const Title: React.FC = () => <span>Dashboard</span>;

export const AdminBar: React.FC<{ adminBarProps?: PayloadAdminBarProps }> = (props) => {
  const { adminBarProps } = props || {};

  const segments = useSelectedLayoutSegment();
  const router = useRouter();

  const [show, setShow] = useState(false);

  console.log('Segments', segments);

  const collection = (
    collectionLabels[segments?.[1] as keyof typeof collectionLabels] ? segments?.[1] : 'pages'
  ) as keyof typeof collectionLabels;

  const onAuthChange = useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id));
  }, []);

  return (
    <div
      className={cn('admin-bar py-2 bg-neutral-900 text-foreground-inverted hidden', {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-foreground-inverted"
          classNames={{
            controls: 'font-medium',
            logo: 'text-foreground-inverted',
            user: 'text-foreground-inverted',
          }}
          cmsURL={getClientSideUrl()}
          collectionSlug={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || 'Pages',
            singular: collectionLabels[collection]?.singular || 'Page',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview').then(() => {
              router.push('/');
              router.refresh();
            });
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  );
};
