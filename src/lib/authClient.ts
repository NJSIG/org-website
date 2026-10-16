'use client';

import { createAuthClient } from 'better-auth/client';
import { magicLinkClient, twoFactorClient } from 'better-auth/client/plugins';

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!baseURL) {
  throw new Error('Missing required environment variable: NEXT_PUBLIC_SERVER_URL');
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    twoFactorClient({
      // Fires when a sign-in response comes back with `twoFactorRedirect: true`.
      // SignInForm also checks the flag directly on its own response, so this
      // callback mainly matters for sign-ins that happen somewhere other than
      // BetterAuthLoginView. This will be rare on the admin side, but we are
      // accounting for future front end integration
      onTwoFactorRedirect() {
        window.location.href = '/auth/sign-in';
      },
    }),
    magicLinkClient(),
  ],
});
