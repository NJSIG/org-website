'use client';

import { authClient } from '@/lib/authClient';
import payload from 'payload';
import { FormEvent, useState } from 'react';

/**
 * Mounted at its own path (/auth/reset). The user lands here
 * from an emailed link carrying a `token` query param, rather than
 * a transition inside the SignInView. Register it as its own entry
 * in `payload.config.ts` at `admin.components.views` alongside `login`.
 *
 * admin {
 *   components: {
 *     views: {
 *       login: {
 *         Component: '@/admin/views/SignInView#SignInView',
 *         path: '/auth/sign-in',
 *       },
 *       forgot: {
 *         Component: '@/admin/views/ResetPasswordView#ResetPasswordView',
 *         path: '/auth/reset',
 *       },
 *     },
 *   },
 * }
 */
export const ResetPasswordView: React.FC = () => {
  const token = new URLSearchParams(window.location.search).get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return (
      <p>This reset link is invalid or has expired. Request a new one from the sign-in page.</p>
    );
  }

  if (success) {
    return (
      <div>
        <p>Password updated. You can sign in now.</p>
        <a href="/auth/sign-in">Sign In</a>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords must match.');

      return;
    }

    setSubmitting(true);

    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token: token!,
    });

    setSubmitting(false);

    if (resetError) {
      payload.logger.error(resetError);

      setError(
        resetError.status === 400
          ? 'This link has expired or is invalid, please request a new one.'
          : 'Failed to reset password, please try again.',
      );

      return;
    }

    setSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert">{error}</p>}

      <label htmlFor="password">New Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      <label htmlFor="confirmPassword">Confirm New Password</label>
      <input
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
};
