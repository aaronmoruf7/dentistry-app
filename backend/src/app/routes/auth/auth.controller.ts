import {Router, Request, Response, NextFunction} from 'express';
import { loginUser, registerUser } from './auth.service';

const router = Router();

//register a new user
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, email, password} = req.body;
        const result = await registerUser(name, email, password);
        res.status(201).json(result);
    }catch (error){
        next(error); //pass error to middleware handler
    }
});

//login a user
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body;
        const result = await loginUser(email, password);
        res.status(201).json(result);
    }catch (error){
        next(error);
    }
});

export default router;
