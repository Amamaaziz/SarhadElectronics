"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const newsletterRoutes_1 = __importDefault(require("./routes/newsletterRoutes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware configuration
app.use((0, cors_1.default)({
    origin: '*', // Allows requests from Vite dev servers (5173, 5174, etc.)
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'Sarhad Electrics REST API',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// Mount Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/contact', contactRoutes_1.default);
app.use('/api/newsletter', newsletterRoutes_1.default);
// Error Handling
app.use(errorMiddleware_1.notFoundHandler);
app.use(errorMiddleware_1.errorHandler);
// Start Server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`⚡ Sarhad Electrics API server running on port ${PORT}`);
        console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
    });
}
exports.default = app;
