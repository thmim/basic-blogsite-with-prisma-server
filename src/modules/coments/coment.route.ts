import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./coment.controller";

const router = Router();

router.post( 
    "/",
    auth(Role.USER, Role.ADMIN, Role.MODERATOR),
    commentController.createComment
);

router.get(
    "/author/:authorId",
    commentController.getCommentByAuthorId
);

router.get(
    "/:commentId",
    commentController.getCommentByCommentId
);

router.patch(
    "/:commentId",
    auth(Role.USER, Role.ADMIN, Role.MODERATOR),
    commentController.updateComment
);

router.delete(
    "/:commentId",
    auth(Role.USER, Role.ADMIN, Role.MODERATOR),
    commentController.deleteComment
);

router.put(
    "/:commentId/moderate",
    auth(Role.ADMIN),
    commentController.moderateComment
);


export const comentRoute = router;