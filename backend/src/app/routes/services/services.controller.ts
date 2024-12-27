import {Router, Request, Response, NextFunction} from 'express';
import { createService, getAllServices } from './services.service';
import auth from '../auth/auth.middleware'
import HttpException from '../../models/http-exception.model';

const router = Router();

//fetch all Services for a specific user id
router.get('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to fetch inventory');
        }
        const inventory = await getAllServices (userId);
        res.json(inventory);
    } catch (error){
        next(error);
    }
});

//create a Service
router.post('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to fetch inventory');
        }
        const {name, description, price, items} = req.body
        const service = await createService ({name, description, price, items, userId});
        res.json(service);
    } catch (error){
        next(error);
    }
});

export default router;

