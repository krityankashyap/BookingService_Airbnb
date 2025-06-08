import { Queue } from 'bullmq';
import { getRedisConnectionObject } from '../config/redis.config';

export const MAILER_QUEUE = 'queue-mailer'; // name of the queue must be unique, if two queues have same name it will reconize both queue as same

export const mailerQueue = new Queue(MAILER_QUEUE , {
  connection: getRedisConnectionObject(),
});
