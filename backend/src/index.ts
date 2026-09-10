import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import contactRoutes from './routes/contactRoutes';
import newsletterRoutes from './routes/newsletterRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(
  cors({
    origin: '*', // Allows requests from Vite dev servers (5173, 5174, etc.)
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`⚡ Sarhad Electrics API server running on port ${PORT}`);
    console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
  });
}

export default app;

