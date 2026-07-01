import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.inteface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
const loginUserFromDb = async (payload:ILoginUser) =>{
    const {email,password} = payload;
    const user = await prisma.users.findUniqueOrThrow({
        where:{email}
    })

    const matchPassword = await bcrypt.compare(password,user.password)

    if(!matchPassword){
        throw new Error("Password is incorrect");
    }

    // create token
    const jwtPayload = {
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role
    }
    // const accessToken = jwt.sign({jwtPayload},config.jwt_acces_secret,{expiresIn:config.jwt_access_expires} as SignOptions)

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_acces_secret,
        config.jwt_access_expires as SignOptions
    );

    // const refreshToken = jwt.sign({jwtPayload},config.jwt_refresh_secret,{expiresIn:config.jwt_refresh_expires} as SignOptions)

   const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires as SignOptions
    );
        
    


    return {accessToken,refreshToken};

}

// when access will expire use this refresh token to regenerate access token
const refreshToken = async(refreshToken:string)=>{
const verifyRefreshTken = jwtUtils.verifyToken(refreshToken,config.jwt_refresh_secret)

if(!verifyRefreshTken.success){
    throw new Error(verifyRefreshTken.error)
}

const {id} = verifyRefreshTken.data as JwtPayload;
    const user = await prisma.users.findUniqueOrThrow({
        where:{
            id
        }
    })

    if(user.active_status === "BLOCKED"){
        throw new Error("User is blocked!")
    }

    const jwtPayload = {
        id,
        email:user.email,
        name:user.name,
        role:user.role
    }

    const accessToken = jwtUtils.createToken(jwtPayload,config.jwt_acces_secret,config.jwt_access_expires as SignOptions)

    return accessToken;

}

export const authServices = {
    loginUserFromDb,
    refreshToken
};