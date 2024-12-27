import { PrismaClient } from '@prisma/client';
import HttpException from '../../models/http-exception.model';

const prisma = new PrismaClient()

export const getAllPurchases = async (userId: number) => {
    return prisma.purchase.findMany({
        where : {
            userId: userId,
        }
    });
};

export const createPurchase = async (data: {
    description: string;
    totalCost: number;
    category: string;
    items?: Array<{inventoryId: number; quantity: number; price: number}>;
    userId: number;
}) => {
    if (!data.description || !data.totalCost || !data.category || !data.userId){
        throw new HttpException (401, 'Missing field');
    }
    return prisma.purchase.create({
        data: {
            description: data.description,
            totalCost: data.totalCost,
            category: data.category,
            userId: data.userId,
            items: {
                create: data.items?.map(item => ({
                    quantity: item.quantity,
                    price: item.price,
                    ...(item.inventoryId?  {inventory: { connect: { id: item.inventoryId } }} : {})
                }))
            }
        },
        include: { items: true }
    });
};
