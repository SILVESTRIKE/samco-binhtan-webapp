import { Router } from 'express';

import { ServiceController } from '../controllers/services.controller';
import { getAuthMiddleware } from '../middlewares/getAuth.middleware';
import { checkAllowedRolesMiddleware } from '../middlewares/checkAllowedRoles.middleware';
import { validateData } from '../middlewares/validateBody.middleware';
import { UpdateServiceZodSchema } from '../types/services.type';

const router = Router();

// router.use(getAuthMiddleware());
router.get(
    '/api/services/home-layout',
    ServiceController.getHomePageLayout
);
//ADMIN
router.get(
    '/api/services',
    // checkAllowedRolesMiddleware(['ADMIN', 'EDITOR', 'VIEWER']),
    ServiceController.getServices
);

router.get(
    '/api/services/:id',
    // checkAllowedRolesMiddleware(['ADMIN', 'EDITOR', 'VIEWER']),
    ServiceController.getServiceById
);

router.post(
    '/api/services/',
    // checkAllowedRolesMiddleware(['ADMIN', 'EDITOR']),
    validateData(UpdateServiceZodSchema, 'body'),
    ServiceController.createService
);

router.post(
    '/api/services/:id',
    // checkAllowedRolesMiddleware(['ADMIN', 'EDITOR']),
    validateData(UpdateServiceZodSchema.partial(), 'body'),
    ServiceController.updateService
);

router.delete(
    '/api/services/:id',
    // checkAllowedRolesMiddleware(['ADMIN']),
    ServiceController.deleteService
);

export { router as serviceRouter };