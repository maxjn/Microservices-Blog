// connection.ts
import amqp from 'amqplib/callback_api';

// Modules
import { startPublisher, publish } from './publisher';
import { startWorker } from './worker';
import { startWorkerFunction } from '../../utils/amqp/workers';


let amqpConn: amqp.Connection | null = null;
let amqpChannel: amqp.Channel | null = null;

export function start(url: string) {
  amqp.connect(url + "?heartbeat=60", function (err, conn) {
    if (err) {
      console.error("[AMQP]", err.message);
      return setTimeout(start.bind(null, url, whenConnected), 1000);
    }

    conn.on("error", function (err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
    });

    conn.on("close", function () {
      console.error("[AMQP] reconnecting");
      return setTimeout(start.bind(null, url, whenConnected), 1000);
    });

    console.log("[AMQP] connected");
    amqpConn = conn;
    whenConnected();
  });
}

function whenConnected () {
    const amqpConn = getAmqpConn();

    // Start RabbitMQ publisher and worker
    if (amqpConn) {
      amqpConn.createChannel((err, channel) => {
        if (err) {
          console.error("[AMQP] Error creating channel", err);
          return;
        }

        amqpChannel = channel

        // Now you can use the channel
        startPublisher(channel);
        // startWorkerFunction(amqpChannel);
      });
    }
  }

export function getAmqpConn(): amqp.Connection | null {
  return amqpConn;
}

export function getAmqpChannel(): amqp.Channel | null {
  return amqpChannel;
}
