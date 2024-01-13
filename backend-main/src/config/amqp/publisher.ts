import { Channel } from 'amqplib/callback_api';
import { ExchangeType, OfflinePubQueueType  } from '../../types/controllers/type';



let offlinePubQueue: OfflinePubQueueType = [];

export function startPublisher(ch: Channel) {

  while (true) {
    const m = offlinePubQueue.shift();
    if (!m) break;
    publish(ch, m[0], m[1], m[2], m[3], m[4], m[5]);
  }
}

export function publish(
  ch: Channel,
  destination: string, // Queue or Exchange name
  routingKey: string,
  content: Buffer,
  destinationType: 'queue' | 'exchange',
  exchangeType: ExchangeType,
  exchangeOptions: any
) {
  try {
    if (destinationType === 'queue') {
      // Assert the queue to make sure it exists
      ch.assertQueue(destination, { durable: true });
      ch.sendToQueue(destination, content, { persistent: true });
    } else if (destinationType === 'exchange') {
      // Assert the exchange to make sure it exists
      ch.assertExchange(destination, exchangeType, exchangeOptions);
      ch.publish(destination, routingKey, content, { persistent: true });
    } else {
      throw new Error("Invalid destination type. Use 'queue' or 'exchange'.");
    }
  } catch (e) {
    console.error("[AMQP] publish", e.message);
    offlinePubQueue.push([destination, routingKey, content, destinationType, exchangeType, exchangeOptions]);
  }
}


