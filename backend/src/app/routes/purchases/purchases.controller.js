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
const purchases_service_1 = require("./purchases.service");
const auth_middleware_1 = __importDefault(require("../auth/auth.middleware"));
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const router = (0, express_1.Router)();
//fetch all Purchases for a specific user id
router.get('/', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to fetch inventory');
        }
        const inventory = yield (0, purchases_service_1.getAllPurchases)(userId);
        res.json(inventory);
    }
    catch (error) {
        next(error);
    }
}));
//create a Purchase
router.post('/', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to fetch inventory');
        }
        const { description, totalCost, category, items } = req.body;
        const purchase = yield (0, purchases_service_1.createPurchase)({ description, totalCost, category, items, userId });
        res.json(purchase);
    }
    catch (error) {
        next(error);
    }
}));
//update a purchase
router.put('/:id', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // console.log("Request Body:", req.body);
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to update purchase item');
        }
        const id = parseInt(req.params.id);
        const { description, category, totalCost, items } = req.body;
        const updatedPurchase = yield (0, purchases_service_1.updatePurchase)({ id, description, category, totalCost, items, userId });
        res.status(200).json(updatedPurchase);
    }
    catch (error) {
        next(error);
    }
}));
// delete a purchase
router.delete('/:id', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to delete purchase item');
        }
        const id = parseInt(req.params.id);
        const deletedPurchase = yield (0, purchases_service_1.deletePurchase)(id);
        res.status(200).json(deletedPurchase);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
