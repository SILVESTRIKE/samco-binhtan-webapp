
import { FilterQuery } from "mongoose";
import { FooterItemModel, FooterItemDoc } from "../models/footer_categories.models";
import {
  CreateFooterItemType,
  UpdateFooterItemType,
} from "../types/footer_categories.types";

export interface TransformedItem {
  _id: number;
  title: string;
  titleKey: string;
  content?: string;
  order: number;
  mediaPath?: string;
  iconKey?: string;
  column: 1 | 2 | 3;
  group: string;
  type: string;
  displayBehavior?: "collapsible" | "expanded"; 
  target: "_self" | "_blank";
  parent_id: number | null;
  url?: string;
  children: TransformedItem[]; 
}

interface TransformedFooterLayout {
  column1: TransformedItem[];
  column2: TransformedItem[];
  column3: TransformedItem[];
}

export class FooterItemService {

  private static transformTree(item: any): TransformedItem {
    return {
      _id: item._id,
      title: item.title,
      titleKey: item.titleKey,
      content: item.content,
      order: item.order,
      mediaPath: item.media_logo?.mediaPath,
      iconKey: item.iconKey,
      column: item.column,
      group: item.group,
      type: item.type,
      displayBehavior: item.displayBehavior,
      target: item.target,
      parent_id: item.parent_id,
      url: item.url,
      children: item.children ? item.children.map(FooterItemService.transformTree) : [],
    };
  }

  static async create(itemData: CreateFooterItemType): Promise<FooterItemDoc> {
    const newItem = await FooterItemModel.create(itemData);
    return newItem.populate({ path: "media_logo" });
  }

  static async update(
    _id: number,
    data: UpdateFooterItemType
  ): Promise<FooterItemDoc | null> {
    return FooterItemModel.findOneAndUpdate(
      { _id, isDeleted: false },
      { $set: data },
      { new: true }
    ).populate({ path: "media_logo" });
  }

  static async softDeleteRecursive(_id: number): Promise<void> {
    const children = await FooterItemModel.find({
      parent_id: _id,
      isDeleted: false,
    });
    for (const child of children) {
      await FooterItemService.softDeleteRecursive(child._id); 
    }
    await FooterItemModel.findByIdAndUpdate(_id, { isDeleted: true });
  }

  static async findById(_id: number): Promise<FooterItemDoc | null> {
    return FooterItemModel.findOne({ _id, isDeleted: false }).populate({
      path: "media_logo",
    });
  }

  static async findAllForAdmin(
    filter: FilterQuery<FooterItemDoc> = {}
  ): Promise<FooterItemDoc[]> {
    return FooterItemModel.find({ ...filter, isDeleted: false })
      .sort({ column: "asc", order: "asc" })
      .populate({ path: "media_logo" });
  }
  
  static async getLayout(): Promise<TransformedFooterLayout> {
    
    const allItems = await FooterItemModel.find({ isDeleted: false })
      .sort({ order: "asc" })
      .populate({ path: "media_logo" })
      .lean(); 

    const buildTree = (items: any[], parentId: number | null = null): any[] => {
      return items
        .filter((item) => item.parent_id == parentId)
        .map((item) => ({ ...item, children: buildTree(items, item._id) }));
    };
    const tree = buildTree(allItems);

    const layout: { column1: any[], column2: any[], column3: any[] } = {
      column1: [],
      column2: [],
      column3: [],
    };
    for (const rootItem of tree) {
      switch (rootItem.column) {
        case 1:
          layout.column1.push(rootItem);
          break;
        case 2:
          layout.column2.push(rootItem);
          break;
        case 3:
          layout.column3.push(rootItem);
          break;
      }
    }

    const transformedLayout: TransformedFooterLayout = {
      column1: layout.column1.map(FooterItemService.transformTree),
      column2: layout.column2.map(FooterItemService.transformTree),
      column3: layout.column3.map(FooterItemService.transformTree),
    };

    return transformedLayout;
  }
}