import { prisma } from "../../lib/prisma"
import { IcreatePost } from "./post.interface"

// create post service
const createPostintoDb = async (payload: IcreatePost,authorId:string) => {

    const createPost = await prisma.post.create({
        data: {
            ...payload,
            authorId
        }
    })
    return createPost;

}

const getAllPostFromDb = async() => {
    
    const posts = await prisma.post.findMany({
        include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:true
        }
    })
    return posts;

}

const getPostWithStatsFromDb = () => {

}

const getMyPostFromDb = () => {

}

const getPostByIdFromDb = async(postId:string) => {
    const post = await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        }
    })

    const updateViewCountPost = await prisma.post.update({
        where:{
            id:postId
        },
        data:{
            views:{
                increment:1
            }
            
        },
        include:{
            author:{
                omit:{password:true}
            },
            comments:true
        }
    })
    return updateViewCountPost;

}

const updatePostFromDb = () => {

}

const deletePostFromDb = () => {

}

export const postServices = {
    createPostintoDb,
    getAllPostFromDb,
    getMyPostFromDb,
    getPostWithStatsFromDb,
    getPostByIdFromDb,
    updatePostFromDb,
    deletePostFromDb
}