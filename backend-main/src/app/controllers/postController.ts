import { PostControllerFunction } from "types/controllers/type";
import prisma from "config/database";

// AMQP
import { getAmqpChannel } from "../../config/amqp/amqpConnection";
import { publish } from "../../config/amqp/publisher";
import { publishMessage } from "../../utils/amqp/publishers";

// GET all posts
export const getAllPosts: PostControllerFunction = async (req, res) => {


};

// POST new post
export const createPost: PostControllerFunction = async (req, res) => {
  const { title, image } = req.body;


};

// GET a post
export const getSinglePost: PostControllerFunction = async (req, res) => {
  const { id } = req.params;

  try {
  
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a post
export const deletePost: PostControllerFunction = async (req, res) => {
  const { id } = req.params;

  const numericId = parseInt(id, 10); // Convert to a number

  if (isNaN(numericId)) {
    res.status(404).json({ error: "Invalid post ID" });
    return; // Exit the function
  }

  try {

   

    res.status(200).json({ id: numericId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//UPDATE a post
export const updatePost: PostControllerFunction = async (req, res) => {
  const { id } = req.params;
  const { title, image } = req.body;

  const numericId = parseInt(id, 10); // Convert to a number

  if (isNaN(numericId)) {
    res.status(404).json({ error: "Invalid post ID" });
    return; // Exit the function
  }

  try {
   

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Like a post
export const likePost: PostControllerFunction = async (req, res) => {
  const { id } = req.params;

  const numericId = parseInt(id, 10); // Convert to a number

  if (isNaN(numericId)) {
    res.status(404).json({ error: "Invalid post ID" });
    return; // Exit the function
  }

  try {
   

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
