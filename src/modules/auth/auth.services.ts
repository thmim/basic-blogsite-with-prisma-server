import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.inteface";
import jwt, { SignOptions } from "jsonwebtoken";
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

export const authServices = {
    loginUserFromDb
};