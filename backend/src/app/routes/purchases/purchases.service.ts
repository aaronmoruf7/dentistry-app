import { PrismaClient } from '@prisma/client';
import HttpException from '../../models/http-exception.model';

const prisma = new PrismaClient()

export const createPurchase = async (data: {
    patientName: string;
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
            totalAmount: data.totalAmount,
            userId: data.userId,
            services: {
                create: data.services.map(service => ({
                    quantity: service.quantity,
                    service: { connect: {id: service.serviceId} }
                }))
            }
        },
        include: { services: true }
    });
};
