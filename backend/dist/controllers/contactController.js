"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactMessages = exports.submitContactMessage = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const db_1 = __importDefault(require("../config/db"));
const productService_1 = require("../services/productService");
const submitContactMessage = async (req, res) => {
    try {
        const { fullName, email, subject, message } = req.body;
        if (!fullName || !email || !subject || !message) {
            (0, apiResponse_1.sendError)(res, 'All fields (Full Name, Email, Subject, Message) are required', 400);
            return;
        }
        const isDbLive = await (0, productService_1.checkDbConnection)();
        if (isDbLive) {
            const contact = await db_1.default.contactMessage.create({
                data: {
                    fullName,
                    email,
                    subject,
                    message,
                    status: 'UNREAD',
                },
            });
            (0, apiResponse_1.sendSuccess)(res, contact, 'Message sent successfully! We will get back to you shortly.', 201);
            return;
        }
        // Memory fallback
        const newMsg = {
            id: `msg-${Date.now()}`,
            fullName,
            email,
            subject,
            message,
            status: 'UNREAD',
            createdAt: new Date(),
        };
        productService_1.memoryMessages.unshift(newMsg);
        (0, apiResponse_1.sendSuccess)(res, newMsg, 'Message sent successfully! We will get back to you shortly.', 201);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to submit contact message', 500, error);
    }
};
exports.submitContactMessage = submitContactMessage;
const getContactMessages = async (req, res) => {
    try {
        const isDbLive = await (0, productService_1.checkDbConnection)();
        if (isDbLive) {
            const messages = await db_1.default.contactMessage.findMany({
                orderBy: { createdAt: 'desc' },
            });
            (0, apiResponse_1.sendSuccess)(res, messages);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, productService_1.memoryMessages);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to retrieve messages', 500, error);
    }
};
exports.getContactMessages = getContactMessages;
