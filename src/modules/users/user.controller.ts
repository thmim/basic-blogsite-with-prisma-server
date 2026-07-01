
import httpStatus from "http-status"
import  {NextFunction, Request, RequestHandler, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt  from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { prisma } from "../../lib/prisma";


const registerUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    // console.log("koi")
    const payload = req.body;

        const user = await userServices.insertUserIntoDb(payload);

        sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: { user }
    })

})

const getMyProfile = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    
//  const {accessToken} = req.cookies;
//  const veriFiedToken = jwtUtils.verifyToken(accessToken,config.jwt_acces_secret)
// if(typeof veriFiedToken === "string"){
//     throw new Error(veriFiedToken)
// }
 const profile = await userServices.getMyProfileFromDb(req.user?.id as string)
 sendResponse(res,{
success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: { profile }
 })
})

// update my profile
const updateMyProfile = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const payload = req.body;

    const updatedProfile = await userServices.updateMyProfileInDB(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile updated successfully",
        data: { updatedProfile }
    })
})

export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile
}