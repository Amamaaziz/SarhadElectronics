"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const errorHandler = (err, req, res, next) => {
    console.error('API Error:', err);
    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    const message = err.message || 'Internal Server Error';
    (0, apiResponse_1.sendError)(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, next) => {
    (0, apiResponse_1.sendError)(res, `Route not found - ${req.originalUrl}`, 404);
};
exports.notFoundHandler = notFoundHandler;
