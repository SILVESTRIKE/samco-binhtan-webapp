import { Router } from "express";
import { FooterItemController } from "../controllers/footer_categories.controller";
import { validateData } from "../middlewares/validateBody.middleware"; 
import {
  CreateFooterItemSchema,
  UpdateFooterItemSchema,
  FooterItemParamsSchema, 
} from "../types/footer_categories.types";

const router = Router();

/**
 * 1.1. [Public] Lấy toàn bộ cấu trúc layout của footer.
 * Đây là endpoint chính mà client sẽ sử dụng để render toàn bộ footer.
 * @route GET /api/footer-items/layout
 */
router.get("/api/footer-items/layout", FooterItemController.getLayout);

/**
 * 2.1. [Admin] Lấy danh sách phẳng tất cả các footer item.
 * Dùng để hiển thị trong bảng quản lý.
 * @route GET /api/footer-items
 */
router.get(
  "/api/footer-items",
  
  FooterItemController.getAllForAdmin
);

/**
 * 2.2. [Admin] Tạo một footer item mới.
 * @route POST /api/footer-items
 */
router.post(
  "/api/footer-items",
  
  validateData(CreateFooterItemSchema, "body"),
  FooterItemController.createItem
);

/**
 * 2.3. [Admin] Lấy thông tin chi tiết của một footer item bằng ID.
 * Dùng để load dữ liệu vào form chỉnh sửa.
 * @route GET /api/footer-items/:id
 */
router.get(
  "/api/footer-items/:id",
  
  validateData(FooterItemParamsSchema, "params"),
  FooterItemController.getById
);

/**
 * 2.4. [Admin] Cập nhật thông tin của một footer item.
 * @route PATCH /api/footer-items/:id  (Sử dụng PATCH là chuẩn RESTful hơn cho việc cập nhật)
 */
router.patch(
  "/api/footer-items/:id",
  
  validateData(FooterItemParamsSchema, "params"),
  validateData(UpdateFooterItemSchema, "body"),
  FooterItemController.updateItem
);

/**
 * 2.5. [Admin] Xóa mềm một footer item (và các mục con của nó).
 * @route DELETE /api/footer-items/:id
 */
router.delete(
  "/api/footer-items/:id",
  
  validateData(FooterItemParamsSchema, "params"),
  FooterItemController.deleteItem
);

export { router as footerItemRouter };