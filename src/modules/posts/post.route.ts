import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.ADMIN,Role.USER,Role.MODERATOR) ,postController.createPost);

router.get("/",postController.getAllPost);

router.get("/stats", auth(Role.ADMIN,Role.USER) ,postController.getPostWithStats);

router.get("/my-posts", auth(Role.ADMIN,Role.USER) ,postController.getMyPost);

router.get("/:postId",postController.getPostById);

router.patch("/:postId", auth(Role.ADMIN,Role.USER) ,postController.updatePost);

router.delete("/:postId", auth(Role.ADMIN,Role.USER) ,postController.deletePost);


export const postRoute = router;