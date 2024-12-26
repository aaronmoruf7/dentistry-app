import { PrismaClient } from '@prisma/client';
import HttpException from '../../models/http-exception.model';

const prisma = new PrismaClient()

export const getAllInventory = async (userId: number) => {
    return prisma.inventory.findMany({
        where : {
            userId: userId,
        }
    });
};

export const createInventoryItem = async (data: {
    name: string;
    category: string;
    quantity: number;
    price?: number;
    userId: number;
}) => {
    if (!data.name || !data.category || !data.quantity || !data.userId){
        throw new HttpException (401, 'Missing field');
    }
    return prisma.inventory.create({
        data,
    });
};

