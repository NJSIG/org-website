'use client';

import { authClient } from '@/lib/authClient';
import payload from 'payload';
import React, { FormEvent, useState } from 'react';

type Props = {
  onTwoFactorRequired: (methods: ('totp' | 'otp')[]) => void;
  onSwitchToMagicLink: () => void;
  onForgotPassword: () => void;
};

export const SignInForm: React.FC<Props> = ({
  onTwoFactorRequired,
  onSwitchToMagicLink,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setAuthenticating(true);

    try {
      await authClient.signIn.email(
        { email, password },
        {
          async onSuccess(context) {
            if (context.data.twoFactorRedirect) {
              // No partial session exists so yet, there is nothing to hand off
              // to Payload. Route to the two-factor challenge.
              onTwoFactorRequired(context.data.twoFactorMethods as ('totp' | 'otp')[]);

              return;
            }

            // No MFA enrolled, the session is set and the user is signed in successfully.
            window.location.href = '/admin';
          },
          onError(context) {
            payload.logger.error(context.error);

            // 429 ACCOUNT_TEMPORARILY_LOCKED has a shared counter across
            // OTP, TOTP, and Backup Codes so it is worth handling explicitly
            // so a locked out admin doesn't assume their password is incorrect.
            setError(
              context.error.status === 429
                ? 'Too many failed attempts. Your account has been temporarily locked, please try again later.'
                : 'Incorrect email or password.',
            );
          },
        },
      );
    } finally {
      setAuthenticating(false);
    }
  }

  // TODO: This needs styling
  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert">{error}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      <button type="submit" disabled={authenticating}>
        {authenticating ? 'Signing in...' : 'Sign In'}
      </button>

      <button type="button" onClick={onForgotPassword}>
        Forgot Password?
      </button>

      <button type="button" onClick={onSwitchToMagicLink}>
        Sign in with Magic Link
      </button>
    </form>
  );
};
