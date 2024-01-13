// Import necessary modules and types
import amqp, { ConsumeMessage } from "amqplib/callback_api";
import { startWorker } from "../../config/amqp/worker";
import { ProcessCallbackType } from "types/controllers/type";
// import { getAmqpChannel } from '../../config//amqp/amqpConnection';

// Assume you have a route or function where you want to start a worker
export async function startWorkerFunction(channel: amqp.Channel | null) {
  //   const channel = getAmqpChannel();

  async function processMessageCallback(msg: ConsumeMessage): Promise<boolean> {
    // Custom processing logic here
    console.log("Custom processing logic:", msg.content.toString());
  
    // Returning true acknowledges the message, false rejects it
    return true;
  }

  if (channel) {
    // Use the startWorker function to start processing messages from a queue or exchange
    startWorker({
      channel,
      destination: "test_queue",
      destinationType: "queue", // or 'exchange'
      exchangeType: "direct", // or other exchange type
      exchangeOptions: {}, // exchange options
      processCallback: processMessageCallback as ProcessCallbackType ,
    });
  } else {
    console.error("AMQP channel not available");
  }
}
