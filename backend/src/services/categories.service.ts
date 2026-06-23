import { CategoryModel, CategoryDoc } from '../models/categories.model';
import { CategoryZodType } from '../types/categories.type';
import { FilterQuery } from 'mongoose';
import { NotFoundError } from '../errors';

export interface FindCategoryOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    type?: string;
    directoryId?: number;
}
export interface CategoryTreeNode extends CategoryDoc {
    children: CategoryTreeNode[];
}
export interface PaginatedCategoryResult {
    data: CategoryDoc[];
    pagination: { totalItems: number; totalPages: number; currentPage: number; limit: number; };
}


export class CategoryService {
    static async createCategory(categoryData: CategoryZodType): Promise<CategoryDoc> {
        const { parent_code, ...restOfData } = categoryData;
        
        let ancestors: string[] = [];
        if (parent_code) {
            const parentCategory = await this.findByCode(parent_code);
            if (!parentCategory) {
                throw new NotFoundError(`Parent category with code '${parent_code}' not found.`);
            }
            ancestors = [...parentCategory.ancestors, parentCategory.code];
        }
        
        const newCategory = await CategoryModel.create({ 
            ...restOfData,
            parent_code, 
            ancestors 
        });

        return newCategory;
    }

    static async updateCategory(categoryId: number, categoryData: Partial<CategoryZodType>): Promise<CategoryDoc | null> {
        return await CategoryModel.findByIdAndUpdate(categoryId, categoryData, { new: true });
    }

    static async softDeleteCategory(_id: number): Promise<CategoryDoc | null> {
        return await CategoryModel.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
    }

    static async findByCode(code: string): Promise<(CategoryDoc & { ancestors: string[] }) | null> {
        return await CategoryModel.findOne({ code, isDeleted: false });
    }
    
    static async findAndPaginate(options: FindCategoryOptions): Promise<PaginatedCategoryResult> {
        const page = options.page || 1;
        const limit = options.limit || 12;
        const sortBy = options.sortBy || 'created_date';
        const sortOrder = options.sortOrder || 'desc';

        const filter: FilterQuery<CategoryDoc> = { isDeleted: false }; 
        if (options.search) {
            filter.name = new RegExp(options.search, 'i');
        }
        const sortOptions: { [key: string]: 1 | -1 } = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const [totalItems, Categorys] = await Promise.all([
            CategoryModel.countDocuments(filter),
            CategoryModel.find(filter).sort(sortOptions).skip((page - 1) * limit).limit(limit),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: Categorys,
            pagination: { totalItems, totalPages, currentPage: page, limit },
        };
    }

    static async findById(Category_id: number): Promise<CategoryDoc | null> {
        return await CategoryModel.findOne({ _id: Category_id, isDeleted: false });
    }
    static async findBySlug(slug: string): Promise<CategoryDoc | null> {
        return await CategoryModel.findOne({ slug: slug, isDeleted: false });
    }
    static async findChildrenOf(parentCode: string): Promise<CategoryDoc[]> {
        return await CategoryModel.find({ parent_code: parentCode, isDeleted: false }).sort({ display_order: 1 });
    }
    

    static async findAllDescendantCodes(parentCode: string): Promise<string[]> {
        const descendants = await CategoryModel.find({
            $or: [{ ancestors: parentCode }, { code: parentCode }],
            isDeleted: false
        }).select('code');
        return descendants.map(cat => cat.code);
    }

    static async getCategoryTree(): Promise<CategoryTreeNode[]> {
    const allCategory = await CategoryModel.find({ isDeleted: false }).sort({ display_order: 1 }).lean();

    const categoryMap: { [key: string]: any } = {};
    const categoryTree: CategoryTreeNode[] = [];

    for (const cat of allCategory) {
        categoryMap[cat.code] = { ...cat, children: [] };
    }

    for (const code in categoryMap) {
        const categoryNode = categoryMap[code];
        if (categoryNode.parent_code && categoryMap[categoryNode.parent_code]) {
            categoryMap[categoryNode.parent_code].children.push(categoryNode);
        } else {
            categoryTree.push(categoryNode);
        }
    }

    return categoryTree;
}
}