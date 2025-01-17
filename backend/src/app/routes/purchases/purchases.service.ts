import { PrismaClient } from '@prisma/client';
import HttpException from '../../models/http-exception.model';

const prisma = new PrismaClient()

export const getAllPurchases = async (userId: number) => {
    return prisma.purchase.findMany({
        where : {
            userId: userId,
            deleted: false,
        },
        orderBy: {
            createdAt: 'desc'
        },
        include:{
            items: true,
        }
    });
};

export const createPurchase = async (data: {
    description: string;
    totalCost: number;
    category: string;
    items?: Array<{inventoryId: number; name: string; quantity: number; price: number}>;
    userId: number;
}) => {
    if (!data.description || !data.totalCost || !data.category || !data.userId){
        throw new HttpException (401, 'Missing field');
    }

    // update inventory item quantities to reflect the new purchase
    for (const item of data.items || []) {
        if (item.inventoryId){
            await prisma.inventory.update({
                where: {id: item.inventoryId},
                data: { quantity: {increment: item.quantity}}
            })
        } else{
            const newInventoryItem = await prisma.inventory.create({
                data: {
                    name: item.name,
                    category: data.category,
                    quantity: item.quantity,
                    price: item.price,
                    user: {connect: { id: data.userId}}
                }
            })
            
            item.inventoryId = newInventoryItem.id;
        }      
    }


    return prisma.purchase.create({
        data: {
            description: data.description,
            totalCost: data.totalCost,
            category: data.category,
            userId: data.userId,
            items: {
                create: data.items?.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    ...(item.inventoryId?  {inventory: { connect: { id: item.inventoryId } }} : {})
                }))
            }
        },
        include: { items: true }
    });
};

export const updatePurchase = async ( updatedData: {
    id: number,
    description: string;
    totalCost: number;
    category: string;
    items?: Array<{inventoryId: number; name: string; quantity: number; price: number}>;
    userId: number;
}) => {
    
    if (!updatedData.description || !updatedData.description || !updatedData.totalCost || !updatedData.category || !updatedData.userId){
        throw new HttpException (401, 'Missing field');
    }


    for (const item of updatedData.items || []){
        
        //update inventory to reflect purchase updates 
        const originalPurchaseItem = await prisma.purchaseItem.findFirst({
            where: {inventoryId: item.inventoryId,
                    purchaseId: updatedData.id,
                }});

        if (!originalPurchaseItem){
            throw new HttpException (401, 'No Purchase Item found');
        }

        const quantityDifference = item.quantity - originalPurchaseItem.quantity;

        if(quantityDifference > 0){
            await prisma.inventory.update({
                where: {id: item.inventoryId},
                data: { quantity: {increment: quantityDifference}}
            });
        } else if (quantityDifference < 0){
            await prisma.inventory.update({
                where: {id: item.inventoryId},
                data: { quantity: {decrement: quantityDifference}}
            });
        }
       
        //update actual purchase Item record
        await prisma.purchaseItem.update({
            where: {id: originalPurchaseItem.id},
            data: {
                name: item.name,
                quantity: item.quantity,
                price: item.price
            },
        })
    }

    return prisma.purchase.update({
        where : {
            id: updatedData.id,
        },
        data: {
            description: updatedData.description,
            totalCost: updatedData.totalCost,
            category: updatedData.category,
        }
    });
};

export const deletePurchase = async (id: number) => {
    if (!id){
        throw new HttpException (401, 'Missing field');
    }

    // fetch the purchase with its associated purchase items
    const purchase = await prisma.purchase.findUnique({
        where: {id: id},
        include: {items: true}
    });

    if (!purchase){
        throw new HttpException (401, 'Purchase not found');
    }

    // update inventory to reflect the deletion of the purchase
    for (const item of purchase.items) {
        if (item.inventoryId && item.quantity){
            await prisma.inventory.update({
                where: {id: item.inventoryId},
                data: { quantity: {decrement: item.quantity}}
            })
        }
    }


    return prisma.purchase.update({
        where : {
            id: id,
        },
        data: {
            deleted: true
        }
    });
};
