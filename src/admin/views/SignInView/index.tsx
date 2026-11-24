'use client';

import { ForgotPasswordForm } from '@/components/Auth/ForgotPasswordForm';
import { MFAChallenge } from '@/components/Auth/MFAChallenge';
import { MFAEnrollScan } from '@/components/Auth/MFAEnrollScan';
import { MFAEnrollStart } from '@/components/Auth/MFAEnrollStart';
import { SignInForm } from '@/components/Auth/SignInForm';
import { Logo } from '@/components/Logo';
import { ADMIN_ROUTE } from '@/lib/authPaths';
import { useTheme } from '@payloadcms/ui';
import React, { useState } from 'react';

/**
 * Registered as `views.login` component in the Payload config and
 * mounted at `/admin/login`. All actions related to the login process
 * (e.g., login, magic link, MFA, request password reset) is handled
 * by the local state in this view, not sub-routes. Processing password
 * resets are handled outside this state machine because the view is
 * reached from an emailed link with its own token.
 */

/**
 * To enable magic links add:
 *
 * `| { name: 'magicLinkRequest' }` to the Step type
 *
 * Then handle it in the switch below, a `MagicLinkForm` component already exists for it.
 *
 * Then make sure to switch to the magic link step from SignInForm via onSwitchToMagicLink
 * that is commented out in the SignInForm component.
 */

type Step =
  | { name: 'signIn' }
  | { name: 'passwordResetRequest' }
  | { name: 'mfaChallenge'; methods: ('totp' | 'otp')[] }
  | { name: 'mfaEnrollStart' }
  | { name: 'mfaEnrollScan'; enrollURI: string; backupCodes: string[] };

const goToAdmin = () => {
  // Hard navigation on purpose to ensure a fresh request that carries
  // the session cookie that was just set, so Payload's `me` check sees it.
  window.location.assign(ADMIN_ROUTE);
};

export const SignInView: React.FC = () => {
  const { theme } = useTheme();
  const [step, setStep] = useState<Step>({ name: 'signIn' });

  let view: React.ReactNode;

  switch (step.name) {
    case 'signIn':
      view = (
        <SignInForm
          onTwoFactorRequired={(methods) => setStep({ name: 'mfaChallenge', methods })}
          onBypassMFA={() => goToAdmin()}
          onForgotPassword={() => setStep({ name: 'passwordResetRequest' })}
        />
      );
      break;
    case 'passwordResetRequest':
      view = <ForgotPasswordForm onBack={() => setStep({ name: 'signIn' })} />;
      break;
    case 'mfaChallenge':
      view = (
        <MFAChallenge
          methods={step.methods}
          onVerified={() => {
            // The session exists now. Users already enrolled with TOTP can continue to admin;
            // everyone else is offered the option to set up TOTP, on every sign-in, until they
            // do. The `methods` came from the sign-in response, so no extra lookup is needed.
            if (step.methods.includes('totp')) {
              goToAdmin();
            } else {
              setStep({ name: 'mfaEnrollStart' });
            }
          }}
          onCancel={() => setStep({ name: 'signIn' })}
        />
      );
      break;
    case 'mfaEnrollStart':
      view = (
        <MFAEnrollStart
          onEnrollStarted={(enrollURI, backupCodes) =>
            setStep({ name: 'mfaEnrollScan', enrollURI, backupCodes })
          }
          onSkip={() => goToAdmin()}
        />
      );
      break;
    case 'mfaEnrollScan':
      view = (
        <MFAEnrollScan
          enrollURI={step.enrollURI}
          backupCodes={step.backupCodes}
          onSkip={() => goToAdmin()}
          onDeviceEnrolled={() => goToAdmin()}
        />
      );
      break;
  }

  return (
    <div className="njsig__custom bg-njsig-background dark:bg-azure-900 flex min-h-screen w-full flex-col px-4">
      <main className="flex grow flex-col items-center justify-center gap-6">
        <Logo style="wordmark" theme={theme} loading="eager" />
        {view}
      </main>
      <footer className="text-muted flex items-center justify-center p-4">
        <p>Copyright &copy; New Jersey Schools Insurance Group. All rights reserved.</p>
      </footer>
    </div>
  );
};
