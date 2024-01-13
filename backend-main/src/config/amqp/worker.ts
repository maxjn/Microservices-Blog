import { Channel, ConsumeMessage } from "amqplib/callback_api";
import { WorkerOptionsType } from "types/controllers/type";
import { ProcessCallbackType } from "types/controllers/type";

export function startWorker(options: WorkerOptionsType): void {
  const { channel, destination, destinationType, processCallback } = options;

  channel.prefetch(1);

  if (destinationType === "queue") {
    // Worker for queue
    channel.assertQueue(destination, { durable: true }, function (_err, _ok) {
      // Pass the processCallback directly
      channel.consume(
        destination,
        (msg) => processMsg(channel, msg as ConsumeMessage, processCallback),
        { noAck: false }
      );
      console.log(`Worker for queue '${destination}' is started`);
    });
  } else if (destinationType === "exchange") {
    // Worker for exchange
    channel.assertExchange(
      destination,
      options.exchangeType || "direct",
      options.exchangeOptions || {}
    );
    channel.assertQueue("", { exclusive: true }, function (_err, q) {
      channel.bindQueue(q.queue, destination, "");

      channel.consume(
        q.queue,
        processMsg.bind(null, channel, processCallback),
        { noAck: false }
      );
      console.log(`Worker for exchange '${destination}' is started`);
    });
  }
}

export async function processMsg(
  ch: Channel,
  msg: ConsumeMessage | null,
  processCallback: ProcessCallbackType
) {
  if (!msg) {
    return;
  }

  const destination =
    msg.fields?.exchange ||
    msg.properties?.headers?.queue ||
    msg.fields?.routingKey;
    
  try {
    console.log(processCallback); // Log the type
    console.log(typeof processCallback); // Log the type
    const result = await processCallback(msg);

    if (result) {
      ch.ack(msg);
    } else {
      ch.reject(msg, true);
    }
  } catch (e) {
    closeOnErr(e, ch);
  }

  console.log(`Worker got message from destination: ${destination}`);
  console.log("Message content: ", msg.content.toString());
}

export function closeOnErr(err: Error | null, ch: Channel) {
  if (err) {
    console.error("[AMQP] error", err);
    ch.connection.close();
    return true;
  }
  return false;
}
