// import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {PrismaClient} from '@prisma/client';
import HttpException from '../../models/http-exception.model';

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'superSecret';

//register a user
export const registerUser = async (name: string, email: string, password: string) => {
    //validate input
    if (!name || !email || !password){
        throw new HttpException(400, "Name, email, and password required");
    }
    //check if email already exists
    const existingUser = await prisma.user.findUnique({where : {email : email}});
    if (existingUser){
        throw new HttpException(409,'Email is already registered');
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


//login a user
export const loginUser = async (email: string, password: string) => {
    //validate input
    if (!email || !password){
        throw new HttpException(400, "Email, and password required");

    }
    //look for user in database
    const user = await prisma.user.findUnique({where : {email : email}});

    if (!user){
        throw new HttpException (401, "Invalid email or password");
    }

    //see if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch){
        throw new HttpException (401, "Invalid email or password");
    }

    //generate a token for the User
    const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {expiresIn: '3h'});

    return {user, token};
}