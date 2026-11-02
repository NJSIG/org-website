'use client';

import { authClient } from '@/lib/authClient';
import { Alert, AlertDescription } from '@/primitives/ui/alert';
import { Button } from '@/primitives/ui/button';
import { Field, FieldError, FieldLabel } from '@/primitives/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/primitives/ui/input-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitives/ui/tooltip';
import {
  CircleQuestionMarkIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  LoaderCircleIcon,
  ShieldUserIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import TitleTheme from '../TitleTheme';

type Props = {
  onEnrollStarted: (enrollURI: string, backupCodes: string[]) => void;
  onSkip: () => void;
};

export const MFAEnrollStart: React.FC<Props> = ({ onEnrollStarted, onSkip }) => {
  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState(false);

  const passwordError = passwordTouched && password === '';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);
    setPasswordTouched(true);

    if (password === '') {
      setError('Password is required');
      return;
    }

    setAuthenticating(true);

    try {
      await authClient.twoFactor.enable(
        { password, method: 'totp' },
        {
          onSuccess(context) {
            if (context.data.methods?.includes('totp') && context.data.totpURI) {
              onEnrollStarted(context.data.totpURI, context.data.backupCodes ?? []);
              return;
            }

            setError('Failed to generated enrollment URI');
          },
          onError(context) {
            console.error(context.error);
            setError('Failed to start MFA enrollment, please try again.');
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
        Secure Your Account
      </TitleTheme>
      <p className="font-medium">Enhance your account security with an authenticator app.</p>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 pt-3">
        {error && (
          <Alert variant="destructive">
            <TriangleAlertIcon size={24} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && (
          <Alert>
            <InfoIcon size={24} />
            <AlertDescription>Verify your password to get started.</AlertDescription>
          </Alert>
        )}

        <Field data-invalid={passwordError}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
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

        <Button type="submit" variant="button" style="flat" disabled={authenticating}>
          {authenticating ? (
            <LoaderCircleIcon size={24} className="mr-2 animate-spin" />
          ) : (
            <ShieldUserIcon size={24} className="mr-2" />
          )}
          <span>Secure Account</span>
        </Button>

        <div className="flex gap-2">
          <Button type="button" variant="button" style="outline" disabled={authenticating}>
            <span>Skip</span>
          </Button>

          <Tooltip>
            <TooltipTrigger>
              <span>
                <CircleQuestionMarkIcon size={16} />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <ul>
                <li>You will be asked again next time your device is validated.</li>
                <li>You will always be able to get codes by email.</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};
