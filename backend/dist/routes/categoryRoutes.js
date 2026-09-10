"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', categoryController_1.getCategories);
router.post('/', authMiddleware_1.protect, authMiddleware_1.adminOnly, categoryController_1.createCategory);
exports.default = router;
