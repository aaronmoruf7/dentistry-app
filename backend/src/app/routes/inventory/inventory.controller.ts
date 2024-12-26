import {Router, Request, Response, NextFunction} from 'express';
import { getAllInventory, createInventoryItem } from './inventory.service';
import auth from '../auth/auth.middleware'
import HttpException from '../../models/http-exception.model';

const router = Router();

//fetch all inventory items for a specific user
router.get('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to fetch inventory');
        }
        const inventory = await getAllInventory (userId);
        res.json(inventory);
    } catch (error){
        next(error);
    }
});

//create inventory item
router.post('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to fetch inventory');
        }
        const {name, category, quantity, price} = req.body
        const inventory_item = await createInventoryItem ({name, category, quantity, price, userId});
        res.json(inventory_item);
    } catch (error){
        next(error);
    }
});

export default router;
