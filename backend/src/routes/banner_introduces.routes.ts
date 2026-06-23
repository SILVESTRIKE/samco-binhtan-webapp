import { Router } from 'express';
import { BannerIntroducesController } from '../controllers/banner_introduces.controller';
import { validateData } from '../middlewares/validateBody.middleware';
import z from 'zod';
import { BannerIntroduceZodSchema } from '../types/banner_introduces.types';

const router = Router();

// get all banner introduces
router.get(
    "/api/banner-introduces",
    BannerIntroducesController.getAllBannerIntroduce
);

// get banner introduce by slug
router.get(
    "/api/banner-introduces/slug/:slug",
    validateData(z.object({ slug: z.string() }), 'params'),
    BannerIntroducesController.getBannerIntroduceBySlug
);

// get banner introduce by id
router.get(
    "/api/banner-introduces/:id",
    validateData(z.object({ id: z.string() }), 'params'),
    BannerIntroducesController.getBannerIntroduceById
)

// create banner introduce
router.post("/api/banner-introduces/create",
    validateData(BannerIntroduceZodSchema, 'body'),
    BannerIntroducesController.createBannerIntroduce
);

// update banner introduce
router.put("/api/banner-introduces/update/:id",
    validateData(z.object({ id: z.string() }), 'params'),
    validateData(BannerIntroduceZodSchema, 'body'),
    BannerIntroducesController.updateBannerIntroduce
);

// delete banner introduce
router.delete("/api/banner-introduces/delete/:id",
    validateData(z.object({ id: z.string() }), 'params'),
    BannerIntroducesController.deleteBannerIntroduce
);

export { router as BannerIntroducesRouter };
