import { Request, Response } from "express";
import { NavbarItemService } from "../services/header_categories.service";
import { NotFoundError, BadRequestError } from "../errors";

export class NavbarItemController {
  /**
   * [POST] /api/navbar-items - Tạo một mục navbar mới.
   */
  static async create(req: Request, res: Response) {
    const newItem = await NavbarItemService.create(req.body);
    res.status(201).json(newItem);
  }

  /**
   * [GET] /api/navbar-items-tree/:group - Lấy toàn bộ cây menu cho một nhóm cụ thể.
   * Đây là endpoint chính mà client sẽ gọi.
   */
  static async getMenuTree(req: Request, res: Response) {
    const { group } = req.params;
    if (!group) {
      throw new BadRequestError("Cần cung cấp 'group' của menu.");
    }
    const menuTree = await NavbarItemService.getFullMenuTree(group);
    res.status(200).json(menuTree);
  }

  /**
   * [GET] /api/navbar-items/:id - Lấy chi tiết một mục (dùng cho admin).
   */
  static async getById(req: Request, res: Response) {
    const id = (req.params as any).id as number;
    const item = await NavbarItemService.findById(id);
    if (!item)
      throw new NotFoundError(`Không tìm thấy mục navbar với ID: ${id}`);
    res.status(200).json(item);
  }

  static async getAll(req: Request, res: Response) {
    const items = await NavbarItemService.findAll();
    res.status(200).json(items);
  }

  /**
   * [POST] /api/navbar-items/:id - Cập nhật một mục.
   */
  static async update(req: Request, res: Response) {
    const id = (req.params as any).id as number;
    const updatedItem = await NavbarItemService.update(id, req.body);
    if (!updatedItem)
      throw new NotFoundError(`Không tìm thấy mục navbar với ID: ${id}`);
    res.status(200).json(updatedItem);
  }

  /**
   * [DELETE] /api/navbar-items/:id - Xóa một mục.
   */
  static async delete(req: Request, res: Response) {
    const id = (req.params as any).id as number;
    const itemExists = await NavbarItemService.findById(id);
    if (!itemExists)
      throw new NotFoundError(`Không tìm thấy mục navbar với ID: ${id}`);

    await NavbarItemService.softDeleteRecursive(id);
    res.status(204).send();
  }
}
