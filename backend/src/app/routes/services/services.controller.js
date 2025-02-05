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
const services_service_1 = require("./services.service");
const auth_middleware_1 = __importDefault(require("../auth/auth.middleware"));
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const router = (0, express_1.Router)();
//fetch all Services for a specific user id
router.get('/', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to fetch service data');
        }
        const services = yield (0, services_service_1.getAllServices)(userId);
        res.json(services);
    }
    catch (error) {
        next(error);
    }
}));
//create a Service
router.post('/', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to fetch service data');
        }
        const { name, description, price, items } = req.body;
        const service = yield (0, services_service_1.createService)({ name, description, price, items, userId });
        res.json(service);
    }
    catch (error) {
        next(error);
    }
}));
//update service item
router.put('/:id', auth_middleware_1.default.required, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new http_exception_model_1.default(401, 'User ID is required to service inventory item');
        }
        const id = parseInt(req.params.id);
        const { name, description, price, items } = req.body;
        const updatedService = yield (0, services_service_1.updateServiceItem)({ id, name, description, items, price, userId });
        res.status(200).json(updatedService);
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
            throw new http_exception_model_1.default(401, 'User ID is required to delete service item');
        }
        const id = parseInt(req.params.id);
        const deletedService = yield (0, services_service_1.deleteServiceItem)(id);
        res.status(200).json(deletedService);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
