import { prisma } from "../../lib/prisma"
import { IcreatePost, IUpdatePostPayload } from "./post.interface"

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

const getMyPostFromDb = async(authorId:string) => {
    console.log(authorId)
    const findMyPost = await prisma.post.findMany({
        where:{
            authorId
        },
        
        orderBy:{
            createdAt:"desc"
        },
        include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:true,
            _count:{
                select:{
                    comments:true
                }
            },
            
        }
    })
    console.log(findMyPost)
    return findMyPost;
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

const updatePostFromDb = async(payload:IUpdatePostPayload,postId:string,authorId:string,isAdmin:boolean) => {

    const post = await prisma.post.findUniqueOrThrow({
        where:{
            id:postId
        }
    })
    if(!isAdmin && authorId !== post.authorId){
        throw new Error("you are not the owner of this post")
    }
    const result = await prisma.post.update({
        where : {
            id : postId
        },
        data : payload,
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })
return result;
}

const deletePostFromDb = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post!")
    }

    await prisma.post.delete({
        where : {
            id : postId
        }
    })
    

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