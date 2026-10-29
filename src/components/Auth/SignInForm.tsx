'use client';

import TitleTheme from '@/components/TitleTheme';
import { authClient } from '@/lib/authClient';
import { Alert, AlertDescription } from '@/primitives/ui/alert';
import { Button } from '@/primitives/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/primitives/ui/field';
import { Input } from '@/primitives/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/primitives/ui/input-group';
import {
  EyeIcon,
  EyeOffIcon,
  KeySquareIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
  WandSparklesIcon,
} from 'lucide-react';
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
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState(false);

  const emailError = emailTouched && email === '';
  const passwordError = passwordTouched && password === '';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setEmailTouched(true);
    setPasswordTouched(true);

    if (email === '' || password === '') {
      setError('All fields are required.');
      return;
    }

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
    <div className="bg-njsig-neutral-background flex w-full max-w-md flex-col gap-3 rounded-3xl p-4 shadow-2xl">
      <TitleTheme size="medium" animated={false} className="mr-auto">
        Sign In
      </TitleTheme>
      <p className="font-medium">Welcome back! Please sign in to your account below.</p>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 pt-3">
        {error && (
          <Alert variant="destructive">
            <TriangleAlertIcon size={24} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FieldGroup>
          <Field data-invalid={emailError}>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              autoComplete="username"
              required
              aria-invalid={emailError}
            />
            {emailError && <FieldError>Email Address is required.</FieldError>}
          </Field>
          <Field data-invalid={passwordError}>
            <FieldLabel htmlFor="password">
              <span>Password</span>
              <Button
                type="button"
                onClick={onForgotPassword}
                variant="link"
                style="ghost"
                size="small"
                className="ml-auto h-auto p-0"
              >
                Forgot Password?
              </Button>
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                autoComplete="current-password"
                required
                aria-invalid={passwordError}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="icon"
                  size="icon-xs"
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {passwordError && <FieldError>Password is required.</FieldError>}
          </Field>
        </FieldGroup>

        <Button type="submit" variant="button" style="flat" disabled={authenticating}>
          {authenticating ? (
            <LoaderCircleIcon size={24} className="mr-2 animate-spin" />
          ) : (
            <KeySquareIcon size={24} className="mr-2" />
          )}
          <span>Sign In</span>
        </Button>
        <Button type="button" variant="button" style="outline" onClick={onSwitchToMagicLink}>
          <WandSparklesIcon size={24} className="mr-2" />
          <span>Sign in with Magic Link</span>
        </Button>
      </form>
    </div>
  );
};
