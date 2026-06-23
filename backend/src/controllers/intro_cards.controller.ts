import { NextFunction, Request, Response } from "express";
import { IntroCardsService } from "../services/intro_cards.service";
import { BadRequestError, ValidationError, NotFoundError } from "../errors";
import { transformMediaURLs } from "../utils/media.util";
export class IntroCardsController {
    static async getHomepageLayout(req: Request, res: Response) {
        const homepageLayout = await IntroCardsService.getHomepageLayout();
        if (homepageLayout) {
            const transformationHomepageLayout = transformMediaURLs(req, homepageLayout);
            res.status(200).json(transformationHomepageLayout);
        }
        else {
            throw new NotFoundError("Homepage layout not found");
        }

    }
    static async getIntroCards(req: Request, res: Response) {
        const options = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            search: req.query.search as string,
        };
        const introCards = await IntroCardsService.findAndPaginate(options);
        if (introCards) {
            const transformedIntroCards = transformMediaURLs(req, introCards);
            res.status(200).json(transformedIntroCards);
        }
        else {
            throw new NotFoundError("Failed to fetch intro cards");
        }
    }

    static async getIntroCardsById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new BadRequestError("ID has to be a number.");

        const introCard = await IntroCardsService.findById(id);
        if (introCard) {
            const transformedIntroCard = transformMediaURLs(req, introCard);
            res.status(200).json(transformedIntroCard);
        } else {
            throw new NotFoundError(`Cant find article with ID: ${id}`);
        }
    }

    static async createIntroCards(req: Request, res: Response) {
        const newIntroCard = await IntroCardsService.createIntroCards(req.body);
        const transformedIntroCard = transformMediaURLs(req, newIntroCard);
        res.status(201).json(transformedIntroCard);
    }

    static async updateIntroCards(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new BadRequestError("ID has to be a number.");

        const updatedIntroCard = await IntroCardsService.updateIntroCards(id, req.body);
        if (!updatedIntroCard) throw new NotFoundError(`Cant find article with ID: ${id}`);
        const transformedUpdatedIntroCard = transformMediaURLs(req, updatedIntroCard);
        res.status(200).json(transformedUpdatedIntroCard);
    }

    static async deleteIntroCards(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) throw new BadRequestError("ID has to be a number.");

        const wasDeleted = await IntroCardsService.softDeleteIntroCards(id);
        if (!wasDeleted) throw new NotFoundError(`Cant find article with ID: ${id}`);
        res.status(204).send();
    }
}
