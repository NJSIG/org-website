import { getAuth } from '@/lib/auth';
import { CollectionAfterLogoutHook } from 'payload';

export const signOutBetterAuthHook: CollectionAfterLogoutHook = async ({ req }) => {
  try {
    const auth = await getAuth();

    // req.headers carriers the Better Auth session cookie.
    await auth.api.signOut({ headers: req.headers });
  } catch (err) {
    // Prevent a Better Auth failure from breaking Payload's logout response.
    req.payload.logger.error({ err }, 'Better Auth sign-out failed.');
  }
};
