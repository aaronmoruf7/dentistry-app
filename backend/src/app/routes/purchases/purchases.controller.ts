import {Router, Request, Response, NextFunction} from 'express';
import { createPurchase, getAllPurchases, updatePurchase, deletePurchase} from './purchases.service';
import auth from '../auth/auth.middleware'
import HttpException from '../../models/http-exception.model';

const router = Router();

//fetch all Purchases for a specific user id
router.get('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to fetch inventory');
        }
        const inventory = await getAllPurchases (userId);
        res.json(inventory);
    } catch (error){
        next(error);
    }
});

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

//update a purchase
router.put('/:id', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log("Request Body:", req.body);
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to update purchase item');
        }
        const id = parseInt(req.params.id);
        const {description, category, totalCost, items} = req.body;
       
        const updatedPurchase = await updatePurchase ({id, description, category, totalCost, items, userId});
        res.status(200).json(updatedPurchase);
    } catch (error){
        next(error);
    }
});

// delete a purchase
router.delete('/:id', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to delete purchase item');
        }
        const id = parseInt(req.params.id)
        const deletedPurchase = await deletePurchase(id);
        res.status(200).json(deletedPurchase);
    } catch (error){
        next(error);
    }
});

export default router;

