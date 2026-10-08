'use client';

import { authClient } from '@/lib/authClient';
import payload from 'payload';
import { FormEvent, useState } from 'react';

type Method = 'totp' | 'otp' | 'backup';

type Props = {
  methods: ('totp' | 'otp')[];
  onVerified: () => void;
  onCancel: () => void;
};

export const MFAChallenge: React.FC<Props> = ({ methods, onVerified, onCancel }) => {
  const [activeMethod, setActiveMethod] = useState<Method | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Default trust device to false, this could be something
  // that is changed per user type.
  const [trustDevice, setTrustDevice] = useState(false);

  async function requestEmailCode() {
    setError(null);

    const { error: sendOtpError } = await authClient.twoFactor.sendOtp();

    if (sendOtpError) {
      payload.logger.error(sendOtpError);
      setError('Failed to send OTP Code, please try again.');

      return;
    }

    setOtpSent(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setSubmitting(true);

    const verify =
      activeMethod === 'totp'
        ? authClient.twoFactor.verifyTotp({ code, trustDevice })
        : activeMethod === 'otp'
          ? authClient.twoFactor.verifyOtp({ code, trustDevice })
          : authClient.twoFactor.verifyBackupCode({ code, trustDevice });

    const { error: verifyError } = await verify;

    if (verifyError) {
      payload.logger.error(verifyError);

      // 429 ACCOUNT_TEMPORARILY_LOCKED has a shared counter across
      // OTP, TOTP, and Backup Codes so it is worth handling explicitly
      // so a locked out admin doesn't assume their password is incorrect.
      setError(
        verifyError.status === 429
          ? 'Too many failed attempts. Your account has been temporarily locked, please try again later.'
          : 'Invalid code, please try again.',
      );

      return false;
    }

    onVerified();
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert">{error}</p>}

      {methods.length > 1 && activeMethod !== 'backup' && (
        <div>
          {methods.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => {
                setActiveMethod(method);
                setCode('');
                setOtpSent(false);
              }}
              disabled={activeMethod === method}
            >
              {method === 'totp' ? 'Authenticator App' : 'Email Code'}
            </button>
          ))}
        </div>
      )}

      {activeMethod === 'otp' && !otpSent && (
        <button type="button" onClick={requestEmailCode}>
          Send me a code
        </button>
      )}

      {(activeMethod === 'totp' ||
        (activeMethod === 'otp' && otpSent) ||
        activeMethod === 'backup') && (
        <>
          <label htmlFor="mfa-code">
            {activeMethod === 'backup' ? 'Backup Code' : '6-Digit Code'}
          </label>
          <input
            id="mfa-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode={activeMethod === 'backup' ? 'text' : 'numeric'}
            autoFocus
            required
          />
        </>
      )}

      <label htmlFor="trust-device">
        <input
          type="checkbox"
          checked={trustDevice}
          onChange={(e) => setTrustDevice(e.target.checked)}
        />
        Trust this device for 30 days
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Verifying...' : 'Verify'}
      </button>

      {activeMethod !== 'backup' && (
        <button
          type="button"
          onClick={() => {
            setActiveMethod('backup');
            setCode('');
          }}
        >
          Use Backup Code
        </button>
      )}

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};
