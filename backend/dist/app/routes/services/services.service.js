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
exports.deleteServiceItem = exports.updateServiceItem = exports.createService = exports.getAllServices = void 0;
const client_1 = require("@prisma/client");
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const prisma = new client_1.PrismaClient();
const getAllServices = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.service.findMany({
        where: {
            userId: userId,
            deleted: false
        }
    });
});
exports.getAllServices = getAllServices;
const createService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.name || !data.items || !data.userId) {
        throw new http_exception_model_1.default(401, 'Missing field');
    }
    return prisma.service.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            userId: data.userId,
            items: data.items.length ? {
                create: data.items.map(item => ({
                    quantity: item.quantity,
                    inventory: { connect: { id: item.inventoryId } }
                }))
            }
                : undefined
        },
        include: { items: true }
    });
});
exports.createService = createService;
const updateServiceItem = (updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!updatedData.id || !updatedData.name || !updatedData.description || !updatedData.price || !updatedData.userId){
    //     throw new HttpException (401, 'Missing field');
    // }
    if (!updatedData.id) {
        throw new http_exception_model_1.default(401, 'Missing id');
    }
    return prisma.service.update({
        where: {
            id: updatedData.id,
        },
        data: {
            name: updatedData.name,
            description: updatedData.description,
            price: updatedData.price
            //items not considered in this MVP
        }
    });
});
exports.updateServiceItem = updateServiceItem;
const deleteServiceItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new http_exception_model_1.default(401, 'Missing field');
    }
    return prisma.service.update({
        where: {
            id: id,
        },
        data: {
            deleted: true
        }
    });
});
exports.deleteServiceItem = deleteServiceItem;
