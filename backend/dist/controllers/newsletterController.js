"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscribers = exports.subscribe = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const db_1 = __importDefault(require("../config/db"));
const productService_1 = require("../services/productService");
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.includes('@')) {
            (0, apiResponse_1.sendError)(res, 'A valid email address is required', 400);
            return;
        }
        const emailNormalized = email.toLowerCase().trim();
        const isDbLive = await (0, productService_1.checkDbConnection)();
        if (isDbLive) {
            const existing = await db_1.default.subscriber.findUnique({
                where: { email: emailNormalized },
            });
            if (existing) {
                (0, apiResponse_1.sendSuccess)(res, existing, 'You are already subscribed to our newsletter!');
                return;
            }
            const subscriber = await db_1.default.subscriber.create({
                data: { email: emailNormalized },
            });
            (0, apiResponse_1.sendSuccess)(res, subscriber, 'Successfully subscribed to Sarhad Electrics newsletter!', 201);
            return;
        }
        const existing = productService_1.memorySubscribers.find((s) => s.email === emailNormalized);
        if (existing) {
            (0, apiResponse_1.sendSuccess)(res, existing, 'You are already subscribed to our newsletter!');
            return;
        }
        const subscriber = {
            id: `sub-${Date.now()}`,
            email: emailNormalized,
            subscribedAt: new Date(),
        };
        productService_1.memorySubscribers.push(subscriber);
        (0, apiResponse_1.sendSuccess)(res, subscriber, 'Successfully subscribed to Sarhad Electrics newsletter!', 201);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Subscription failed', 500, error);
    }
};
exports.subscribe = subscribe;
const getSubscribers = async (req, res) => {
    try {
        const isDbLive = await (0, productService_1.checkDbConnection)();
        if (isDbLive) {
            const subscribers = await db_1.default.subscriber.findMany({
                orderBy: { subscribedAt: 'desc' },
            });
            (0, apiResponse_1.sendSuccess)(res, subscribers);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, productService_1.memorySubscribers);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch subscribers', 500, error);
    }
};
exports.getSubscribers = getSubscribers;
