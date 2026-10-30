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
    // We're deliberately omitting `onTwoFactorRedirect` here. That callback fires on every
    // sign-in response that has `twoFactorRedirect` set. The SignInForm reads the value and
    // the SignInView state machine handles the handoff to the verification screen.
    twoFactorClient(),
    magicLinkClient(),
  ],
});
