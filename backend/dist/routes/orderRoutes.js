"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Placing an order (authenticated or guest token)
router.post('/', orderController_1.createOrder);
// Fetching user's orders (or all if admin)
router.get('/', authMiddleware_1.protect, orderController_1.getOrders);
// Admin updates order status
router.patch('/:id/status', authMiddleware_1.protect, authMiddleware_1.adminOnly, orderController_1.updateOrderStatus);
exports.default = router;
