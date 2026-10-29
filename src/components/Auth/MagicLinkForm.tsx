'use client';

import { authClient } from '@/lib/authClient';
import { Alert, AlertDescription } from '@/primitives/ui/alert';
import { Button } from '@/primitives/ui/button';
import { Field, FieldError, FieldLabel } from '@/primitives/ui/field';
import { Input } from '@/primitives/ui/input';
import { ArrowLeftIcon, LoaderCircleIcon, SendIcon, TriangleAlertIcon } from 'lucide-react';
import { FormEvent, useState } from 'react';
import TitleTheme from '../TitleTheme';

type Props = {
  onSent: (email: string) => void;
  onBack: () => void;
};

/**
 * NOTE: Magic Link sign in is not gated by MFA. An MFA enrolled user
 * can bypass their second factor by using a magic link. If we want to
 * require MFA for magic links we would need to add an `after` hook on
 * the magic link verify endpoint rather than relying on the client.
 */
export const MagicLinkForm: React.FC<Props> = ({ onSent, onBack }) => {
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const emailError = emailTouched && email === '';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setEmailTouched(true);

    if (email === '') {
      setError('All fields are required.');
      return;
    }

    setSending(true);

    // TODO: Do check the result of trying to send a magic link to an account
    // that does not exist, this form should not reveal that fact.
    try {
      await authClient.signIn.magicLink(
        {
          email,
          callbackURL: '/admin', // Redirect URL after successful sign-in
        },
        {
          onSuccess() {
            onSent(email);
          },
          onError(context) {
            console.error(context.error);
            setError('Failed to send magic link, please try again later.');
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
        Sign In
      </TitleTheme>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 pt-3">
        {error && (
          <Alert variant="destructive">
            <TriangleAlertIcon size={24} />
            <AlertDescription>{error}</AlertDescription>
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
          <span>Send Magic Link</span>
        </Button>

        <Button type="button" variant="button" style="outline" onClick={onBack}>
          <ArrowLeftIcon size={24} className="mr-2" />
          <span>Back to Sign In</span>
        </Button>
      </form>
    </div>
  );
};
