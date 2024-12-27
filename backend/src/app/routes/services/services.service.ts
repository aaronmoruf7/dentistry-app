import { PrismaClient } from '@prisma/client';
import HttpException from '../../models/http-exception.model';

const prisma = new PrismaClient()

export const createService = async (data: {
    name: string;
    description?: string;
    price?: number;
    items: Array<{inventoryId: number; quantity: number }>;
    userId: number;
}) => {
    if (!data.name || !data.items || !data.userId){
        throw new HttpException (401, 'Missing field');
    }
    return prisma.service.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            userId: data.userId,
            items: {
                create: data.items.map(item => ({
                    quantity: item.quantity,
                    inventory: { connect: {id: item.inventoryId} }
                }))
            }
        },
        include: { items: true }
    });
};
