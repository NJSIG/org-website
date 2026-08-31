import config from '@payload-config';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { admin } from 'better-auth/plugins/admin';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { getPayload } from 'payload';

let authPromise: ReturnType<typeof initializeAuth> | undefined;

const initializeAuth = async () => {
  const payload = await getPayload({ config });
  const client = payload.db.connection.getClient();
  const db = client.db();

  return betterAuth({
    appName: 'NJSIG',
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,

    database: mongodbAdapter(db, {
      // Client is optional, but needed for multi-document updates
      client,
      // Disable transactions for standalone MongoDB or sign up will throw
      // For a replica set, enable transactions by setting this to true
      transaction: false,
    }),

    // Collection names for the core schema
    user: { modelName: 'auth-users' },
    session: { modelName: 'auth-sessions' },
    account: { modelName: 'auth-accounts' },
    verification: { modelName: 'auth-verifications' },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      disableSignUp: true,
    },

    plugins: [
      admin(),
      twoFactor({
        issuer: `NJSIG (${process.env.BETTER_AUTH_URL})`,
        twoFactorTable: 'auth-two-factor',
        otpOptions: {
          async sendOTP({ user, otp }) {
            // TODO: Implement email templates
            await payload.sendEmail({
              to: user.email,
              subject: 'NJSIG - Verification Code',
              text: `Your verification code is: ${otp}`,
            });
          },
        },
      }),
      // TODO: Add magic link authentication
    ],

    // Sync user created by Better Auth to Payload
    databaseHooks: {
      user: {
        create: {
          after: async (betterAuthUser) => {
            const name = betterAuthUser.name.split(' ');

            await payload.create({
              collection: 'users',
              data: {
                email: betterAuthUser.email,
                firstName: name[0] ?? '',
                lastName: name.slice(1).join(' ') ?? '',
                role: 'user',
              },
              draft: false,
            });
          },
        },
      },
    },
  });
};

export const getAuth = () => (authPromise ??= initializeAuth());
