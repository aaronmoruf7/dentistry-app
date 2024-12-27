import {Router, Request, Response, NextFunction} from 'express';
import { createPurchase } from './purchases.service';
import auth from '../auth/auth.middleware'
import HttpException from '../../models/http-exception.model';

const router = Router();

//create a Purchase
router.post('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to fetch inventory');
        }
        const {description, totalCost, category, items} = req.body
        const purchase = await createPurchase ({description, totalCost, category, items, userId});
        res.json(purchase);
    } catch (error){
        next(error);
    }
});

export default router;

