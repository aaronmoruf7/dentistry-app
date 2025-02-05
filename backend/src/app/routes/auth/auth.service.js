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
exports.loginUser = exports.registerUser = void 0;
// import 'dotenv/config';
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'superSecret';
//register a user
const registerUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    //validate input
    if (!name || !email || !password) {
        throw new http_exception_model_1.default(400, "Name, email, and password required");
    }
    //check if email already exists
    const existingUser = yield prisma.user.findUnique({ where: { email: email } });
    if (existingUser) {
        throw new http_exception_model_1.default(409, 'Email is already registered');
    }
    //hash password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    //create the user
    const user = yield prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
        },
    });
    //generate a token for the User
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '3h' });
    return { user, token };
});
exports.registerUser = registerUser;
//login a user
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    //validate input
    if (!email || !password) {
        throw new http_exception_model_1.default(400, "Email, and password required");
    }
    //look for user in database
    const user = yield prisma.user.findUnique({ where: { email: email } });
    if (!user) {
        throw new http_exception_model_1.default(401, "Invalid email or password");
    }
    //see if password matches
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new http_exception_model_1.default(401, "Invalid email or password");
    }
    //generate a token for the User
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '3h' });
    return { user, token };
});
exports.loginUser = loginUser;
