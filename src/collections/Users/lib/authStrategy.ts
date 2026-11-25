import { getAuth } from '@/lib/auth';
import { AuthStrategy } from 'payload';

// Because Better Auth's user will be null until completely
// authenticated (i.e., signed in and completed MFA) we get
// multi-factor protection for free here.

export const betterAuthStrategy: AuthStrategy = {
  name: 'better-auth',
  authenticate: async ({ payload, headers }) => {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers });

    if (!session) {
      return { user: null };
    }

    const result = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: session.user.email,
        },
      },
      limit: 1,
    });

    const doc = result.docs[0];

    if (!doc) {
      return { user: null };
    }

    return { user: { ...doc } };
  },
};
