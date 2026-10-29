'use client';

import TitleTheme from '@/components/TitleTheme';
import { Button } from '@/primitives/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

type Props = {
  email: string;
  onBack: () => void;
};

export const MagicLinkSent: React.FC<Props> = ({ email, onBack }) => {
  return (
    <div className="bg-njsig-neutral-background flex w-full max-w-md flex-col gap-3 rounded-3xl p-4 shadow-2xl">
      <TitleTheme size="medium" animated={false} className="mr-auto">
        Sign In
      </TitleTheme>
      <p className="mb-6">
        A sign in link has been sent to <strong>{email}</strong>. If you don't see it, check your
        spam folder.
      </p>
      <Button type="button" variant="button" style="outline" onClick={onBack}>
        <ArrowLeftIcon size={24} className="mr-2" />
        <span>Back to Sign In</span>
      </Button>
    </div>
  );
};
