import { Router } from "express";
import { checkAllowedRolesMiddleware } from "../middlewares/checkAllowedRoles.middleware";
import { getAuthMiddleware } from "../middlewares/getAuth.middleware";
import { IntroCardsController } from "../controllers/intro_cards.controller";
import { validateData } from "../middlewares/validateBody.middleware";
import { IntroCardsZodSchema, UpdateIntroCardsZodSchema } from "../types/intro_cards.type";
const router = Router();

//router.use(getAuthMiddleware());
router.get(
    '/api/intro-cards/homepage-layout',
    IntroCardsController.getHomepageLayout
);
//admin
router.get(
    '/api/intro-cards',
    //checkAllowedRolesMiddleware(['HR_ADMIN', 'EDITOR', 'VIEWER']),
    IntroCardsController.getIntroCards
);

router.get(
    '/api/intro-cards/:id',
    //checkAllowedRolesMiddleware(['HR_ADMIN', 'EDITOR', 'VIEWER']),
    IntroCardsController.getIntroCardsById
);

router.post(
    '/api/intro-cards/',
    //checkAllowedRolesMiddleware(['HR_ADMIN', 'EDITOR']),
    validateData(IntroCardsZodSchema, 'body'),
    IntroCardsController.createIntroCards
);

router.post(
    '/api/intro-cards/:id',
    //checkAllowedRolesMiddleware(['HR_ADMIN', 'EDITOR']),
    validateData(UpdateIntroCardsZodSchema.partial(), 'body'),
    IntroCardsController.updateIntroCards
);

router.delete(
    '/api/intro-cards/:id',
    //checkAllowedRolesMiddleware(['HR_ADMIN']),
    IntroCardsController.deleteIntroCards
);

export { router as introCardsRouter };