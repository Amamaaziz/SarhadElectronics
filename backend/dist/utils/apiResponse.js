"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = 'Success', statusCode = 200, meta) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        ...(meta && { meta }),
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(error && { error: typeof error === 'string' ? error : error.message || error }),
    });
};
exports.sendError = sendError;
