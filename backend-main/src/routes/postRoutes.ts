import { Router } from "express";

const router = Router();

// Controllers
import {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  updatePost,
  likePost
} from "../app/controllers/postController";



// GET all Posts
router.get("/", getAllPosts);

// POST new Post
router.post("/", createPost);

//GET single Post
router.get("/:id", getSinglePost);

//DELETE single Post
router.delete("/:id", deletePost);

//UPDATE single Post
router.patch("/:id", updatePost);

//LIKE single Post
router.patch("/:id/like", likePost);

export default router;
