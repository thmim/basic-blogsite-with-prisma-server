import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/register", userController.registerUser);

// get user own profile
router.get("/me", auth(Role.ADMIN, Role.MODERATOR, Role.USER),
    userController.getMyProfile);

    // how auth fuction work
// router.get("/me",
//         (req,res,next)=>{
//     console.log(req.cookies);
//     const {accessToken} = req.cookies;
//     const veriFiedToken = jwtUtils.verifyToken(accessToken,config.jwt_acces_secret)
//     if(typeof veriFiedToken === "string"){
//         throw new Error(veriFiedToken)
//     }

//     const {name,email,id,role} = veriFiedToken;
//     const requiredRoles = [Role.ADMIN,Role.MODERATOR,Role.USER]

//     if(!requiredRoles.includes(role)){
//     return res.status(403).json({
//      success: false,
//     statusCode: httpStatus.FORBIDDEN,
//     message: "Forbidden. You don't have permission to access this resource."
//     })
//     }
//     req.user={
//         name,
//         email,
//         id,
//         role
//     }
//     next();

//     },
//     auth(Role.ADMIN, Role.MODERATOR, Role.USER),
//     userController.getMyProfile);

export const userRouter = router;