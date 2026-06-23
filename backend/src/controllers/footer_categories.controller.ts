
import { NextFunction, Request, Response } from "express";
import { FooterItemService } from "../services/footer_categories.service";
import {
  CreateFooterItemSchema,
  UpdateFooterItemSchema,
  FooterItemParamsSchema,
} from "../types/footer_categories.types";
import { BadRequestError, NotFoundError } from "../errors";
import { transformMediaURLs } from "../utils/media.util"; 

export class FooterItemController {
  
  /**
   * Lấy toàn bộ cấu trúc footer đã được phân cấp cho client.
   */
  static async getLayout(req: Request, res: Response, next: NextFunction) {
    try {
      const layout = await FooterItemService.getLayout();

      const transformedLayout = {
        column1: transformMediaURLs(req, layout.column1),
        column2: transformMediaURLs(req, layout.column2),
        column3: transformMediaURLs(req, layout.column3),
      };

      res.status(200).json({
        success: true,
        message: "Footer layout fetched successfully",
        data: transformedLayout,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy danh sách phẳng tất cả các item cho trang quản trị.
   */
  static async getAllForAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await FooterItemService.findAllForAdmin();
      const transformedItems = transformMediaURLs(req, items);

      res.status(200).json({
        success: true,
        message: "Footer items fetched successfully for admin",
        data: transformedItems,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lấy thông tin chi tiết của một item bằng ID.
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      
      const validationResult = FooterItemParamsSchema.safeParse(req.params);
      if (!validationResult.success) {
        throw new BadRequestError("Invalid item ID provided");
      }
      const itemId = validationResult.data.id;

      const item = await FooterItemService.findById(itemId);
      if (!item) {
        throw new NotFoundError(`Footer item with ID ${itemId} not found`);
      }

      const transformedItem = transformMediaURLs(req, item);
      res.status(200).json({
        success: true,
        message: "Footer item fetched successfully",
        data: transformedItem,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tạo một item mới.
   */
  static async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      
      const validationResult = CreateFooterItemSchema.safeParse(req.body);
      if (!validationResult.success) {
        
        throw new BadRequestError("Invalid data provided");
      }

      const newItem = await FooterItemService.create(validationResult.data);
      const transformedNewItem = transformMediaURLs(req, newItem);
      
      res.status(201).json({
        success: true,
        message: "Footer item created successfully",
        data: transformedNewItem,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật một item đã có.
   */
  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      
      const paramsValidation = FooterItemParamsSchema.safeParse(req.params);
      if (!paramsValidation.success) {
        throw new BadRequestError("Invalid item ID provided");
      }
      const itemId = paramsValidation.data.id;

      const bodyValidation = UpdateFooterItemSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        throw new BadRequestError("Invalid data provided");
      }

      const updatedItem = await FooterItemService.update(itemId, bodyValidation.data);
      if (!updatedItem) {
        throw new NotFoundError(`Footer item with ID ${itemId} not found for update`);
      }

      const transformedUpdatedItem = transformMediaURLs(req, updatedItem);
      res.status(200).json({
        success: true,
        message: "Footer item updated successfully",
        data: transformedUpdatedItem,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa (mềm) một item và các con của nó.
   */
  static async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      
      const validationResult = FooterItemParamsSchema.safeParse(req.params);
      if (!validationResult.success) {
        throw new BadRequestError("Invalid item ID provided");
      }
      const itemId = validationResult.data.id;

      const itemExists = await FooterItemService.findById(itemId);
      if (!itemExists) {
        throw new NotFoundError(`Footer item with ID ${itemId} not found for deletion`);
      }

      await FooterItemService.softDeleteRecursive(itemId);
      
      res.status(204).send(); 
    } catch (error) {
      next(error);
    }
  }
}