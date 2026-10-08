'use client';

import { authClient } from '@/lib/authClient';
import payload from 'payload';
import { FormEvent, useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setIsSending(true);

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
            payload.logger.error(context.error);
            setError('Failed to send magic link, please try again later.');
          },
        },
      );
    } finally {
      setIsSending(false);
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

      <button type="submit" disabled={isSending}>
        {isSending ? 'Sending magic link...' : 'Send Magic Link'}
      </button>

      <button type="button" onClick={onBack}>
        Back
      </button>
    </form>
  );
};
