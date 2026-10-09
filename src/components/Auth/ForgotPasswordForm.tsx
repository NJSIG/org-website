'use client';

import { authClient } from '@/lib/authClient';
import { FormEvent, useState } from 'react';

type Props = {
  onSent: (email: string) => void;
  onBack: () => void;
};

export const ForgotPasswordForm: React.FC<Props> = ({ onSent, onBack }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setSubmitting(true);

    // Call onSent with any result to prevent this form from revealing
    // if a given email has an account associated with it.
    try {
      await authClient.requestPasswordReset(
        {
          email,
          redirectTo: '/auth/forgot-password',
        },
        {
          onError(context) {
            console.error(context.error);
          },
        },
      );
    } finally {
      setSubmitting(false);
      onSent(email);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
        required
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Request Password Reset'}
      </button>

      <button type="button" onClick={onBack}>
        Back
      </button>
    </form>
  );
};
