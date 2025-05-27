'use client';

import { getClientSideUrl } from '@/utilities/getClientSideUrl';
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';

export const LivePreviewListener: React.FC = () => {
  const router = useRouter();

  return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideUrl()} />;
};
