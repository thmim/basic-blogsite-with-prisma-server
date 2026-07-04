import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { subscriptionServices } from "./subscription.service";
import httpStatus from "http-status";

const createSubscription = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const userId = req.user?.id;

        const result = await subscriptionServices.subscriptionCreateToDb(userId as string);

        sendResponse(res, {
            success : true,
            statusCode : httpStatus.OK,
            message : "Checkout completed successfully",
            data : result
        })
    

})

// webhook control

const handleWebhook = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const event  = req.body as Buffer;
    
    const signature = req.headers['stripe-signature'];

    await subscriptionServices.handleWebhookFromDb(event,signature as string);

    sendResponse(res, {
            success : true,
            statusCode : 200,
            message : "Webhook triggered successfully",
            data : null
        })
    

})

export const subscriptionController = {
    createSubscription,
    handleWebhook
}