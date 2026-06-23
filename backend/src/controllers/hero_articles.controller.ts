import { NextFunction, Request, Response } from "express";
import { HeroArticlesService } from "../services/hero_articles.service";
import { BadRequestError, ValidationError, NotFoundError } from "../errors";
import { transformMediaURLs } from "../utils/media.util";
export class HeroArticlesController {
    static async getHomepageLayout(req: Request, res: Response) {
        const homepageLayout = await HeroArticlesService.getHomepageLayout();
        const transformedLayout = transformMediaURLs(req, homepageLayout);
        res.status(200).json(transformedLayout);
    }
    static async getHeroArticles(req: Request, res: Response) {
        const options = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            search: req.query.search as string,
        };
        res.status(200).json(await HeroArticlesService.findAndPaginate(options));
    }

    static async getHeroArticlesById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new BadRequestError("ID has to be a number.");

        const heroArticle = await HeroArticlesService.findById(id);
        if (heroArticle) {
            const transformedHeroArticle = transformMediaURLs(req, heroArticle);
            res.status(200).json(transformedHeroArticle);
        }
        else {
            throw new NotFoundError(`Cant find article with ID: ${id}`);
        }
    }

    static async createHeroArticles(req: Request, res: Response) {
        const newHeroArticle = await HeroArticlesService.createHeroArticles(req.body);
        const transformedHeroArticle = transformMediaURLs(req, newHeroArticle);
        res.status(201).json(transformedHeroArticle);
    }

    static async updateHeroArticles(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new BadRequestError("ID has to be a number.");

        const updatedHeroArticle = await HeroArticlesService.updateHeroArticles(id, req.body);
        const transformedHeroArticle = transformMediaURLs(req, updatedHeroArticle);
        res.status(200).json(transformedHeroArticle);
    }

    static async deleteHeroArticles(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new BadRequestError("ID has to be a number.");

        const wasDeleted = await HeroArticlesService.softDeleteHeroArticles(id);
        if (!wasDeleted) throw new NotFoundError(`Cant find article with ID: ${id}`);
        res.status(204).send();
    }
}
