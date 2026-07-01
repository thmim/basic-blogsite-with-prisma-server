import { Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";

const router = Router();

router.post("/register",userController.registerUser );
declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            }
        }
    }
}

router.get("/me",(req,res,next)=>{
console.log(req.cookies);
const {accessToken} = req.cookies;
const veriFiedToken = jwtUtils.verifyToken(accessToken,config.jwt_acces_secret)
if(typeof veriFiedToken === "string"){
    throw new Error(veriFiedToken)
}

const {name,email,id,role} = veriFiedToken;
const requiredRoles = [Role.ADMIN,Role.MODERATOR,Role.USER]

if(!requiredRoles.includes(role)){
return res.status(403).json({
 success: false,
statusCode: httpStatus.FORBIDDEN,
message: "Forbidden. You don't have permission to access this resource."
})
}
req.user={
    name,
    email,
    id,
    role
}
next();
},userController.getMyProfile );

export const userRouter = router;