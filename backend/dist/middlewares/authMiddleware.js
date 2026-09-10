"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const apiResponse_1 = require("../utils/apiResponse");
const protect = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            (0, apiResponse_1.sendError)(res, 'Access denied. No authorization token provided.', 401);
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Invalid or expired session token.', 401, error);
    }
};
exports.protect = protect;
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        (0, apiResponse_1.sendError)(res, 'Access denied. Administrator privileges required.', 403);
        return;
    }
    next();
};
exports.adminOnly = adminOnly;
