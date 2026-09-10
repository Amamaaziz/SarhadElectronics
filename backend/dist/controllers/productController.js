"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const productService_1 = require("../services/productService");
const cloudinary_1 = require("../config/cloudinary");
const getProducts = async (req, res) => {
    try {
        const { search, category, sort, featured, page, limit } = req.query;
        const products = await (0, productService_1.getProductsFromStore)({
            search: search,
            category: category,
            sort: sort,
            featured: featured !== undefined ? featured === 'true' : undefined,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 50,
        });
        (0, apiResponse_1.sendSuccess)(res, products, 'Products retrieved successfully', 200, {
            total: products.length,
        });
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch products', 500, error);
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await (0, productService_1.getProductByIdFromStore)(id);
        if (!product) {
            (0, apiResponse_1.sendError)(res, 'Product not found', 404);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, product, 'Product details retrieved successfully');
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch product details', 500, error);
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId, brand, featured, imageUrl } = req.body;
        if (!name || !price) {
            (0, apiResponse_1.sendError)(res, 'Name and price are required fields', 400);
            return;
        }
        let finalImageUrl = imageUrl;
        // Handle file upload if present
        if (req.file) {
            finalImageUrl = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer);
        }
        if (!finalImageUrl) {
            finalImageUrl = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80';
        }
        const created = await (0, productService_1.createProductInStore)({
            name,
            description: description || '',
            price: Number(price),
            stock: Number(stock) || 0,
            categoryId: categoryId || 'cat-01',
            brand: brand || 'Sarhad',
            featured: featured === true || featured === 'true',
            imageUrl: finalImageUrl,
        });
        (0, apiResponse_1.sendSuccess)(res, created, 'Product created successfully', 201);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to create product', 500, error);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        if (req.file) {
            updates.imageUrl = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer);
        }
        if (updates.price !== undefined)
            updates.price = Number(updates.price);
        if (updates.stock !== undefined)
            updates.stock = Number(updates.stock);
        if (updates.featured !== undefined)
            updates.featured = updates.featured === true || updates.featured === 'true';
        const updated = await (0, productService_1.updateProductInStore)(id, updates);
        if (!updated) {
            (0, apiResponse_1.sendError)(res, 'Product not found or update failed', 404);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, updated, 'Product updated successfully');
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to update product', 500, error);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await (0, productService_1.deleteProductInStore)(id);
        if (!deleted) {
            (0, apiResponse_1.sendError)(res, 'Product not found or could not be deleted', 404);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, { id }, 'Product deleted successfully');
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to delete product', 500, error);
    }
};
exports.deleteProduct = deleteProduct;
