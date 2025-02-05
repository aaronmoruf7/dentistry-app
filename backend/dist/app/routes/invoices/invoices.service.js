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
exports.deleteInvoiceItem = exports.createInvoice = exports.getAllInvoices = void 0;
const client_1 = require("@prisma/client");
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const prisma = new client_1.PrismaClient();
const getAllInvoices = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.invoice.findMany({
        where: {
            userId: userId,
            deleted: false
        },
        include: {
            services: { include: { service: true } }
        }
    });
});
exports.getAllInvoices = getAllInvoices;
const createInvoice = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.patientName || !data.services || !data.userId || !data.totalAmount) {
        throw new http_exception_model_1.default(401, 'Missing field');
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
                    service: { connect: { id: service.serviceId } }
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
});
exports.createInvoice = createInvoice;
const deleteInvoiceItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new http_exception_model_1.default(401, 'Missing field');
    }
    return prisma.invoice.update({
        where: {
            id: id,
        },
        data: {
            deleted: true
        }
    });
});
exports.deleteInvoiceItem = deleteInvoiceItem;
