// import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'superSecret';

export const registerUser = async (name: string, email: string, password: string) => {
    //check if email already exists
    const existingUser = await prisma.user.findUnique({where : {email : email}});
    if (existingUser){
        throw new Error ('Email is already registered');
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create the user
    const user = await prisma.user.create ({
        data : {
            name: name,
            email: email,
            password: hashedPassword,
        },
    });

    //generate a token for the User
    const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {expiresIn: '3h'});

    return {user, token};
}