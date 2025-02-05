"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); //to get variables from .env
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_controller_1 = __importDefault(require("./app/routes/auth/auth.controller"));
const inventory_controller_1 = __importDefault(require("./app/routes/inventory/inventory.controller"));
const services_controller_1 = __importDefault(require("./app/routes/services/services.controller"));
const invoices_controller_1 = __importDefault(require("./app/routes/invoices/invoices.controller"));
const purchases_controller_1 = __importDefault(require("./app/routes/purchases/purchases.controller"));
const app = (0, express_1.default)();
//backend and frontend are on different servers
app.use((0, cors_1.default)());
//middleware
app.use(express_1.default.json());
//routes
app.use('/api/auth', auth_controller_1.default);
app.use('/api/inventory', inventory_controller_1.default);
app.use('/api/services', services_controller_1.default);
app.use('/api/invoices', invoices_controller_1.default);
app.use('/api/purchases', purchases_controller_1.default);
//set up server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
