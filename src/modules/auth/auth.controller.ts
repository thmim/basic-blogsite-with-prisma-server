import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const logInUser = catchAsync( async(req:Request,res:Response,next:NextFunction)=>{
    const payload = req.body;
    const result = await authServices.loginUserFromDb(payload);
    console.log(result)
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: result
    })

}) 

export const authController = {
    logInUser
};