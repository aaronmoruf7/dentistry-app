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
const express_1 = require("express");
const invoices_service_1 = require("./invoices.service");
const auth_middleware_1 = __importDefault(require("../auth/auth.middleware"));
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const router = (0, express_1.Router)();
//fetch all Invoices for a specific user id
router.get('/', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to fetch inventory');
        }
        const inventory = yield (0, invoices_service_1.getAllInvoices)(userId);
        res.json(inventory);
    }
    catch (error) {
        next(error);
    }
}));
//create an Invoice
router.post('/', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to fetch inventory');
        }
        const { patientName, paymentType, totalAmount, services } = req.body;
        const invoice = yield (0, invoices_service_1.createInvoice)({ patientName, paymentType, totalAmount, services, userId });
        res.json(invoice);
    }
    catch (error) {
        next(error);
    }
}));
//delete invoice
router.delete('/:id', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to delete invoice item');
        }
        const id = parseInt(req.params.id);
        const deletedInvoice = yield (0, invoices_service_1.deleteInvoiceItem)(id);
        res.status(200).json(deletedInvoice);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
