"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrders = exports.createOrder = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const db_1 = __importDefault(require("../config/db"));
const productService_1 = require("../services/productService");
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, shippingPhone, paymentMethod } = req.body;
        const userId = req.user?.userId || 'guest-user';
        if (!items || !items.length || !shippingAddress) {
            (0, apiResponse_1.sendError)(res, 'Order items and shipping address are required', 400);
            return;
        }
        const isDbLive = await (0, productService_1.checkDbConnection)();
        if (isDbLive && userId !== 'guest-user') {
            const order = await db_1.default.order.create({
                data: {
                    userId,
                    totalAmount: Number(totalAmount),
                    shippingAddress,
                    shippingPhone,
                    paymentMethod: paymentMethod || 'COD',
                    status: 'PENDING',
                    orderItems: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            priceAtPurchase: Number(item.price),
                        })),
                    },
                },
                include: {
                    orderItems: {
                        include: { product: true },
                    },
                },
            });
            (0, apiResponse_1.sendSuccess)(res, order, 'Order placed successfully', 201);
            return;
        }
        // Memory fallback
        const newOrder = {
            id: `ord-${Date.now()}`,
            userId,
            totalAmount: Number(totalAmount),
            shippingAddress,
            shippingPhone,
            paymentMethod: paymentMethod || 'COD',
            status: 'PENDING',
            orderItems: items.map((item) => ({
                id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                productId: item.productId,
                productName: item.name || 'Electronic Item',
                quantity: item.quantity,
                priceAtPurchase: Number(item.price),
            })),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        productService_1.memoryOrders.unshift(newOrder);
        (0, apiResponse_1.sendSuccess)(res, newOrder, 'Order placed successfully', 201);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to place order', 500, error);
    }
};
exports.createOrder = createOrder;
const getOrders = async (req, res) => {
    try {
        const isDbLive = await (0, productService_1.checkDbConnection)();
        if (isDbLive) {
            const where = req.user?.role === 'ADMIN' ? {} : { userId: req.user?.userId };
            const orders = await db_1.default.order.findMany({
                where,
                include: {
                    orderItems: {
                        include: { product: true },
                    },
                    user: {
                        select: { fullName: true, email: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            (0, apiResponse_1.sendSuccess)(res, orders);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, productService_1.memoryOrders);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch orders', 500, error);
    }
};
exports.getOrders = getOrders;
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            (0, apiResponse_1.sendError)(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
            return;
        }
        const isDbLive = await (0, productService_1.checkDbConnection)();
        if (isDbLive) {
            const updated = await db_1.default.order.update({
                where: { id },
                data: { status },
            });
            (0, apiResponse_1.sendSuccess)(res, updated, 'Order status updated');
            return;
        }
        const order = productService_1.memoryOrders.find((o) => o.id === id);
        if (!order) {
            (0, apiResponse_1.sendError)(res, 'Order not found', 404);
            return;
        }
        order.status = status;
        order.updatedAt = new Date();
        (0, apiResponse_1.sendSuccess)(res, order, 'Order status updated');
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to update order status', 500, error);
    }
};
exports.updateOrderStatus = updateOrderStatus;
