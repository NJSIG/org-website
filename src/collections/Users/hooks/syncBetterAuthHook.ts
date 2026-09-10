import { getAuth } from '@/lib/auth';
import { randomBytes } from 'crypto';
import { CollectionAfterChangeHook } from 'payload';

export const syncBetterAuthHook: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation === 'create') {
    const auth = await getAuth();

    await auth.api.createUser({
      body: {
        email: doc.email,
        name: `${doc.firsName} ${doc.lastName}`.trim(),
        password: randomBytes(24).toString('hex'), // Never surfaced to the user
        role: 'user', // This is the Better Auth role, not the CMS role
      },
    });

    // TODO: Trigger first sign in email with Magic Link or Email-OTP for password creation
  }
};
