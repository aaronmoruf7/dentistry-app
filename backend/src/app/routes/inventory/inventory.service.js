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
exports.updateInventoryItem = exports.deleteInventoryItem = exports.createInventoryItem = exports.getAllInventory = void 0;
const client_1 = require("@prisma/client");
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const prisma = new client_1.PrismaClient();
const getAllInventory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.inventory.findMany({
        where: {
            userId: userId,
            deleted: false
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
});
exports.getAllInventory = getAllInventory;
const createInventoryItem = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.name || !data.category || !data.quantity || !data.userId) {
        throw new http_exception_model_1.default(401, 'Missing field');
    }
    return prisma.inventory.create({
        data,
    });
});
exports.createInventoryItem = createInventoryItem;
const deleteInventoryItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new http_exception_model_1.default(401, 'Missing field');
    }
    return prisma.inventory.update({
        where: {
            id: id,
        },
        data: {
            deleted: true
        }
    });
});
exports.deleteInventoryItem = deleteInventoryItem;
const updateInventoryItem = (updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!updatedData.id || !updatedData.name || !updatedData.category || !updatedData.quantity || !updatedData.userId) {
        throw new http_exception_model_1.default(401, 'Missing field');
    }
    return prisma.inventory.update({
        where: {
            id: updatedData.id,
        },
        data: {
            name: updatedData.name,
            category: updatedData.category,
            quantity: updatedData.quantity,
            price: updatedData.price
        }
    });
});
exports.updateInventoryItem = updateInventoryItem;
