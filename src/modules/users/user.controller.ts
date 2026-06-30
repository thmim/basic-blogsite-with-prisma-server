
import httpStatus from "http-status"
import  {NextFunction, Request, RequestHandler, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



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

export const userController = {
    registerUser
}