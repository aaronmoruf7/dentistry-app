"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePurchase = exports.updatePurchase = exports.createPurchase = exports.getAllPurchases = void 0;
const client_1 = require("@prisma/client");
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const prisma = new client_1.PrismaClient();
const getAllPurchases = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.purchase.findMany({
        where: {
            userId: userId,
            deleted: false,
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            items: true,
        }
    });
});
exports.getAllPurchases = getAllPurchases;
const createPurchase = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!data.description || !data.totalCost || !data.category || !data.userId) {
        throw new http_exception_model_1.default(401, 'Missing field');
    }
    // update inventory item quantities to reflect the new purchase
    for (const item of data.items || []) {
        if (item.inventoryId) {
            yield prisma.inventory.update({
                where: { id: item.inventoryId },
                data: { quantity: { increment: item.quantity } }
            });
        }
        else {
            const newInventoryItem = yield prisma.inventory.create({
                data: {
                    name: item.name,
                    category: data.category,
                    quantity: item.quantity,
                    price: item.price,
                    user: { connect: { id: data.userId } }
                }
            });
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
                create: (_a = data.items) === null || _a === void 0 ? void 0 : _a.map(item => (Object.assign({ name: item.name, quantity: item.quantity, price: item.price }, (item.inventoryId ? { inventory: { connect: { id: item.inventoryId } } } : {}))))
            }
        },
        include: { items: true }
    });
});
exports.createPurchase = createPurchase;
const updatePurchase = (updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!updatedData.description || !updatedData.description || !updatedData.totalCost || !updatedData.category || !updatedData.userId) {
        throw new http_exception_model_1.default(401, 'Missing field');
    }
    for (const item of updatedData.items || []) {
        //update inventory to reflect purchase updates 
        const originalPurchaseItem = yield prisma.purchaseItem.findFirst({
            where: { inventoryId: item.inventoryId,
                purchaseId: updatedData.id,
            }
        });
        if (!originalPurchaseItem) {
            throw new http_exception_model_1.default(401, 'No Purchase Item found');
        }
        const quantityDifference = item.quantity - originalPurchaseItem.quantity;
        if (quantityDifference > 0) {
            yield prisma.inventory.update({
                where: { id: item.inventoryId },
                data: { quantity: { increment: quantityDifference } }
            });
        }
        else if (quantityDifference < 0) {
            yield prisma.inventory.update({
                where: { id: item.inventoryId },
                data: { quantity: { decrement: quantityDifference } }
            });
        }
        //update actual purchase Item record
        yield prisma.purchaseItem.update({
            where: { id: originalPurchaseItem.id },
            data: {
                name: item.name,
                quantity: item.quantity,
                price: item.price
            },
        });
    }
    return prisma.purchase.update({
        where: {
            id: updatedData.id,
        },
        data: {
            description: updatedData.description,
            totalCost: updatedData.totalCost,
            category: updatedData.category,
        }
    });
});
exports.updatePurchase = updatePurchase;
const deletePurchase = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new http_exception_model_1.default(401, 'Missing field');
    }
    // fetch the purchase with its associated purchase items
    const purchase = yield prisma.purchase.findUnique({
        where: { id: id },
        include: { items: true }
    });
    if (!purchase) {
        throw new http_exception_model_1.default(401, 'Purchase not found');
    }
    // update inventory to reflect the deletion of the purchase
    for (const item of purchase.items) {
        if (item.inventoryId && item.quantity) {
            yield prisma.inventory.update({
                where: { id: item.inventoryId },
                data: { quantity: { decrement: item.quantity } }
            });
        }
    }
    return prisma.purchase.update({
        where: {
            id: id,
        },
        data: {
            deleted: true
        }
    });
});
exports.deletePurchase = deletePurchase;
