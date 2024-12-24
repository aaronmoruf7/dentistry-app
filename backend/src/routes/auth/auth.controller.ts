import {Router, Request, Response, NextFunction} from 'express';
import { registerUser } from './auth.service';

const router = Router();

//register a new user
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, email, password} = req.body;

        //validate input
        if (!name || !email || !password){
            res.status(400).json({error: "Name, email, and password reequired" });
        }

        const result = await registerUser(name, email, password);
        res.status(201).json(result);
    }catch (error){
        next(error); //pass error to middleware handler
    }
});

export default router;
