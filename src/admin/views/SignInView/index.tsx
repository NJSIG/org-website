'use client';

import { ForgotPasswordForm } from '@/components/Auth/ForgotPasswordForm';
import { ForgotPasswordSent } from '@/components/Auth/ForgotPasswordSent';
import { MagicLinkForm } from '@/components/Auth/MagicLinkForm';
import { MagicLinkSent } from '@/components/Auth/MagicLinkSent';
import { MFAChallenge } from '@/components/Auth/MFAChallenge';
import { SignInForm } from '@/components/Auth/SignInForm';
import React, { useState } from 'react';

/**
 * Registered as `views.login` component in the Payload config and
 * mounted at `/admin/login`. All actions related to the login process
 * (e.g., login, magic link, MFA, request password reset) is handled
 * by the local state in this view, not sub-routes. Processing password
 * resets are handled outside this state machine because the view is
 * reached from an emailed link with its own token.
 */

type Step =
  | { name: 'signIn' }
  | { name: 'magicLinkRequest' }
  | { name: 'magicLinkSent'; email: string }
  | { name: 'passwordResetRequest' }
  | { name: 'passwordResetSent'; email: string }
  | { name: 'mfaChallenge'; methods: ('totp' | 'otp')[] };

export const SignInView: React.FC = () => {
  const [step, setStep] = useState<Step>({ name: 'signIn' });

  switch (step.name) {
    case 'signIn':
      return (
        <SignInForm
          onTwoFactorRequired={(methods) => setStep({ name: 'mfaChallenge', methods })}
          onSwitchToMagicLink={() => setStep({ name: 'magicLinkRequest' })}
          onForgotPassword={() => setStep({ name: 'passwordResetRequest' })}
        />
      );
    case 'magicLinkRequest':
      return (
        <MagicLinkForm
          onSent={(email) => setStep({ name: 'magicLinkSent', email })}
          onBack={() => setStep({ name: 'signIn' })}
        />
      );
    case 'magicLinkSent':
      return <MagicLinkSent email={step.email} onBack={() => setStep({ name: 'signIn' })} />;
    case 'passwordResetRequest':
      return (
        <ForgotPasswordForm
          onSent={(email) => setStep({ name: 'passwordResetSent', email })}
          onBack={() => setStep({ name: 'signIn' })}
        />
      );
    case 'passwordResetSent':
      return <ForgotPasswordSent email={step.email} onBack={() => setStep({ name: 'signIn' })} />;
    case 'mfaChallenge':
      return (
        <MFAChallenge
          methods={step.methods}
          onVerified={() => setStep({ name: 'signIn' })}
          onCancel={() => setStep({ name: 'signIn' })}
        />
      );
  }
};
