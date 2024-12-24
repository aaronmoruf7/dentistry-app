import { PrismaClient } from '@prisma/client';

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
    return prisma.inventory.create({
        data,
    });
};

