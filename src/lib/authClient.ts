'use client';

import { requireEnv } from '@/utilities/requireEnv';
import { createAuthClient } from 'better-auth/client';
import { magicLinkClient, twoFactorClient } from 'better-auth/client/plugins';

const requiredSettings = {
  BETTER_AUTH_URL: requireEnv('BETTER_AUTH_URL'),
};

export const authClient = createAuthClient({
  baseURL: requiredSettings.BETTER_AUTH_URL,
  plugins: [
    twoFactorClient({
      // Fires when a sign-in response comes back with `twoFactorRedirect: true`.
      // SignInForm also checks the flag directly on its own response, so this
      // callback mainly matters for sign-ins that happen somewhere other than
      // BetterAuthLoginView. This will be rare on the admin side, but we are
      // accounting for future front end integration
      onTwoFactorRedirect() {
        window.location.href = '/admin/sign-in';
      },
    }),
    magicLinkClient(),
  ],
});
