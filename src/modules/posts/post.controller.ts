import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postServices } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

// create post controller
const createPost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const id = req.user?.id;
    const payload = req.body;
    const result = await postServices.createPostintoDb(payload,id as string)

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"post created successfully",
        data:result
    })

})

const getAllPost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await postServices.getAllPostFromDb();
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"post retrived successfully",
        data:result
    })

})

const getPostWithStats = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    

    const result = await postServices.getPostWithStatsFromDb();
    
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"post stats retrived successfully",
        data:result
    })

})

const getMyPost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const authorId = req.user?.id;
    
    const result = await postServices.getMyPostFromDb(authorId as string)
    console.log(result)
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"my post retrived successfully",
        data:result
    })

})
const getPostById = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const id = req.params.postId;
    if(!id){
        throw new Error("id is required")
    }
    const result = await postServices.getPostByIdFromDb(id as string);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"post retrived by id successfully",
        data:result
    })

})
const updatePost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const payload = req.body;
    const postId = req.params.postId;
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
     if (!postId) {
        throw new Error("Post Id Required In Params")
    }

    const result = await postServices.updatePostFromDb(payload,postId as string,authorId as string,isAdmin);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"post updated successfully",
        data:result
    })

})
const deletePost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const authorId = req.user?.id
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;
    if (!postId) {
        throw new Error("Post Id Required In Params")
    }

    await postServices.deletePostFromDb(postId as string, authorId as string, isAdmin)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post deleted successfully",
        data: null
    })

})


export const postController = {
    createPost,
    getAllPost,
    getPostWithStats,
    getMyPost,
    getPostById,
    updatePost,
    deletePost

}