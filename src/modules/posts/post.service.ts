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

const getPostByIdFromDb = () => {

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