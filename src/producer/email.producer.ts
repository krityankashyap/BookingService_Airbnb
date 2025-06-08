import { notificationDTO } from "../dto/notification.dto";
import { mailerQueue } from "../queues/email.queue";

export const MAILER_PAYLOAD = "payload:mail";

export const addEmailToQueue = async (payload: notificationDTO) => {
  await mailerQueue.add(MAILER_PAYLOAD , payload);
  console.log(`Email added to queue: ${JSON.stringify(payload)}`);
}

// this code should sufficient enough that can helps us to produce or create a new mailer payload that will be enqueued inside queue to be rather processed some kind of  job processor 