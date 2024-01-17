// Import necessary modules and types
import amqp, { ConsumeMessage } from "amqplib/callback_api";
import { startWorker } from "../../config/amqp/worker";
import { ProcessCallbackType } from "types/controllers/type";
import { createPost, deletePost, likePost, updatePost } from "../../app/controllers/postController";
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


// Post Worker
export async function startPostWorker(channel: amqp.Channel | null,queueName:'create_post'|'update_post'|'delete_post' | 'like_post') {


  // CallBacks
  //  - Create Post
  async function createPostCB(msg: ConsumeMessage): Promise<boolean> {
    // Custom processing logic here
    console.log("Creating a Post...");

    // Returning true acknowledges the message, false rejects it
    return createPost(JSON.parse(msg.content.toString()));
  }

   //  - Delete Post
  async function deletePostCB(msg: ConsumeMessage): Promise<boolean> {
    // Custom processing logic here
    console.log("Deleting a Post...");

    // Returning true acknowledges the message, false rejects it
    return deletePost(JSON.parse(msg.content.toString()));
  }

   //  - Update Post
  async function updatePostCB(msg: ConsumeMessage): Promise<boolean> {
    // Custom processing logic here
    console.log("Updating a Post...");
    // Returning true acknowledges the message, false rejects it
    return updatePost(JSON.parse(msg.content.toString()));
  }

   //  - Like Post
  async function likePostCB(msg: ConsumeMessage): Promise<boolean> {
    // Custom processing logic here
    console.log("Liking a Post...");
    // Returning true acknowledges the message, false rejects it
    return likePost(JSON.parse(msg.content.toString()));
  }

  // CallbackMap
  const callbackMap ={
    'create_post':createPostCB as ProcessCallbackType,
    'delete_post':deletePostCB as ProcessCallbackType,
    'update_post':updatePostCB as ProcessCallbackType,
    'like_post':likePostCB as ProcessCallbackType,
  }

  if (channel) {
    // Use the startWorker function to start processing messages from a queue or exchange
    startWorker({
      channel,
      destination: queueName,
      destinationType: "queue", // or 'exchange'
      exchangeType: "direct", // or other exchange type
      exchangeOptions: {}, // exchange options
      processCallback: callbackMap[queueName] ,
    });
  } else {
    console.error("AMQP channel not available");
  }
}

