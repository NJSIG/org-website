'use client';

import { authClient } from '@/lib/authClient';
import { Button } from '@/primitives/ui/button';
import { KeySquareIcon, WandSparklesIcon } from 'lucide-react';
import React, { FormEvent, useState } from 'react';
import TitleTheme from '../TitleTheme';

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
            console.error(context.error);

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

  return (
    <div className="bg-njsig-neutral-background flex flex-col gap-3 rounded-3xl p-4 shadow-2xl">
      <TitleTheme size="responsive" animated={false} className="mr-auto">
        Sign In
      </TitleTheme>
      <p className="font-medium">Welcome back! Please sign in to your account below.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-3">
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

        <button type="button" onClick={onForgotPassword}>
          Forgot Password?
        </button>

        <Button
          variant="button"
          style="flat"
          type="submit"
          className="border-none"
          disabled={authenticating}
        >
          <KeySquareIcon size={24} className="mr-2" />
          <span>Sign In</span>
        </Button>
        <Button
          variant="button"
          style="outline"
          onClick={onSwitchToMagicLink}
          className="cursor-pointer"
        >
          <WandSparklesIcon size={24} className="mr-2" />
          <span>Sign in with Magic Link</span>
        </Button>
      </form>
    </div>
  );
};
