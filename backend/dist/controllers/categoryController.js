"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.getCategories = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const productService_1 = require("../services/productService");
const db_1 = __importDefault(require("../config/db"));
const getCategories = async (req, res) => {
    try {
        const categories = await (0, productService_1.getCategoriesFromStore)();
        (0, apiResponse_1.sendSuccess)(res, categories, 'Categories retrieved successfully');
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to fetch categories', 500, error);
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const { name, description, imageUrl } = req.body;
        if (!name) {
            (0, apiResponse_1.sendError)(res, 'Category name is required', 400);
            return;
        }
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const isDbLive = await (0, productService_1.checkDbConnection)();
        if (isDbLive) {
            const category = await db_1.default.category.create({
                data: {
                    name,
                    slug,
                    description,
                    imageUrl,
                },
            });
            (0, apiResponse_1.sendSuccess)(res, category, 'Category created successfully', 201);
            return;
        }
        const newCategory = {
            id: `cat-${Date.now()}`,
            name,
            slug,
            description: description || '',
            imageUrl: imageUrl || '',
        };
        (0, apiResponse_1.sendSuccess)(res, newCategory, 'Category created successfully', 201);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, 'Failed to create category', 500, error);
    }
};
exports.createCategory = createCategory;
