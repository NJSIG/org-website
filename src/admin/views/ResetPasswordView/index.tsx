'use client';

import { Hyperlink } from '@/components/Hyperlink';
import { Logo } from '@/components/Logo';
import TitleTheme from '@/components/TitleTheme';
import { authClient } from '@/lib/authClient';
import { SIGN_IN_URL } from '@/lib/authPaths';
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
  ArrowLeftIcon,
  CircleCheckIcon,
  EyeIcon,
  EyeOffIcon,
  KeySquareIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

/**
 * This is where the emailed link lands. The chain is:
 *
 * email link -> /api/<RESET_PASSWORD_PATH>/<token>?callback=<RESET_PASSWORD_URL>
 *            -> Better Auth checks the token, then redirects to
 *            -> <RESET_PASSWORD_URL>?token=<token>        (valid)
 *            -> <RESET_PASSWORD_URL>?error=INVALID_TOKEN  (expired or used)
 *
 * So `callbackURL` has to be the real URL of THIS view, including the admin prefix.
 *
 * Register this view in `payload.config.ts` using the shared constants:
 *
 *  routes: { admin: ADMIN_ROUTE, login: SIGN_IN_PATH, forgot: RESET_PASSWORD_PATH },
 *  components: {
 *    views: {
 *      forgot: {
 *        Component: "@/admin/views/ResetPasswordView#ResetPasswordView",
 *        path: RESET_PASSWORD_PATH,
 *      }
 *    }
 *  }
 */

const goToAuth = () => {
  // Hard navigation on purpose to ensure a fresh request that carries
  // the session cookie that was just set, so Payload's `me` check sees it.
  window.location.href = '/auth/sign-in';
};

export const ResetPasswordView: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const linkError = searchParams.get('error'); // "INVALID_TOKEN" when expired or already used

  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState<null | string>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState<null | string>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetting, setResetting] = useState(false);

  const preValidatePassword = () => {
    setPasswordTouched(true);
    setPasswordInvalid(password.length < 12 ? 'Password must be 12 characters or more.' : null);
  };

  const preValidateConfirmPassword = () => {
    setConfirmPasswordTouched(true);

    if (confirmPassword === '') {
      setConfirmPasswordInvalid('Confirm Password is required.');
      return;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordInvalid('Must match password');
      return;
    }

    setConfirmPasswordInvalid(null);
  };

  async function handleReset(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (password === '' || confirmPassword === '') {
      setError('Fill out all fields.');
      return;
    }

    if (password.length < 12) {
      setError('Password must be at least 12 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords must match.');
      return;
    }

    setResetting(true);

    try {
      await authClient.resetPassword(
        {
          newPassword: password,
          token: token!,
        },
        {
          onSuccess() {
            setSuccess(true);
          },
          onError(context) {
            setError(
              context.error.status === 400
                ? 'This link has expired or is invalid, please request a new one.'
                : 'Failed to reset password, please try again.',
            );
          },
        },
      );
    } finally {
      setResetting(false);
    }
  }

  return (
    <div
      className="njsig__custom bg-njsig-background flex min-h-screen w-full flex-col px-4"
      data-theme="light"
    >
      <main className="flex grow flex-col items-center justify-center gap-6">
        <Logo style="wordmark" theme="light" loading="eager" />
        <div className="bg-njsig-neutral-background flex w-full max-w-md flex-col gap-3 rounded-3xl p-4 shadow-2xl">
          <TitleTheme size="medium" animated={false} className="mr-auto">
            Password Reset
          </TitleTheme>
          <p className="font-medium">Your new password must be at least 12 characters.</p>
          <form onSubmit={handleReset} noValidate className="flex flex-col gap-4 pt-3">
            {(linkError || !token) && (
              <Alert variant="destructive">
                <TriangleAlertIcon size={24} />
                <AlertDescription>
                  This link has expired or is invalid, please request a new one.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <TriangleAlertIcon size={24} />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="success">
                <CircleCheckIcon size={24} />
                <AlertDescription>
                  Your password has been reset, go back to the{' '}
                  <Hyperlink link={{ type: 'custom', url: SIGN_IN_URL }}>Sign In</Hyperlink> page.
                </AlertDescription>
              </Alert>
            )}

            <FieldGroup>
              <Field data-invalid={passwordTouched && passwordInvalid !== null}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    onBlur={() => preValidatePassword()}
                    required
                    aria-invalid={passwordTouched && passwordInvalid !== null}
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
                {passwordTouched && passwordInvalid !== null && (
                  <FieldError>{passwordInvalid}</FieldError>
                )}
              </Field>
              <Field data-invalid={confirmPasswordTouched && confirmPasswordInvalid !== null}>
                <FieldLabel htmlFor="password">Confirm Password</FieldLabel>
                <Input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value.trim())}
                  onBlur={() => preValidateConfirmPassword()}
                  autoComplete="current-password"
                  required
                  aria-invalid={confirmPasswordTouched && confirmPasswordInvalid !== null}
                />
                {confirmPasswordTouched && confirmPasswordInvalid && (
                  <FieldError>{confirmPasswordInvalid}</FieldError>
                )}
              </Field>
            </FieldGroup>

            <Button type="submit" variant="button" style="flat" disabled={resetting}>
              {resetting ? (
                <LoaderCircleIcon size={24} className="mr-2 animate-spin" />
              ) : (
                <KeySquareIcon size={24} className="mr-2" />
              )}
              <span>Update Password</span>
            </Button>

            <Button type="button" variant="button" style="outline" onClick={() => goToAuth()}>
              <ArrowLeftIcon size={24} className="mr-2" />
              <span>Back to Sign In</span>
            </Button>
          </form>
        </div>
      </main>
      <footer className="text-muted flex items-center justify-center p-4">
        <p>Copyright &copy; New Jersey Schools Insurance Group. All rights reserved.</p>
      </footer>
    </div>
  );
};
