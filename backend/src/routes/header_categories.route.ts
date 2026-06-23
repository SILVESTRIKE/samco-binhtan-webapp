import { Router } from "express";
import { NavbarItemController } from "../controllers/header_categories.controller";
import { validateData } from "../middlewares/validateBody.middleware";
import {
  CreateNavbarItemSchema,
  UpdateNavbarItemSchema,
  GetByIdParamsSchema,
} from "../types/header_categories.type";
// import { checkAllowedRolesMiddleware } from "../middlewares/checkAllowedRoles.middleware";
// import { getAuthMiddleware } from "../middlewares/getAuth.middleware";

const router = Router();

// router.use(getAuthMiddleware());

// =================================================================
// I. PUBLIC DATA ROUTE (Dành cho client/website)
// =================================================================

/**
 * 1.1. [Public] Lấy toàn bộ cấu trúc cây của một nhóm menu.
 * Đây là endpoint chính mà client sẽ sử dụng để render menu.
 * @route GET /api/navbar-tree/:group
 */
router.get("/api/navbar-tree/:group", NavbarItemController.getMenuTree);

router.get("/api/navbar-items", NavbarItemController.getAll);
// =================================================================
// II. ADMIN MANAGEMENT ROUTES (Dành cho trang quản trị)
// =================================================================

/**
 * 2.1. [Admin] Tạo một mục navbar mới.
 * @route POST /api/navbar-items
 */
router.post(
  "/api/navbar-items",
  // checkAllowedRolesMiddleware(['ADMIN']),
  validateData(CreateNavbarItemSchema, "body"),
  NavbarItemController.create
);

/**
 * 2.2. [Admin] Lấy thông tin chi tiết của một mục navbar bằng ID.
 * Dùng để load dữ liệu vào form chỉnh sửa.
 * @route GET /api/navbar-items/:id
 */
router.get(
  "/api/navbar-items/:id",
  // checkAllowedRolesMiddleware(['ADMIN', 'EDITOR']),
  validateData(GetByIdParamsSchema, "params"),
  NavbarItemController.getById
);

/**
 * 2.3. [Admin] Cập nhật thông tin của một mục navbar.
 * @route POST /api/navbar-items/:id
 */
router.post(
  "/api/navbar-items/:id",
  // checkAllowedRolesMiddleware(['ADMIN']),
  validateData(GetByIdParamsSchema, "params"),
  validateData(UpdateNavbarItemSchema, "body"),
  NavbarItemController.update
);

/**
 * 2.4. [Admin] Xóa mềm một mục navbar (và các mục con của nó).
 * @route DELETE /api/navbar-items/:id
 */
router.delete(
  "/api/navbar-items/:id",
  // checkAllowedRolesMiddleware(['ADMIN']),
  validateData(GetByIdParamsSchema, "params"),
  NavbarItemController.delete
);

export { router as navbarItemRouter };
