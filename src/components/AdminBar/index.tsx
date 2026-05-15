'use client';

import { cn } from '@/utilities/cn';
import { getClientSideUrl } from '@/utilities/getClientSideUrl';
import { PayloadAdminBar, PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar';
import { PayloadIcon } from '@payloadcms/ui/shared';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { useCallback, useState } from 'react';

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

export const AdminBar: React.FC<{ adminBarProps?: PayloadAdminBarProps }> = (props) => {
  const { adminBarProps } = props || {};

  const segments = useSelectedLayoutSegments();
  const router = useRouter();

  const [show, setShow] = useState(false);

  const collection = (
    collectionLabels[segments?.[0] as keyof typeof collectionLabels] ? segments?.[0] : 'pages'
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
      <div className="container px-4">
        <PayloadAdminBar
          {...adminBarProps}
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
          logo={<PayloadIcon fill="var(--color-battleship-gray-50)" />}
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
