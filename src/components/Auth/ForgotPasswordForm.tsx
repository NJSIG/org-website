'use client';

import TitleTheme from '@/components/TitleTheme';
import { authClient } from '@/lib/authClient';
import { Alert, AlertDescription } from '@/primitives/ui/alert';
import { Button } from '@/primitives/ui/button';
import { Field, FieldError, FieldLabel } from '@/primitives/ui/field';
import { Input } from '@/primitives/ui/input';
import {
  ArrowLeftIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
  SendIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

type Props = {
  onBack: () => void;
};

export const ForgotPasswordForm: React.FC<Props> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  const emailError = emailTouched && email === '';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setSent(null);
    setEmailTouched(true);

    if (email === '') {
      setError('All fields are required.');
      return;
    }

    setSending(true);

    // Call onSent with any result to prevent this form from revealing
    // if a given email has an account associated with it.
    try {
      await authClient.requestPasswordReset(
        {
          email,
          redirectTo: '/auth/forgot-password',
        },
        {
          onSuccess() {
            setSent(email);
          },
          onError(context) {
            console.error(context.error);
            setError('Failed to send reset link.');
          },
        },
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-njsig-neutral-background flex w-full max-w-md flex-col gap-3 rounded-3xl p-4 shadow-2xl">
      <TitleTheme size="medium" animated={false} className="mr-auto">
        Forgot Password
      </TitleTheme>
      <p className="font-medium">Enter your email to request a password reset link.</p>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 pt-3">
        {error && (
          <Alert variant="destructive">
            <TriangleAlertIcon size={24} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {sent && (
          <Alert variant="success">
            <CircleCheckIcon size={24} />
            <AlertDescription>
              If <strong>{sent}</strong> is associated with an account, a password reset link has
              been sent. If you don't see it, check your spam folder.
            </AlertDescription>
          </Alert>
        )}

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

        <Button type="submit" variant="button" style="flat" disabled={sending}>
          {sending ? (
            <LoaderCircleIcon size={24} className="mr-2 animate-spin" />
          ) : (
            <SendIcon size={24} className="mr-2" />
          )}
          <span>Request Password Reset</span>
        </Button>

        <Button type="button" variant="button" style="outline" onClick={onBack}>
          <ArrowLeftIcon size={24} className="mr-2" />
          <span>Back to Sign In</span>
        </Button>
      </form>
    </div>
  );
};
