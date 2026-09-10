"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public submission
router.post('/', contactController_1.submitContactMessage);
// Admin view inquiries
router.get('/', authMiddleware_1.protect, authMiddleware_1.adminOnly, contactController_1.getContactMessages);
exports.default = router;
