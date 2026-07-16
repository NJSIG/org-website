import { TaskConfig } from 'payload';

export const nightly: NonNullable<TaskConfig['schedule']>[0] = {
  cron: '0 0 * * *', // 12:00 AM every day
  queue: 'nightly', // Use the "nightly" queue for this task
};
