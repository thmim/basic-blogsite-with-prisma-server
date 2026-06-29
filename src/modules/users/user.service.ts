import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";

interface RegisterUserPayload {
    name: string;
    email: string;
    password: string;
    profile_photo?: string;
}

const insertUserIntoDb = async(payload:RegisterUserPayload)=>{
    const { name, email, password, profile_photo } = payload;
    
        const isUserExist = await prisma.users.findUnique({
            where: { email }
        })
        if (isUserExist) {
            throw new Error("user already exist")
        }
        const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_round))
    
        // create user
        const createdUser = await prisma.users.create({
            data: {
                name,
                email,
                password: hashPassword,
            }
        })
    
        await prisma.profiles.create({
            data: {
                user_id: createdUser.id,
                profile_photo
            }
        })
        const user = await prisma.users.findUnique({
            where: {
                id: createdUser.id,
                email: createdUser.email || email
            },
            omit: {
                password: true
            },
            include: {
                profile: true
            }
        })
        return user;
}

export const userServices = {
    insertUserIntoDb
}