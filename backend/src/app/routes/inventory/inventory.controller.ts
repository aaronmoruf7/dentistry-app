import {Router, Request, Response, NextFunction} from 'express';
import { getAllInventory, createInventoryItem, deleteInventoryItem, updateInventoryItem } from './inventory.service';
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
            throw new HttpException (401, 'User ID is required to add inventory item');
        }
        const {name, category, quantity, price} = req.body
        const inventory_item = await createInventoryItem ({name, category, quantity, price, userId});
        res.json(inventory_item);
    } catch (error){
        next(error);
    }
});

//delete inventory item
router.delete('/:id', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to delete inventory item');
        }
        const id = parseInt(req.params.id)
        await deleteInventoryItem (id);
    } catch (error){
        next(error);
    }
});

//update inventory item
router.put('/:id', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log("Request Body:", req.body);
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to delete inventory item');
        }
        const id = parseInt(req.params.id);
        const {name, category, quantity, price} = req.body;
       
        const updatedItem = await updateInventoryItem ({id, name, category, quantity, price, userId});
        res.status(200).json(updatedItem);
    } catch (error){
        next(error);
    }
});

export default router;
