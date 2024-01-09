// Import necessary modules and types
import {  publish } from '../../config/amqp/publisher';
import { getAmqpChannel } from '../../config//amqp/amqpConnection';

// Assume you have a route or function where you want to publish a message
export async function publishMessage() {
  const channel = getAmqpChannel();
  
  if (channel) {
    // Use the publish function to send a message to a queue or exchange
    const messageContent = Buffer.from('Hello, RabbitMQ!');
    publish(
      channel,
      'test_queue',
      'test_queue',
      messageContent,
      'queue', // or 'exchange'
      'direct', // or other exchange type
      {durable:true} // exchange options
    );
  } else {
    console.error('AMQP channel not available');
  }
}