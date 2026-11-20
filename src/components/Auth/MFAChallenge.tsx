'use client';

import TitleTheme from '@/components/TitleTheme';
import { authClient } from '@/lib/authClient';
import { Alert, AlertDescription } from '@/primitives/ui/alert';
import { Button } from '@/primitives/ui/button';
import { Field, FieldError, FieldLabel } from '@/primitives/ui/field';
import { Input } from '@/primitives/ui/input';
import { LoaderCircleIcon, ShieldUserIcon, TriangleAlertIcon } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

const RESEND_SECONDS = 30;

type Method = 'totp' | 'otp';
type Mode = Method | 'backup';

type Props = {
  methods: Method[];
  onVerified: () => void;
  onCancel: () => void;
};

/**
 * This screen decides which MFA method to use:
 *
 *   enrolled in TOTP => authenticator code input, option to request email code or use backup code
 *   email OTP only   => code is emailed automatically on arrival with an option to resend
 */

export const MFAChallenge: React.FC<Props> = ({ methods, onVerified, onCancel }) => {
  const hasTOTP = methods.includes('totp');
  const hasOTP = methods.includes('otp');
  const defaultMode: Mode = hasTOTP ? 'totp' : 'otp';

  const [mode, setMode] = useState<Mode>(defaultMode);
  const [code, setCode] = useState('');
  const [codeTouched, setCodeTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const autoSent = useRef(false);

  // Default trust device to false, this could be something
  // that is changed per user type.
  const [trustDevice, setTrustDevice] = useState(false);

  const codeError = codeTouched && code === '';

  async function sendEmailCode() {
    setError(null);

    const { error: sendError } = await authClient.twoFactor.sendOtp();

    if (sendError) {
      setError('Failed to send a code, please try again.');
    }

    setCooldown(RESEND_SECONDS);
  }

  // Email-only users: the code is sent as soon as the screen appears. The ref
  // keep React StrictMode's double-invoked effect from sending two emails in dev.
  useEffect(() => {
    if (!hasTOTP && !autoSent.current) {
      autoSent.current = true;
      sendEmailCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resend cooldown ticker
  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  function switchTo(mode: Mode) {
    setMode(mode);
    setCode('');
    setError(null);

    if (mode === 'otp') sendEmailCode();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setSubmitting(true);

    const { error: verifyError } =
      mode === 'totp'
        ? await authClient.twoFactor.verifyTotp({ code, trustDevice })
        : mode === 'otp'
          ? await authClient.twoFactor.verifyOtp({ code, trustDevice })
          : await authClient.twoFactor.verifyBackupCode({ code }); // We don't trust a device when a backup code was used.

    setSubmitting(false);

    if (verifyError) {
      console.error(verifyError);

      // 429 ACCOUNT_TEMPORARILY_LOCKED has a shared counter across
      // OTP, TOTP, and Backup Codes so it is worth handling explicitly
      // so a locked out admin doesn't assume their password is incorrect.
      setError(
        verifyError.status === 429
          ? 'Too many failed attempts. Your account has been temporarily locked, please try again later.'
          : 'Invalid code, please try again.',
      );

      return;
    }

    onVerified();
  }

  const prompt =
    mode === 'totp'
      ? 'Enter the 6-digit code from your authenticator app.'
      : mode === 'otp'
        ? 'Enter the 6-digit code sent to your email.'
        : 'Enter one of your backup codes.';

  return (
    <div className="bg-njsig-neutral-background flex w-full max-w-md flex-col gap-3 rounded-3xl p-4 shadow-2xl dark:bg-neutral-800">
      <TitleTheme size="medium" animated={false} className="mr-auto">
        Verify Your Identity
      </TitleTheme>
      <p className="font-medium">{prompt}</p>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 pt-3">
        {error && (
          <Alert variant="destructive">
            <TriangleAlertIcon size={24} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Field data-invalid={codeError}>
          <FieldLabel htmlFor="code">{mode === 'backup' ? 'Backup Code' : 'Code'}</FieldLabel>
          <Input
            id="code"
            type={mode === 'backup' ? 'text' : 'number'}
            inputMode={mode === 'backup' ? 'text' : 'numeric'}
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            onBlur={() => setCodeTouched(true)}
            required
            autoFocus
            aria-invalid={codeError}
          />
          {codeError && (
            <FieldError>
              {mode === 'backup' ? 'Backup code is required.' : 'Code is required.'}
            </FieldError>
          )}
        </Field>

        <Button type="submit" variant="button" style="flat" disabled={submitting}>
          {submitting ? (
            <LoaderCircleIcon size={24} className="mr-2 animate-spin" />
          ) : (
            <ShieldUserIcon size={24} className="mr-2" />
          )}
          <span>Secure Account</span>
        </Button>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Verifying…' : 'Verify'}
        </button>

        {/* Secondary options: only what this user can actually use, and only
            alternatives to the screen they're already on. */}
        {mode === 'otp' && (
          <Button
            type="button"
            variant="button"
            style="outline"
            onClick={sendEmailCode}
            disabled={submitting || cooldown > 0}
          >
            <span>{cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code'}</span>
          </Button>
        )}
        {mode === 'otp' && hasTOTP && (
          <Button
            type="button"
            variant="button"
            style="outline"
            onClick={() => switchTo('totp')}
            disabled={submitting}
          >
            <span>Use Authenticator App</span>
          </Button>
        )}
        {mode === 'totp' && hasOTP && (
          <Button
            type="button"
            variant="button"
            style="outline"
            onClick={() => switchTo('otp')}
            disabled={submitting}
          >
            <span>Get Code by Email</span>
          </Button>
        )}
        {mode === 'totp' && (
          <Button
            type="button"
            variant="link"
            style="ghost"
            size="small"
            onClick={() => switchTo('backup')}
            disabled={submitting}
          >
            <span>Use Backup Code</span>
          </Button>
        )}
        {mode === 'backup' && (
          <Button
            type="button"
            variant="button"
            style="outline"
            onClick={() => switchTo(defaultMode)}
            disabled={submitting}
          >
            <span>Back</span>
          </Button>
        )}

        <Button
          type="button"
          variant="link"
          style="ghost"
          size="small"
          onClick={onCancel}
          disabled={submitting}
        >
          <span>Start Over</span>
        </Button>
      </form>
    </div>
  );
};
