import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.inteface";

const loginUserFromDb = async (payload:ILoginUser) =>{
    const {email,password} = payload;
    const user = await prisma.users.findUniqueOrThrow({
        where:{email}
    })

    const matchPassword = await bcrypt.compare(password,user.password)

    if(!matchPassword){
        throw new Error("Password is incorrect");
    }
    return user;

}

export const authServices = {
    loginUserFromDb
};