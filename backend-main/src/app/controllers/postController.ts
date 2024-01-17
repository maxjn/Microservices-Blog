import {
  CreatePostControllerFunction,
  DeletePostControllerFunction,
  PostControllerFunction,
} from "types/controllers/type";
import prisma from "../../config/database";

// GET all posts
export const getAllPosts: PostControllerFunction = async (req, res) => {};

// POST new post
export const createPost: CreatePostControllerFunction = async (data) => {
  const postData = {
    id: data.id,
    title: data.title,
    image: data.image,
    like: data.like,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };

  try {
    const post = await prisma.post.create({
      data: postData,
    });

    console.log("SUCCESS [CREATE POST] >>>", post);
    return true;
  } catch (error) {
    console.log("ERROR [CREATE POST] >>>", error.message);
    return true;
  }
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
export const deletePost: DeletePostControllerFunction = async (data) => {
  const { id } = data;

  try {
    const numericId = parseInt(id, 10); // Convert to a number

    if (isNaN(numericId)) {
      console.log("ERROR [DELETE POST] >>>", "Invalid ID");
      return true;
    }
    console.log(id);

    const post = await prisma.post.delete({
      where: { id: numericId },
    });

    console.log("SUCCESS [DELETE POST] >>>", post);
    return true;
  } catch (error) {
    console.log("ERROR [DELETE POST] >>>", error.message);
    return true;
  }
};

//UPDATE a post
export const updatePost: CreatePostControllerFunction = async (data) => {
  const id = data.id;
  const postData = {
    title: data.title,
    image: data.image,
    like: data.like,
    updatedAt: data.updatedAt,
  };

  try {
    const updatedPost = await prisma.post.update({
      data: postData,
      where: { id },
    });
    console.log("SUCCESS [UPDATE POST] >>>", updatedPost);

    return true;
  } catch (error) {
    console.log("ERROR [UPDATE POST] >>>", error.message);

    return true;
  }
};

//Like a post
export const likePost: DeletePostControllerFunction = async (data) => {
  const id = data.id;

  const numericId = parseInt(id, 10); // Convert to a number

  if (isNaN(numericId)) {
    console.log("ERROR [LIKE POST] >>>", "Invalid ID");
    return true; // Exit the function
  }

  try {
    await prisma.post.update({
      where: { id: numericId },
      data: { like: { increment: 1 } },
    });

    console.log("SUCCESS [LIKE POST] >>>", id);
    return true;
  } catch (error) {
    console.log("ERROR [LIKE POST] >>>", error.message);
    return true;
  }
};
