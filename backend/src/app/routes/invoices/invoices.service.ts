import { PrismaClient } from '@prisma/client';
import HttpException from '../../models/http-exception.model';

const prisma = new PrismaClient()

export const getAllInvoices = async (userId: number) => {
    return prisma.invoice.findMany({
        where : { 
            userId: userId, 
            deleted: false
        },
        include : { 
            services: { include: {service: true}} 
        }
    });
};

export const createInvoice = async (data: {
    patientName: string;
    paymentType: string;
    totalAmount: number;
    services: Array<{serviceId: number; quantity: number }>;
    userId: number;
}) => {
    if (!data.patientName || !data.services || !data.userId || !data.totalAmount){
        throw new HttpException (401, 'Missing field');
    }
    return prisma.invoice.create({
        data: {
            patientName: data.patientName,
            paymentType: data.paymentType,
            totalAmount: data.totalAmount,
            userId: data.userId,
            services: {
                create: data.services.map(service => ({
                    quantity: service.quantity,
                    service: { connect: {id: service.serviceId} }
                }))
            }
        },
        include: { 
            services: { 
                include: { 
                    service: true
                },
            },
        },
    });
};

export const deleteInvoiceItem = async (id: number) => {
    if (!id){
        throw new HttpException (401, 'Missing field');
    }
    return prisma.invoice.update({
        where : {
            id: id,           
        },
        data: {
            deleted: true
        }
    });
};
