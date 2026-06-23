import { Request, Response } from 'express';
import { CategoryService } from '../services/categories.service';
import { BadRequestError, NotFoundError } from '../errors';
import { CategoryZodType } from '../types/categories.type';

export class CategoryController {
    static async getCategories(req: Request, res: Response) {
        const options = {
            page: req.query.page ? parseInt(req.query.page as string) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
            sortBy: req.query.sortBy as string,
            sortOrder: req.query.sortOrder as 'asc' | 'desc',
            search: req.query.search as string,
        };

        const result = await CategoryService.findAndPaginate(options);
        res.status(200).json(result);
    }

    static async getCategoryById(req: Request, res: Response) {
        const categoryId = parseInt(req.params.id, 10);
        if (isNaN(categoryId)) {
            throw new BadRequestError('Category ID must be a number.');
        }

        const category = await CategoryService.findById(categoryId);
        if (!category) {
            throw new NotFoundError(`Category with ID ${categoryId} not found.`);
        }

        res.status(200).json(category);
    }

    static async createCategory(req: Request, res: Response) {
        const categoryData = req.body;
        const newCategory = await CategoryService.createCategory(categoryData);

        res.status(201).json(newCategory);
    }

    static async updateCategory(req: Request, res: Response) {
        const Category_id = parseInt(req.params.id);
        if (isNaN(Category_id)) {
            throw new BadRequestError('ID has to be a number.');
        }

        const updatedCategory = await CategoryService.updateCategory(Category_id, req.body);
        if (!updatedCategory) {
            throw new NotFoundError(`Can't find Category with ID: ${Category_id}.`);
        }

        res.status(200).json(updatedCategory);
    }

    static async deleteCategory(req: Request, res: Response) {
        const Category_id = parseInt(req.params.id);
        if (isNaN(Category_id)) {
            throw new BadRequestError('ID has to be a number.');
        }
        const deletedCategory = await CategoryService.softDeleteCategory(Category_id);
        if (!deletedCategory) {
            throw new NotFoundError(`Can't find Category with ID: ${Category_id}.`);
        }

        res.status(204).send();
    }
    static async getCategoryTree(req: Request, res: Response) {
        const tree = await CategoryService.getCategoryTree();
        res.status(200).json(tree);
    }
}