import { PrismaClient } from '@prisma/client';
import HttpException from '../../models/http-exception.model';

const prisma = new PrismaClient()

export const getAllServices = async (userId: number) => {
    return prisma.service.findMany({
        where : {
            userId: userId,
            deleted: false
        }
    });
};

export const createService = async (data: {
    name: string;
    description: string;
    price: number;
    items?: Array<{inventoryId: number; quantity: number }>;
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
            items: data.items.length?{
                create: data.items.map(item => ({
                    quantity: item.quantity,
                    inventory: { connect: {id: item.inventoryId} }
                }))
            }
            : undefined
        },
        include: { items: true }
    });
};

export const updateServiceItem = async ( updatedData: {
    id: number; 
    name: string;
    description: string;
    items?: Array<{inventoryId: number; quantity: number }>
    price: number;
    userId: number;
}) => {
    
    // if (!updatedData.id || !updatedData.name || !updatedData.description || !updatedData.price || !updatedData.userId){
    //     throw new HttpException (401, 'Missing field');
    // }

    if (!updatedData.id){
        throw new HttpException (401, 'Missing id')
    }

    return prisma.service.update({
        where : {
            id: updatedData.id,
        },
        data: {
            name: updatedData.name,
            description: updatedData.description,
            price: updatedData.price
            //items not considered in this MVP
        }
    });
};


export const deleteServiceItem = async (id: number) => {
    if (!id){
        throw new HttpException (401, 'Missing field');
    }
    return prisma.service.update({
        where : {
            id: id,           
        },
        data: {
            deleted: true
        }
    });
};
