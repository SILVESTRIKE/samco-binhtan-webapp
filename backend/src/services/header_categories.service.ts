import { FilterQuery } from "mongoose";
import {
  NavbarItemModel,
  NavbarItemDoc,
} from "../models/header_categories.model";
import {
  CreateNavbarItemType,
  UpdateNavbarItemType,
} from "../types/header_categories.type";

export class NavbarItemService {
  static async create(itemData: CreateNavbarItemType): Promise<NavbarItemDoc> {
    return NavbarItemModel.create(itemData);
  }
  static async findAll(
    filter: FilterQuery<NavbarItemDoc> = {}
  ): Promise<NavbarItemDoc[]> {
    return NavbarItemModel.find({ ...filter, isDeleted: false }).sort({
      order: "asc",
    });
  }
  static async update(
    _id: number,
    data: UpdateNavbarItemType
  ): Promise<NavbarItemDoc | null> {
    return NavbarItemModel.findOneAndUpdate({ _id, isDeleted: false }, data, {
      new: true,
    });
  }

  static async softDeleteRecursive(_id: number): Promise<void> {
    const children = await NavbarItemModel.find({
      parent_id: _id,
      isDeleted: false,
    });
    for (const child of children) {
      await this.softDeleteRecursive(child._id);
    }
    await NavbarItemModel.findByIdAndUpdate(_id, { isDeleted: true });
  }

  static async findById(_id: number): Promise<NavbarItemDoc | null> {
    return NavbarItemModel.findOne({ _id, isDeleted: false });
  }

  // static async findByType(type: string): Promise<NavbarItemDoc[]> {
  //   return NavbarItemModel.find({ type, isDeleted: false }).sort({
  //     order: "asc",
  //   });
  // }
  static async getFullMenuTree(group: string) {
    const allItems = await NavbarItemModel.find({
      group,
      isDeleted: false,
    })
      .sort({ order: "asc" })
      .populate({
        path: "content.category",
      })

      .lean();

    const buildTree = (items: any[], parentId: number | null = null): any[] => {
      return items
        .filter((item) => item.parent_id == parentId)
        .map((item) => ({ ...item, children: buildTree(items, item._id) }));
    };

    return buildTree(allItems);
  }
}
