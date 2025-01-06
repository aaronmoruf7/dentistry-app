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

export const deleteInventoryItem = async (id: number) => {
    if (!id){
        throw new HttpException (401, 'Missing field');
    }
    return prisma.inventory.delete({
        where : {
            id: id,
        }
    });
};

export const updateInventoryItem = async ( updatedData: {
    id: number; 
    name: string;
    category: string;
    quantity: number;
    price?: number;
    userId: number;
}) => {
    // if (!updatedData.id) || !updatedData.name || !updatedData.category || !updatedData.quantity || !updatedData.userId){
    //     throw new HttpException (401, 'Missing field');
    // }

    if (!updatedData.id){
        throw new HttpException (401, 'Missing item id');
    }

    if (!updatedData.name) {
        throw new HttpException (401, 'Missing name');
    }

    if (!updatedData.category) {
        throw new HttpException (401, 'Missing category');
    }

    if (!updatedData.quantity) {
        throw new HttpException (401, 'Missing quantity');
    }
    
    if (!updatedData.userId) {
        throw new HttpException (401, 'Missing userId');
    }

    return prisma.inventory.update({
        where : {
            id: updatedData.id,
        },
        data: {
            name: updatedData.name,
            category: updatedData.category,
            quantity: updatedData.quantity,
            price: updatedData.price
        }
    });
};



