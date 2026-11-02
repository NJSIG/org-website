'use client';

import { authClient } from '@/lib/authClient';
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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const autoSent = useRef(false);

  // Default trust device to false, this could be something
  // that is changed per user type.
  const [trustDevice, setTrustDevice] = useState(false);

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
    <form onSubmit={handleSubmit}>
      <p>{prompt}</p>
      {error && <p role="alert">{error}</p>}

      <label>
        {mode === 'backup' ? 'Backup code' : 'Code'}
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          inputMode={mode === 'backup' ? 'text' : 'numeric'}
          autoComplete="one-time-code"
          autoFocus
          required
        />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Verifying…' : 'Verify'}
      </button>

      {/* Secondary options: only what this user can actually use, and only
          alternatives to the screen they're already on. */}
      {mode === 'otp' && (
        <button type="button" onClick={sendEmailCode} disabled={cooldown > 0}>
          {cooldown > 0 ? `Resend code (${cooldown}s)` : 'Resend code'}
        </button>
      )}
      {mode === 'otp' && hasTOTP && (
        <button type="button" onClick={() => switchTo('totp')}>
          Use authenticator app instead
        </button>
      )}
      {mode === 'totp' && hasOTP && (
        <button type="button" onClick={() => switchTo('otp')}>
          Email me a code instead
        </button>
      )}
      {mode === 'totp' && (
        <button type="button" onClick={() => switchTo('backup')}>
          Use a backup code
        </button>
      )}
      {mode === 'backup' && (
        <button type="button" onClick={() => switchTo(defaultMode)}>
          Back
        </button>
      )}

      <button type="button" onClick={onCancel}>
        Start over
      </button>
    </form>
  );
};
