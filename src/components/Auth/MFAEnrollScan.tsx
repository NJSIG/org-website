'use client';

import TitleTheme from '@/components/TitleTheme';
import { authClient } from '@/lib/authClient';
import { Alert, AlertDescription } from '@/primitives/ui/alert';
import { Button } from '@/primitives/ui/button';
import { Field, FieldError, FieldLabel } from '@/primitives/ui/field';
import { Input } from '@/primitives/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitives/ui/tooltip';
import {
  CircleQuestionMarkIcon,
  LoaderCircleIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import QRCode from 'react-qr-code';

type Props = {
  enrollURI: string;
  backupCodes: string[];
  onDeviceEnrolled: (backupCodes: string[]) => void;
  onSkip: () => void;
};

export const MFAEnrollScan = ({ enrollURI, backupCodes, onDeviceEnrolled }: Props) => {
  const [code, setCode] = useState('');
  const [codeTouched, setCodeTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  // THe otpauth:// URI carries the shared secret; we should surface it for
  // manual entry if the user can't scan the QR code
  const manualKey = new URL(enrollURI).searchParams.get('secret');

  const codeError = codeTouched && code === '';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setCodeTouched(true);

    if (code === '') {
      setError('Code is required');
      return;
    }

    setVerifying(true);

    try {
      await authClient.twoFactor.verifyTotp(
        { code },
        {
          onSuccess() {
            onDeviceEnrolled(backupCodes);
            return;
          },
          onError(context) {
            console.error(context.error);
            setError('Failed to verify code, please try again.');
          },
        },
      );
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="bg-njsig-neutral-background flex w-full max-w-md flex-col gap-3 rounded-3xl p-4 shadow-2xl dark:bg-neutral-800">
      <TitleTheme size="medium" animated={false} className="mr-auto">
        Secure Your Account
      </TitleTheme>
      <p className="font-medium">Enhance your account security with an authenticator app.</p>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 pt-3">
        {error && (
          <Alert variant="destructive">
            <TriangleAlertIcon size={24} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <QRCode value={enrollURI} />
          {manualKey && <code>{manualKey}</code>}
        </div>

        <Field data-invalid={codeError}>
          <FieldLabel htmlFor="code">Code</FieldLabel>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            onBlur={() => setCodeTouched(true)}
            required
            aria-invalid={codeError}
          />
          {codeError && <FieldError>Code is required.</FieldError>}
        </Field>

        <Button type="submit" variant="button" style="flat" disabled={verifying}>
          {verifying ? (
            <LoaderCircleIcon size={24} className="mr-2 animate-spin" />
          ) : (
            <ShieldCheckIcon size={24} className="mr-2" />
          )}
          <span>Secure Account</span>
        </Button>

        <div className="flex gap-2">
          <Button type="button" variant="button" style="outline" disabled={verifying}>
            <span>Skip</span>
          </Button>

          <Tooltip>
            <TooltipTrigger>
              <span>
                <CircleQuestionMarkIcon size={16} />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <ul>
                <li>You will be asked again next time your device is validated.</li>
                <li>You will always be able to get codes by email.</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};
