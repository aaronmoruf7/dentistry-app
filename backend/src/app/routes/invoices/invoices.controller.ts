import {Router, Request, Response, NextFunction} from 'express';
import { createInvoice, getAllInvoices } from './invoices.service';
import auth from '../auth/auth.middleware'
import HttpException from '../../models/http-exception.model';

const router = Router();

//fetch all Invoices for a specific user id
router.get('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to fetch inventory');
        }
        const inventory = await getAllInvoices (userId);
        res.json(inventory);
    } catch (error){
        next(error);
    }
});

//create an Invoice
router.post('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to fetch inventory');
        }
        const {patientName, totalAmount, services} = req.body
        const invoice = await createInvoice ({patientName, totalAmount, services, userId});
        res.json(invoice);
    } catch (error){
        next(error);
    }
});

export default router;

