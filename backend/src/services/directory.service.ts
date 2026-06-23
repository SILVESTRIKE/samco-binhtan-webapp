import { DirectoryModel, DirectoryDoc } from "../models/directory.model";
import { CreateDirectoryZodType } from "../types/medias.type";
import { MediaModel } from "../models/medias.model";

export class DirectoryService {
  static async create(
    data: CreateDirectoryZodType,
    creator_id: number
  ): Promise<DirectoryDoc> {
    const newDirectory = new DirectoryModel({ ...data, creator_id });
    return newDirectory.save();
  }

  static async findById(id: number): Promise<DirectoryDoc | null> {
    return DirectoryModel.findOne({ _id: id, isDeleted: false });
  }

  static async getChildren(parent_id: number | null): Promise<DirectoryDoc[]> {
    return DirectoryModel.find({ parent_id, isDeleted: false }).sort({
      name: "asc",
    });
  }

  static async softDeleteRecursive(directoryId: number): Promise<void> {
    await MediaModel.updateMany(
      { directory_id: directoryId, isDeleted: false },
      { $set: { isDeleted: true, updated_date: new Date() } }
    );

    const subDirectories = await DirectoryModel.find({
      parent_id: directoryId,
      isDeleted: false,
    });

    if (subDirectories.length > 0) {
      await Promise.all(
        subDirectories.map((subDir) => this.softDeleteRecursive(subDir._id))
      );
    }

    await DirectoryModel.findByIdAndUpdate(directoryId, {
      $set: { isDeleted: true, updated_date: new Date() },
    });
  }
  static async getBreadcrumb(directoryId: number): Promise<DirectoryDoc[]> {
    const breadcrumb: DirectoryDoc[] = [];
    let currentId: number | null = directoryId;

    while (currentId) {
      const directory = await DirectoryModel.findOne({
        _id: currentId,
        isDeleted: false,
      }).select("_id name parent_id");
      if (directory) {
        breadcrumb.unshift(directory); 
        currentId = directory.parent_id;
      } else {
        break;
      }
    }
    return breadcrumb;
  }
}
