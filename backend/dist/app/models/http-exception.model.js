"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//taken directly from chatgpt
class HttpException extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.default = HttpException;
