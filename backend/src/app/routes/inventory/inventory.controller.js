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
const inventory_service_1 = require("./inventory.service");
const auth_middleware_1 = __importDefault(require("../auth/auth.middleware"));
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const router = (0, express_1.Router)();
//fetch all inventory items for a specific user
router.get('/', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to fetch inventory');
        }
        const inventory = yield (0, inventory_service_1.getAllInventory)(userId);
        res.json(inventory);
    }
    catch (error) {
        next(error);
    }
}));
//create inventory item
router.post('/', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to add inventory item');
        }
        const { name, category, quantity, price } = req.body;
        const inventory_item = yield (0, inventory_service_1.createInventoryItem)({ name, category, quantity, price, userId });
        res.json(inventory_item);
    }
    catch (error) {
        next(error);
    }
}));
//delete inventory item
router.delete('/:id', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to delete inventory item');
        }
        const id = parseInt(req.params.id);
        const deletedItem = yield (0, inventory_service_1.deleteInventoryItem)(id);
        res.status(200).json(deletedItem);
    }
    catch (error) {
        next(error);
    }
}));
//update inventory item
router.put('/:id', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // console.log("Request Body:", req.body);
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to update inventory item');
        }
        const id = parseInt(req.params.id);
        const { name, category, quantity, price } = req.body;
        const updatedItem = yield (0, inventory_service_1.updateInventoryItem)({ id, name, category, quantity, price, userId });
        res.status(200).json(updatedItem);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
