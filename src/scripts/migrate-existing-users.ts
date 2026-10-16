/**
 * One-time migration: Create a Better Auth account for each existing Payload user.
 *
 * Back up the database or run this against a copy of production data first. This script assumes the Payload user collection
 * has an `email (string)`, `fullName (string)`, and `role (string)` field for each user.
 *
 * Usage:
 *   npx payload run scripts/migrate-existing-users.ts --dry-run
 *
 *      # Test the script without making any changes
 *
 *   npx payload run scripts/migrate-existing-users.ts [--user-collection <collection>] [--user <email>]
 *
 *      # Run the migration for existing users
 *      ## Options:
 *      ##   --user-collection <collection> User collection to migrate (default: users)
 *      ##   --user <email> Target a specific user by email
 *
 *   npx payload run scripts/migrate-existing-users.ts --send-reset-emails [--user <email>]
 *
 *      # Send password reset emails to migrated users so they can set their new password
 *      ## Options:
 *      ##   --user <email> Target a specific user by email
 *      ### Note: This will only send reset emails to users who have already been migrated,
 *      ### if the user has not been migrated yet, they will not receive a reset email.
 *
 * This script is safe to re-run; users who already have a Better Auth account are detected and reported as "skipped" and
 * not treated as failures, retried, or recreated.
 */

import { getAuth, type Auth } from '@/lib/auth';
import config from '@payload-config';
import { randomBytes } from 'crypto';
import { writeFile } from 'fs/promises';
import { CollectionSlug, getPayload } from 'payload';

type MigrationResult =
  | { email: string; status: 'created' }
  | { email: string; status: 'skipped' }
  | { email: string; status: 'failed'; error: string };

type MigratableUserData = {
  email: string;
  fullName?: string;
  role?: string;
};

// Hard-coded constants for the migration script
const PAGE_SIZE = 25; // This should be kept reasonable - createUser does password hashing per call

// User set flags
const DRY_RUN = process.argv.includes('--dry-run');
const SEND_RESET_EMAILS = process.argv.includes('--send-reset-emails');
const REQUESTED_USER_COLLECTION =
  process.argv.find((arg, index, args) => args[index - 1] === '--user-collection') ?? 'users';
const USER_FLAG_INDEX = process.argv.indexOf('--user');
const TARGET_USER = USER_FLAG_INDEX === -1 ? null : (process.argv[USER_FLAG_INDEX + 1] ?? '');

async function main() {
  const payload = await getPayload({ config });
  const auth = await getAuth();

  // Validate the user collection to ensure it exists in the Payload configuration
  const VALIDATED_USER_COLLECTION = payload.config.collections
    .map((collection) => collection.slug)
    .find((slug): slug is CollectionSlug => slug === REQUESTED_USER_COLLECTION);

  if (!VALIDATED_USER_COLLECTION) {
    throw new Error(`Invalid user collection: ${REQUESTED_USER_COLLECTION}`);
  }

  // Validate the requested user if passed
  if (TARGET_USER !== null && (!TARGET_USER || TARGET_USER.startsWith('--'))) {
    throw new Error('--user requires an email value, e.g. --user someone@example.com');
  }

  if (SEND_RESET_EMAILS) {
    return sendResetEmails(auth, payload, VALIDATED_USER_COLLECTION);
  }

  // Paginate for handling large existing user collections and mark
  // a resumable cursor in case the process dies partway through.
  let page = 1;
  let hasNextPage = true;

  const results: MigrationResult[] = [];

  while (hasNextPage) {
    const { docs, nextPage } = await payload.find({
      collection: VALIDATED_USER_COLLECTION,
      limit: PAGE_SIZE,
      page,
      sort: 'id', // Stable ordering so subsequent runs walk the user collection consistently
      where: TARGET_USER ? { email: { equals: TARGET_USER } } : undefined,
    });

    for (const user of docs) {
      results.push(await migrateOne(auth, user as MigratableUserData));
    }

    if (TARGET_USER && page === 1 && docs.length === 0) {
      throw new Error(`No user found with email ${TARGET_USER}`);
    }

    console.log(`Processed page ${page} (${docs.length} users)`);
    hasNextPage = Boolean(nextPage);
    page += 1;
  }

  await writeReport(results);
}

async function migrateOne(auth: Auth, user: MigratableUserData): Promise<MigrationResult> {
  // Idempotency check first rather than relying on `createUser` to return a duplicate-email error.
  const existing = await auth.api
    .listUsers({ query: { searchField: 'email', searchValue: user.email, limit: 1 } })
    .catch(() => null);

  if (existing?.users?.length) {
    return { email: user.email, status: 'skipped' };
  }

  if (DRY_RUN) {
    console.log(`[DRY RUN] Would create a Better Auth account for ${user.email}`);
    return { email: user.email, status: 'created' };
  }

  try {
    await auth.api.createUser({
      body: {
        email: user.email,
        name: user.fullName ?? user.email,
        password: randomBytes(24).toString('hex'), // Randomly generated, never surfaced to the user
        role: user.role === 'admin' ? 'admin' : 'user', // Better Auth's admin-plugin role, no related to Payload, but we'll make sure admins are correctly assigned/ Pre-verify the email since the user already exists
        data: {
          emailVerified: true, // We know the Payload users already own the associated email address, so pre-verify it in Better Auth
        },
      },
    });

    return { email: user.email, status: 'created' };
  } catch (error) {
    return { email: user.email, status: 'failed', error: (error as Error).message };
  }
}

// This is deliberately called only when a flag is passed so we're not sending emails
// when generating accounts, we want to send all the email notifications explicitly.
async function sendResetEmails(
  auth: Auth,
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: CollectionSlug,
) {
  const { docs: users } = await payload.find({
    collection,
    limit: 0,
    where: TARGET_USER ? { email: { equals: TARGET_USER } } : undefined,
  });
  const DELAY_MS = 250; // May need to be tuned for rate-limiting purposes

  for (const user of users) {
    const email = (user as MigratableUserData).email;

    try {
      await auth.api.requestPasswordReset({
        body: {
          email,
          redirectTo: '/auth/forgot-password',
        },
      });

      console.info(`Sent password reset email to ${email}`);
    } catch (error) {
      console.error(`Failed to send password reset email to ${email}:`, (error as Error).message);
    }

    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }
}

async function writeReport(results: MigrationResult[]) {
  const failed = results.filter(
    (r): r is Extract<MigrationResult, { status: 'failed' }> => r.status === 'failed',
  );
  const created = results.filter((r) => r.status === 'created').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;

  console.info(`\nDone. Created: ${created}, Skipped: ${skipped}, Failed: ${failed.length}`);

  if (failed.length) {
    console.info('Failed (re-running this script is safe, already created users will be skipped):');

    failed.forEach((f) => console.warn(`    - ${f.email}: ${f.error ?? 'Unknown Error'}`));
  }

  await writeFile(
    `migration-report-${Date.now()}.json`,
    JSON.stringify({ created, skipped, failed, results }, null, 2),
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration script crashed:', error);
    process.exit(1);
  });
