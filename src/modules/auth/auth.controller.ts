import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const logInUser = catchAsync( async(req:Request,res:Response,next:NextFunction)=>{
    const payload = req.body;
    const {accessToken,refreshToken} = await authServices.loginUserFromDb(payload);

//    set access token
    res.cookie("accessToken",accessToken,{
    httpOnly:true,
    secure:false,
    sameSite:"none",
    maxAge:1000*60*60*24
   })
//   set refresh token
   res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure:false,
    sameSite:"none",
    maxAge:1000*60*60*24*7
   });
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: {accessToken,refreshToken}
    })

}) 

// create refresh token to access token
const refreshToken = catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
const refreshToken = req.cookies.refreshToken;
const result = await authServices.refreshToken(refreshToken);
// console.log(result)
res.cookie("accessToken",result,{
    httpOnly:true,
    secure:false,
    sameSite:"none",
    maxAge:1000*60*60*24
   })

sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"access token regenerate from refresh token",
    data:{
        result
    }
})
})

export const authController = {
    logInUser,
    refreshToken
};