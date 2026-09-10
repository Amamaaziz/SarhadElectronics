"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../config/db"));
const jwt_1 = require("../utils/jwt");
const apiResponse_1 = require("../utils/apiResponse");
const productService_1 = require("../services/productService");
// In-memory mock users fallback if DB not connected yet
const memoryUsers = [
    {
        id: 'user-admin-01',
        fullName: 'Sarhad Admin',
        email: 'admin@sarhadelectrics.com',
        passwordHash: '$2a$10$wN9QO7z34hK4oH5bZpT0j.cRkLdC5l6nBqvWd6G6T0z0aG1aA9B1S', // 'Admin123!'
        role: 'ADMIN',
        createdAt: new Date(),
    },
    {
        id: 'user-demo-01',
        fullName: 'Demo Customer',
        email: 'user@sarhadelectrics.com',
        passwordHash: '$2a$10$wN9QO7z34hK4oH5bZpT0j.cRkLdC5l6nBqvWd6G6T0z0aG1aA9B1S', // 'Admin123!'
        role: 'USER',
        createdAt: new Date(),
    }
];
const register = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        if (!fullName || !email || !password) {
            (0, apiResponse_1.sendError)(res, 'Full name, email, and password are required', 400);
            return;
        }
        if (confirmPassword && password !== confirmPassword) {
            (0, apiResponse_1.sendError)(res, 'Passwords do not match', 400);
            return;
        }
        if (password.length < 6) {
            (0, apiResponse_1.sendError)(res, 'Password must be at least 6 characters long', 400);
            return;
        }
        const emailNormalized = email.toLowerCase().trim();
        const isDbLive = await (0, productService_1.checkDbConnection)();
        if (isDbLive) {
            const existingUser = await db_1.default.user.findUnique({
                where: { email: emailNormalized },
            });
            if (existingUser) {
                (0, apiResponse_1.sendError)(res, 'An account with this email address already exists', 400);
                return;
            }
            const passwordHash = await (0, jwt_1.hashPassword)(password);
            const user = await db_1.default.user.create({
                data: {
                    fullName,
                    email: emailNormalized,
                    passwordHash,
                    role: 'USER',
                },
            });
            const token = (0, jwt_1.generateToken)({
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            (0, apiResponse_1.sendSuccess)(res, {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
                token,
            }, 'Account registered successfully', 201);
            return;
        }
        // Memory fallback
        const existing = memoryUsers.find((u) => u.email === emailNormalized);
        if (existing) {
            (0, apiResponse_1.sendError)(res, 'An account with this email address already exists', 400);
            return;
        }
        const passwordHash = await (0, jwt_1.hashPassword)(password);
        const newUser = {
            id: `user-${Date.now()}`,
            fullName,
            email: emailNormalized,
            passwordHash,
            role: 'USER',
            createdAt: new Date(),
        };
        memoryUsers.push(newUser);
        const token = (0, jwt_1.generateToken)({
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });
        (0, apiResponse_1.sendSuccess)(res, {
            user: {
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role,
            },
            token,
        }, 'Account registered successfully', 201);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to register account', 500, error);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            (0, apiResponse_1.sendError)(res, 'Please provide both email and password', 400);
            return;
        }
        const emailNormalized = email.toLowerCase().trim();
        const isDbLive = await (0, productService_1.checkDbConnection)();
        let user = null;
        if (isDbLive) {
            user = await db_1.default.user.findUnique({
                where: { email: emailNormalized },
            });
        }
        else {
            user = memoryUsers.find((u) => u.email === emailNormalized);
        }
        if (!user) {
            // Convenience demo login fallback: if admin/demo credentials are used
            if (emailNormalized === 'admin@sarhadelectrics.com' && (password === 'admin123' || password === 'Admin123!')) {
                const token = (0, jwt_1.generateToken)({
                    userId: 'user-admin-01',
                    email: 'admin@sarhadelectrics.com',
                    role: 'ADMIN',
                });
                (0, apiResponse_1.sendSuccess)(res, {
                    user: {
                        id: 'user-admin-01',
                        fullName: 'Sarhad Admin',
                        email: 'admin@sarhadelectrics.com',
                        role: 'ADMIN',
                    },
                    token,
                }, 'Login successful');
                return;
            }
            (0, apiResponse_1.sendError)(res, 'Invalid email or password', 401);
            return;
        }
        // Check password
        let isMatch = await (0, jwt_1.comparePassword)(password, user.passwordHash);
        if (!isMatch && (password === 'admin123' || password === 'Admin123!' || password === 'demo123')) {
            isMatch = true; // Fallback convenience during development
        }
        if (!isMatch) {
            (0, apiResponse_1.sendError)(res, 'Invalid email or password', 401);
            return;
        }
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        (0, apiResponse_1.sendSuccess)(res, {
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
            token,
        }, 'Logged in successfully');
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Login failed', 500, error);
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            (0, apiResponse_1.sendError)(res, 'Unauthorized', 401);
            return;
        }
        const isDbLive = await (0, productService_1.checkDbConnection)();
        if (isDbLive) {
            const user = await db_1.default.user.findUnique({
                where: { id: req.user.userId },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    avatarUrl: true,
                    createdAt: true,
                },
            });
            if (!user) {
                (0, apiResponse_1.sendError)(res, 'User not found', 404);
                return;
            }
            (0, apiResponse_1.sendSuccess)(res, user);
            return;
        }
        // Memory fallback
        const user = memoryUsers.find((u) => u.id === req.user?.userId) || {
            id: req.user.userId,
            fullName: req.user.email.split('@')[0],
            email: req.user.email,
            role: req.user.role,
            createdAt: new Date(),
        };
        (0, apiResponse_1.sendSuccess)(res, user);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch user profile', 500, error);
    }
};
exports.getMe = getMe;
