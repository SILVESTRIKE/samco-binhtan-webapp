import { Router } from "express";
import { ProductController } from "../controllers/products.controller";
import { validateData } from "../middlewares/validateBody.middleware";
import { createProductZodSchema, updateProductZodSchema, variantZodSchema } from "../types/products.type";
import { authMiddlewareAsync } from "../middlewares/auth.middleware";
import { checkAllowedRolesMiddleware } from "../middlewares/roles.middleware";

const router = Router();

// =================================================================
// PUBLIC ROUTES (Không cần đăng nhập)
// =================================================================

router.get('/api/products/cards', ProductController.getProductCards);
router.get('/api/products/homepage-sliders', ProductController.getHomepageSliders);
router.get('/api/products/feature-sliders', ProductController.getProductFeatureSliders);
router.get('/api/products/vertical-slider-motor/:slug', ProductController.getVerticalSliderMotorItems);
router.get('/api/products/buying-guides/:slug', ProductController.getBuyingGuideItems);
router.get('/api/products/slug/:slug', ProductController.getProductBySlug);
router.get('/api/products/mega-menu', ProductController.getMegaMenuProducts);

// =================================================================
// PROTECTED ROUTES (Cần đăng nhập + phân quyền)
// =================================================================

router.get(
    '/api/products/',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor']),
    ProductController.getAllProductsForAdmin
);

router.get(
    '/api/products/:id',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor', 'viewer']),
    ProductController.getProductById
);

router.post(
    '/api/products/',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor']),
    validateData(createProductZodSchema, 'body'),
    ProductController.createProduct
);

router.post(
    '/api/products/:id',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor']),
    validateData(updateProductZodSchema.partial(), 'body'),
    ProductController.updateProduct
);

router.delete(
    '/api/products/:id',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin']),
    ProductController.deleteProduct
);

// === ROUTES PHỤ ĐỂ QUẢN LÝ VARIANTS CỦA MỘT PRODUCT ===
router.post(
    `/api/products/:id/variants`,
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor']),
    validateData(variantZodSchema, 'body'),
    ProductController.addVariant
);

router.post(
    `/api/products/:id/variants/:sku`,
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor']),
    validateData(variantZodSchema.partial(), 'body'),
    ProductController.updateVariant
);

router.delete(
    `/api/products/:id/variants/:sku`,
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin']),
    ProductController.removeVariant
);

export { router as productRouter };
