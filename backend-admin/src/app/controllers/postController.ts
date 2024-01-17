import { PostControllerFunction } from "types/controllers/type";

// AMQP
import { getAmqpChannel } from "../../config/amqp/amqpConnection";
import { publish } from "../../config/amqp/publisher";

import Post from "../../app/models/postModel";
import { messageToQueue, publishMessage } from "../../utils/amqp/publishers";
// GET all posts
export const getAllPosts: PostControllerFunction = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "ASC"]],
    });

    await publishMessage()

    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST new post
export const createPost: PostControllerFunction = async (req, res) => {
  const { title, image } = req.body;

  //   if fields were empty
  let emptyFields = [];

  !title ? emptyFields.push("title") : null;
  !image ? emptyFields.push("image") : null;

  if (emptyFields.length > 0) {
    res
      .status(400)
      .json({ error: "Please fill in the empty fields!", emptyFields });
    return;
  }

  try {
    const post = await Post.create({ title, image });
    messageToQueue('create_post',post)
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET a post
export const getSinglePost: PostControllerFunction = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);

    // If didn't exists
    if (!post) {
      res.status(404).json({ error: "No such post" });
      return;
    }

    res.status(200).json(post);
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
    const deletedCount = await Post.destroy({ where: { id } });
    if (deletedCount === 0) {
      res.status(404).json({ error: "No such Post" });
      return; // Exit the function
    }

    messageToQueue('delete_post',{id})

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
    const [rowCount] = await Post.update({ title, image }, { where: { id } });

    if (rowCount === 0) {
      res.status(404).json({ error: "No such post" });
      return;
    }

    // Find the updated post
    const updatedPost = await Post.findByPk(id);

    if (!updatedPost) {
      res.status(404).json({ error: "No such post" });
      return;
    }
    messageToQueue('update_post',updatedPost)

    res.status(200).json(updatedPost);
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
    const post = await Post.findOne({
      where: { id: numericId },
    });

    if (!post) {
      res.status(404).json({ error: "No such post" });
      return;
    }

    post.like++;

    await post.save();

    messageToQueue('like_post',{id})

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
