import { Router } from 'express';
import { CategoryController } from '../controllers/categories.controller';
import { validateData } from '../middlewares/validateBody.middleware';
import { categoryZodSchema } from '../types/categories.type';
import { authMiddlewareAsync } from "../middlewares/auth.middleware";
import { checkAllowedRolesMiddleware } from "../middlewares/roles.middleware";

const router = Router();

// =================================================================
// PUBLIC ROUTES
// =================================================================

router.get('/api/categories/tree', CategoryController.getCategoryTree);

// =================================================================
// PROTECTED ROUTES
// =================================================================

router.get(
    '/api/categories/',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor', 'viewer']),
    CategoryController.getCategories
);

router.get(
    '/api/categories/:id',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor', 'viewer']),
    CategoryController.getCategoryById
);

router.post(
    '/api/categories/',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor']),
    validateData(categoryZodSchema, 'body'),
    CategoryController.createCategory
);

router.post(
    '/api/categories/:id',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor']),
    validateData(categoryZodSchema.partial(), 'body'),
    CategoryController.updateCategory
);

router.delete(
    '/api/categories/:id',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin']),
    CategoryController.deleteCategory
);

export { router as categoryRouter };
