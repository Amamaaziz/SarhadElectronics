"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const apiResponse_1 = require("../utils/apiResponse");
const productService_1 = require("../services/productService");
const getUsers = async (req, res) => {
    try {
        const isDbLive = await (0, productService_1.checkDbConnection)();
        if (isDbLive) {
            const users = await db_1.default.user.findMany({
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    avatarUrl: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            (0, apiResponse_1.sendSuccess)(res, users);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, [
            {
                id: 'user-admin-01',
                fullName: 'Sarhad Admin',
                email: 'admin@sarhadelectrics.com',
                role: 'ADMIN',
                createdAt: new Date(),
            },
            {
                id: 'user-demo-01',
                fullName: 'Demo Customer',
                email: 'user@sarhadelectrics.com',
                role: 'USER',
                createdAt: new Date(),
            },
        ]);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch user accounts', 500, error);
    }
};
exports.getUsers = getUsers;
