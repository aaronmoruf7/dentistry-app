import {Router, Request, Response, NextFunction} from 'express';
import { createService, getAllServices, updateServiceItem, deleteServiceItem } from './services.service';
import auth from '../auth/auth.middleware'
import HttpException from '../../models/http-exception.model';

const router = Router();

//fetch all Services for a specific user id
router.get('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to fetch service data');
        }
        const services = await getAllServices (userId);
        res.json(services);
    } catch (error){
        next(error);
    }
});

//create a Service
router.post('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to fetch service data');
        }
        const {name, description, price, items} = req.body
        const service = await createService ({name, description, price, items, userId});
        res.json(service);
    } catch (error){
        next(error);
    }
});

//update service item
router.put('/:id', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to service inventory item');
        }
        const id = parseInt(req.params.id);
        const {name, description, price, items} = req.body;
       
        const updatedService = await updateServiceItem ({id, name, description, items, price, userId});
        res.status(200).json(updatedService);
    } catch (error){
        next(error);
    }
});

//delete inventory item
router.delete('/:id', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException (401, 'User ID is required to delete service item');
        }
        const id = parseInt(req.params.id)
        const deletedService = await deleteServiceItem (id);
        res.status(200).json(deletedService);
    } catch (error){
        next(error);
    }
});



export default router;

