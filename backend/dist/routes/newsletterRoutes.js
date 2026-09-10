"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletterController_1 = require("../controllers/newsletterController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public newsletter subscription
router.post('/', newsletterController_1.subscribe);
// Admin view subscriber list
router.get('/', authMiddleware_1.protect, authMiddleware_1.adminOnly, newsletterController_1.getSubscribers);
exports.default = router;
