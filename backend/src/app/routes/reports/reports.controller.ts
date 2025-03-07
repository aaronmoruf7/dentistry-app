import { Router, Request, Response, NextFunction } from 'express';
import auth from '../auth/auth.middleware';
import { PrismaClient } from '@prisma/client';
import HttpException from '../../models/http-exception.model';

const prisma = new PrismaClient()
const router = Router();

router.get('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.id;
        if (!userId) {
            throw new HttpException(401, 'User ID is required to fetch reports');
        }
        

        const month = parseInt(req.query.month as string);
        const year = new Date().getFullYear();

        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        console.log(`Fetching data from ${startDate.toISOString()} to ${endDate.toISOString()}`);


          // Fetch active invoices
          const invoices = await prisma.invoice.findMany({
            where: {
                userId,
                createdAt: { gte: startDate, lte: endDate },
                deleted: false // Exclude deleted records
            }
        });

        // Fetch deleted invoices
        const deletedInvoices = await prisma.invoice.findMany({
            where: {
                userId,
                createdAt: { gte: startDate, lte: endDate },
                deleted: true // Only fetch deleted records
            }
        });

        // Fetch active purchases
        const purchases = await prisma.purchase.findMany({
            where: {
                userId,
                createdAt: { gte: startDate, lte: endDate },
                deleted: false
            }
        });

        // Fetch deleted purchases
        const deletedPurchases = await prisma.purchase.findMany({
            where: {
                userId,
                createdAt: { gte: startDate, lte: endDate },
                deleted: true
            }
        });


        // Format report data
        const formattedInvoices = invoices.map((invoice) => ({
            date: new Date(invoice.createdAt).toISOString().split('T')[0],
            patient: invoice.patientName,
            total: invoice.totalAmount
        }));

        const formattedDeletedInvoices = deletedInvoices.map((invoice) => ({
            date: new Date(invoice.createdAt).toISOString().split('T')[0],
            patient: invoice.patientName,
            total: invoice.totalAmount
        }));

        const formattedPurchases = purchases.map((purchase) => ({
            date: new Date(purchase.createdAt).toISOString().split('T')[0],
            description: purchase.description,
            amount: purchase.totalCost
        }));

        const formattedDeletedPurchases = deletedPurchases.map((purchase) => ({
            date: new Date(purchase.createdAt).toISOString().split('T')[0],
            description: purchase.description,
            amount: purchase.totalCost
        }));



        // Compute totals
        const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
        const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
        const netProfit = totalRevenue - totalPurchases;

        // response
        res.json({
            totalPurchases,
            totalRevenue,
            netProfit,
            invoices: formattedInvoices,
            deletedInvoices: formattedDeletedInvoices, 
            purchases: formattedPurchases,
            deletedPurchases: formattedDeletedPurchases
        });

    } catch (error) {
        console.error('Error generating report:', error);
        next(error);
    }
});

export default router;
