import { Router } from "express";
import {
  MediaController,
  DirectoryController,
} from "../controllers/medias.controller";
import { validateData } from "../middlewares/validateBody.middleware";
import {
  UpdateMediaInfoZodSchema,
  CreateDirectoryZodSchema,
  GetByIdParamsSchema,
  GetMediasQuerySchema,
} from "../types/medias.type";
import { uploadSingle, uploadMultiple } from "../middlewares/upload.middleware";
import { authMiddlewareAsync } from "../middlewares/auth.middleware";
import { checkAllowedRolesMiddleware } from "../middlewares/roles.middleware";

const router = Router();

// =================================================================
// I. MEDIA UPLOAD ROUTES (Protected - Admin/Editor)
// =================================================================

router.post(
  "/api/medias/upload/single",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor']),
  uploadSingle,
  MediaController.uploadSingle
);

router.post(
  "/api/medias/upload/multiple",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor']),
  uploadMultiple,
  MediaController.uploadMultiple
);

router.post(
  "/api/medias/upload-url",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor']),
  uploadSingle,
  MediaController.uploadAndGetUrl
);

// =================================================================
// II. MEDIA ACCESS & MANAGEMENT ROUTES
// =================================================================

router.get(
  "/api/medias",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor', 'viewer']),
  validateData(GetMediasQuerySchema, "query"),
  MediaController.getMedias
);

router.get(
  "/api/medias/:id",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor', 'viewer']),
  validateData(GetByIdParamsSchema, "params"),
  MediaController.getMediaById
);

router.post(
  "/api/medias/:id",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor']),
  validateData(GetByIdParamsSchema, "params"),
  validateData(UpdateMediaInfoZodSchema, "body"),
  MediaController.updateMediaInfo
);

router.delete(
  "/api/medias/:id",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin']),
  validateData(GetByIdParamsSchema, "params"),
  MediaController.deleteMedia
);

// =================================================================
// III. DIRECTORY (LOGICAL FOLDERS) MANAGEMENT ROUTES
// =================================================================

router.post(
  "/api/directories",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor']),
  validateData(CreateDirectoryZodSchema, "body"),
  DirectoryController.create
);

router.get(
  "/api/directories/content",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor', 'viewer']),
  DirectoryController.getContent
);

router.get(
  "/api/directories/content/:id",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor', 'viewer']),
  validateData(GetByIdParamsSchema, "params"),
  DirectoryController.getContent
);

router.get(
  "/api/directories/:id/breadcrumb",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor', 'viewer']),
  validateData(GetByIdParamsSchema, "params"),
  DirectoryController.getBreadcrumb
);

router.delete(
  "/api/directories/:id",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin']),
  validateData(GetByIdParamsSchema, "params"),
  DirectoryController.softDelete
);

// =================================================================
// IV. PHYSICAL FOLDER BROWSING ROUTES (ADMIN ONLY)
// =================================================================

router.get(
  "/api/admin/media-folders",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor']),
  MediaController.getFileTypeFolders
);

router.get(
  "/api/admin/media-folders/:fileType",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor']),
  MediaController.getYearFolders
);

router.get(
  "/api/admin/media-folders/:fileType/:year",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor']),
  MediaController.getMonthFolders
);

router.get(
  "/api/admin/media-folders/:fileType/:year/:month",
  authMiddlewareAsync,
  checkAllowedRolesMiddleware(['admin', 'editor']),
  MediaController.getMediaByPhysicalPath
);

export { router as mediaRouter };
