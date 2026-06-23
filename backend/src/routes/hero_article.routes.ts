import { Router } from "express";
import { HeroArticlesController } from "../controllers/hero_articles.controller";
import { validateData } from "../middlewares/validateBody.middleware";
import { HeroArticlesZodSchema, UpdateHeroArticlesZodSchema } from "../types/hero_articles.type";
import { authMiddlewareAsync } from "../middlewares/auth.middleware";
import { checkAllowedRolesMiddleware } from "../middlewares/roles.middleware";

const router = Router();

// =================================================================
// PUBLIC ROUTES
// =================================================================

router.get(
    '/api/hero-articles/homepage-layout',
    HeroArticlesController.getHomepageLayout
);

// =================================================================
// PROTECTED ROUTES (Admin/Editor)
// =================================================================

router.get(
    '/api/hero-articles',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor', 'viewer']),
    HeroArticlesController.getHeroArticles
);

router.get(
    '/api/hero-articles/:id',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor', 'viewer']),
    HeroArticlesController.getHeroArticlesById
);

router.post(
    '/api/hero-articles/',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor']),
    validateData(HeroArticlesZodSchema, 'body'),
    HeroArticlesController.createHeroArticles
);

router.post(
    '/api/hero-articles/:id',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin', 'editor']),
    validateData(UpdateHeroArticlesZodSchema.partial(), 'body'),
    HeroArticlesController.updateHeroArticles
);

router.delete(
    '/api/hero-articles/:id',
    authMiddlewareAsync,
    checkAllowedRolesMiddleware(['admin']),
    HeroArticlesController.deleteHeroArticles
);

export { router as heroArticlesRouter };
